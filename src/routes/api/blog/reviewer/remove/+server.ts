import { removeReviewer } from '$lib/db/roles';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { blog_id, reviewer_to_remove_address } = await request.json();
	const siwe_state = locals['siwe']; // Get the current owner address from the session
	const result = await removeReviewer(blog_id, siwe_state.address, reviewer_to_remove_address);

	if (!result) {
		return new Response(JSON.stringify({ message: 'Failed to remove reviewer.' }), { status: 422 });
	}

	return new Response(JSON.stringify(result), { status: 200 });
};
