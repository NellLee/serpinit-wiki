
import { MarkdownPage } from '$lib/markdownPage';
import path from 'path'
import { getFilePathsInFolder } from './files';
import { error } from '@sveltejs/kit';
import fs from 'fs'

export const wiki: Map<string, MarkdownPage> = new Map()
export const cache: Map<string, string> = new Map() //maps 
const __dirname = new URL(".", import.meta.url).pathname.substring(1)


export const WIKI_URL = '/content'
export const PAGE_API_URL = "/api/page"
export const WIKI_PATH = path.resolve(__dirname, "../../../../content")

export function initWiki() {
    console.log("Initializing all wiki pages")
    const files = getFilePathsInFolder(WIKI_PATH, [".md"])
    for (let file of files) {
        loadMarkdownPage(path.resolve(WIKI_PATH, file.substring(1)))
    }
}

export function loadMarkdownPage(fullPath: string): MarkdownPage {
    let markdownForCache = fs.readFileSync(fullPath, "utf-8")
    let page: MarkdownPage
    if (!fs.existsSync(fullPath)) {
        if(fullPath.endsWith("index.md")) {
            const folderPath = fullPath.substring(0, fullPath.lastIndexOf(path.sep))
            page = MarkdownPage.constructIndexPage(folderPath)
        } else {
            throw error(404, `File ${fullPath} not found`)
        }
    } else {
        if (cache.get(markdownForCache) == fullPath) {
            console.log(`File "${fullPath}" has been loaded from the cache.`)
            if (!wiki.has(fullPath)) {
                let fileName = fullPath.split(path.sep).at(-1)
                throw error(500, `Cache has entry for '${fileName}', but wiki has not.`)
            }
            page = wiki.get(fullPath)!
        } else {
            console.log(`First page load for '${fullPath}' or markdown content has changed.`)
            page = new MarkdownPage(fullPath)
        }
    }
    wiki.set(fullPath, page)
    cache.set(markdownForCache, fullPath)
    return page
}
