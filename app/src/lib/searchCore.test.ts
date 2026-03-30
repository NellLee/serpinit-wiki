import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
	buildSearchIndex,
	highlightSearchMatches,
	normalizeSearchText,
	searchDocuments
} from './searchCore';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

assert.equal(normalizeSearchText('Himmelsk\u00f6rper'), 'himmelskoerper');
assert.equal(normalizeSearchText(' V\u00f6lker-\u00dcbersicht '), 'voelker uebersicht');
assert.equal(normalizeSearchText('Schoepfung'), 'schoepfung');
assert.match(highlightSearchMatches('Himmelsk\u00f6rper', 'himmelskoerper'), /<mark>Himmelsk\u00f6rper<\/mark>/);

const documents = [
	{
		title: 'Himmelsk\u00f6rper',
		href: '/content/Himmelskoerper_/index.md',
		categories: ['Orte'],
		contentText: 'Das Planetensystem umfasst neun Himmelsk\u00f6rper.',
		contentHtml: '<p>Das Planetensystem umfasst neun Himmelsk\u00f6rper.</p>'
	},
	{
		title: 'V\u00f6lker',
		href: '/content/Volk_/index.md',
		categories: ['Kulturen'],
		contentText: 'Die V\u00f6lker des Systems besitzen vielf\u00e4ltige Geschichte.',
		contentHtml: '<p>Die V\u00f6lker des Systems besitzen vielf\u00e4ltige Geschichte.</p>'
	}
];

const index = buildSearchIndex(documents);

assert.equal(searchDocuments(index, 'himmelskoerper').at(0)?.item.title, 'Himmelsk\u00f6rper');
assert.equal(searchDocuments(index, 'voelker').at(0)?.item.title, 'V\u00f6lker');
assert.equal(searchDocuments(index, 'geschichte', { includeContent: true }).at(0)?.item.title, 'V\u00f6lker');
assert.equal(searchDocuments(index, '', { includeContent: true }).length, 0);

const searchServerSource = readAppFile('src/routes/content/search/+page.server.ts');
assert.match(searchServerSource, /if \(!query\)/);
assert.match(searchServerSource, /searchResults:\s*\[\]/);

const searchPageSource = readAppFile('src/routes/content/search/+page.svelte');
assert.doesNotMatch(searchPageSource, /placeholder="Search\.\.\."/);
assert.doesNotMatch(searchPageSource, />Categories</);
assert.doesNotMatch(searchPageSource, />Content</);
assert.match(searchPageSource, /query=\{data\.query\}/);

const searchEntrySource = readAppFile('src/lib/components/SearchEntry.svelte');
assert.match(searchEntrySource, /titleHtml/);
assert.match(searchEntrySource, /@\s*html\s+titleHtml/);
