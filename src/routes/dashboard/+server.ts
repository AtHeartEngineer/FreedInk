import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.siwe) {
		return new Response(JSON.stringify({ message: 'Unauthorized access. Please sign in.' }), {
			status: 401
		});
	}

	return new Response(`You are authenticated and your address is: ${locals.siwe.address}`, {
		headers: { 'Content-Type': 'text/plain' },
		status: 200
	});
};
