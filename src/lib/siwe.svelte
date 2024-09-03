<script lang="ts">
	import { browser } from '$app/environment';
	import { BrowserProvider } from 'ethers';
	import { SiweMessage } from 'siwe';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isConnected = false;
	let isAuthenticated = false;

	if (browser) {
		onMount(async () => {
			function checkAuthentication() {
				const cookies = document.cookie;
				console.log(cookies);
				// FIXME! THIS IS NOT WORKING
				isAuthenticated = true;
			}
			const provider = new BrowserProvider(window.ethereum);

			const accounts = await provider.listAccounts();
			if (accounts.length > 0) {
				isConnected = true;
				checkAuthentication();
			}

			const connectWalletBtn = document.getElementById('connectWalletBtn');
			const siweBtn = document.getElementById('siweBtn');
			console.log(siweBtn);
			if (connectWalletBtn) {
				connectWalletBtn.onclick = connectWallet;
			}
			if (siweBtn) {
				siweBtn.onclick = signInWithEthereum;
			}
		});
		const BACKEND_ADDR = 'http://localhost:5173';
		async function createSiweMessage(address: string, statement: string) {
			const res = await fetch(`${BACKEND_ADDR}/nonce`, {
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

			const res = await fetch(`${BACKEND_ADDR}/verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message, signature }),
				credentials: 'include'
			});
			res.text().then((txt) => {
				if (txt == 'true') goto('/dashboard');
			});
		}
	}

	async function signOut() {
		const response = await fetch('/signout', { method: 'POST' });
		if (response.ok) {
			goto('/login');
		} else {
			console.error('Failed to sign out');
		}
	}
</script>

{#if !isConnected}
	<button id="connectWalletBtn">Connect</button>
{/if}
{#if isAuthenticated}
	<button on:click={signOut}>Sign Out</button>
{:else}
	<button id="siweBtn">Sign-in</button>
{/if}
