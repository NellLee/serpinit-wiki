declare type LinkObject = {
    href: string,
    text: string,
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
    parent: LinkNode | LinkTree
}