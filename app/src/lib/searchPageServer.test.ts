import assert from 'node:assert/strict';
import { load } from '../routes/content/search/+page.server';

let fetchedUrl = '';

const result = await load({
	url: new URL(
		'http://localhost/content/search?q=Do%20Uspil&includeCategories=false&includeContent=false&sort=domain&domain=volk&pageType=article&category=magie&category=theologie'
	),
	fetch: async (input: RequestInfo | URL) => {
		fetchedUrl = String(input);
		return {
			ok: true,
			json: async () => ({
				query: 'Do Uspil',
				parsedQuery: {
					rawQuery: 'Do Uspil',
					freeTextTerms: ['Do', 'Uspil'],
					phrases: [],
					exclusions: [],
					fieldFilters: {
						title: [],
						category: [],
						path: [],
						type: []
					}
				},
				activeFilters: {
					domains: ['volk'],
					pageTypes: ['article'],
					categories: ['magie', 'theologie'],
					includeTitle: true,
					includeCategories: false,
					includeContent: false
				},
				sort: 'domain',
				facets: {
					domains: [],
					pageTypes: [],
					categories: []
				},
				suggestions: {
					broadenSearch: false,
					removeFilters: [],
					nearbyQueries: []
				},
				results: []
			})
		} as Response;
	}
} as Parameters<typeof load>[0]);

const apiUrl = new URL(fetchedUrl, 'http://localhost');
assert.equal(apiUrl.searchParams.get('q'), 'Do Uspil');
assert.equal(apiUrl.searchParams.get('includeCategories'), 'false');
assert.equal(apiUrl.searchParams.get('includeContent'), 'false');
assert.equal(apiUrl.searchParams.get('sort'), 'domain');
assert.deepEqual(apiUrl.searchParams.getAll('domain'), ['volk']);
assert.deepEqual(apiUrl.searchParams.getAll('pageType'), ['article']);
assert.deepEqual(apiUrl.searchParams.getAll('category'), ['magie', 'theologie']);

assert.deepEqual(result.activeFilters.domains, ['volk']);
assert.deepEqual(result.activeFilters.pageTypes, ['article']);
assert.deepEqual(result.activeFilters.categories, ['magie', 'theologie']);
assert.equal(result.sort, 'domain');
