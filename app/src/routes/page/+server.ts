
import { getLinkedFilePath } from '$lib/utilities/links';
import { loadMarkdownPage } from '$lib/utilities/wiki';
import { error, json } from '@sveltejs/kit';

export function GET({url}) {
    
    const file = url.searchParams.get('file');
    if(file == undefined) {
        throw error(400, "URL parameter 'file' required")
    }

    return json(loadMarkdownPage(getLinkedFilePath(file)))
}