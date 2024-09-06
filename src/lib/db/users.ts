import { supabase } from '$lib/supabaseClient';
import type { UserT } from './types';

/**
 * Get a user by Ethereum address.
 * @param address The user's Ethereum address.
 * @returns The user data or null if not found.
 */
export async function getUserByAddress(address: string) {
	console.debug('getUserByAddress', address);
	try {
		let { data: userData, error } = await supabase
			.from('Users')
			.select('*')
			.eq('address', address)
			.single();

		if (error) {
			userData = await createUser(address);
			return userData ? userData : null;
		}

		return userData;
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * Create a new user with the given Ethereum address.
 * @param address The user's Ethereum address.
 * @returns true if the user was created, otherwise null.
 */
export async function createUser(address: string) {
	console.debug('createUser', address);
	try {
		const { error } = await supabase.from('Users').insert([{ address }]);

		if (error) throw new Error(`Error creating user: ${error.message}`);

		console.info('User created', address);
		return true;
	} catch (error) {
		console.error(error);
		return null;
	}
}

/**
 * Update a user's information based on their Ethereum address.
 * @param address The user's Ethereum address.
 * @param update An object containing the fields to update (username, idc, public_key).
 * @returns The updated address or null in case of an error.
 */
export async function updateUser(address: string, update: UserT) {
	console.debug('updateUser', address, update);
	try {
		const { error } = await supabase
			.from('Users')
			.update({
				username: update.username,
				idc: update.idc,
				public_key: update.public_key
			})
			.eq('address', address);

		if (error) throw new Error(`Error updating user: ${error.message}`);

		console.debug('User updated', address);
		return address;
	} catch (error) {
		console.error(error);
		return null;
	}
}
