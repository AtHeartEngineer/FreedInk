<script lang="ts">
	import { goto } from '$app/navigation';
	import { hashMessage, sluggify } from '$lib/utils';
	import { Identity } from '@semaphore-protocol/core';
	import { Group } from '@semaphore-protocol/group';
	import { generateProof } from '@semaphore-protocol/proof';

	export let data;
	const blog_slug = sluggify(data.blog_title);
	$: title = '';
	$: titleSlug = sluggify(title);
	$: content = '';

	async function createPost() {
		const group_res = await fetch(`/api/blog/group`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blog_slug })
		});

		if (group_res.ok) {
			console.log('Group fetched');
			const members = await group_res.json();
			const group = new Group(members);
			const identity_string = localStorage.getItem('semaphoreIdentity');
			const identity = new Identity(identity_string as string);
			const scope = group.root;
			const messageHash = await hashMessage(title + content);
			const proof = await generateProof(identity, group, messageHash, scope);
			const post_res = await fetch(`/api/blog/post`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ blog_slug, title, content, proof })
			});
			if (post_res.ok) {
				console.log('Post created');
				goto(`/admin/`);
			} else {
				console.error('Failed to create post');
			}
		} else {
			console.error('Failed to fetch group');
		}
	}
</script>

<h3>New post for: {data.blog_title}</h3>
<form>
	<div id="title_wrapper">
		<div id="title">
			<label for="title">Post Title</label>
			<input type="text" id="title" name="title" bind:value={title} />
		</div>
		<div id="title_slug">
			<label for="title">Mock URL</label>
			<input type="text" bind:value={titleSlug} disabled />
		</div>
	</div>
	<div id="content">
		<label for="content">Enter the content of the new post:</label>
		<textarea id="content" name="content" bind:value={content}></textarea>
	</div>
	<button on:click={createPost} style="max-width: 20ch !important">Create Post</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 1rem;
	}

	#title_wrapper {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
	#title,
	#title_slug,
	#title input,
	#title_slug input {
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		width: 100%;
	}

	#content {
	}

	textarea {
		width: 100%;
		height: 10rem;
	}
</style>
