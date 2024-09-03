import { supabase } from '$lib/supabaseClient';
import { getBlogBySlug } from './blogs';

export async function getBlogPosts(blog_slug: string) {
	console.log('slug:', blog_slug);
	// First, retrieve the blog's ID using the slug
	const blogData = await getBlogBySlug(blog_slug);

	// Now, retrieve the blog posts for the fetched blog ID
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
		.eq('blog_id', blogData?.id)
		.order('created_at', { ascending: true });

	if (postsError) {
		console.error('Error fetching blog posts:', postsError);
		return null;
	}

	const flattenedPosts = postsData.map((post) => ({
		title: post.BlogPostVersions?.title,
		content: post.BlogPostVersions?.content,
		slug: post.BlogPostVersions?.slug,
		status: post.status
	}));
	//.filter((post) => post.status === 'published');

	return {
		Blog: { title: blogData?.title, slug: blog_slug, description: blogData?.description },
		Posts: flattenedPosts ?? []
	};
}

export async function getBlogPost(blog_slug: string, post_slug: string) {
	// Step 1: Retrieve the blog's ID using the blog slug
	const { data: blogData, error: blogError } = await supabase
		.from('Blogs')
		.select('id, title')
		.eq('slug', blog_slug)
		.single(); // Expecting a single blog with the given slug

	if (blogError) {
		console.error('Error fetching blog:', blogError);
		return null;
	}

	// Step 2: Retrieve the specific blog post by post slug and blog ID
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
		.eq('BlogPostVersions.slug', post_slug) // Filter by post slug
		.single(); // Expecting a single post with the given slug

	if (postError) {
		console.error('Error fetching blog post:', postError);
		return null;
	}

	// Step 3: Flatten the data to remove the relationship object
	const post = {
		id: postData.id,
		created_at: postData.created_at,
		blog_id: postData.blog_id,
		status: postData.status,
		title: postData.BlogPostVersions?.title,
		content: postData.BlogPostVersions?.content,
		slug: postData.BlogPostVersions?.slug
	};

	// Step 4: Return the blog and post details
	return {
		Blog: { title: blogData.title, slug: blog_slug },
		Post: post
	};
}
