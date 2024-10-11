import { initWiki, search } from "$lib/wiki";
import { error, json } from "@sveltejs/kit";

initWiki()

export function GET({url}) {
    let query = url.searchParams.get('q');
    if (!query) {
        throw error(400, "URL parameter 'q' required")
    }
    let includeCategories = !!url.searchParams.get('includeCategories');
    let includeContent = !!url.searchParams.get('includeContent');
    let searchResults = search(query, includeCategories, includeContent)
    
    return json(searchResults)
}