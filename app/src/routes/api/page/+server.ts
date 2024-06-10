
import type { MarkdownPage } from '$lib/markdownPage.js';
import { getLinkedFilePath } from '$lib/utilities/links';
import { initWiki, loadMarkdownPage, wiki } from '$lib/utilities/wiki';
import { error, json } from '@sveltejs/kit';

// initWiki()

export function GET({url}) {
    let pages: MarkdownPage | MarkdownPage[];

    if(url.searchParams.get('search') !== null) {
        pages = []
        const tags = url.searchParams.get('tags');
        let query = url.searchParams.get('q');
        if(url.searchParams.size == 1) { // only "?search"
            pages = Array.from(wiki.values())
        }
        if (query) {
            let cleanQuery = query!.trim().toLowerCase()
            let searchResult: string[] = []
            searchResult.push(...search((page) => page.title.toLowerCase().includes(cleanQuery)))
            searchResult.push(...search((page) => page.tags.map((tag) => tag.text.toLowerCase()).includes(cleanQuery)))
            searchResult.push(...search((page) => page.markdown.toLowerCase().includes(cleanQuery)))
            if(searchResult.length > 0) { 
                for (let key of searchResult) {
                    pages.push(loadMarkdownPage(getLinkedFilePath(key)))
                }
            }
        } 
        if(tags) {
            let searchResult: string[] = []
            for (let searchTag of tags.split(',')) {
                searchResult.push(...search((page) => page.tags.map((tag) => tag.text.toLowerCase()).includes(searchTag.toLowerCase())))
            }
            if(searchResult.length > 0) { 
                for (let key of searchResult) {
                    pages.push(loadMarkdownPage(getLinkedFilePath(key)))
                }
            }
        }
    } else {
        const file = url.searchParams.get('file');
        if(!file) {
            throw error(400, "URL parameter 'file' required")
        }
        pages = loadMarkdownPage(getLinkedFilePath(file))
    }

    if(pages instanceof Array) {
        pages = [...new Set(pages)]
    }
    
    return json(pages)
}


function search(criterium: (page: MarkdownPage) => boolean): string[] {
    const result = []
    if(!wiki || wiki.size == 0) {
        throw error(500, "Wiki is empty...")
    }
    for (let [key, page] of wiki.entries()) {
        if (criterium(page)) {
            result.push(key);
        }
    }
    return result
}