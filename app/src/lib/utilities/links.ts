import { getFileLinkObject } from "./files"
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

export function getBreadcrumbs(path: string) {
    let breadcrumbs = []
    let constructed = ''
    for (let [i, segment] of path
        .split('/')
        .filter((segment) => segment !== '' && segment !== 'index.md')
        .entries()) {
        constructed += '/' + segment
        let linkedFilePath = getLinkedFilePath(constructed + "/index.md")
        let text = getFileLinkObject(linkedFilePath).text
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
