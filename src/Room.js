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
		setMsgs(msgsPrev => [...msgsPrev, ...msgs]);
		console.log(msgs);
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
				setMsgs(msgsPrev => [...obj.msgs, ...msgsPrev]);
			},
		});
	};

	const deleted = new Set(msgsView.filter(
		msg => JSON.parse(msg.custom || null)?.messageType === 'DELETE'
	).map(msg => JSON.parse(msg.custom).targetId));

	return (
		<div>
			<header>{props.name}</header>
			<button onClick={debug}>Debug</button>
			{stageView}
			<button onClick={init}>Init</button>
			<button onClick={earlier}>Earlier</button>
			<div>
				{msgsView.map(msg => (
					<Msg key={msg.idClient} msg={msg} deleted={deleted.has(msg.idClient)}/>
				))}
			</div>
		</div>
	);
};
