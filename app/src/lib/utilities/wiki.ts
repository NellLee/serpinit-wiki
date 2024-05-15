
import { MarkdownPage } from '$lib/markdownPage';
import path from 'path'
import { getFilePathsInFolder } from './files';
import { error } from '@sveltejs/kit';
import fs from 'fs'

export const wiki: Map<string, MarkdownPage> = new Map();
const __dirname = new URL(".", import.meta.url).pathname.substring(1)


export const WIKI_URL = '/content'
export const WIKI_PATH = path.resolve(__dirname, "../../../../content")

export function initWiki() {
    console.log("Initializing all wiki pages")
    const files = getFilePathsInFolder(WIKI_PATH, [".md"])
    for (let file of files) {
        loadMarkdownPage(path.resolve(WIKI_PATH, file.substring(1)))
    }
}

export function loadMarkdownPage(fullPath: string): MarkdownPage {

    if (wiki.has(fullPath)) {
        return wiki.get(fullPath)!
    } else {
        let page: MarkdownPage
        if (!fs.existsSync(fullPath)) {
            if(fullPath.endsWith("index.md")) {
                const folderPath = fullPath.substring(0, fullPath.lastIndexOf(path.sep))
                page = MarkdownPage.constructIndexPage(folderPath)
            } else {
                throw error(404, `File ${fullPath} not found`)
            }
        } else {
            page = new MarkdownPage(fullPath)
        }
        wiki.set(fullPath, page)
        return page
    }
}
