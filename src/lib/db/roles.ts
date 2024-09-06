import { supabase } from '$lib/supabaseClient';
import { getUserByAddress } from './users';

export async function isOwner(blog_id: string, owner_address: string): Promise<boolean> {
	console.debug('isOwner?', owner_address);
	const user = await getUserByAddress(owner_address);
	const { data } = await supabase
		.from('BlogOwners')
		.select('id')
		.eq('blog_id', blog_id)
		.eq('owner_id', user.id);
	return data ? data.length > 0 : false;
}

export async function isAuthor(blog_id: string, author_address: string): Promise<boolean> {
	console.debug('isAuthor?', author_address);
	const user = await getUserByAddress(author_address);
	const { data } = await supabase
		.from('BlogAuthors')
		.select('id')
		.eq('blog_id', blog_id)
		.eq('author_id', user.id);
	return data ? data.length > 0 : false;
}

export async function isReviewer(blog_id: string, reviewer_address: string): Promise<boolean> {
	console.debug('isReviewer?', blog_id, reviewer_address);
	const user = await getUserByAddress(reviewer_address);
	const { data } = await supabase
		.from('BlogReviewers')
		.select('id')
		.eq('blog_id', blog_id)
		.eq('reviewer_id', user.id);
	return data ? data.length > 0 : false;
}

async function isFirstOwner(blog_id: string, owner_address: string): Promise<boolean> {
	console.debug('isFirstOwner?', owner_address);
	const user = await getUserByAddress(owner_address);
	const { data, error } = await supabase
		.from('BlogOwners')
		.select('owner_id')
		.eq('blog_id', blog_id)
		.order('created_at', { ascending: true })
		.limit(1)
		.single();

	if (error || !data) {
		console.error('Error fetching first owner or no owner found:', error);
		return false;
	}

	return data.owner_id === user.id;
}

export async function addOwner(blog_id: string, owner_address: string, new_owner_address: string) {
	console.debug('addOwner', blog_id, owner_address, new_owner_address);

	const isCurrentOwner = await isFirstOwner(blog_id, owner_address);
	const new_user = await getUserByAddress(new_owner_address);
	if (!isCurrentOwner) {
		throw new Error('Only the original blog owner can add new owners.');
	}

	await removeAuthor(blog_id, owner_address, new_owner_address);
	await removeReviewer(blog_id, owner_address, new_owner_address);

	const { error } = await supabase.from('BlogOwners').insert([{ blog_id, owner_id: new_user.id }]);

	if (error) {
		console.error('Error adding new owner:', error);
	}
}

export async function removeOwner(
	blog_id: string,
	owner_address: string,
	address_to_remove: string,
	bypassCheck = false
) {
	console.debug('removeOwner', blog_id, owner_address, address_to_remove);

	if (owner_address === address_to_remove) {
		throw new Error("You can't remove yourself as an owner.");
	}
	const owner = await getUserByAddress(owner_address);
	if (!bypassCheck) {
		const isCurrentOwner = await isFirstOwner(blog_id, owner_address);
		if (!isCurrentOwner) {
			throw new Error('Only the original blog owner can remove other owners.');
		}
	}

	const { data: currentOwnerData, error: currentOwnerError } = await supabase
		.from('BlogOwners')
		.select('created_at')
		.eq('blog_id', blog_id)
		.eq('owner_id', owner.id)
		.single();

	if (currentOwnerError) {
		throw new Error('Error fetching current owner information.');
	}

	const { data: ownerToRemoveData, error: ownerToRemoveError } = await supabase
		.from('BlogOwners')
		.select('created_at')
		.eq('blog_id', blog_id)
		.eq('owner_id', owner.id)
		.single();

	if (ownerToRemoveError) {
		throw new Error('Error fetching owner to remove information.');
	}

	if (new Date(ownerToRemoveData.created_at) < new Date(currentOwnerData.created_at)) {
		throw new Error('You cannot remove an owner who was added before you.');
	}
	const user_to_remove = await getUserByAddress(address_to_remove);
	const { error: removeError } = await supabase
		.from('BlogOwners')
		.delete()
		.eq('blog_id', blog_id)
		.eq('owner_id', user_to_remove.id);

	if (removeError) {
		console.error('Error removing owner:', removeError);
		throw new Error('Error removing owner.');
	}

	console.debug('Owner removed successfully');
}

