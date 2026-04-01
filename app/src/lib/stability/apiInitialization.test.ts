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

	test('awaits ensureWikiInitialized in API routes without direct initWiki calls', () => {
		for (const routePath of [
			'src/routes/api/page/+server.ts',
			'src/routes/api/search/+server.ts',
			'src/routes/api/timeline/+server.ts'
		]) {
			const routeSource = readAppFile(routePath);
			expect(routeSource).not.toMatch(/^\s*initWiki\(\)/m);
			expect(routeSource).toMatch(/ensureWikiInitialized/);
			expect(routeSource).toMatch(/await\s+ensureWikiInitialized\(\)/);
		}
	});
});
