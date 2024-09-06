import { createBlog } from '$lib/db/blogs';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { title, description } = await request.json();
	const siwe_state = locals['siwe'];
	const result = await createBlog(siwe_state.address, title, description);
	if (!result) {
		return new Response(JSON.stringify({ message: 'Blog creation failed.' }), { status: 422 });
	}
	return new Response(JSON.stringify(result), { status: 200 });
};
