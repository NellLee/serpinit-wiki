import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

test('keeps the German search page copy in place', () => {
	const source = fs.readFileSync(path.resolve(process.cwd(), 'src/routes/content/search/+page.svelte'), 'utf8');

	expect(source.includes('Suche ausführen')).toBe(true);
	expect(source.includes('Treffer für')).toBe(true);
	expect(source.includes('standardmäßig')).toBe(true);
	expect(source.includes('lässt')).toBe(true);
	expect(source.includes('Ausschlüsse')).toBe(true);
	expect(source.includes('Suche verfeinern')).toBe(true);
	expect(source.includes('Feldfilter:')).toBe(true);
});
