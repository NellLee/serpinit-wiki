type LinkObject = {
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

type Timeline = TimelineEvent[]

type TimelineEvent = {
    start: number
    end: number
    text: string
    fuzzy_start: boolean
    fuzzy_end: boolean
    category: {
        name: string
        color: string
        progress_color: string
        done_color: string
        font_color: string
        parent?: string
    } | null
    description?: string
    labels?: string[] | string
    default_color?: string
}

type XmlTimelineCategory = {
    name: string
    color: string
    progress_color: string
    done_color: string
    font_color: string
    parent?: string
}

type XmlTimelineEvent = {
    start: number
    end: number
    text: string
    fuzzy: boolean
    fuzzy_start: boolean
    fuzzy_end: boolean
    locked: boolean
    ends_today: boolean
    category: string
    description?: string
    labels?: string[] | string
    default_color?: string
}

type XmlTimeline = {
    version: string
    timetype: string
    categories: XmlTimelineCategory[]
    events: XmlTimelineEvent[]
}

type SearchResult<T> = {
    item: T;
    excerpts: string[];
}