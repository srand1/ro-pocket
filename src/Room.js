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
		chatroom.getHistoryMsgs({
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
