import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve(process.cwd(), 'src/routes/content/search/+page.svelte'), 'utf8');

assert.ok(source.includes('Suche ausführen'));
assert.ok(source.includes('Treffer für'));
assert.ok(source.includes('standardmäßig'));
assert.ok(source.includes('lässt'));
assert.ok(source.includes('Ausschlüsse'));
assert.ok(source.includes('Suche verfeinern'));
assert.ok(source.includes('Feldfilter:'));
