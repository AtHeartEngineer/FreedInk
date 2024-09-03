<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>{data.Blog.title}</h1>
<code>{data.Blog.description}</code>
<ul>
	{#each data.Posts as Post}
		<li>
			<h2>
				<a href={`/b/${data.Blog.slug}/${Post.slug}`}>{Post.title}</a>
			</h2>
			<div class="post_short">{Post.content}</div>
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style-type: none;
		padding: 0;
	}

	.post_short {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 120ch;
	}
</style>
