import { deleteSession } from '$lib/sessionStore';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies, locals }) => {
	// Retrieve the session ID from the cookie
	const sessionId = cookies.get('session_id');

	if (sessionId) {
		// Delete the session from the server-side session store
		deleteSession(sessionId);
		// Clear the session ID cookie
		cookies.delete('session_id', { path: '/' });
		// Clear the SIWE cookie
		cookies.delete('siwe', { path: '/' });

		console.log(`Session ${sessionId} and SIWE cookie deleted`);
	} else {
		console.log('No session ID found in cookies');
	}
	return new Response(JSON.stringify({ success: true, message: 'Signed out successfully' }), {
		status: 200
	});
};
