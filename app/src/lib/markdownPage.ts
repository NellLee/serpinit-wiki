
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
    tabs: LinkObject[]
    breadcrumbs: LinkObject[]
    toc: LinkTree
    references: NamedLinkList[]
    href: string

    static constructIndexPage(folderPath: string): MarkdownPage {
        let constructedMarkdown = "# " + folderPath.substring(folderPath.lastIndexOf(path.sep) + 1) + "\n"
        const filePath = folderPath + path.sep + "index.md"

        const markdownFiles = []
        markdownFiles.push(...getFilePathsInFolder(folderPath, [".md"], 0))
        markdownFiles.push(...getFolderPathsInFolder(folderPath, 0).map(folder => folder + path.sep + "index.md"))

        for (let file of markdownFiles) {
            const fileLink = new FileLink(folderPath + file)
            constructedMarkdown += `* [${fileLink.text}](${fileLink.href})\n`
        }


        const imageFiles = getFilePathsInFolder(folderPath, [".jpg", ".jpeg", ".png"], 0)

        for (let file of imageFiles) {
            const fileLink = new FileLink(folderPath + file)
            constructedMarkdown += `![${fileLink.text}](${fileLink.href})\n`
        }

        return new MarkdownPage(filePath, constructedMarkdown)
    }

    constructor(filePath: string, markdown: string | null = null) {
        const fileLink = new FileLink(filePath)
        this.#fileLink = fileLink

        const fileName = fileLink.fileName
        const folderPath = fileLink.path
        const folderHref = this.#fileLink.href.replace("/content", "").replace(`${fileName}.${this.#fileLink.extension}`, "")
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


        // Custom markdown parsing
        const galleryPath = folderPath + path.sep + "images"
        const galleryHref = folderHref + "images"
        if (fs.existsSync(galleryPath)) {
            const imageList = getFilePathsInFolder(galleryPath).reverse().map(file => {
                file = file.replaceAll(path.sep, "/").substring(1)
                return `![${file}](${galleryHref}/${file})`
            })
            if(!this.markdown.includes("<!--!gallery-->")) {
                this.markdown = imageList.join("\n")+this.markdown
            }
        }

        // Parse markdown to html
        let unsanitized = marked(this.markdown) as string
        this.#initialHtml = '<!DOCTYPE html>' + DOMPurify.sanitize(unsanitized)
        const $ = cheerio.load(this.#initialHtml)

        // Wrap images for fancybox
        $('img').each((_, img) => {
            const imgElement = $(img);
            const src = folderHref + imgElement.attr('src')?.substring(1)
            if (imgElement.attr('src')?.startsWith(".")) {
                imgElement.attr('src', src)
            }
            imgElement.addClass("thumbnail")
            const link = $('<a></a>').attr('href', src).attr('data-fancybox', 'gallery');
            imgElement.wrap(link);
        });

        // Generate table of contents
        const tocTree: LinkTree = {
            children: []
        }
        const stack: (LinkNode | LinkTree)[] = [tocTree];
        $('h1, h2, h3, h4, h5, h6').each(function (_, element) {
            const header = $(element)
            const headerLevel = parseInt(element.tagName.slice(1))
            const headerId = generateHeaderId(header.text())
            header.attr('id', headerId)

            // Find the correct parent for this node
            while (stack.length > headerLevel) {
                stack.pop();
            }
            const parent = stack[stack.length - 1];

            let node: LinkNode = {
                link: {
                    href: `#${headerId}`,
                    text: header.text()
                },
                children: [],
                parent: parent
            }


            parent.children.push(node);
            stack.push(node);
        })
        const removeParentReferences = (node: Partial<LinkNode>) => {
            node.children!.forEach((child: Partial<LinkNode>) => {
                delete child.parent;
                removeParentReferences(child);
            });
        }
        removeParentReferences(tocTree)
        this.toc = tocTree

        // Generate related content
        const related: FileLink[] = []
        const tabs: FileLink[] = []
        let parentFolder = filePath.substring(0, filePath.lastIndexOf(path.sep))
        for (let sibling of getFilePathsInFolder(parentFolder, [".md"], 0)) {
            let fileLink = new FileLink(parentFolder + sibling)
            tabs.push(fileLink)
        }
        for (let relative of getFolderPathsInFolder(parentFolder, 0).map(folder => folder + path.sep + "index.md")) {
            let fileLink = new FileLink(parentFolder + relative)
            related.push(fileLink)
        }
        tabs.sort((a, b) => {
            if (a.fileName == "index") {
                return -1
            }
            return a.fileName.localeCompare(b.fileName)
        })
        tabs.forEach(link => {
            if (link.fileName == "index") {
                link.text = "Index"
            }
        })
        this.tabs = tabs

        // Generate references
        const referred: LinkObject[] = []
        $('a[href$=".md"]:not(nav a)').each(function (_, element) {
            const linkInText = $(element)
            const href = linkInText.attr('href')
            if (!href) {
                throw new ReferenceError('Missing href attribute')
            }
            let linkedFile = getLinkedFilePath(href, folderPath)
            let link = new FileLink(linkedFile)
            referred.push(link)
        })

        this.references = [
            // { name: "Nebenliegende Artikel", linkList: siblings },
            { name: "Verwandte Artikel", linkList: related },
            { name: "Hier erwähnt", linkList: referred },
        ]

        // TODO
        const regex = /<!--TAGS\[(.*?)\]-->/
        const match = this.markdown.match(regex)
        const tags = []
        if (match) {
            tags.push(...match[1].split(','))
        }
        tags.push(...this.#fileLink.getTags())
        this.tags = tags.map(tag => {
            const encodedTag = encodeURIComponent(tag)
            return {
                href: "/content/search?tags=" + encodedTag,
                text: tag
            }
        })

        this.breadcrumbs = getBreadcrumbs(fileLink.href)

        this.html = $.html()

        this.href = this.#fileLink.href
    }
    toJSON() {
        let result = {
            html: this.html,
            markdown: this.markdown,
            title: this.title,
            tags: this.tags,
            tabs: this.tabs,
            breadcrumbs: this.breadcrumbs,
            toc: this.toc,
            references: this.references,
            href: this.href,
        }

        return JSON.stringify(result)
    }
}