import qchatServerList from './qchat.json';

const byName = new Map(qchatServerList.map(({name, qchatServerId}) => [name, qchatServerId]));

export const QchatCtrl = props => {
	return (
		<>
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
