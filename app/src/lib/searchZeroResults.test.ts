import { describe, expect, test } from 'vitest';
import { parseSearchQuery } from './searchQuery';
import { buildZeroResultSuggestions } from './searchZeroResults';

describe('searchZeroResults', () => {
	test('suggests removing exclusions when they block all results', () => {
		const withExclusion = buildZeroResultSuggestions({
			parsedQuery: parseSearchQuery('Sodili -Lateralen'),
			activeFilters: {
				domains: [],
				pageTypes: [],
				categories: [],
				includeTitle: true,
				includeCategories: true,
				includeContent: true
			},
			resultsCount: 0,
			relaxedQueries: ['Sodili']
		});

		expect(withExclusion.broadenSearch).toBe(true);
		expect(withExclusion.removeFilters).toEqual(['-Lateralen']);
		expect(withExclusion.nearbyQueries).toEqual(['Sodili']);
	});

	test('suggests removing active filters and disabled scopes', () => {
		const withActiveFilters = buildZeroResultSuggestions({
			parsedQuery: parseSearchQuery('Sodili'),
			activeFilters: {
				domains: ['volk'],
				pageTypes: ['article'],
				categories: ['Kulturen'],
				includeTitle: true,
				includeCategories: false,
				includeContent: false
			},
			resultsCount: 0,
			relaxedQueries: []
		});

		expect(withActiveFilters.broadenSearch).toBe(true);
		expect(withActiveFilters.removeFilters).toEqual([
			'Bereich: Volk',
			'Seitentyp: article',
			'Kategorie: Kulturen',
			'Kategorien aus',
			'Inhalt aus'
		]);
		expect(withActiveFilters.nearbyQueries).toEqual([]);
	});

	test('does not suggest broadening for an empty query', () => {
		const noSuggestionCase = buildZeroResultSuggestions({
			parsedQuery: parseSearchQuery(''),
			activeFilters: {
				domains: [],
				pageTypes: [],
				categories: [],
				includeTitle: true,
				includeCategories: true,
				includeContent: true
			},
			resultsCount: 0,
			relaxedQueries: ['Sodili']
		});

		expect(noSuggestionCase.broadenSearch).toBe(false);
		expect(noSuggestionCase.nearbyQueries).toEqual([]);
	});
});
