import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

//https://kit.svelte.dev/docs/adapter-node#custom-server

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter( {
            out: '../build/svelte',
            precompress: false,
            envPrefix: '',
            polyfill: false
        }),
        // paths: {base: "svelte"},  // set out for the serving path, done in vite, see that
	}
};

export default config;