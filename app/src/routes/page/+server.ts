import { MarkdownPage } from '$lib/markdownPage';
import { WIKI_PATH, loadMarkdownPage } from '$lib/utilities/wiki';
import { error, json } from '@sveltejs/kit';
import fs from "fs"
import path from 'path';

export function GET({url}) {
    
    const file = url.searchParams.get('file');
    if(file == undefined) {
        throw error(400, "URL parameter 'file' required")
    }
    const fullPath = WIKI_PATH + path.sep + file.replaceAll("/", path.sep);

    let page: undefined | MarkdownPage
    if (!fs.existsSync(fullPath)) {
        if(fullPath.endsWith("index.md")) {
            const folderPath = fullPath.substring(0, fullPath.lastIndexOf(path.sep))
            page = MarkdownPage.constructIndexPage(folderPath)
        } else {
            throw error(404, `File ${fullPath} not found`)
        }
    } else {
        page = loadMarkdownPage(fullPath)
    }
    return json(page)
}