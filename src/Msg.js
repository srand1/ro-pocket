import './Msg.css';

const Unknown = props => <div>Unknown {props.tag}: {JSON.stringify(props.msg)}</div>;
const Ignore = props => <div>(Ignored {props.tag})</div>

export const Msg = props => {
	if (props.msg.flow !== 'in') {
		return <Unknown tag={'flow'} msg={props.msg} />;
	}
	let adminServer = false;
	if (props.msg.from === 'admin' || props.msg.fromClientType === 'Server') {
		if (!(props.msg.from === 'admin' && props.msg.fromClientType === 'Server')) {
			return <Unknown tag={'adminServer'} msg={props.msg} />;
		}
		adminServer = true;
	}
	if (!props.msg.custom) {
		return <Unknown tag={'custom'} msg={props.msg} />;
	}
	const custom = JSON.parse(props.msg.custom);
	if (custom.messageType === 'TEXT') {
		return <Text msg={props.msg} custom={custom} deleted={props.deleted} />;
	}
	if (adminServer && custom.messageType === 'PRESENT_NORMAL') {
		return <Ignore tag={'adminServer PRESENT_NORMAL'} />;
	}
	if (adminServer && custom.messageType === 'DELETE') {
		return <Ignore tag={'adminServer DELETE'} />;
	}
	if (custom.messageType === 'PRESENT_TEXT') {
		return <PresentText msg={props.msg} custom={custom} />;
	}
	return <div>{JSON.stringify({...props.msg, custom})}</div>;
};

const Text = props => {
	return (
		<div className={props.deleted?'deleted':''}>
			<img className="avatar" src={`https://source.48.cn${props.custom.user?.avatar}`} alt="" />
			{(props.custom.user?.pfUrl)?(<img className="avatar-overlay" src={`https://source.48.cn${props.custom.user?.pfUrl}`} alt="" />):null}
			{props.custom.user?.nickName}<br />
			{props.custom.text}
		</div>
	);
};
const PresentText = props => {
	return (
		<div>
			{props.custom.user?.nickName}<br />
			{props.custom.giftInfo?.giftName}
		</div>
	);
};
