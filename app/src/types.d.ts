declare type LinkObject = {
    href: string,
    text: string,
}

type FileLinkObject = LinkObject & {
    path: string,
    fileName: string,
    extension: string,
}

type NamedLinkList = {
    name: string,
    linkList: LinkObject[]
}

type LinkTree = {
    children: LinkNode[]
}

type LinkNode = {
    link: LinkObject,
    children: LinkNode[],
    parent: LinkNode | NamedLinkTree
}