import { getBlogPosts } from '$lib/db/posts';

type BlogPage = {
	Blog: unknown;
	Posts: unknown[];
};

export const load: (params: { blog: string }) => Promise<BlogPage> = async ({ params }) => {
	return await getBlogPosts(params.blog);
};
