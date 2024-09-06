<script lang="ts">
	import { browser } from '$app/environment';
	import { BrowserProvider } from 'ethers';
	import { SiweMessage } from 'siwe';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte'; // To ensure DOM updates

	export let address;

	let isConnected = false;
	let isAuthenticated = false;
	let connectWalletBtn;
	let siweBtn;

	if (browser) {
		onMount(async () => {
			function checkAuthentication() {
				isAuthenticated = address ? true : false;
			}

			const provider = new BrowserProvider(window.ethereum);

			const accounts = await provider.listAccounts();
			if (accounts.length > 0) {
				isConnected = true;
				checkAuthentication();
			}

			// Attach event listeners after the DOM is updated
			await tick();
			if (connectWalletBtn) {
				connectWalletBtn.onclick = connectWallet;
			}
			if (siweBtn) {
				siweBtn.onclick = signInWithEthereum;
			}
		});

		async function createSiweMessage(address: string, statement: string) {
			const res = await fetch('/api/nonce', {
				credentials: 'include'
			});
			const message = new SiweMessage({
				scheme: 'https',
				domain: document.location.host,
				address,
				statement,
				uri: document.location.origin,
				version: '1',
				chainId: (await provider.getNetwork().then(({ chainId }) => chainId)) as number,
				nonce: await res.text()
			});
			return message.prepareMessage();
		}

		const provider = new BrowserProvider(window.ethereum);

		function connectWallet() {
			provider.send('eth_requestAccounts', []).catch(() => console.log('user rejected request'));
		}

		async function signInWithEthereum() {
			const signer = await provider.getSigner();

			const message = await createSiweMessage(
				await signer.getAddress(),
				'Sign into Freed Ink with Ethereum.'
			);
			const signature = await signer.signMessage(message);

			const res = await fetch('/api/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message, signature }),
				credentials: 'include'
			});
			res.json().then((data) => {
				if (data.new_user) {
					goto('/signup/profile');
				} else {
					window.location.href = '/admin';
				}
			});
		}
	}

	async function signOut() {
		const response = await fetch('/api/signout', { method: 'POST' });
		if (response.ok) {
			window.location.reload();
			goto('/');
		} else {
			console.error('Failed to sign out');
		}
	}
</script>

<div id="siwe_state">
	{#if !isConnected}
		<button bind:this={connectWalletBtn}>Connect</button>
	{/if}
	{#if isAuthenticated}
		<div title={address} class="address">{address}</div>
		<button on:click={signOut}>Sign Out</button>
	{:else}
		<button bind:this={siweBtn}>Sign-in</button>
	{/if}
</div>

<style>
	#siwe_state {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	#siwe_state .address {
		max-width: 12ch;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
