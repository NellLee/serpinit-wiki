import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildSearchIndex, normalizeSearchText, searchDocuments } from './searchCore';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

assert.equal(normalizeSearchText('Himmelskörper'), 'himmelskoerper');
assert.equal(normalizeSearchText(' Völker-Übersicht '), 'voelker uebersicht');
assert.equal(normalizeSearchText('Schoepfung'), 'schoepfung');

const documents = [
	{
		title: 'Himmelskörper',
		href: '/content/Himmelskoerper_/index.md',
		categories: ['Orte'],
		contentText: 'Das Planetensystem umfasst neun Himmelskörper.',
		contentHtml: '<p>Das Planetensystem umfasst neun Himmelskörper.</p>'
	},
	{
		title: 'Völker',
		href: '/content/Volk_/index.md',
		categories: ['Kulturen'],
		contentText: 'Die Völker des Systems besitzen vielfältige Geschichte.',
		contentHtml: '<p>Die Völker des Systems besitzen vielfältige Geschichte.</p>'
	}
];

const index = buildSearchIndex(documents);

assert.equal(searchDocuments(index, 'himmelskoerper').at(0)?.item.title, 'Himmelskörper');
assert.equal(searchDocuments(index, 'voelker').at(0)?.item.title, 'Völker');
assert.equal(searchDocuments(index, 'geschichte', { includeContent: true }).at(0)?.item.title, 'Völker');
assert.equal(searchDocuments(index, '', { includeContent: true }).length, 0);

const searchServerSource = readAppFile('src/routes/content/search/+page.server.ts');
assert.match(searchServerSource, /if \(!query\)/);
assert.match(searchServerSource, /searchResults:\s*\[\]/);

const searchPageSource = readAppFile('src/routes/content/search/+page.svelte');
assert.doesNotMatch(searchPageSource, /placeholder="Search\.\.\."/);
assert.doesNotMatch(searchPageSource, />Categories</);
assert.doesNotMatch(searchPageSource, />Content</);
