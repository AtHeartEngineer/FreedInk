<script lang="ts">
	import SIWE from '$lib/components/siwe.svelte';
	export let data: string | null;
</script>

<header>
	<nav>
		<div>
			<a href="/" class="nav-title">Freed.Ink</a>
			<a href="/b">Blogs</a>
		</div>
		<div>
			<a href="/admin">Admin Dashboard</a>
			<SIWE address={data.address} />
		</div>
	</nav>
</header>
<main>
	<slot></slot>
	<!-- <hr />
	<h1>h1</h1>
	<h2>h2</h2>
	<h3>h3</h3>
	<h4>h4</h4>
	<h5>h5</h5>
	<h6>h6</h6>
	<p>paragraph</p>
	<code>code</code>
	<blockquote>blockquote</blockquote>
	<a href="/">link</a> -->
</main>

<style global>
	:root {
		--heading-font: 'Source Code Pro', sans-serif;
		--text-font: 'Lato', sans-serif;
		--color-green: hsl(172, 60%, 25%);
		--color-green-light: hsl(172, 42%, 50%);
		--color-green-lightest: hsl(172, 40%, 75%);
		--color-green-white: hsl(172, 60%, 95%);
		--color-green-dark: hsl(172, 84%, 15%);
		--color-red: hsl(354, 60%, 37%);
		--color-red-dark: hsl(354, 80%, 23%);
		--color-blue: hsl(215, 60%, 30%);
		--color-blue-light: hsl(215, 40%, 50%);
		--color-blue-lightest: hsl(215, 40%, 70%);
		--color-blue-dark: hsl(215, 70%, 20%);
		--color-purple: hsl(270, 60%, 30%);
		--color-purple-light: hsl(270, 40%, 50%);
		--color-purple-lightest: hsl(270, 40%, 75%);
		--color-purple-dark: hsl(270, 70%, 20%);

		--text-color-green-darkest: #000a03;
	}

	:global(body) {
		background-color: var(--color-green-white);
		font-family: var(--text-font);
		color: var(--text-color-green-darkest);
		margin: 0;
		padding: 0;
	}

	:global(a, a:visited) {
		color: var(--text-color-green-darkest);
		text-decoration: none;

		text-shadow: 1px 1px 2px var(--color-green-lightest);
	}

	:global(a:hover) {
		text-decoration: underline;
		text-shadow: 1px 1px 1px var(--color-green-lightest);
	}

	:global(h1, h2, h3, h4, h5, h6, nav > a, button) {
		font-family: var(--heading-font);
		text-decoration: none !important;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		margin: 0.5rem 0;
	}

	main {
		margin: 1rem;
		display: flex;
		flex-direction: column;
	}

	.nav-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin-right: 1.5rem;
	}

	nav {
		background-color: var(--color-green-dark);
		color: var(--color-green-lightest);
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	nav a {
		color: var(--color-light);
		margin-right: 1rem;
		text-shadow: none;
	}

	nav a:hover {
		text-shadow: 0px 0px 2px var(--color-green-lightest);
	}

	nav div {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	:global(button, .btn) {
		background-color: var(--color-green) !important;
		color: var(--color-green-white) !important;
		border: 1px solid var(--color-green-light);
		border-radius: 0.25rem;
		padding: 0.35rem 0.75rem;
		margin: 0 0.5rem;
		cursor: pointer;
		text-shadow: none;
		font-weight: 500;
	}

	:global(button:hover, .btn:hover) {
		background-color: var(--color-green-light) !important;
		color: var(--color-green) !important;
		text-decoration: none;
		text-shadow: none;
	}
</style>
