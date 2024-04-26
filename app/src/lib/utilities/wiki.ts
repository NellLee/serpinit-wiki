
import path from 'path'

const __dirname = new URL(".", import.meta.url).pathname.substring(1)

export const WIKI_URL = '/content'
export const WIKI_PATH = path.resolve(__dirname, "../../../.."+WIKI_URL)

export function getLinkedFilePath(link: string, currentFolder: string | null = null): string {
    if (link.startsWith(WIKI_URL)) {
        link = link.substring(WIKI_URL.length+1)
    }
    console.log(link)
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