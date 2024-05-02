
import { MarkdownPage } from '$lib/markdown';
import path from 'path'
import { writable, type Updater, type Writable } from 'svelte/store';

const __dirname = new URL(".", import.meta.url).pathname.substring(1)


export const WIKI_URL = '/content'
export const WIKI_PATH = path.resolve(__dirname, "../../../../content")

export class CapitalizedError extends Error {
    faultyLink: string
    correctLink: string

    constructor(faultyLink: string, correctLink: string) {
        const message = `Link is not properly capitalized: '${faultyLink}', correct is: '${correctLink}'`
        super(message)
        this.faultyLink = faultyLink
        this.correctLink = correctLink
        this.name = 'CapitalizedError'
    }
}

// FIXME: respect non-index md files and '#' header anchors
export function getLinkedFilePath(link: string, currentFolder: string | null = null, onlyWarn = false): string {
    if (link.startsWith(WIKI_URL)) {
        link = link.substring(WIKI_URL.length+1)
    }
    
    let capitalizedLink = link.replace(/(\w+)\//g, function(match, p1) {
        return p1.charAt(0).toUpperCase() + p1.slice(1) + '/';
    });
    if(capitalizedLink != link) {
        const error = new CapitalizedError(link, capitalizedLink)
        if (!onlyWarn) {
            throw error
        } else {
            console.warn(error.message)
        }
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
