<script lang="ts">
	export let authoredBlogs;
</script>

<h3>Author</h3>
<ul>
	{#if authoredBlogs.length === 0}
		<li>You aren't the author on any blogs yet.</li>
	{:else}
		{#each authoredBlogs as blog}
			<li><a href="/admin/b/{blog.slug}/author">{blog.title}</a></li>
		{/each}
	{/if}
</ul>
