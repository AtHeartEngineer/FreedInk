<script lang="ts">
	import { goto } from '$app/navigation';

	const createBlog = async (event) => {
		event.preventDefault();
		const title = event.target.title.value;
		const description = event.target.description.value;
		const res = await fetch('/api/blog/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, description })
		});
		const status = (await res.status) === 200 ? 'success' : 'failure';

		if (status === 'success') {
			const json = await res.json();
			const slug = json.slug;
			console.log(json);
			event.target.reset();
			goto(`/admin/b/${slug}/manage`);
		}
	};
</script>

<h3>Create a Blog</h3>

<form on:submit={createBlog}>
	<label for="title">Title</label>
	<input type="text" id="title" name="title" required />

	<label for="description">Description</label>
	<textarea id="description" name="description" required rows="5"></textarea>

	<button type="submit">Create</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 80ch;
	}
</style>
