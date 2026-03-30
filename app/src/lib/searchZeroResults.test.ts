import assert from 'node:assert/strict';
import { parseSearchQuery } from './searchQuery';
import { buildZeroResultSuggestions } from './searchZeroResults';

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

assert.equal(withExclusion.broadenSearch, true);
assert.deepEqual(withExclusion.removeFilters, ['-Lateralen']);
assert.deepEqual(withExclusion.nearbyQueries, ['Sodili']);

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

assert.equal(withActiveFilters.broadenSearch, true);
assert.deepEqual(withActiveFilters.removeFilters, [
	'Bereich: Volk',
	'Seitentyp: article',
	'Kategorie: Kulturen',
	'Kategorien aus',
	'Inhalt aus'
]);
assert.deepEqual(withActiveFilters.nearbyQueries, []);

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

assert.equal(noSuggestionCase.broadenSearch, false);
assert.deepEqual(noSuggestionCase.nearbyQueries, []);
