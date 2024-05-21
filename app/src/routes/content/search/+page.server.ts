import type { MarkdownPage } from "$lib/markdownPage"
import { PAGE_API_URL } from "$lib/utilities/wiki";
import { error } from "@sveltejs/kit";


export async function load({ fetch, params, url }) {
    let urlParams = url.searchParams
    let fetchResult = await fetch(`${PAGE_API_URL}?search&${urlParams.toString()}`)
    if (!fetchResult.ok) {
        const { message } = await fetchResult.json();
        throw error(fetchResult.status, message);
    }
    let fetchJson: string[] = await fetchResult.json()
    let pages: MarkdownPage[] = fetchJson.map(json => JSON.parse(json))
    return {
        query: urlParams.get("q")!,
        pages,
    }
}