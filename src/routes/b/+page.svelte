<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData & { Blogs: any[] };
</script>

<h2>Featured Blogs</h2>
<ul>
	{#each data.Blogs as Blog}
		<li>
			<h2><a href={`/b/${Blog.slug}`}>{Blog.title}</a></h2>
			<p>{Blog.description}</p>
		</li>
	{/each}
</ul>

<style>
	li {
		margin-bottom: 1rem;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
