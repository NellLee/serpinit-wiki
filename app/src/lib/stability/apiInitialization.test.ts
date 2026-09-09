import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

describe('apiInitialization', () => {
	test('exports ensureWikiInitialized from the wiki module', () => {
		const wikiSource = readAppFile('src/lib/wiki.ts');
		expect(wikiSource).toMatch(
			/export\s+function\s+ensureWikiInitialized|export\s+async\s+function\s+ensureWikiInitialized/
		);
	});

	test('exports loadSingleMarkdownPage from the wiki module', () => {
		const wikiSource = readAppFile('src/lib/wiki.ts');
		expect(wikiSource).toMatch(
			/export\s+function\s+loadSingleMarkdownPage|export\s+async\s+function\s+loadSingleMarkdownPage/
		);
	});

	test('no route calls the raw initWiki() full-corpus loader directly', () => {
		for (const routePath of [
			'src/routes/api/page/+server.ts',
			'src/routes/api/search/+server.ts',
			'src/routes/api/timeline/+server.ts'
		]) {
			const routeSource = readAppFile(routePath);
			expect(routeSource).not.toMatch(/\binitWiki\(\)/);
		}
	});

	test('the server never eagerly pre-loads the whole wiki at boot', () => {
		const hooksPath = path.resolve(APP_ROOT, 'src/hooks.server.ts');
		if (!fs.existsSync(hooksPath)) {
			return;
		}
		const hooksSource = fs.readFileSync(hooksPath, 'utf8');
		expect(hooksSource).not.toMatch(/\binitWiki\(\)/);
	});

	test('search awaits the full-corpus ensureWikiInitialized, since it needs every page', () => {
		const routeSource = readAppFile('src/routes/api/search/+server.ts');
		expect(routeSource).toMatch(/await\s+ensureWikiInitialized\(\)/);
	});

	test('page and timeline routes await only initTimeline, not the full-corpus batch', () => {
		for (const routePath of [
			'src/routes/api/page/+server.ts',
			'src/routes/api/timeline/+server.ts'
		]) {
			const routeSource = readAppFile(routePath);
			expect(routeSource).toMatch(/await\s+initTimeline\(\)/);
			expect(routeSource).not.toMatch(/ensureWikiInitialized/);
		}
	});

	test('page route loads its single page through the batched, cached loader', () => {
		const routeSource = readAppFile('src/routes/api/page/+server.ts');
		expect(routeSource).toMatch(/loadSingleMarkdownPage/);
	});
});
