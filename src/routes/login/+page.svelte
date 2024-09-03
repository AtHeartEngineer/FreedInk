<script typescript>
	import SIWE from '$lib/siwe.svelte';
</script>

<div class="stack">
	Sign-in with Ethereum
	<SIWE />
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		justify-content: top;
		align-items: center;
		height: 100vh;
		gap: 1rem;
		margin-top: 3rem;
	}
</style>
