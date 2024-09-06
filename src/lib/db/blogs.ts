import { supabase } from '$lib/supabaseClient';
import { sluggify } from '$lib/utils';
import { getUserByAddress } from './users';

export async function getAllBlogs() {
	console.debug('getAllBlogs');
	const { data } = await supabase.from('Blogs').select();
	return {
		Blogs: data ?? []
	};
}

export async function getBlogBySlug(slug: string) {
	console.debug('getBlogBySlug', slug);
	const { data: blogData, error: blogError } = await supabase
		.from('Blogs')
		.select()
		.eq('slug', slug)
		.single();
	if (blogError) {
		console.error('Error fetching blog:', blogError);
		return null;
	}
	return blogData;
}

export async function getOwnedBlogsByAddress(address: string) {
	console.debug('getOwnedBlogsByAddress', address);
	const userData = await getUserByAddress(address);
	const userId = userData.id;

	const { data: blogs, error: blogError } = await supabase
		.from('BlogOwners')
		.select('blog_id, Blogs (title, slug)')
		.eq('owner_id', userId);

	if (blogError) {
		console.error('Error fetching owned blogs:', blogError);
		return [];
	}
	return blogs.map((blog) => blog.Blogs);
}

export async function getAuthoredBlogsByAddress(address: string) {
	console.debug('getAuthoredBlogsByAddress', address);
	const userData = await getUserByAddress(address);
	const userId = userData.id;

	const { data: blogs, error: blogError } = await supabase
		.from('BlogAuthors')
		.select('blog_id, Blogs (title, slug)')
		.eq('author_id', userId);

	if (blogError) {
		console.error('Error fetching owned blogs:', blogError);
		return [];
	}
	return blogs.map((blog) => blog.Blogs);
}

export async function getReviewedBlogsByAddress(address: string) {
	console.debug('getReviewedBlogsByAddress', address);
	const userData = await getUserByAddress(address);
	const userId = userData.id;

	const { data: blogs, error: blogError } = await supabase
		.from('BlogReviewers')
		.select('blog_id, Blogs (title, slug)')
		.eq('reviewer_id', userId);

	if (blogError) {
		console.error('Error fetching owned blogs:', blogError);
		return [];
	}
	return blogs.map((blog) => blog.Blogs);
}

export async function createBlog(address: string, title: string, description: string) {
	console.debug('createBlog', address, title);
	const userData = await getUserByAddress(address);
	const userId = userData.id;
	const slug = sluggify(title);

	const { data: blogData, error: blogError } = await supabase
		.from('Blogs')
		.insert([{ title, description, slug }])
		.select('id')
		.single();

	if (blogError) {
		console.error('Error creating blog:', blogError);
		return { success: false, message: 'Error creating blog.' };
	}

	const blogId = blogData.id;

	const { error: ownerError } = await supabase
		.from('BlogOwners')
		.insert([{ blog_id: blogId, owner_id: userId }]);

	if (ownerError) {
		console.error('Error setting blog owner:', ownerError);
		return { success: false, message: 'Error setting blog owner.' };
	}

	return { success: true, message: 'Blog created and owner set successfully.', slug };
}

export async function getAuthorIDCs(blog_id: string) {
	try {
		// Fetch owners
		const { data: owners, error: ownersError } = await supabase
			.from('BlogOwners')
			.select('owner_id')
			.eq('blog_id', blog_id);

		if (ownersError) throw new Error(`Error fetching owners: ${ownersError.message}`);

		// Fetch authors
		const { data: authors, error: authorsError } = await supabase
			.from('BlogAuthors')
			.select('author_id')
			.eq('blog_id', blog_id);

		if (authorsError) throw new Error(`Error fetching authors: ${authorsError.message}`);

		// Fetch reviewers
		const { data: reviewers, error: reviewersError } = await supabase
			.from('BlogReviewers')
			.select('reviewer_id')
			.eq('blog_id', blog_id);

		if (reviewersError) throw new Error(`Error fetching reviewers: ${reviewersError.message}`);

		// Combine all the user IDs
		const userIds = [
			...owners.map((owner) => owner.owner_id),
			...authors.map((author) => author.author_id),
			...reviewers.map((reviewer) => reviewer.reviewer_id)
		];

		// Fetch the users based on the combined IDs
		const { data: users, error: usersError } = await supabase
			.from('Users')
			.select('idc, created_at')
			.in('id', userIds)
			.order('created_at', { ascending: true });

		if (usersError) throw new Error(`Error fetching users: ${usersError.message}`);

		return users.map((user) => user.idc);
	} catch (error) {
		console.error('Error fetching IDCs:', error);
		return null;
	}
}
