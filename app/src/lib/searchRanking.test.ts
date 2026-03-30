import assert from 'node:assert/strict';
import { deriveDomainInfo } from './searchDerivedData';
import { parseSearchQuery } from './searchQuery';
import { runSearchRanking } from './searchRanking';

const records = [
	{
		title: 'Dur-Uspil Zeremonien',
		href: '/content/Volk_/Lateralen_/Sodili/Dur-Uspil.md',
		path: 'content/Volk_/Lateralen_/Sodili/Dur-Uspil.md',
		domain: deriveDomainInfo('content/Volk_/Lateralen_/Sodili/Dur-Uspil.md'),
		pageClass: 'article' as const,
		categories: ['Rituale'],
		contentText: 'Die Dur-Uspil führt tief in die Tradition der Sodili.',
		contentHtml: '<p>Die Dur-Uspil führt tief in die Tradition der Sodili.</p>'
	},
	{
		title: 'Sodili Übersicht',
		href: '/content/Volk_/Lateralen_/Sodili/index.md',
		path: 'content/Volk_/Lateralen_/Sodili/index.md',
		domain: deriveDomainInfo('content/Volk_/Lateralen_/Sodili/index.md'),
		pageClass: 'index' as const,
		categories: ['Kulturen'],
		contentText: 'Die Sodili sind ein Volk der Lateralen.',
		contentHtml: '<p>Die Sodili sind ein Volk der Lateralen.</p>'
	},
	{
		title: 'Arkten',
		href: '/content/Himmelskoerper_/Arkten.md',
		path: 'content/Himmelskoerper_/Arkten.md',
		domain: deriveDomainInfo('content/Himmelskoerper_/Arkten.md'),
		pageClass: 'article' as const,
		categories: ['Orte'],
		contentText: 'Arkten ist ein Himmelskörper.',
		contentHtml: '<p>Arkten ist ein Himmelskörper.</p>'
	},
	{
		title: 'Akils-Anfänge',
		href: '/content/Stories/Akils-Anfaenge.md',
		path: 'content/Stories/Akils-Anfaenge.md',
		domain: deriveDomainInfo('content/Stories/Akils-Anfaenge.md'),
		pageClass: 'article' as const,
		categories: ['Charakter'],
		contentText: 'Do Uspil ist für Akil prägend.',
		contentHtml: '<p>Do Uspil ist für Akil prägend.</p>'
	}
];

const pathFiltered = runSearchRanking(records, parseSearchQuery('path:Sodili'), {
	includeCategories: true,
	includeContent: true,
	sort: 'relevance',
	activeFilters: {
		domains: [],
		pageTypes: [],
		categories: []
	}
});
assert.deepEqual(
	pathFiltered.results.map((result) => result.item.title),
	['Dur-Uspil Zeremonien', 'Sodili Übersicht']
);

const categoryFiltered = runSearchRanking(records, parseSearchQuery('category:Rituale category:Orte'), {
	includeCategories: true,
	includeContent: true,
	sort: 'relevance',
	activeFilters: {
		domains: [],
		pageTypes: [],
		categories: []
	}
});
assert.deepEqual(
	categoryFiltered.results.map((result) => result.item.title),
	['Dur-Uspil Zeremonien', 'Arkten']
);

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
assert.deepEqual(titleOnlyStillWorks.results.map((result) => result.item.title), ['Arkten']);

const exclusionRemovesMatches = runSearchRanking(records, parseSearchQuery('Sodili -Lateralen'), {
	includeCategories: true,
	includeContent: true,
	sort: 'relevance',
	activeFilters: {
		domains: [],
		pageTypes: [],
		categories: []
	}
});
assert.deepEqual(exclusionRemovesMatches.results.map((result) => result.item.title), []);

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
assert.deepEqual(
	domainSorted.results.map((result) => result.item.title),
	['Arkten', 'Akils-Anfänge', 'Dur-Uspil Zeremonien', 'Sodili Übersicht']
);

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
assert.deepEqual(uiFiltered.results.map((result) => result.item.title), ['Dur-Uspil Zeremonien']);

const curatedCategoryFiltered = runSearchRanking(records, parseSearchQuery('Do Uspil'), {
	includeCategories: true,
	includeContent: true,
	sort: 'relevance',
	activeFilters: {
		domains: [],
		pageTypes: [],
		categories: ['charaktere']
	}
});
assert.deepEqual(curatedCategoryFiltered.results.map((result) => result.item.title), ['Akils-Anfänge']);
