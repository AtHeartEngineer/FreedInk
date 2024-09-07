import { getUserByAddress } from '$lib/db/users';
export const ssr = false;

export const load = async ({ locals }) => {
	const siwe_state = locals['siwe'];
	const address = siwe_state ? siwe_state.address : null;
	if (address) {
		const userExists: boolean = await getUserByAddress(address);
		console.log('User Found', userExists.address);
	}
	return { address };
};
