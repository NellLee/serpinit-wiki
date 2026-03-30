import { SEARCH_API_URL } from '$lib/constants';
import type { MarkdownPage } from '$lib/markdownPage';
import { getUtilityPagePresentation } from '$lib/presentation/pagePresentation';
import { error } from '@sveltejs/kit';

export async function load({ fetch, url }) {
	const urlParams = url.searchParams;
	const query = urlParams.get('q')?.trim() ?? '';

	if (!query) {
		return {
			searchResults: [],
			query: '',
			includeCategories: true,
			includeContent: true,
			presentation: getUtilityPagePresentation('search')
		};
	}

	const params = new URLSearchParams();
	params.set('q', query);
	params.set('includeCategories', urlParams.get('includeCategories') ?? 'true');
	params.set('includeContent', urlParams.get('includeContent') ?? 'true');

	const fetchResult = await fetch(`${SEARCH_API_URL}?${params.toString()}`);
	if (!fetchResult.ok) {
		const { message } = await fetchResult.json();
		throw error(fetchResult.status, message);
	}
	const searchResults: SearchResult<MarkdownPage>[] = await fetchResult.json();
	searchResults.forEach((result) => (result.item = JSON.parse(result.item as unknown as string)));
	return {
		searchResults,
		query,
		includeCategories: (urlParams.get('includeCategories') ?? 'true') === 'true',
		includeContent: (urlParams.get('includeContent') ?? 'true') === 'true',
		presentation: getUtilityPagePresentation('search')
	};
}
