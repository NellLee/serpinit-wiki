import { describe, expect, test } from 'vitest';
import { deriveDomainInfo } from './searchDerivedData';
import { parseSearchQuery } from './searchQuery';
import { runSearchRanking } from './searchRanking';

const records = [
	{
		title: 'Dur-Uspil Zeremonien',
		href: '/content/Volk/Lateralen/Sodili/Dur-Uspil.md',
		path: 'content/Volk/Lateralen/Sodili/Dur-Uspil.md',
		domain: deriveDomainInfo('content/Volk/Lateralen/Sodili/Dur-Uspil.md'),
		pageClass: 'article' as const,
		categories: ['Rituale'],
		contentText: 'Die Dur-Uspil führt tief in die Tradition der Sodili.',
		contentHtml: '<p>Die Dur-Uspil führt tief in die Tradition der Sodili.</p>'
	},
	{
		title: 'Sodili Übersicht',
		href: '/content/Volk/Lateralen/Sodili/index.md',
		path: 'content/Volk/Lateralen/Sodili/index.md',
		domain: deriveDomainInfo('content/Volk/Lateralen/Sodili/index.md'),
		pageClass: 'index' as const,
		categories: ['Kulturen'],
		contentText: 'Die Sodili sind ein Volk der Lateralen.',
		contentHtml: '<p>Die Sodili sind ein Volk der Lateralen.</p>'
	},
	{
		title: 'Arkten',
		href: '/content/Himmelskörper/Arkten.md',
		path: 'content/Himmelskörper/Arkten.md',
		domain: deriveDomainInfo('content/Himmelskörper/Arkten.md'),
		pageClass: 'article' as const,
		categories: ['Orte'],
		contentText: 'Arkten ist ein Himmelskörper.',
		contentHtml: '<p>Arkten ist ein Himmelskörper.</p>'
	},
	{
		title: 'Akils-Anfänge',
		href: '/content/Stories/Akils-Anfänge.md',
		path: 'content/Stories/Akils-Anfänge.md',
		domain: deriveDomainInfo('content/Stories/Akils-Anfänge.md'),
		pageClass: 'article' as const,
		categories: ['Charakter'],
		contentText: 'Do Uspil ist für Akil prägend.',
		contentHtml: '<p>Do Uspil ist für Akil prägend.</p>'
	}
];

describe('searchRanking', () => {
	const titlesFor = (query: string, options: { includeContent?: boolean } = {}) =>
		runSearchRanking(records, parseSearchQuery(query), {
			includeCategories: true,
			includeContent: options.includeContent ?? true,
			sort: 'relevance',
			activeFilters: { domains: [], pageTypes: [], categories: [] }
		}).results.map((result) => result.item.title);

	test('matches path and category filters', () => {
		const pathFiltered = runSearchRanking(records, parseSearchQuery('pfad:Sodili'), {
			includeCategories: true,
			includeContent: true,
			sort: 'relevance',
			activeFilters: {
				domains: [],
				pageTypes: [],
				categories: []
			}
		});
		expect(pathFiltered.results.map((result) => result.item.title)).toEqual([
			'Dur-Uspil Zeremonien',
			'Sodili Übersicht'
		]);

		const categoryFiltered = runSearchRanking(
			records,
			parseSearchQuery('kategorie:Rituale kategorie:Orte'),
			{
				includeCategories: true,
				includeContent: true,
				sort: 'relevance',
				activeFilters: {
					domains: [],
					pageTypes: [],
					categories: []
				}
			}
		);
		expect(categoryFiltered.results.map((result) => result.item.title)).toEqual([
			'Dur-Uspil Zeremonien',
			'Arkten'
		]);
	});

	test('handles title-only and exclusion filtering', () => {
		const titleOnlyStillWorks = runSearchRanking(records, parseSearchQuery('Arkten'), {
			includeCategories: false,
			includeContent: false,
			sort: 'relevance',
			activeFilters: {
				domains: [],
				pageTypes: [],
				categories: []
			}
		});
		expect(titleOnlyStillWorks.results.map((result) => result.item.title)).toEqual(['Arkten']);

		const exclusionRemovesMatches = runSearchRanking(
			records,
			parseSearchQuery('Sodili -Lateralen'),
			{
				includeCategories: true,
				includeContent: true,
				sort: 'relevance',
				activeFilters: {
					domains: [],
					pageTypes: [],
					categories: []
				}
			}
		);
		expect(exclusionRemovesMatches.results.map((result) => result.item.title)).toEqual([]);
	});

	test('supports domain sorting and UI filter state', () => {
		const domainSorted = runSearchRanking(records, parseSearchQuery(''), {
			includeCategories: true,
			includeContent: true,
			sort: 'domain',
			activeFilters: {
				domains: [],
				pageTypes: [],
				categories: []
			}
		});
		expect(domainSorted.results.map((result) => result.item.title)).toEqual([
			'Arkten',
			'Akils-Anfänge',
			'Dur-Uspil Zeremonien',
			'Sodili Übersicht'
		]);

		const uiFiltered = runSearchRanking(records, parseSearchQuery('Sodili'), {
			includeCategories: true,
			includeContent: true,
			sort: 'relevance',
			activeFilters: {
				domains: ['volk'],
				pageTypes: ['article'],
				categories: ['rituale']
			}
		});
		expect(uiFiltered.results.map((result) => result.item.title)).toEqual(['Dur-Uspil Zeremonien']);
	});

	test('a quoted phrase must match exactly, without typo tolerance', () => {
		expect(titlesFor('"Dur Uspil"')).toEqual(['Dur-Uspil Zeremonien']);
		expect(titlesFor('"Zeremonjen"')).toEqual([]);
		expect(titlesFor('Zeremonjen')).toEqual(['Dur-Uspil Zeremonien']);
	});

	test('a phrase narrows the results that the remaining words then rank', () => {
		expect(titlesFor('"uspil" Sodili')).toEqual(['Dur-Uspil Zeremonien']);
	});

	test('a phrase only looks where the search looks', () => {
		expect(titlesFor('"do uspil"', { includeContent: false })).toEqual([]);
		expect(titlesFor('"do uspil"')).toEqual(['Akils-Anfänge']);
	});

	test('the type filter accepts the German page type labels', () => {
		expect(titlesFor('typ:Artikel')).toEqual(['Dur-Uspil Zeremonien', 'Arkten', 'Akils-Anfänge']);
		expect(titlesFor('typ:Übersicht')).toEqual(['Sodili Übersicht']);
	});
});
