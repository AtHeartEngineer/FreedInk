<script lang="ts">
	export let ownedBlogs;
</script>

<h3>Manage Blogs</h3>
<ul>
	{#if ownedBlogs.length === 0}
		<li>You don't own any blogs yet.</li>
	{:else}
		{#each ownedBlogs as blog}
			<li><a href="/admin/b/{blog.slug}/manage">{blog.title}</a></li>
		{/each}
	{/if}
</ul>
