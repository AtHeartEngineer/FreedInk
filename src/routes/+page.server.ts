import { getAllBlogs } from '$lib/db/blogs';

type HomePage = {
	Blogs: unknown[];
};

export const load: () => Promise<HomePage> = async () => {
	return await getAllBlogs();
};
