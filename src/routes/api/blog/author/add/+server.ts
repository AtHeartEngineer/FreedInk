import { addAuthor } from '$lib/db/roles';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { blog_id, new_author_address } = await request.json();
	const siwe_state = locals['siwe'];
	const result = await addAuthor(blog_id, siwe_state.address, new_author_address);

	if (!result) {
		return new Response(JSON.stringify({ message: 'Failed to add author.' }), { status: 422 });
	}

	return new Response(JSON.stringify(result), { status: 200 });
};
