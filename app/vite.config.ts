import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		watch: {
			// inotify never reports changes on WSL's DrvFs mounts (/mnt/<drive>), so without polling
			// the dev server silently keeps serving stale modules after every edit.
			usePolling: process.platform === 'linux' && process.cwd().startsWith('/mnt/'),
			interval: 300
		}
	},
	build: {
		commonjsOptions: { transformMixedEsModules: true }
	}
});
