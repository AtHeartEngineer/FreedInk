import { updateUser } from '$lib/db/users';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { username } = await request.json();
	const siwe_state = locals['siwe'];
	const result = await updateUser(siwe_state.address, username);
	if (!result) {
		return new Response(JSON.stringify({ message: 'Username update failed.' }), { status: 422 });
	}
	return new Response({ username }, { status: 200 });
};
