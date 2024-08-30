import { FileLink } from "$lib/fileLink"
import path from 'path'
import { WIKI_PATH } from "../wiki"
import { WIKI_URL } from "$lib/constants"

export function linkTreeToList(linkTree: LinkTree, name: string, depth = 0) {
    const namedLinkList: NamedLinkList = { name, linkList: [] }

    function traverse(node: LinkNode, currentDepth: number) {
        const indent = "&nbsp".repeat(currentDepth * 2)
        const indentedText = `${indent}${node.link.text}`

        namedLinkList.linkList.push({ href: node.link.href, text: indentedText })

        // Recursively traverse children
        for (const childNode of node.children) {
            traverse(childNode, currentDepth + 1)
        }
    }

    // Start traversal from the root
    for (const rootNode of linkTree.children) {
        traverse(rootNode, depth)
    }

    return namedLinkList
}

export function generateBreadcrumbs(url: string) {
    let breadcrumbs = []
    let constructed = ''
    let segments = url
        .split('/')
        .filter((segment) => segment !== '' && !segment.endsWith('.md'))
    for (let [i, segment] of segments.entries()) {
        constructed += '/' + segment
        let linkedFilePath = getLinkedFilePath(constructed)
        let text = new FileLink(linkedFilePath).fileName
        if (segment == 'content') {
            text = 'Home'
        }
        breadcrumbs.push({
            text,
            href: constructed
        })
    }
    if (breadcrumbs.length <= 1) {
        breadcrumbs = []
    }
    return breadcrumbs
}

export function getLinkedFilePath(link: string, currentFolder: string | null = null): string {
    if (link.startsWith(WIKI_URL)) {
        link = link.substring(WIKI_URL.length + 1)
    }


    if (link.startsWith(".")) {
        if (!currentFolder) {
            throw new TypeError("Current folder must not be null if link starts with '.'")
        }
        link = path.resolve(currentFolder, link)
    }

    let filePath = decodeURIComponent(link.replace(/\//g, path.sep))
    let fullPath = path.resolve(WIKI_PATH, filePath)

    return fullPath
}
