import { SEARCH_API_URL } from "$lib/constants";
import type { MarkdownPage } from "$lib/markdownPage";
import { error } from "@sveltejs/kit";


export async function load({ fetch, params, url }) {
    let urlParams = url.searchParams
    let fetchResult = await fetch(`${SEARCH_API_URL}?${urlParams.toString()}`)
    if (!fetchResult.ok) {
        const { message } = await fetchResult.json();
        throw error(fetchResult.status, message);
    }
    let searchResults: SearchResult<MarkdownPage>[] = await fetchResult.json()
    searchResults.forEach(result => result.item = JSON.parse(result.item as unknown as string))
    return {
        searchResults,
    }
}