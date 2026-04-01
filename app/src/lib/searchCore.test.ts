import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import {
	buildHighlightedHtml,
	buildSearchIndex,
	normalizeSearchText,
	searchDocuments
} from './searchCore';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

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
	},
	{
		title: 'Dur-Uspil Zeremonien',
		href: '/content/Test.md',
		categories: ['Rituale'],
		contentText: 'Dur-Uspil Zeremonien werden durchgeführt.',
		contentHtml: '<p>Dur-Uspil Zeremonien werden durchgeführt.</p>'
	}
];

describe('searchCore', () => {
	test('normalizes and highlights umlauted search text', () => {
		expect(normalizeSearchText('Himmelskörper')).toBe('himmelskoerper');
		expect(normalizeSearchText(' Völker-Übersicht ')).toBe('voelker uebersicht');
		expect(normalizeSearchText('Schoepfung')).toBe('schoepfung');
		expect(buildHighlightedHtml('Himmelskörper', [[0, 12]])).toBe('<mark>Himmelskörper</mark>');
	});

	test('searches indexed documents and returns title highlights', () => {
		const index = buildSearchIndex(documents);
		expect(searchDocuments(index, 'himmelskoerper').at(0)?.item.title).toBe('Himmelskörper');
		expect(searchDocuments(index, 'voelker').at(0)?.item.title).toBe('Völker');
		expect(searchDocuments(index, 'geschichte', { includeContent: true }).at(0)?.item.title).toBe('Völker');
		expect(searchDocuments(index, '', { includeContent: true })).toHaveLength(0);
		expect(searchDocuments(index, 'himmelskoper').at(0)?.titleHighlights).toEqual([[0, 12]]);
		expect(
			searchDocuments(index, 'Dur Uspil').find((result) => result.item.title === 'Dur-Uspil Zeremonien')
				?.titleHighlights
		).toEqual([[0, 8]]);
		expect(
			buildHighlightedHtml(
				searchDocuments(index, 'himmelskoper').at(0)?.item.title ?? '',
				searchDocuments(index, 'himmelskoper').at(0)?.titleHighlights ?? []
			)
		).toBe('<mark>Himmelskörper</mark>');
		expect(
			buildHighlightedHtml(
				searchDocuments(index, 'Dur Uspil').find((result) => result.item.title === 'Dur-Uspil Zeremonien')
					?.item.title ?? '',
				searchDocuments(index, 'Dur Uspil').find((result) => result.item.title === 'Dur-Uspil Zeremonien')
					?.titleHighlights ?? []
			)
		).toBe('<mark>Dur-Uspil</mark> Zeremonien');
	});

	test('keeps search route and component wiring in place', () => {
		const searchServerSource = readAppFile('src/routes/content/search/+page.server.ts');
		expect(searchServerSource).toMatch(/if \(!query\)/);
		expect(searchServerSource).toMatch(/results:\s*\[\]/);
		expect(searchServerSource).toMatch(/parsedQuery:/);
		expect(searchServerSource).toMatch(/facets:/);

		const searchPageSource = readAppFile('src/routes/content/search/+page.svelte');
		expect(searchPageSource).not.toMatch(/placeholder="Search\.\.\."/);
		expect(searchPageSource).not.toMatch(/>Categories</);
		expect(searchPageSource).not.toMatch(/>Content</);
		expect(searchPageSource).toMatch(/titleHighlights=\{result\.titleHighlights \?\? \[\]\}/);
		expect(searchPageSource).toMatch(/facet/);
		expect(searchPageSource).toMatch(/syntax-help/);
		expect(searchPageSource).toMatch(/active-chips/);
		expect(searchPageSource).toMatch(/sortInput/);

		const apiSearchServerSource = readAppFile('src/routes/api/search/+server.ts');
		expect(apiSearchServerSource).toMatch(/return json\(/);
		expect(apiSearchServerSource).toMatch(/query,/);
		expect(apiSearchServerSource).toMatch(/results:/);
		expect(apiSearchServerSource).toMatch(/searchPreview/);

		const searchEntrySource = readAppFile('src/lib/components/SearchEntry.svelte');
		expect(searchEntrySource).toMatch(/titleHighlights/);
		expect(searchEntrySource).toMatch(/buildHighlightedHtml/);
		expect(searchEntrySource).toMatch(/metadata/);

		const searchbarSource = readAppFile('src/lib/components/Searchbar.svelte');
		expect(searchbarSource).toMatch(/SearchPreviewResponse/);
		expect(searchbarSource).toMatch(/previewResponse\.results/);
	});
});
