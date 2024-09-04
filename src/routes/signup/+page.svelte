<script lang="ts">
	import SIWE from '$lib/components/siwe.svelte';
	export let data;
</script>

<div class="stack">
	Sign-in with Ethereum
	<SIWE address={data.address} />
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
