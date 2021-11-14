import { useState } from 'react';
import { Msg } from './Msg';

const appKey = '632feff1f4c838541ab75195d1ceb3fa';
const chatroomAddresses = ['chatweblink01.netease.im:443'];

export const Room = props => {
	const [chatroom, setChatroom] = useState(null);
	const [stageView, setStage] = useState('OFFLINE');
	const [msgsView, setMsgs] = useState([]);

	const debug = () => {
		console.log(window.SDK);
		console.log(chatroom);
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
			chatroomId: props.roomId,
			chatroomAddresses,
			onconnect,
			onwillreconnect,
			ondisconnect,
			onerror,
			onmsgs,
		});
		setChatroom(chatroomNew);
	};
	const onconnect = chatroomInfo => {
		setStage('ONLINE');
		console.log('ONLINE', chatroomInfo);
	};
	const onwillreconnect = (...args) => { console.log('r', args); };
	const ondisconnect = (...args) => { console.log('d', args); };
	const onerror = (...args) => { console.log('e', args); };
	const onmsgs = msgs => {
		setMsgs(msgsPrev => {
			msgs = sanitizeDelta(msgs, msgsPrev, 'dupNew');
			return [...msgsPrev, ...msgs];
		});
		console.log(msgs);
	};
	const sanitizeDelta = (msgs, msgsPrev, tag) => {
		// debugger;
		msgs = msgs.filter(msg => !msg.resend);
		msgs.forEach((msg, idx) => {
			// try {
				// if (msg.custom && typeof msg.custom !== 'string') debugger;
				msg.custom = JSON.parse(msg.custom || null);
			// } catch (e) {
			// 	console.log('catch', e, msg);
			// }
		});
		// Mostly unnecessary after `resend` check.
		// But consecutive button clicks can send dup requests.
		const byKey = new Map(msgsPrev.map((msg, idx) => [msg.idClient, idx]));
		// console.log('sanitize', byKey, msgs);
		const lookup = msgs.map((msg, idx) => [idx, msg, byKey.get(msg.idClient)]);
		const dups = lookup.filter(
			([idx, msg, idxEx]) => idxEx !== undefined
		).map(
			([idx, msg, idxEx]) => [idx, msg, idxEx, msgsPrev[idxEx]]
		);
		if (dups.length > 0) console.log(tag, dups);
		msgs = lookup.filter(
			([idx, msg, idxEx]) => idxEx === undefined
		).map(
			([idx, msg, idxEx]) => msg
		);
		return msgs;
	};
	const earlier = () => {
		chatroom.getHistoryMsgs({
			timetag: msgsView[0]?.time,
			done: (err, obj) => {
				if (err) {
					console.log(err);
					return;
				}
				obj.msgs.reverse();
				console.log('debug-done');
				const doneTime = new Date();
				setMsgs(msgsPrev => {
					obj.debug = (obj.debug || 0) + 1;
					// console.log('debug-setMsgs', doneTime, obj, msgsView);
					console.trace('debug-setMsgs', doneTime, obj, msgsView, console.log);
					// debugger;
					obj.msgs = sanitizeDelta(obj.msgs, msgsPrev, 'dupHist');
					return [...obj.msgs, ...msgsPrev];
				});
			},
		});
	};

	const deleted = new Set(msgsView.filter(
		msg => msg.custom?.messageType === 'DELETE'
	).map(msg => msg.custom.targetId));

	return (
		<div>
			<header>{props.name}</header>
			<button onClick={debug}>Debug</button>
			{stageView}
			<button onClick={init}>Init</button>
			<button onClick={earlier}>Earlier</button>
			<div>
				{msgsView.map(msg => (
					<div key={msg.idClient} className="each" onClick={() => console.log(msg)}>
						<Msg msg={msg} deleted={deleted.has(msg.idClient)}/>
					</div>
				))}
			</div>
		</div>
	);
};
