import './Msg.css';

const base = 'https://source.48.cn/';
const baseM = 'https://mp4.48.cn/';

const Unknown = props => props.toggles.get('unknown') ? <div>Unknown {props.tag}: {JSON.stringify(props.msg)}</div> : null;
const Ignore = props => props.toggles.get('ignore') ? <div>(Ignored {props.custom.messageType})</div> : null;

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

	if (!custom) return <Ignore tag={'no custom'} toggles={props.toggles} />;

	if (!props.toggles.get('showAll') && parseInt(custom.sessionRole) === 0) return null;
	if (props.toggles.get(custom.messageType) === false) return null;

	const Render = messageType2render.get(custom.messageType);
	if (!Render) return <Unknown tag={'messageType'} msg={props.msg} toggles={props.toggles} />;
	return <Render msg={props.msg} custom={custom} deleted={props.deleted} toggles={props.toggles} />;
};

const PresentText = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			Sent {props.custom.giftInfo?.giftNum}x {props.custom.giftInfo?.giftName}
		</Template>
	);
};
const Text = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.text}
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
const GiftReply = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.text}
			<blockquote>{props.custom.replyName}: {props.custom.replyText}</blockquote>
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
const Image = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<img className="msg-img" src={props.msg.file.url} alt="" />
		</Template>
	);
};
const Gif = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<img className="msg-img" src={props.msg.file.url} alt="" />
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
const Video = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<video className="msg-img" src={props.msg.file.url} controls></video>
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
const FlipCardVideo = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<video className="msg-img" src={new URL(JSON.parse(props.custom.answer).url, baseM)} controls></video>
			<blockquote>{props.custom.question}</blockquote>
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
const SharePosts = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<a
				href={props.custom.playUrl}
				target="_blank"
				rel="noreferrer"
			>{props.custom.shareTitle}</a><br />
			{props.custom.shareDesc}
		</Template>
	);
};
const Vote = props => {
	const url = new URL(props.custom.shortPath, 'http://example.com');
	const postId = url.searchParams.get('id');
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			<a
				href={`https://h5.48.cn/2019appshare/dynamic/index.html?id=${postId}`}
				target="_blank"
				rel="noreferrer"
			>{props.custom.text}</a><br />
			{props.custom.content}
		</Template>
	);
};
const LiveUpdate = props => {
	return (
		<div>
			{`${props.custom.liveUpdateInfo.online} \u4eba`} &nbsp;
			{`${props.custom.liveUpdateInfo.allMoney} \ud83c\udf57`}
		</div>
	);
};
const CloseLive = props => {
	return (
		<div>
			Closed.
		</div>
	);
};
const BarrageNormal = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.text}
		</Template>
	);
};
const EventVipEnter = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.liveIntoPromptDescribe}
		</Template>
	);
};
const BarrageNotify = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.text}
		</Template>
	);
};
const PresentNormal = props => {
	if (props.custom.module !== 'LIVE') return <Ignore {...props} />;
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			Sent {props.custom.giftInfo?.giftNum}x {props.custom.giftInfo?.giftName}
		</Template>
	);
};
const PresentFullScreen = props => {
	if (props.custom.module !== 'LIVE') return <Ignore {...props} />;
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			Sent {props.custom.giftInfo?.giftNum}x {props.custom.giftInfo?.giftName}
		</Template>
	);
};

const messageType2render = new Map([
	['DELETE', Ignore],
	['DISABLE_SPEAK', Ignore],
	['CLOSE_ROOM_CHAT', Ignore],
	['SESSION_DIANTAI', Ignore],
	['PRESENT_NORMAL', PresentNormal],
	['PRESENT_FULLSCREEN', PresentFullScreen],
	['RECIEVE_GIFT_EVENT', Ignore],
	['SEND_GIFT_EVENT', Ignore],
	['SPRING_FESTIVAL_2022', Ignore],
	['PRESENT_TEXT', PresentText],
	['TEXT', Text],
	['REPLY', Reply],
	['GIFTREPLY', GiftReply],
	['EXPRESSIMAGE', ExpressImage],
	['IMAGE', Image],
	['gif', Gif],
	['AUDIO', Audio],
	['VIDEO', Video],
	['FLIPCARD', FlipCard],
	['FLIPCARD_AUDIO', FlipCardAudio],
	['FLIPCARD_VIDEO', FlipCardVideo],
	['LIVEPUSH', LivePush],
	['SHARE_POSTS', SharePosts],
	['VOTE', Vote],
	// EXPRESS
	// OPEN_LIVE TRIP_INFO
	// ZHONGQIU_ACTIVITY_LANTERN_FANS
	['LIVEUPDATE', LiveUpdate],
	['CLOSELIVE', CloseLive],
	['BARRAGE_NORMAL', BarrageNormal],
	['EVENT_VIP_ENTER', EventVipEnter],
	['BARRAGE_NOTIFY', BarrageNotify],
]);
