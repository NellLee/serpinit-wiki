import { initWiki, search, type SearchResult } from "$lib/utilities/wiki";
import { error, json } from "@sveltejs/kit";

initWiki()

export function GET({url}) {
    let query = url.searchParams.get('q');
    if (!query) {
        throw error(400, "URL parameter 'q' required")
    }
    let searchResults: SearchResult[] = search(query)
    
    return json(searchResults)
}