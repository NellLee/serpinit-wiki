
import type { MarkdownPage } from '$lib/markdownPage.js';
import { getLinkedFilePath } from '$lib/utilities/links';
import { initWiki, loadMarkdownPage, wiki } from '$lib/wiki';
import { error, json } from '@sveltejs/kit';

initWiki()

export function GET({url}) {    
    const file = url.searchParams.get('file');
    if(!file) {
        throw error(400, "URL parameter 'file' required")
    }
    let page: MarkdownPage = loadMarkdownPage(getLinkedFilePath(file))
    return json(page)
}