<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>{data.Blog.title}</h1>
<code>{data.Blog.description}</code>

<div id="authors">
	<h4>Authors:</h4>
	{#each data.Blog.authors as author}
		<div>{author}</div>
	{/each}
</div>
<h3>Posts</h3>
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
		margin: 0;
	}
	div#authors {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	div#authors div::after {
		content: ',';
	}

	.post_short {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 120ch;
	}
</style>
