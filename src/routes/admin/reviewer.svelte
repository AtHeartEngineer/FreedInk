<script lang="ts">
	export let reviewedBlogs;
</script>

<h3>Review Posts</h3>
<ul>
	{#if reviewedBlogs.length === 0}
		<li>You aren't the reviewer on any blogs yet.</li>
	{:else}
		{#each reviewedBlogs as blog}
			<li><a href="/admin/b/{blog.slug}/reviewer">{blog.title}</a></li>
		{/each}
	{/if}
</ul>
