import { addReviewer } from '$lib/db/roles';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { blog_id, new_reviewer_address } = await request.json();
	const siwe_state = locals['siwe']; // Get the current owner address from the session
	const result = await addReviewer(blog_id, siwe_state.address, new_reviewer_address);

	if (!result) {
		return new Response(JSON.stringify({ message: 'Failed to add reviewer.' }), { status: 422 });
	}

	return new Response(JSON.stringify(result), { status: 200 });
};
