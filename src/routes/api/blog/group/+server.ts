import { getAuthorIDCs, getBlogBySlug } from '$lib/db/blogs';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { blog_slug } = await request.json();
	const blog = await getBlogBySlug(blog_slug);
	const result = await getAuthorIDCs(blog.id);

	if (!result) {
		return new Response(JSON.stringify({ message: 'Failed to fetch group.' }), { status: 422 });
	}

	return new Response(JSON.stringify(result), { status: 200 });
};
