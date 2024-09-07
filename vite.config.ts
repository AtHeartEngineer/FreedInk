import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			include: ['path', 'stream', 'util'],
			exclude: ['http'],
			globals: {
				Buffer: true,
				global: true,
				process: true
			},
			overrides: {
				fs: 'memfs'
			},
			protocolImports: true
		})
	],
	ssr: {
		noExternal: ['@semaphore-protocol/proof', 'snarkjs', 'ffjavascript', 'web-worker']
	}
});
