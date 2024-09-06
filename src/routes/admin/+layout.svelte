<script lang="ts">
	import { setContext } from 'svelte';
	export let data;
	setContext('address', data.address);
	setContext('user', data.user);
	setContext('owned', data.ownedBlogs);
	setContext('authored', data.authoredBlogs);
	setContext('reviewer', data.reviewedBlogs);

	const username = data.user.username;
</script>

<div id="header">
	<h3>Welcome {username}</h3>
	<nav>
		<a href="/admin/" class="btn">Dashboard</a>
		<a href="/admin/new" class="btn">+ Create a new blog</a>
	</nav>
</div>

<slot></slot>

<style>
	#header,
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	#header {
		margin-bottom: 0.5rem;
	}
</style>
