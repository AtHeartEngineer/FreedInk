import type { Handle } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import { getSession } from '$lib/sessionStore'; // Import the session retrieval function

export const handle: Handle = async ({ event, resolve }) => {
	// Session ID Management
	let sessionId = event.cookies.get('session_id');

	if (sessionId) {
		// Try to retrieve the session data from the session store using the session ID
		const sessionData = getSession(sessionId);
		if (sessionData) {
			event.locals.siwe = sessionData.siwe; // Store session data in locals for use in the app
			console.log('Session data successfully retrieved and set in locals:', event.locals.siwe);
		} else {
			console.log('Session ID found in cookie but no session data found in store.');
		}
	} else {
		// If no session ID is found, create a new one and set it in the cookies
		sessionId = uuid();
		event.cookies.set('session_id', sessionId, { path: '/' });
		console.log('New session ID created and set in cookie:', sessionId);
	}

	// Proceed with request handling
	const response = await resolve(event);
	return response;
};
