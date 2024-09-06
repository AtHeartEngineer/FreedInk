import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	getAuthoredBlogsByAddress,
	getOwnedBlogsByAddress,
	getReviewedBlogsByAddress
} from '$lib/db/blogs';
import { getUserByAddress } from '$lib/db/users';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.siwe) {
		console.error('SIWE data not found in locals:', locals);
		throw redirect(303, '/'); // Redirect to login if not authenticated
	}

	const address = locals.siwe.address;
	const user = await getUserByAddress(address);
	const ownedBlogs = await getOwnedBlogsByAddress(address);
	const authoredBlogs = await getAuthoredBlogsByAddress(address);
	const reviewedBlogs = await getReviewedBlogsByAddress(address);

	const data = {
		address,
		user,
		ownedBlogs,
		authoredBlogs,
		reviewedBlogs
	};

	return data;
};
