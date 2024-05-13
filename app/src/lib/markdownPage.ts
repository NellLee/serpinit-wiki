
import fs from "fs"
import path from "path"
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import * as cheerio from 'cheerio'
import { generateHeaderId } from '$lib/utilities/utilities'
import { getBreadcrumbs, getLinkedFilePath, linkTreeToList } from "./utilities/links"
import { getFilePathsInFolder, getFolderPathsInFolder } from "./utilities/files"
import { FileLink } from "./fileLink"

export const REGEX_FIRST_HEADER = /^# (.+)$/m

export class MarkdownPage {
    #fileLink: FileLink
    #initialHtml: string

    html: string
    markdown: string
    title: string
    tags: LinkObject[]
    breadcrumbs: LinkObject[]
    toc: NamedLinkList
    references: NamedLinkList[]

    get href() {
        return this.#fileLink.href
    }

    static constructIndexPage(folderPath: string): MarkdownPage {
        let constructedMarkdown = "# "+folderPath.substring(folderPath.lastIndexOf(path.sep)+1)+"\n"
        const filePath = folderPath+path.sep+"index.md"

        const markdownFiles = []
        markdownFiles.push(... getFilePathsInFolder(folderPath, [".md"], 0))
        markdownFiles.push(... getFolderPathsInFolder(folderPath, 0).map(folder => folder+path.sep+"index.md"))

        for (let file of markdownFiles) {
            const fileLink = new FileLink(folderPath+file)
            constructedMarkdown += `* [${fileLink.text}](${fileLink.href})\n`
        }


        const imageFiles = getFilePathsInFolder(folderPath, [".jpg", ".jpeg", ".png"], 0)

        for (let file of imageFiles) {
            const fileLink = new FileLink(folderPath+file)
            constructedMarkdown += `![${fileLink.text}](${fileLink.href})\n`
        }

        return new MarkdownPage(filePath, constructedMarkdown)
    }

    constructor(filePath: string, markdown: string | null = null) {
        const fileLink = new FileLink(filePath)
        this.#fileLink = fileLink
        
        const fileName = fileLink.fileName
        const folderPath = fileLink.path
        if (markdown == null) {
            this.markdown = fs.readFileSync(filePath, "utf-8")
        } else {
            this.markdown = markdown
        }
        // Extract first header as title (fallback to file name)
        this.title = fileName
        this.markdown = this.markdown.replace(REGEX_FIRST_HEADER, (_, header) => {
            this.title = header
            return ''
        })

        // Parse markdown to html
        let unsanitized = marked(this.markdown) as string
        this.#initialHtml = '<!DOCTYPE html>' + DOMPurify.sanitize(unsanitized)
        const $ = cheerio.load(this.#initialHtml)

        // Generate table of contents
        const tocTree: LinkTree = {
            children: []
        }
        let prevNode: LinkNode = (tocTree as unknown as LinkNode) // trust me bro
        let prevLevel = 0
        $('h1, h2, h3, h4, h5, h6').each(function(_, element) {
            const header = $(element)
            const headerLevel = parseInt(element.tagName.slice(1))
            const headerId = generateHeaderId(header.text())
            header.attr('id', headerId)
            let parent
            if(headerLevel > prevLevel) {
                parent = prevNode
            } else {
                parent = prevNode.parent
            }
            let child: LinkNode = {
                link: {
                    href: `#${headerId}`,
                    text: header.text()
                },
                children: [],
                parent: parent
            }
            parent.children.push(child)
            prevLevel = headerLevel
            prevNode = child
        })

        // Generate related content
        const related: FileLink[] = []
        let parentFolder = filePath.substring(0, filePath.lastIndexOf(path.sep))
        const files: string[] = []
        files.push(... getFilePathsInFolder(parentFolder, [".md"], 0))
        files.push(... getFolderPathsInFolder(parentFolder, 0).map(folder => folder+path.sep+"index.md"))
        for (let file of files) {
            let fileLink = new FileLink(parentFolder + file)
            if (fileLink.path != folderPath) {
                related.push(fileLink)
            }
        }

        // Generate references
        const referred: LinkObject[] = []
        $('a[href$=".md"]:not(nav a)').each(function(_, element) {
            const linkInText = $(element)
            const href = linkInText.attr('href')
            if (!href){
                throw new ReferenceError('Missing href attribute')
            }
            let linkedFile = getLinkedFilePath(href, folderPath)
            let link = new FileLink(linkedFile)
            referred.push(link)
        })

        this.toc = linkTreeToList(tocTree, "Inhalt") // FIXME: Not indented

        this.references = [
            { name: "Verwandte Artikel", linkList: related },
            { name: "Hier erwähnt", linkList: referred },
        ]

        // TODO
        const regex = /<!--TAGS\[(.*?)\]-->/
        const match = this.markdown.match(regex)
        const tags = []
        if (match) {
            tags.push(... match[1].split(','))
        }
        tags.push(...this.#fileLink.getTags())
        this.tags = tags.map(tag => {
            const encodedTag = encodeURIComponent(tag)
            return {
                href: "/search?tags="+encodedTag,
                text: tag
            }
        })

        this.breadcrumbs = getBreadcrumbs(fileLink.href)

        this.html = $.html()
    }
    toJSON() {
        let result = {
            html: this.html,
            markdown: this.markdown,
            title: this.title,
            tags: this.tags,
            breadcrumbs: this.breadcrumbs,
            toc: this.toc,
            references: this.references,
        }

        return JSON.stringify(result)
    }
}