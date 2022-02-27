import './Msg.css';

const base = 'https://source.48.cn/';
const baseM = 'https://mp4.48.cn/';

const Unknown = props => props.toggles.get('unknown') ? <div>Unknown {props.tag}: {JSON.stringify(props.msg)}</div> : null;
const Ignore = props => props.toggles.get('ignore') ? <div>(Ignored {props.custom.messageType})</div> : null;

const Template = props => (
	<div className={props.deleted?'deleted':''}>
		<img className="avatar" src={new URL(props.user?.avatar, base)} alt="" />
		{(props.user?.pfUrl)?(<img className="avatar-overlay" src={new URL(props.user?.pfUrl, base)} alt="" />):null}
		{props.user?.nickName || props.user?.nickname}
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
			{props.custom.shareDesc}<br />
			{(props.custom.sharePic)?(<img className="msg-img" src={new URL(props.custom.sharePic, base)} alt="" />):null}
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
const BarragePay = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			##<strong>{props.custom.giftInfo?.attachData?.text}</strong>
		</Template>
	);
};
const BarrageStarTwo = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			#*<strong>{props.custom.giftInfo?.attachData?.text}</strong>
		</Template>
	);
};
const BarrageMember = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			**<strong>{props.custom.text}</strong>
		</Template>
	);
};
const BarrageSuperman = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			*#<strong>{props.custom.text}</strong>
		</Template>
	);
};
const LiveAnnounce = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			Announce: {props.custom.text}
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
const EventHaveHeadEnter = props => {
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			{props.custom.liveIntoPromptDescribe}
		</Template>
	);
};
const EventNoHeadEnter = props => {
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
const PresentEmotion = props => {
	if (props.custom.module !== 'LIVE') return <Ignore {...props} />;
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			Sent {props.custom.giftInfo?.giftNum}x {props.custom.giftInfo?.giftName}
			<br /><img src={new URL(props.custom.giftInfo?.picPath, base)} alt="" />
		</Template>
	);
};
const MicrophoneConnectionStart = props => {
	return (
		<Template msg={props.msg} user={props.custom.initiator} deleted={props.deleted}>
			Dual Request Started
		</Template>
	);
};
const MicrophoneConnectionCancel = props => {
	return (
		<Template msg={props.msg} user={props.custom.initiator} deleted={props.deleted}>
			Dual Request Cancelled
		</Template>
	);
};
const MicrophoneConnectionAgree = props => {
	return (
		<Template msg={props.msg} user={props.custom.invitee} deleted={props.deleted}>
			Dual Request Agreed
		</Template>
	);
};
const MicrophoneConnectionRefuse = props => {
	return (
		<Template msg={props.msg} user={props.custom.invitee} deleted={props.deleted}>
			Dual Request Refused
		</Template>
	);
};
const InformBothStarInfo = props => {
	return (
		<div>
			Dual Started: {props.custom.initiator.nickname} -> {props.custom.invitee.nickname}
		</div>
	);
};
const MicrophoneConnectionFinish = props => {
	const terminator = [props.custom.initiator, props.custom.invitee].filter(u => u.userId === props.custom.terminator)[0];
	return (
		<Template msg={props.msg} user={terminator} deleted={props.deleted}>
			Dual Finished: {props.custom.initiator.nickname} -> {props.custom.invitee.nickname}
		</Template>
	);
};
const KtvSingProgress = props => {
	const fmtMs = ms => `${Math.floor(ms/60000)}:${Math.floor(ms%60000/1000)}.${ms%1000}`;
	return (
		<Template msg={props.msg} user={props.custom.user} deleted={props.deleted}>
			KTV ({fmtMs(props.custom.currentTime)} / {fmtMs(props.custom.totalTime)}): {props.custom.businessData.userInfo}
		</Template>
	);
};
const MemberStartSongBarrageNotify = props => {
	return (
		<div>
			{props.custom.text}
		</div>
	);
};

const messageType2render = new Map([
	['DELETE', Ignore],
	['DISABLE_SPEAK', Ignore],
	['CLOSE_ROOM_CHAT', Ignore],
	['SESSION_DIANTAI', Ignore],
	['PRESENT_NORMAL', PresentNormal],
	['PRESENT_FULLSCREEN', PresentFullScreen],
	['PRESENT_EMOTION', PresentEmotion],
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
	['SHARE_LIVE', SharePosts],
	['SHARE_MUSIC', SharePosts],
	['SHARE_VIDEO', SharePosts],
	['VOTE', Vote],
	// Live
	['LIVEUPDATE', LiveUpdate],
	['CLOSELIVE', CloseLive],
	// Live-msg
	['BARRAGE_NORMAL', BarrageNormal],
	['BARRAGE_PAY', BarragePay],
	['BARRAGE_STARTWO', BarrageStarTwo],
	['BARRAGE_MEMBER', BarrageMember],
	['BARRAGE_SUPERMAN', BarrageSuperman],
	['LIVE_ANNOUNCE', LiveAnnounce],
	['EVENT_VIP_ENTER', EventVipEnter],
	['EVENT_HAVEHEAD_ENTER', EventHaveHeadEnter],
	['EVENT_NOHEAD_ENTER', EventNoHeadEnter],
	['BARRAGE_NOTIFY', BarrageNotify],
	// Live-dual
	['MICROPHONE_CONNECTION_START', MicrophoneConnectionStart],   // invitee
	['MICROPHONE_CONNECTION_CANCEL', MicrophoneConnectionCancel], // invitee
	['MICROPHONE_CONNECTION_AGREE', MicrophoneConnectionAgree],   // initiator
	['MICROPHONE_CONNECTION_REFUSE', MicrophoneConnectionRefuse], // initiator
	['INFORM_BOTH_STAR_INFO', InformBothStarInfo],                // both
	['MICROPHONE_CONNECTION_FINISH', MicrophoneConnectionFinish], // both
	// Live-ktv
	['KTV_SING_Progress', KtvSingProgress],
	['MEMBERSTARTSONG_BARRAGE_NOTIFY', MemberStartSongBarrageNotify],
	['KTV_SONG_MSG', Ignore],
	['KTV_SING_START', Ignore],
	['KTV_SING_END', Ignore],
	['KTV_SONG_SUSPEND', Ignore],
	['KTV_SONG_CONTINUE', Ignore],
	// OpenLive
	['EVENT_DYNAMIC_ACTIVITY', Ignore],
]);
