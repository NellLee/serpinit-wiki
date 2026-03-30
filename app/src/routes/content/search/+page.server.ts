import { SEARCH_API_URL } from '$lib/constants';
import type { MarkdownPage } from '$lib/markdownPage';
import { getUtilityPagePresentation } from '$lib/presentation/pagePresentation';
import { error } from '@sveltejs/kit';

export async function load({ fetch, url }) {
	const urlParams = url.searchParams;
	const fetchResult = await fetch(`${SEARCH_API_URL}?${urlParams.toString()}`);
	if (!fetchResult.ok) {
		const { message } = await fetchResult.json();
		throw error(fetchResult.status, message);
	}
	const searchResults: SearchResult<MarkdownPage>[] = await fetchResult.json();
	searchResults.forEach((result) => (result.item = JSON.parse(result.item as unknown as string)));
	return {
		searchResults,
		presentation: getUtilityPagePresentation('search')
	};
}
