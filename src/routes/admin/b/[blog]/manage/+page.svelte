<script lang="ts">
	export let data;
	let {
		blog_title = 'Loading...',
		authors = [],
		owners = [],
		reviewers = [],
		blog_id,
		blog_slug
	} = data;

	async function addUser(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const address = form.address.value;
		const role = form.role.value;

		if (role === 'owner') {
			addOwner(address);
		} else if (role === 'reviewer') {
			addReviewer(address);
		} else if (role === 'author') {
			addAuthor(address);
		}
	}

	async function addOwner(new_owner_address: string) {
		const res = await fetch(`/api/blog/owner/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blog_id, new_owner_address })
		});

		if (res.ok) {
			const newOwner = await res.json();
			owners = [...owners, newOwner];
			authors = authors.filter((author) => author.address !== new_owner_address);
			reviewers = reviewers.filter((reviewer) => reviewer.address !== new_owner_address);
		}
	}

	async function removeOwner(owner_to_remove_address: string) {
		const res = await fetch(`/api/blog/owner/remove`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blog_id, owner_to_remove_address })
		});

		if (res.ok) {
			owners = owners.filter((owner) => owner.address !== owner_to_remove_address);
		}
	}

	async function addReviewer(new_reviewer_address: string) {
		const res = await fetch(`/api/blog/reviewer/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blog_id, new_reviewer_address })
		});

		if (res.ok) {
			const newReviewer = await res.json();
			reviewers = [...reviewers, newReviewer];
			authors = authors.filter((author) => author.address !== new_reviewer_address);
			owners = owners.filter((reviewer) => reviewer.address !== new_reviewer_address);
		}
	}

	async function removeReviewer(reviewer_to_remove_address: string) {
		const res = await fetch(`/api/blog/reviewer/remove`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blog_id, reviewer_to_remove_address })
		});

		if (res.ok) {
			reviewers = reviewers.filter((reviewer) => reviewer.address !== reviewer_to_remove_address);
		}
	}

	async function addAuthor(new_author_address: string) {
		const res = await fetch(`/api/blog/author/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blog_id, new_author_address })
		});

		if (res.ok) {
			const newAuthor = await res.json();
			authors = [...authors, newAuthor];
			reviewers = reviewers.filter((reviewer) => reviewer.address !== new_author_address);
			owners = owners.filter((reviewer) => reviewer.address !== new_author_address);
		}
	}

	async function removeAuthor(author_to_remove_address: string) {
		const res = await fetch(`/api/blog/author/remove`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blog_id, author_to_remove_address })
		});

		if (res.ok) {
			authors = authors.filter((author) => author.address !== author_to_remove_address);
		}
	}
</script>

<h3>Manage {blog_title}</h3>
<a href="/admin/b/{blog_slug}/author"><button>Make Post</button></a>
<h4>Owners</h4>
<p>Owners can add new authors and reviewers, vote to publish drafts, and author draft posts.</p>
<table>
	<thead>
		<tr>
			<th>Username</th>
			<th>Address</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each owners as owner}
			<tr>
				<td>{owner.username}</td>
				<td>{owner.address}</td>
				<td>
					<button class="reviewer" on:click={() => addReviewer(owner.address)}>Make Reviewer</button
					>
					<button class="author" on:click={() => addAuthor(owner.address)}>Make Author</button>
					<button class="remove" on:click={() => removeOwner(owner.address)}>Remove</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<h4>Reviewers</h4>
<p>Reviewers can vote on draft posts to be published, and author draft posts.</p>
{#if reviewers.length > 0}
	<table>
		<thead>
			<tr>
				<th>Username</th>
				<th>Address</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each reviewers as reviewer}
				<tr>
					<td>{reviewer.username}</td>
					<td>{reviewer.address}</td>
					<td>
						<button class="owner" on:click={() => addOwner(reviewer.address)}>Make Owner</button>
						<button class="author" on:click={() => addAuthor(reviewer.address)}>Make Author</button>
						<button class="remove" on:click={() => removeReviewer(reviewer.address)}>Remove</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>No reviewers yet.</p>
{/if}

<h4>Authors Only</h4>
<p>Authors can draft posts that are voted on to be published by reviewers.</p>
{#if authors.length > 0}
	<table>
		<thead>
			<tr>
				<th>Username</th>
				<th>Address</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each authors as author}
				<tr>
					<td>{author.username}</td>
					<td>{author.address}</td>
					<td
						><button class="owner" on:click={() => addOwner(author.address)}>Make Owner</button>
						<button class="reviewer" on:click={() => addReviewer(author.address)}
							>Make Reviewer</button
						>
						<button class="remove" on:click={() => removeAuthor(author.address)}>Remove</button></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>No authors yet.</p>
{/if}

<h4>Add User</h4>
<form on:submit={addUser}>
	<label for="address">User Address</label>
	<input type="text" id="address" name="address" required />

	<label for="role">Description</label>
	<select id="role" name="role" required>
		<option value="author" selected>Author</option>
		<option value="reviewer">Reviewer & Author</option>
		<option value="owner">Owner</option>
	</select>

	<button type="submit">Add</button>
</form>

<style>
	form {
		display: flex;
		padding: 0.5rem 0.125rem;
		flex-direction: row;
		gap: 1rem;
		max-width: 80ch;
	}
	p {
		margin: 0 0 1rem 0.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.75em;
		text-align: left;
		border: 1px solid var(--color-green-light);
	}

	th {
		background-color: var(--color-green);
		color: var(--color-green-lightest);
	}

	.remove {
		background-color: var(--color-red) !important;
		color: white;
		border: none;
		padding: 0.5em;
		cursor: pointer;
		font-weight: 600;
	}

	.remove:hover {
		background-color: var(--color-red-dark) !important;
		color: white !important;
	}

	.owner {
		background-color: var(--color-green) !important;
		border-color: var(--color-green-dark);
		color: white !important;
	}

	.author {
		background-color: var(--color-blue) !important;
		border-color: var(--color-blue-dark);
		color: white !important;
	}

	.reviewer {
		background-color: var(--color-purple) !important;
		border-color: var(--color-purple-dark);
		color: white !important;
	}

	.owner:hover {
		background-color: var(--color-green-light) !important;
		border-color: var(--color-green) !important;
		color: white !important;
	}

	.author:hover {
		background-color: var(--color-blue-light) !important;
		border-color: var(--color-blue) !important;
		color: white !important;
	}

	.reviewer:hover {
		background-color: var(--color-purple-light) !important;
		border-color: var(--color-purple) !important;
		color: white !important;
	}

	h4:not(:first-of-type) {
		margin-top: 1.25em;
	}
</style>
