import { SEARCH_API_URL } from '$lib/constants';
import type { MarkdownPage } from '$lib/markdownPage';
import { getUtilityPagePresentation } from '$lib/presentation/pagePresentation';
import type { SearchApiResponse } from '$lib/searchContracts';
import { error } from '@sveltejs/kit';

export async function load({ fetch, url }) {
	const urlParams = url.searchParams;
	const query = urlParams.get('q')?.trim() ?? '';

	if (!query) {
		return {
			results: [],
			query: '',
			parsedQuery: {
				rawQuery: '',
				freeTextTerms: [],
				phrases: [],
				exclusions: [],
				fieldFilters: {
					title: [],
					category: [],
					path: [],
					type: []
				}
			},
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
			sort: 'relevance',
			activeFilters: {
				domains: [],
				pageTypes: [],
				categories: [],
				includeTitle: true,
				includeCategories: true,
				includeContent: true
			},
			includeCategories: true,
			includeContent: true,
			presentation: getUtilityPagePresentation('search')
		};
	}

	const params = new URLSearchParams();
	params.set('q', query);
	params.set('includeCategories', urlParams.get('includeCategories') ?? 'true');
	params.set('includeContent', urlParams.get('includeContent') ?? 'true');
	params.set('sort', urlParams.get('sort') ?? 'relevance');

	for (const domain of urlParams.getAll('domain')) {
		params.append('domain', domain);
	}

	for (const pageType of urlParams.getAll('pageType')) {
		params.append('pageType', pageType);
	}

	for (const category of urlParams.getAll('category')) {
		params.append('category', category);
	}

	const fetchResult = await fetch(`${SEARCH_API_URL}?${params.toString()}`);
	if (!fetchResult.ok) {
		const { message } = await fetchResult.json();
		throw error(fetchResult.status, message);
	}
	const searchResponse: SearchApiResponse<MarkdownPage> = await fetchResult.json();
	searchResponse.results.forEach(
		(result) => (result.item = JSON.parse(result.item as unknown as string))
	);
	return {
		results: searchResponse.results,
		query,
		parsedQuery: searchResponse.parsedQuery,
		facets: searchResponse.facets,
		suggestions: searchResponse.suggestions,
		sort: searchResponse.sort,
		activeFilters: searchResponse.activeFilters,
		includeCategories: (urlParams.get('includeCategories') ?? 'true') === 'true',
		includeContent: (urlParams.get('includeContent') ?? 'true') === 'true',
		presentation: getUtilityPagePresentation('search')
	};
}
