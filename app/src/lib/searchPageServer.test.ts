import { expect, test } from 'vitest';
import { load } from '../routes/content/search/+page.server';

test('forwards search page parameters to the API route', async () => {
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
	expect(apiUrl.searchParams.get('q')).toBe('Do Uspil');
	expect(apiUrl.searchParams.get('includeCategories')).toBe('false');
	expect(apiUrl.searchParams.get('includeContent')).toBe('false');
	expect(apiUrl.searchParams.get('sort')).toBe('domain');
	expect(apiUrl.searchParams.getAll('domain')).toEqual(['volk']);
	expect(apiUrl.searchParams.getAll('pageType')).toEqual(['article']);
	expect(apiUrl.searchParams.getAll('category')).toEqual(['magie', 'theologie']);

	expect(result.activeFilters.domains).toEqual(['volk']);
	expect(result.activeFilters.pageTypes).toEqual(['article']);
	expect(result.activeFilters.categories).toEqual(['magie', 'theologie']);
	expect(result.sort).toBe('domain');
});
