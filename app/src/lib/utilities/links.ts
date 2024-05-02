import { FileLink } from "$lib/fileLink"
import { getLinkedFilePath } from "./wiki"

export function linkTreeToList(linkTree: LinkTree, name: string, depth = 0) {
    const namedLinkList: NamedLinkList = { name, linkList: [] }
    
    function traverse(node: LinkNode, currentDepth: number) {
        const indent = "&nbsp".repeat(currentDepth*2)
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

export function getBreadcrumbs(url: string) {
    let breadcrumbs = []
    let constructed = ''
    for (let [i, segment] of url
        .split('/')
        .filter((segment) => segment !== '' && segment !== 'index.md')
        .entries()) {
        constructed += '/' + segment
        let linkedFilePath = getLinkedFilePath(constructed + "/index.md")
        let text = new FileLink(linkedFilePath).text
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
