import { getBlogBySlug } from '$lib/db/blogs';
import { createBlogPost } from '$lib/db/posts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { blog_slug, title, content, proof } = await request.json();
	const blog = await getBlogBySlug(blog_slug);
	const result = await createBlogPost(blog.id, title, content, proof);

	if (!result) {
		return new Response(JSON.stringify({ message: 'Failed to create post.' }), { status: 422 });
	}

	return new Response(JSON.stringify(result), { status: 200 });
};
