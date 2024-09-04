export const load = ({ locals }) => {
	const siwe_state = locals['siwe'];
	console.log('SIWE state on server:', siwe_state);
	const address = siwe_state ? siwe_state.address : null;
	return { address };
};
