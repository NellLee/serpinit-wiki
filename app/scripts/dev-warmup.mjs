#!/usr/bin/env node
// The first request to a freshly-started dev server pays for Vite's SSR module
// transform plus lazy wiki initialization - worse under WSL, where DrvFs's slow
// file access stretches it well past what feels responsive (mirrors the e2e
// warm-up in e2e/global-setup.cjs, which fixed the same cost for tests). This
// wraps `vite dev` so a human's first click isn't the one paying that cost.
import { spawn } from 'child_process';

// eslint-disable-next-line no-control-regex -- stripping ANSI color codes needs the literal ESC char
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;
const READY_LINE_PATTERN = /Local:\s+(http:\/\/\S+)/;

const child = spawn('vite', ['dev', ...process.argv.slice(2)], {
	stdio: ['inherit', 'pipe', 'inherit']
});

let warmupStarted = false;

child.stdout.on('data', (chunk) => {
	process.stdout.write(chunk);
	if (warmupStarted) {
		return;
	}

	const match = chunk.toString().replace(ANSI_PATTERN, '').match(READY_LINE_PATTERN);
	if (!match) {
		return;
	}

	warmupStarted = true;
	// "/" only reaches the homepage route (content/+page.server.ts), which never imports
	// wiki.ts - it is a disjoint module graph from content/[...page] (the actual per-page
	// route, which also disables SSR entirely) and from the /api/page endpoint it calls.
	// Warming "/" alone leaves both of those cold, so warm the real page route directly.
	const url = new URL('content/index.md', match[1]).toString();
	console.log(`[dev-warmup] warming up ${url} ...`);
	fetch(url, { signal: AbortSignal.timeout(150_000) })
		.then(() => console.log('[dev-warmup] done - first click should be fast now'))
		.catch((error) =>
			console.error(`[dev-warmup] warm-up request to ${url} failed:`, error.message)
		);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => child.kill(signal));
}

child.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
	} else {
		process.exit(code ?? 0);
	}
});
