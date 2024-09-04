import { supabase } from '$lib/supabaseClient';
import type { UserT } from './types';

export const getUserByAddress = async (address: string) => {
	const { data: userData, error } = await supabase
		.from('Users')
		.select()
		.eq('address', address)
		.single();

	console.log(userData);
	if (error) {
		console.error('Error fetching user:', error);
		return null;
	}
	return userData;
};

export const createUser = async (address: string) => {
	const { data, error } = await supabase.from('Users').insert([{ address }]);

	if (error) {
		console.error('Error creating user:', error);
		return null;
	}
	console.info('User created:', address);
	return true;
};

export const updateUser = async (address: string, update: UserT) => {
	const { data, error } = await supabase
		.from('Users')
		.update({ username: update.username, idc: update.idc, public_key: update.public_key })
		.eq('address', address);

	if (error) {
		console.error('Error updating user:', error);
		return null;
	}
	console.info('User updated:', address);
	return address;
};