export async function addAuthor(
	blog_id: string,
	owner_address: string,
	new_author_address: string
) {
	console.debug('addAuthor', blog_id, owner_address, new_author_address);

	const isCurrentOwner = await isOwner(blog_id, owner_address);
	const new_user = await getUserByAddress(new_author_address);
	if (!isCurrentOwner) {
		throw new Error('Only blog owners can add authors.');
	}

	await removeOwner(blog_id, owner_address, new_author_address, true);
	await removeReviewer(blog_id, owner_address, new_author_address);

	const { error } = await supabase
		.from('BlogAuthors')
		.insert([{ blog_id, author_id: new_user.id }]);

	if (error) {
		console.error('Error adding new author:', error);
	}
}

export async function removeAuthor(blog_id: string, owner_address: string, address: string) {
	console.debug('removeAuthor', blog_id, owner_address, address);

	const isCurrentOwner = await isOwner(blog_id, owner_address);
	const user_to_remove = await getUserByAddress(address);
	if (!isCurrentOwner) {
		throw new Error('Only blog owners can remove authors.');
	}

	const { error } = await supabase
		.from('BlogAuthors')
		.delete()
		.eq('blog_id', blog_id)
		.eq('author_id', user_to_remove.id);

	if (error) {
		console.error('Error removing author:', error);
	}
}

export async function addReviewer(
	blog_id: string,
	owner_address: string,
	new_reviewer_address: string
) {
	console.debug('addReviewer', blog_id, owner_address, new_reviewer_address);

	const isCurrentOwner = await isOwner(blog_id, owner_address);
	const new_reviewer = await getUserByAddress(new_reviewer_address);
	if (!isCurrentOwner) {
		throw new Error('Only blog owners can add reviewers.');
	}

	await removeOwner(blog_id, owner_address, new_reviewer_address, true);
	await removeAuthor(blog_id, owner_address, new_reviewer_address);

	const { error } = await supabase
		.from('BlogReviewers')
		.insert([{ blog_id, reviewer_id: new_reviewer.id }]);

	if (error) {
		console.error('Error adding new reviewer:', error);
	}
}

export async function removeReviewer(blog_id: string, owner_address: string, address: string) {
	console.debug('removeReviewer', blog_id, owner_address, address);

	const isCurrentOwner = await isOwner(blog_id, owner_address);
	const user_to_remove = await getUserByAddress(address);
	if (!isCurrentOwner) {
		throw new Error('Only blog owners can remove reviewers.');
	}

	const { error } = await supabase
		.from('BlogReviewers')
		.delete()
		.eq('blog_id', blog_id)
		.eq('reviewer_id', user_to_remove.id);

	if (error) {
		console.error('Error removing reviewer:', error);
	}
}

export async function getBlogOwners(blog_id: string, ownerAddress: string, bypassCheck = false) {
	console.debug('getBlogOwners', blog_id, ownerAddress);
	if (!bypassCheck) {
		const owner = await isOwner(blog_id, ownerAddress);

		if (!owner) {
			return { success: false, message: 'Only owners can view the list of blog owners.' };
		}
	}
	const { data, error } = await supabase
		.from('BlogOwners')
		.select('Users(address, username)')
		.eq('blog_id', blog_id);

	if (error) {
		return { success: false, message: `Error fetching blog owners: ${error.message}` };
	}

	const owners = data.map((owner) => ({
		address: owner.Users.address,
		username: owner.Users.username
	}));
	console.debug('getBlogOwners owners', owners);
	return { success: true, owners };
}

export async function getBlogAuthors(blog_id: string) {
	console.debug('getBlogAuthors', blog_id);

	const { data, error } = await supabase
		.from('BlogAuthors')
		.select('Users(address, username)')
		.eq('blog_id', blog_id);

	if (error) {
		return { success: false, message: `Error fetching blog authors: ${error.message}` };
	}

	const authors = data.map((author) => ({
		address: author.Users.address,
		username: author.Users.username
	}));
	console.debug('getBlogAuthors authors', authors);
	return { success: true, authors };
}

export async function getBlogReviewers(blog_id: string, address: string, bypassCheck = false) {
	console.debug('getBlogReviewers', blog_id, address);
	if (!bypassCheck) {
		const hasOwnerPermission = await isOwner(blog_id, address);
		const hasAuthorPermission = await isAuthor(blog_id, address);

		if (!hasOwnerPermission && !hasAuthorPermission) {
			return {
				success: false,
				message: 'Only owners or authors can view the list of blog reviewers.'
			};
		}
	}

	const { data, error } = await supabase
		.from('BlogReviewers')
		.select('Users(address, username)')
		.eq('blog_id', blog_id);

	if (error) {
		return { success: false, message: `Error fetching blog reviewers: ${error.message}` };
	}

	const reviewers = data.map((reviewer) => ({
		address: reviewer.Users.address,
		username: reviewer.Users.username
	}));
	console.debug('getBlogReviewers reviewers', reviewers);

	return { success: true, reviewers };
}
