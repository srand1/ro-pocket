import { useRef, useState, Fragment } from 'react';
import { Msg } from './Msg';
import { Selector } from './Selector';
import { QchatCtrl } from './QchatCtrl';

const appKey = '632feff1f4c838541ab75195d1ceb3fa';
const chatroomAddresses = ['chatweblink01.netease.im:443'];

const toggleDescs = [
	{key: 'showAll', desc: '\u805A\u805A', init: false},
	{key: 'PRESENT_TEXT', desc: '\u793C\u7269', init: true},
	{key: 'TEXT', desc: '\u6587\u5B57', init: true},
	{key: 'REPLY', desc: '\u56DE\u590D', init: true},
	{key: 'GIFTREPLY', desc: '\u793C\u7269\u56DE\u590D', init: true},
	{key: 'EXPRESSIMAGE', desc: '\u8868\u60C5', init: true},
	{key: 'IMAGE', desc: '\u56FE\u7247', init: true},
	{key: 'gif', desc: 'gif', init: true},
	{key: 'AUDIO', desc: '\u8BED\u97F3', init: true},
	{key: 'VIDEO', desc: '\u89C6\u9891', init: true},
	{key: 'FLIPCARD', desc: '\u6587\u5B57\u7FFB\u724C', init: true},
	{key: 'FLIPCARD_AUDIO', desc: '\u8BED\u97F3\u7FFB\u724C', init: true},
	{key: 'FLIPCARD_VIDEO', desc: '\u89C6\u9891\u7FFB\u724C', init: true},
	{key: 'LIVEPUSH', desc: '\u76F4\u64AD', init: true},
	{key: 'SHARE_POSTS', desc: '\u5e16\u5b50\u5206\u4eab', init: true},
	{key: 'VOTE', desc: '\u6295\u7968', init: true},
	{key: 'ignore', desc: '\u7CFB\u7EDF', init: false},
	{key: 'unknown', desc: '\u672A\u77E5', init: true},
	{key: 'LIVEUPDATE', desc: '\u76F4\u64AD\u4eba\u6c14', init: false},
	{key: 'KTV_SING_Progress', desc: '\u6f14\u5531\u8fdb\u5ea6', init: false},
];

const _p = (chatroom, method, opts) => new Promise((resolve, reject) => chatroom[method]({
	...opts, done: (err, obj) => err ? reject(err) : resolve(obj),
}));
const json2url = json => URL.createObjectURL(new Blob([JSON.stringify(json)]));

