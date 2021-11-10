export const Room = props => {
	const debug = () => {
		console.log(window.SDK);
	};

	return (
		<div>
			<header>{props.name}</header>
			<button onClick={debug}>Debug</button>
		</div>
	);
};
