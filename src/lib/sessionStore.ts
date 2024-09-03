import { v4 as uuid } from 'uuid';

const sessionStore = new Map<string, any>();

export function createSession(sessionData: any) {
	const sessionId = uuid();
	sessionStore.set(sessionId, sessionData);
	return sessionId;
}

export function getSession(sessionId: string) {
	return sessionStore.get(sessionId);
}

export function deleteSession(sessionId: string) {
	sessionStore.delete(sessionId);
}
