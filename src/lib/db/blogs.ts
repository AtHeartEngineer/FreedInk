import { supabase } from '$lib/supabaseClient';

export const getAllBlogs = async () => {
	const { data } = await supabase.from('Blogs').select();
	return {
		Blogs: data ?? []
	};
};

export const getBlogBySlug = async (slug: string) => {
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
};
