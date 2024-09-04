import { getUserByAddress } from '$lib/db/users';

export const load = async ({ locals }) => {
	const siwe_state = locals['siwe'];
	const user = siwe_state ? await getUserByAddress(siwe_state.address) : null;
	const user_data = {
		address: user?.address,
		username: user?.username,
		public_key: user?.public_key,
		idc: user?.idc
	};
	return user_data;
};
