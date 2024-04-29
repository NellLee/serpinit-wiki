
import fs from "fs"
import path from "path"
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import * as cheerio from 'cheerio'
import { generateHeaderId } from '$lib/utilities/utilities'
import { linkTreeToList } from "./utilities/links"
import { getFileLinkObject, getFilePathsInFolder, getFolderPathsInFolder } from "./utilities/files"
import { getLinkedFilePath } from "./utilities/wiki"

export const REGEX_FIRST_HEADER = /^# (.+)$/m

export class MarkdownPage {
    fileLink: FileLinkObject
    markdown: string
    title: string
    references: NamedLinkList[]
    toc: NamedLinkList
    #initialHtml: string

    get domScraper() {
        return cheerio.load('<!DOCTYPE html>' + this.#initialHtml)
    }

    static constructIndexPage(folderPath: string): MarkdownPage {
        let constructedMarkdown = "# "+folderPath.substring(folderPath.lastIndexOf(path.sep)+1)+"\n"
        const filePath = folderPath+"/index.md"

        const markdownFiles = []
        markdownFiles.push(... getFilePathsInFolder(folderPath, [".md"], 0))
        markdownFiles.push(... getFolderPathsInFolder(folderPath, 0).map(folder => folder+path.sep+"index.md"))

        for (let file of markdownFiles) {
            const fileLink = getFileLinkObject(folderPath+file)
            constructedMarkdown += `* [${fileLink.text}](${fileLink.href})\n`
        }


        const imageFiles = getFilePathsInFolder(folderPath, [".jpg", ".jpeg", ".png"], 0)

        for (let file of imageFiles) {
            const fileLink = getFileLinkObject(folderPath+file)
            constructedMarkdown += `![${fileLink.text}](${fileLink.href})\n`
        }
        console.log(constructedMarkdown)

        return new MarkdownPage(filePath, constructedMarkdown)
    }

    constructor(filePath: string, markdown: string | null = null) {
        const fileLink = getFileLinkObject(filePath)
        this.fileLink = fileLink
        
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
        this.#initialHtml = DOMPurify.sanitize(unsanitized)
        const $ = this.domScraper

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
        const related: FileLinkObject[] = []
        let parentFolder = filePath.substring(0, filePath.lastIndexOf(path.sep))
        const files: string[] = []
        files.push(... getFilePathsInFolder(parentFolder, [".md"], 0))
        files.push(... getFolderPathsInFolder(parentFolder, 0).map(folder => folder+path.sep+"index.md"))
        for (let file of files) {
            let fileLink: FileLinkObject = getFileLinkObject(parentFolder + file)
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
            let link: FileLinkObject = getFileLinkObject(linkedFile)
            referred.push(link)
        })

        this.toc = linkTreeToList(tocTree, "Inhalt") // FIXME: Not indented

        this.references = [
            { name: "Verwandte Artikel", linkList: related },
            { name: "Hier erwähnt", linkList: referred },
        ]
    }
}