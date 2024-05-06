
import { MarkdownPage } from '$lib/markdownPage';
import path from 'path'
import { writable, type Updater, type Writable } from 'svelte/store';
import { getFilePathsInFolder } from './files';


export const wiki: Map<string, MarkdownPage> = new Map();
const __dirname = new URL(".", import.meta.url).pathname.substring(1)


export const WIKI_URL = '/content'
export const WIKI_PATH = path.resolve(__dirname, "../../../../content")

export function loadAllMarkdownPages() {
    const files = getFilePathsInFolder(WIKI_PATH, [".md"])
    for (let file of files) {
        loadMarkdownPage(path.resolve(WIKI_PATH, file.substring(1)))
    }
}


export function getLinkedFilePath(link: string, currentFolder: string | null = null): string {
    if (link.startsWith(WIKI_URL)) {
        link = link.substring(WIKI_URL.length+1)
    }


    if (link.startsWith(".")) {
        if(!currentFolder) {
            throw new TypeError("Current folder must not be null if link starts with '.'")
        }
        link = path.resolve(currentFolder, link)
    }

    let filePath = link.replace(/\//g, path.sep)
    let fullPath = path.resolve(WIKI_PATH, filePath)

    return fullPath
}

export function loadMarkdownPage(fullPath: string): MarkdownPage {

    if (wiki.has(fullPath)) {
        return wiki.get(fullPath)!
    } else {
        const page = new MarkdownPage(fullPath)
        wiki.set(fullPath, page)
        return page
    }
}
