import { supabase } from '$lib/supabaseClient';
import { getAuthorIDCs, getBlogBySlug } from './blogs';
import { getBlogAuthors, getBlogOwners } from './roles';
import { getUserByAddress } from './users';
import { getBlogReviewers } from '$lib/db/roles';
import { sluggify } from '$lib/utils';
import { verifyProof, type SemaphoreProof } from '@semaphore-protocol/proof';
import { Group } from '@semaphore-protocol/group';

/**
 * Fetch all posts for a specific blog based on the blog's slug.
 * @param blog_slug The slug of the blog.
 * @returns Blog details and an array of blog posts.
 */
export async function getBlogPosts(blog_slug: string) {
	console.debug('getBlogPosts', blog_slug);
	try {
		// Retrieve the blog's ID and details using the slug
		const blogData = await getBlogBySlug(blog_slug);

		if (!blogData) {
			console.error(`Blog with slug ${blog_slug} not found.`);
			return null;
		}
		console.log('getting all authors');
		const authors = await getBlogAuthors(blogData.id);
		const reviewers = await getBlogReviewers(blogData.id, '', true);
		const owners = await getBlogOwners(blogData.id, '', true);
		const all_authors = [
			...(authors?.authors ?? []).map((author) => author.username),
			...(reviewers?.reviewers ?? []).map((reviewer) => reviewer.username),
			...(owners?.owners ?? []).map((owner) => owner.username)
		].sort();
		console.log(authors, reviewers, owners, all_authors);

		// Fetch blog posts for the specified blog ID
		const { data: postsData, error: postsError } = await supabase
			.from('BlogPosts')
			.select(
				`
				id,
				created_at,
				blog_id,
				status,
				current_version,
				BlogPostVersions:BlogPosts_current_version_fkey (
					title,
					content,
					slug
				)
			`
			)
			.eq('blog_id', blogData.id)
			.order('created_at', { ascending: true });

		if (postsError) throw postsError;

		// Flatten the posts to simplify data structure
		const flattenedPosts = postsData.map((post) => ({
			title: post.BlogPostVersions?.title,
			content: post.BlogPostVersions?.content,
			slug: post.BlogPostVersions?.slug,
			status: post.status
		}));

		return {
			Blog: {
				title: blogData.title,
				slug: blog_slug,
				description: blogData.description,
				authors: all_authors
			},
			Posts: flattenedPosts ?? []
		};
	} catch (error) {
		console.error('Error fetching blog posts:', error);
		return null;
	}
}

/**
 * Fetch a single blog post by the blog's slug and the post's slug.
 * @param blog_slug The slug of the blog.
 * @param post_slug The slug of the blog post.
 * @returns Blog details and the specific blog post.
 */
export async function getBlogPost(blog_slug: string, post_slug: string) {
	try {
		// Retrieve the blog's ID and title using the blog slug
		const { data: blogData, error: blogError } = await supabase
			.from('Blogs')
			.select('id, title')
			.eq('slug', blog_slug)
			.single();

		if (blogError) throw blogError;
		if (!blogData) {
			console.error(`Blog with slug ${blog_slug} not found.`);
			return null;
		}
		// Retrieve the post details using the blog and post slugs
		const { data: postData, error: postError } = await supabase
			.from('BlogPosts')
			.select(
				`
				id,
				created_at,
				blog_id,
				status,
				BlogPostVersions:BlogPosts_current_version_fkey (
					title,
					content,
					slug
				)
			`
			)
			.eq('blog_id', blogData.id)
			.eq('BlogPostVersions.slug', post_slug)
			.single();

		if (postError) throw postError;

		// Flatten the post data
		const post = {
			id: postData.id,
			created_at: postData.created_at,
			blog_id: postData.blog_id,
			status: postData.status,
			title: postData.BlogPostVersions?.title,
			content: postData.BlogPostVersions?.content,
			slug: postData.BlogPostVersions?.slug
		};

		// Return the blog and post details
		return {
			Blog: { title: blogData.title, slug: blog_slug },
			Post: post
		};
	} catch (error) {
		console.error('Error fetching blog post:', error);
		return null;
	}
}

export async function getUnderReviewPostsByReviewer(address: string) {
	try {
		const userData = await getUserByAddress(address);

		const reviewerId = userData.id;

		// Step 2: Fetch the blog IDs where the user is a reviewer
		const { data: blogReviewerData, error: blogReviewerError } = await supabase
			.from('BlogReviewers')
			.select('blog_id')
			.eq('reviewer_id', reviewerId);

		if (blogReviewerError || !blogReviewerData.length) {
			throw new Error(`No blogs found where the address ${address} is a reviewer.`);
		}

		const blogIds = blogReviewerData.map((entry) => entry.blog_id);

		// Step 3: Fetch all blog posts that are in 'under_review' status and belong to the blogs where the user is a reviewer
		const { data: postsData, error: postsError } = await supabase
			.from('BlogPosts')
			.select(
				`
                id,
                created_at,
                blog_id,
                status,
                BlogPostVersions!inner (
                    id,
                    title,
                    content,
                    version,
                    slug,
                    status
                )
            `
			)
			.in('blog_id', blogIds)
			.eq('status', 'under_review') // BlogPost must be under review
			.eq('BlogPostVersions.status', 'under_review') // Fetch the BlogPostVersion that is under review
			.order('created_at', { ascending: true });

		if (postsError) {
			throw new Error(`Error fetching under-review blog posts: ${postsError.message}`);
		}

		// Step 4: Flatten the data for ease of use in the frontend
		const flattenedPosts = postsData.map((post) => ({
			id: post.id,
			created_at: post.created_at,
			blog_id: post.blog_id,
			status: post.status,
			version: {
				id: post.BlogPostVersions.id,
				title: post.BlogPostVersions.title,
				content: post.BlogPostVersions.content,
				slug: post.BlogPostVersions.slug,
				status: post.BlogPostVersions.status
			}
		}));

		return flattenedPosts;
	} catch (error) {
		console.error('Error fetching under-review posts by reviewer:', error);
		return null;
	}
}

export async function createBlogPost(
	blog_id: string,
	title: string,
	content: string,
	proof: object = {}
) {
	const slug = sluggify(title);
	const verified = await verifyProof(proof as SemaphoreProof);
	console.warn('verified', verified);
	const { data: postData, error: postError } = await supabase
		.from('BlogPosts')
		.insert([
			{
				blog_id: blog_id,
				status: 'under_review'
			}
		])
		.select();

	if (postError) {
		console.error('Error creating blog post:', postError);
		return null;
	}
	console.debug('Create post but havent created post version yet');

	const post_id = postData[0].id;

	const { data: versionData, error: versionError } = await supabase
		.from('BlogPostVersions')
		.insert([
			{
				post_id: post_id,
				title: title,
				content: content,
				version: 1,
				slug: slug,
				proof: proof,
				status: 'under_review'
			}
		])
		.select();

	if (versionError) {
		console.error('Error creating blog post version:', versionError);
		return null;
	}

	const { error: postUpdateError } = await supabase
		.from('BlogPosts')
		.update({ current_version: versionData[0].id })
		.eq('id', post_id)
		.select();

	if (postUpdateError) {
		console.error('Error updating blog post:', postUpdateError);
		return null;
	}

	return { post: postData[0], version: versionData[0] };
}