export const Room = props => {
	const chatroomRef = useRef(null);
	const [stageView, setStage] = useState('OFFLINE');
	const [msgsView, setMsgs] = useState([]);
	const [roomId, setRoomId] = useState(() => props.roomId);
	const [qchatServerId, setQchatServerId] = useState(() => props.qchatServerId);
	const [qchatChannelId, setQchatChannelId] = useState(() => props.qchatChannelId);
	const [toggles, setToggles] = useState(() => new Map(toggleDescs.map(({key, init}) => [key, init])));
	const [nMembers, setNMembers] = useState(null);
	const bottomRef = useRef(null);

	const reset = () => {
		chatroomRef.current?.destroy();
		chatroomRef.current = null;
		setStage('OFFLINE');
		setMsgs([]);
		setNMembers(null);
	};

	const debug = () => {
		console.log(window.SDK);
		console.log(chatroomRef.current);
		console.log(msgsView);
		console.log(deleted);
	};

	const init = () => {
		const chatroomNew = window.SDK.Chatroom.getInstance({
			appKey,
			isAnonymous: true,
			chatroomNick: 'RO',
			// account: account,
			// token: account,
			chatroomId: roomId,
			chatroomAddresses,
			onconnect,
			onwillreconnect,
			ondisconnect,
			onerror,
			onmsgs,
		});
		chatroomRef.current = chatroomNew;
	};
	const onconnect = chatroomInfo => {
		setStage('ONLINE');
		console.log('onconnect', chatroomInfo, chatroomRef.current);
		(async () => {
			let cnt = 0;
			let timetag = msgsView[0]?.time;  // = undefined
			while (true) {
				console.log('auto', timetag);
				const obj = await _p(chatroomRef.current, 'getHistoryMsgs', {timetag});
				if (++cnt >= 30) break;
				if (obj.msgs.length === 0) break;
				const msgs = [...obj.msgs];
				msgs.reverse();
				setMsgs(msgsPrev => {
					const msgsSanitized = sanitizeDelta(msgs, msgsPrev, 'dupAudo');
					return [...msgsSanitized, ...msgsPrev];
				});
				timetag = msgs[0].time;
				const dt = new Date(timetag);
				if (new Date() - dt >= 86400e3) break;
			}
		})();
	};
	const onwillreconnect = (...args) => { console.log('r', args); };
	const ondisconnect = err => {
		setStage('OFFLINE');
		console.log('ondisconnect', err);
	};
	const onerror = (...args) => { console.log('e', args); };
	const onmsgs = msgs => {
		setMsgs(msgsPrev => {
			const msgsSanitized = sanitizeDelta(msgs, msgsPrev, 'dupNew');
			return [...msgsPrev, ...msgsSanitized];
		});
		console.log(msgs);
	};
	const sanitizeDelta = (msgs, msgsPrev, tag) => {
		const msgsNoResend = msgs.filter(msg => !msg.resend);
		const msgsParsed = msgsNoResend.map(msg => ({
			...msg,
			custom: JSON.parse(msg.custom || null),
		}));
		// Mostly unnecessary after `resend` check.
		// But consecutive button clicks can send dup requests.
		const byKey = new Map(msgsPrev.map((msg, idx) => [msg.idClient, idx]));
		const lookup = msgsParsed.map((msg, idx) => [idx, msg, byKey.get(msg.idClient)]);
		const dups = lookup.filter(
			([idx, msg, idxEx]) => idxEx !== undefined
		).map(
			([idx, msg, idxEx]) => [idx, msg, idxEx, msgsPrev[idxEx]]
		);
		if (dups.length > 0) console.log(tag, dups);
		const msgsNoDup = lookup.filter(
			([idx, msg, idxEx]) => idxEx === undefined
		).map(
			([idx, msg, idxEx]) => msg
		);
		return msgsNoDup;
	};
	const earlier = () => {
		chatroomRef.current.getHistoryMsgs({
			timetag: msgsView[0]?.time,
			done: (err, obj) => {
				if (err) {
					console.log(err);
					return;
				}
				const msgs = [...obj.msgs];
				msgs.reverse();
				setMsgs(msgsPrev => {
					const msgsSanitized = sanitizeDelta(msgs, msgsPrev, 'dupHist');
					return [...msgsSanitized, ...msgsPrev];
				});
			},
		});
	};
	const fileSelected = async evt => {
		const file = evt.target.files[0];
		if (!file) { console.log('no file', evt.target.files); return; }
		console.log('loading', new Date());
		const text = await file.text();
		let json;
		try {
			json = JSON.parse(text);
		} catch (e) {
			console.log('err parse', e);
			return;
		}
		console.log('loaded', new Date());
		json.reverse();
		let msgsSanitized = sanitizeDelta(json, [], 'dupLoad');
		console.log('rendering', new Date());
		setMsgs(msgsSanitized);
	};
	const dump = () => {
		const a = document.createElement('a');
		a.href = json2url(msgsView);
		a.download = `${roomId}.json`;
		// a.click();
		a.dispatchEvent(new MouseEvent('click'));
	};

	const deleted = new Set(msgsView.filter(
		msg => msg.custom?.messageType === 'DELETE'
	).map(msg => msg.custom.targetId));

	// Actually `renderedNMembers` directly also works.
	const renderNMembers = nMembers => {
		if (!nMembers) return null;
		const { n, t0 } = nMembers;
		return `${n} (${t0.getHours()}:${t0.getMinutes()})`;
	};
	const refresh = async () => {
		const t0 = new Date();
		let n = 0;
		let time = undefined;
		try {
			while (true) {
				const { members } = await _p(chatroomRef.current, 'getChatroomMembers', {guest: true, time});
				n += members.length;
				if (members.length < 100) break;
				time = members[members.length-1].enterTime;
			}
		} catch (err) {
			console.log('refresh', err);
		}
		const t1 = new Date();
		setNMembers({n, t0, t1});
	};

	return (
		<div className="Room">
			<header>
				<button onClick={debug}>Debug</button>
				<input type="file" onChange={fileSelected} />
				<button onClick={dump}>Dump</button>
				<br />
				<QchatCtrl qchatServerId={qchatServerId} qchatChannelId={qchatChannelId} onChange={setQchatServerId} onChannelChange={setQchatChannelId} onMsgs={setMsgs} />
				{qchatServerId}|{qchatChannelId}
				<br />
				<Selector onChange={setRoomId} />
				{roomId}
				<br />
				{stageView} | {chatroomRef.current?.protocol?.hasLogin?.toString()}
				<button onClick={reset}>Reset</button>
				<button onClick={init} disabled={stageView === 'ONLINE'}>Init</button>
				<button onClick={earlier} disabled={!chatroomRef.current?.protocol?.hasLogin}>Earlier</button>
				<button onClick={() => bottomRef.current.scrollIntoView()}>Bottom</button>
				{renderNMembers(nMembers)}
				<button onClick={refresh} disabled={!chatroomRef.current?.protocol?.hasLogin}>{'\u5237\u65b0\u4eba\u6570'}</button>
				<br />
				{msgsView.length} msgs since {msgsView.length>0?(new Date(msgsView[0].time)).toLocaleString():null}
				<div>
					{toggleDescs.map(({key, desc}) => <Fragment key={key}>
						<input type="checkbox" id={`toggle-${key}`} checked={toggles.get(key)} onChange={evt => setToggles(togglesPrev => (new Map(togglesPrev)).set(key, evt.target.checked))} />
						<label htmlFor={`toggle-${key}`}>{desc}</label>
					</Fragment>)}
				</div>
			</header>
			<div className="Msgs">
				{msgsView.map(msg => (
					<div key={msg.idClient} className="each" onClick={() => console.log(msg)}>
						<Msg msg={msg} deleted={deleted.has(msg.idClient)} toggles={toggles} />
					</div>
				))}
				<div ref={bottomRef}>End of Msgs.</div>
			</div>
		</div>
	);
};
