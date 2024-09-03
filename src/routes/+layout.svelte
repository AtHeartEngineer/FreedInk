<script typescript>
	import SIWE from '$lib/siwe.svelte';
</script>

<header>
	<nav>
		<a href="/" class="nav-title">Freed Ink</a>
		<SIWE />
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
		--color-primary: #16423c;
		--color-secondary: #6a9c89;
		--color-light: #c4dad2;
		--color-lightest: #e9efec;
		--color-darkest: #0b1f1c;
		--text-color-primary: #0a0a0a;
	}

	:global(body) {
		background-color: var(--color-lightest);
		font-family: var(--text-font);
		color: var(--text-color-primary);
		margin: 0;
		padding: 0;
	}

	:global(a, a:visited) {
		color: var(--color-primary);
		text-decoration: none;

		text-shadow: 1px 1px 1px var(--color-light);
	}

	:global(a:hover) {
		text-decoration: underline;
		text-shadow: 1px 1px 1px var(--color-secondary);
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
		background-color: var(--color-primary);
		color: var(--color-light);
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
		text-shadow: 0px 0px 2px var(--color-secondary);
	}

	:global(button, .btn) {
		background-color: var(--color-secondary) !important;
		color: var(--color-lightest) !important;
		border: 1px solid var(--color-secondary);
		border-radius: 0.25rem;
		padding: 0.35rem 0.75rem;
		margin: 0 0.5rem;
		cursor: pointer;
		text-shadow: none;
	}

	:global(button:hover, .btn:hover) {
		background-color: var(--color-light) !important;
		color: var(--color-primary) !important;
	}
</style>
