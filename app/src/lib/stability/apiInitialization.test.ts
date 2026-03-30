import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

const wikiSource = readAppFile('src/lib/wiki.ts');
assert.match(
	wikiSource,
	/export\s+function\s+ensureWikiInitialized|export\s+async\s+function\s+ensureWikiInitialized/
);

for (const routePath of [
	'src/routes/api/page/+server.ts',
	'src/routes/api/search/+server.ts',
	'src/routes/api/timeline/+server.ts'
]) {
	const routeSource = readAppFile(routePath);
	assert.doesNotMatch(routeSource, /^\s*initWiki\(\)/m);
	assert.match(routeSource, /ensureWikiInitialized/);
	assert.match(routeSource, /await\s+ensureWikiInitialized\(\)/);
}
