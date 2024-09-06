import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getBlogAuthors,
	getBlogOwners,
	getBlogReviewers,
	isOwner,
	isReviewer
} from '$lib/db/roles';
import { getBlogBySlug } from '$lib/db/blogs';

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
	if (!owner || !reviewer) {
		console.error('User does not have any administrative access to', blog_title);
		throw redirect(303, '/admin'); // Redirect to login if not authenticated
	}
	const authors = await getBlogAuthors(blog_id);
	const owners = await getBlogOwners(blog_id, address);
	const reviewers = await getBlogReviewers(blog_id, address);

	const data = {
		address,
		blog_title,
		blog_id,
		owners: owners.owners,
		authors: authors.authors,
		reviewers: reviewers.reviewers
	};

	return data;
};
