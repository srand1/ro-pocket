import './Msg.css';

const base = 'https://source.48.cn/';
const baseM = 'https://mp4.48.cn/';

const Unknown = props => <div>Unknown {props.tag}: {JSON.stringify(props.msg)}</div>;
const Ignore = props => <div>(Ignored {props.tag})</div>

const Template = props => (
	<div className={props.deleted?'deleted':''}>
		<img className="avatar" src={new URL(props.user?.avatar, base)} alt="" />
		{(props.user?.pfUrl)?(<img className="avatar-overlay" src={new URL(props.user?.pfUrl, base)} alt="" />):null}
		{props.user?.nickName}
		{(new Date(props.msg.time)).toLocaleString()}
		<br />
		{props.children}
	</div>
);

export const Msg = props => {
	const custom = props.msg.custom;
	if (custom.messageType === 'TEXT') {
		return <Text msg={props.msg} custom={custom} deleted={props.deleted} />;
	}
	if (custom.messageType === 'DELETE') {
		return <Ignore tag={'adminServer DELETE'} />;
	}
	if (custom.messageType === 'DISABLE_SPEAK') {
		return <Ignore tag={'adminServer DISABLE_SPEAK'} />;
	}
	if (custom.messageType === 'PRESENT_NORMAL') {
		return <Ignore tag={'adminServer PRESENT_NORMAL'} />;
	}
	if (custom.messageType === 'PRESENT_FULLSCREEN') {
		return <Ignore tag={'adminServer PRESENT_FULLSCREEN'} />;
	}
	if (custom.messageType === 'RECIEVE_GIFT_EVENT') {
		return <Ignore tag={'adminServer RECIEVE_GIFT_EVENT'} />;
	}
	if (custom.messageType === 'SEND_GIFT_EVENT') {
		return <Ignore tag={'adminServer SEND_GIFT_EVENT'} />;
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
	if (custom.messageType === 'FLIPCARD') {
		return <FlipCard msg={props.msg} custom={custom} />;
	}
	if (custom.messageType === 'FLIPCARD_AUDIO') {
		return <FlipCardAudio msg={props.msg} custom={custom} />;
	}
	if (custom.messageType === 'IMAGE') {
		return <Image msg={props.msg} custom={custom} />;
	}
	if (custom.messageType === 'VIDEO') {
		return <Video msg={props.msg} custom={custom} />;
	}
	if (custom.messageType === 'AUDIO') {
		return <Audio msg={props.msg} custom={custom} />;
	}
	if (custom.messageType === 'LIVEPUSH') {
		return <LivePush msg={props.msg} custom={custom} />;
	}
	// GIFTREPLY FLIPCARD_VIDEO EXPRESS VOTE CLOSE_ROOM_CHAT
	// SESSION_DIANTAI OPEN_LIVE TRIP_INFO
	// ZHONGQIU_ACTIVITY_LANTERN_FANS
	return <Unknown tag={'messageType'} msg={props.msg} />;
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
			<img src={new URL(props.custom.emotionRemote, base)} alt="" />
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
const FlipCard = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.answer}
			<blockquote>{props.custom.question}</blockquote>
		</Template>
	);
};
const FlipCardAudio = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<audio src={new URL(JSON.parse(props.custom.answer).url, baseM)} controls></audio>
			<blockquote>{props.custom.question}</blockquote>
		</Template>
	);
};
const Image = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<img className="msg-img" src={props.msg.file.url} alt="" />
		</Template>
	);
};
const Video = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<video className="msg-img" src={props.msg.file.url} controls></video>
		</Template>
	);
};
const Audio = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<audio src={props.msg.file.url} controls></audio>
		</Template>
	);
};
const LivePush = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<a
				href={`https://h5.48.cn/2019appshare/memberLiveShare/?id=${props.custom.liveId}`}
				target="_blank"
				rel="noreferrer"
			>{props.custom.liveTitle}</a><br />
			<img className="msg-img" src={new URL(props.custom.liveCover, base)} alt="" />
		</Template>
	);
};
