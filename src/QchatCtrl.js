import { useRef, useState, Fragment } from 'react';
import qchatServerList from './qchat.json';

const byName = new Map(qchatServerList.map(({name, qchatServerId}) => [name, qchatServerId]));

export const QchatCtrl = props => {
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
	return (
		<>
			<button onClick={saveCreds}>S</button>
			<input onChange={evt => setAccid(evt.target.value)} value={accid} />
			<input onChange={evt => setPwd(evt.target.value)} value={pwd} />
			<button onClick={loadCreds}>L</button>
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
