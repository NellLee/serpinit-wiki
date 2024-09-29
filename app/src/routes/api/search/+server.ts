import { initWiki, search } from "$lib/wiki";
import { error, json } from "@sveltejs/kit";

initWiki()

export function GET({url}) {
    let query = url.searchParams.get('q');
    if (!query) {
        throw error(400, "URL parameter 'q' required")
    }
    let includeTags = !!url.searchParams.get('includeTags');
    let includeContent = !!url.searchParams.get('includeContent');
    let searchResults = search(query, includeTags, includeContent)
    
    return json(searchResults)
}