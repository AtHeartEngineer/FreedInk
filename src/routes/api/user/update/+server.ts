import { updateUser } from '$lib/db/users';
import type { UserT } from '$lib/db/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = (await request.json()) as UserT;
	const siwe_state = locals['siwe'];
	const result = await updateUser(siwe_state.address, data);
	if (!result) {
		return new Response(JSON.stringify({ message: 'User update failed.' }), { status: 422 });
	}
	return new Response(result, { status: 200 });
};
