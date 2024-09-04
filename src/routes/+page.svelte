<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData & { Blogs: any[] };
</script>

<div class="jumbotron">
	<h2>Welcome to Freed Ink</h2>
	<p>
		This is a blogging platform that is a bit different than others. We aim to construct blogs
		shaped around like minds who want to speak more freely, but with some weight behind it.
	</p>
	<p></p>
	<a href="/signup" class="btn btn-primary">Free Your Ink</a>
</div>
<div class="featured">
	<h2>Featured Blogs</h2>
	<ul>
		{#each data.Blogs as Blog}
			<li>
				<h2><a href={`/b/${Blog.slug}`}>{Blog.title}</a></h2>
			</li>
		{/each}
	</ul>
</div>

<style>
	.jumbotron {
		padding: 4rem 2rem;
		margin-inline: auto;
		margin-bottom: 3rem;
		background-color: var(--color-light);
		border-radius: 0.5rem;
		text-align: center;
		max-width: 120ch;
	}

	.jumbotron h2 {
		font-size: 3rem;
		font-weight: bold;
	}

	.jumbotron p {
		font-size: 1.25rem;
		font-weight: 300;
	}

	.jumbotron .btn {
		padding: 0.75rem 1.25rem;
		margin: 1rem;
		font-size: 1.25rem;
		border-radius: 0.3rem;
	}

	.featured {
		margin-inline: auto;
		width: 100%;
		max-width: 120ch;
	}
	li {
		margin-bottom: 1rem;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
</style>
