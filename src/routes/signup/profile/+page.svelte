<script lang="ts">
	import { onMount } from 'svelte';
	import { Identity } from '@semaphore-protocol/core';
	import { BrowserProvider } from 'ethers';
	export let data;
	onMount(() => {
		console.log('data', data);
	});

	async function connectWallet() {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new BrowserProvider(window.ethereum);
			await provider.send('eth_requestAccounts', []);
			const signer = provider.getSigner();
			return signer;
		} else {
			alert('MetaMask is not installed!');
			return null;
		}
	}

	async function signMessage() {
		const signer = await connectWallet();
		if (signer) {
			const message = `Generate your EdDSA Key Pair at ${window.location.origin}`;
			const signature = await signer.signMessage(message);
			const newSemaphoreIdentity = new Identity(signature);
			localStorage.setItem('semaphoreIdentity', newSemaphoreIdentity.privateKey.toString());
			console.log('Semaphore Identity Generated', newSemaphoreIdentity);
			return newSemaphoreIdentity;
		}
	}

	const updateUser = async (event) => {
		event.preventDefault();
		signMessage().then(async (semaphoreID) => {
			const username = event.target.username.value;
			const idc = semaphoreID.commitment.toString();
			const public_key = semaphoreID.publicKey.toString();
			const update = { username, idc, public_key };
			const res = await fetch('/api/user/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(update)
			});
			const json = await res.json();
			console.log('json', json);
		});
	};
</script>

<h2>Sign Up</h2>

<form on:submit={updateUser}>
	<label for="name">Username:</label>
	<input type="text" id="username" name="username" value={data.username} />
	<button type="submit">Save</button>
</form>
