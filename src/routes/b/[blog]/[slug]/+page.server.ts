import { getBlogPost } from '$lib/db/posts';

type BlogPage = {
	Blog: unknown;
	Posts: unknown[];
};

export const load: (params: { blog: string }) => Promise<BlogPage> = async ({ params }) => {
	return await getBlogPost(params.blog, params.slug);
};
