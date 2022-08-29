import { useRef, useState, Fragment } from 'react';
import qchatServerList from './qchat.json';

const byName = new Map(qchatServerList.map(({name, qchatServerId}) => [name, qchatServerId]));

const appkey = '632feff1f4c838541ab75195d1ceb3fa';
const linkAddresses = ['qchatweblink01.netease.im:443'];

export const QchatCtrl = props => {
	const qchatRef = useRef(null);
	const [stageView, setStage] = useState('OFFLINE');
	const [accid, setAccid] = useState('');
	const [pwd, setPwd] = useState('');
	const saveCreds = () => {
		window.localStorage.setItem('accid', accid);
		window.localStorage.setItem('pwd', pwd);
	};
	const loadCreds = () => {
		setAccid(window.localStorage.getItem('accid') || '');
		setPwd(window.localStorage.getItem('pwd') || '');
	};
	const login = () => {
		const qchat = new window.QChat({
			appkey, linkAddresses,
			account: accid,
			token: pwd,
		});
		qchatRef.current = qchat;
		qchat.on('logined', function (loginResult) {
			console.log('login done!!', loginResult);
			setStage('ONLINE');
		});
		qchat.login();
	};
	return (
		<>
			<button onClick={saveCreds}>S</button>
			<input onChange={evt => setAccid(evt.target.value)} value={accid} />
			<input onChange={evt => setPwd(evt.target.value)} value={pwd} />
			<button onClick={loadCreds}>L</button>
			{stageView}
			<button onClick={login} disabled={stageView !== 'OFFLINE'}>C</button>
			<br />
			<input list="qchat-server" onChange={evt => {
				const v = evt.target.value;
				const qchatServerId = byName.get(v) || v;
				props.onChange(qchatServerId);
			}} />
			<datalist id="qchat-server">
			{qchatServerList.map(({name, abbr, qchatServerId}) => <option key={qchatServerId} label={abbr}>{name}</option>)}
			</datalist>
		</>
	);
};