import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.siwe) {
		console.error('SIWE data not found in locals:', locals);
		throw redirect(303, '/login'); // Redirect to login if not authenticated
	}

	console.log('Address returned from load:', locals.siwe.address);
	const data = {
		address: locals.siwe.address
	};
	return data;
};
