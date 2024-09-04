import type { RequestHandler } from './$types';
import { generateNonce } from 'siwe';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	const nonce = generateNonce();
	cookies.set('nonce', nonce, { path: '/' }); // Store the nonce in a cookie

	return new Response(nonce, { status: 200 });
};
