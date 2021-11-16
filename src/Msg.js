import './Msg.css';

const Unknown = props => <div>Unknown {props.tag}: {JSON.stringify(props.msg)}</div>;
const Ignore = props => <div>(Ignored {props.tag})</div>

const Template = props => (
	<div className={props.deleted?'deleted':''}>
		<img className="avatar" src={`https://source.48.cn${props.user?.avatar}`} alt="" />
		{(props.user?.pfUrl)?(<img className="avatar-overlay" src={`https://source.48.cn${props.user?.pfUrl}`} alt="" />):null}
		{props.user?.nickName}
		{(new Date(props.msg.time)).toLocaleString()}
		<br />
		{props.children}
	</div>
);

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
	const custom = props.msg.custom;
	if (custom.messageType === 'TEXT') {
		return <Text msg={props.msg} custom={custom} deleted={props.deleted} />;
	}
	if (adminServer && custom.messageType === 'PRESENT_NORMAL') {
		return <Ignore tag={'adminServer PRESENT_NORMAL'} />;
	}
	if (adminServer && custom.messageType === 'PRESENT_FULLSCREEN') {
		return <Ignore tag={'adminServer PRESENT_FULLSCREEN'} />;
	}
	if (adminServer && custom.messageType === 'RECIEVE_GIFT_EVENT') {
		return <Ignore tag={'adminServer RECIEVE_GIFT_EVENT'} />;
	}
	if (adminServer && custom.messageType === 'DELETE') {
		return <Ignore tag={'adminServer DELETE'} />;
	}
	if (custom.messageType === 'PRESENT_TEXT') {
		return <PresentText msg={props.msg} custom={custom} />;
	}
	if (custom.messageType === 'EXPRESSIMAGE') {
		return <ExpressImage msg={props.msg} custom={custom} />;
	}
	if (custom.messageType === 'REPLY') {
		return <Reply msg={props.msg} custom={custom} />;
	}
	if (props.msg.type === 'image') {
		return <Image msg={props.msg} custom={custom} />;
	}
	return <div>{JSON.stringify(props.msg)}</div>;
};

const Text = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.text}
		</Template>
	);
};
const PresentText = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			Sent {props.custom.giftInfo?.giftNum}x {props.custom.giftInfo?.giftName}
		</Template>
	);
};
const ExpressImage = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<img src={props.custom.emotionRemote} alt="" />
		</Template>
	);
};
const Reply = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.text}
			<blockquote>{props.custom.replyName}: {props.custom.replyText}</blockquote>
		</Template>
	);
};
const Image = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<img src={props.msg.file.url} alt="" />
		</Template>
	);
};
