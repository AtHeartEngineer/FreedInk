import type { RequestHandler } from './$types';
import { SiweMessage } from 'siwe';
import { createSession } from '$lib/sessionStore';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const { message, signature } = await request.json();
	const nonce = cookies.get('nonce'); // Retrieve the nonce from the cookie

	console.log('Received Nonce:', nonce);

	if (!message || !nonce) {
		return new Response(JSON.stringify({ message: 'signed message or nonce missing.' }), {
			status: 422
		});
	}

	try {
		const siweMessage = new SiweMessage(message);
		console.log('SiweMessage:', siweMessage);
		const verification = await siweMessage.verify({ signature, nonce });

		// Store SIWE data in a secure, HTTP-only cookie
		const siweData = JSON.stringify(verification.data);
		const sessionData = { siwe: verification.data };
		const sessionId = createSession(sessionData);
		cookies.set('siwe', siweData, { path: '/', httpOnly: true });
		cookies.set('session_id', sessionId, { path: '/', httpOnly: true });
		return new Response(JSON.stringify(true), { status: 200 });
	} catch (e) {
		cookies.delete('nonce', { path: '/' }); // Clear the nonce cookie
		console.error(e);
		const statusCode =
			e.name === 'ExpiredMessage' ? 440 : e.name === 'InvalidSignature' ? 422 : 500;
		return new Response(JSON.stringify({ message: e.message }), { status: statusCode });
	}
};
