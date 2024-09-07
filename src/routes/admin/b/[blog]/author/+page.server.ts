import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isOwner, isReviewer, isAuthor } from '$lib/db/roles';
import { getBlogBySlug } from '$lib/db/blogs';
export const ssr = false;
export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.siwe) {
		console.error('SIWE data not found in locals:', locals);
		throw redirect(303, '/'); // Redirect to login if not authenticated
	}

	const address = locals.siwe.address;
	const blog_slug = params.blog;
	const blog = await getBlogBySlug(blog_slug);
	const blog_title = blog.title;
	const blog_id = blog.id;

	const owner = await isOwner(blog.id, address);
	const reviewer = await isReviewer(blog.id, address);
	const author = await isAuthor(blog.id, address);
	console.log('owner', owner);
	console.log('reviewer', reviewer);
	console.log('author', author);
	if (!owner && !reviewer && !author) {
		console.error(
			'admin/b/blog/author User does not have any administrative access to',
			blog_title
		);
		throw redirect(303, '/admin'); // Redirect to login if not authenticated
	}

	const data = {
		address,
		blog_title,
		blog_id
	};

	return data;
};
