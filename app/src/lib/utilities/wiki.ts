
import { MarkdownPage } from '$lib/markdownPage';
import path from 'path'
import { writable, type Updater, type Writable } from 'svelte/store';

const __dirname = new URL(".", import.meta.url).pathname.substring(1)


export const WIKI_URL = '/content'
export const WIKI_PATH = path.resolve(__dirname, "../../../../content")


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

const cache: Map<string, MarkdownPage> = new Map();

export function getCachedMarkdownPage(fullPath: string): MarkdownPage {

    if (cache.has(fullPath)) {
        return cache.get(fullPath)!
    } else {
        const page = new MarkdownPage(fullPath)
        cache.set(fullPath, page)
        return page
    }
}
