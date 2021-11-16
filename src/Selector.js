import xoxList from './xox.json';

const byName = new Map(xoxList.map(({name, roomId}) => [name, roomId]));

export const Selector = props => {
	return (
		<>
			<input list="xox" onChange={evt => {
				const v = evt.target.value;
				const roomId = byName.get(v) || v;
				props.onChange(roomId);
			}} />
			<datalist id="xox">
			{xoxList.map(({name, abbr, roomId}) => <option key={roomId} label={abbr}>{name}</option>)}
			</datalist>
		</>
	);
};
