
import fs from "fs"
import path from "path"
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import * as cheerio from 'cheerio'
import { generateHeaderId } from '$lib/utilities/utilities'
import { generateBreadcrumbs, getLinkedFilePath, linkTreeToList } from "./utilities/links"
import { getFilePathsInFolder, getFolderPathsInFolder } from "./utilities/files"
import { FileLink } from "./fileLink"

export const REGEX_FIRST_HEADER = /^# (.+)$/m


export class MarkdownPage {
    #filePath: string
    #fileLink: FileLink

    #initialHtml: string
    #cheerio: cheerio.CheerioAPI

    markdown: string
    breadcrumbs: LinkObject[]
    images: LinkObject[]
    tabs: LinkObject[]
    title: string
    toc: LinkTree
    tags: LinkObject[]
    references: NamedLinkList[]
    overviewHtml: string

    html: string
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
            constructedMarkdown += `![${fileLink.text}](${fileLink.href.replace("/content", "")})\n`
        }

        if(folderPath.endsWith("images")) {
            return new MarkdownPage(folderPath, constructedMarkdown)
        }
        return new MarkdownPage(filePath, constructedMarkdown)
    }

    constructor(filePath: string, markdown: string | null = null) {
        this.#filePath = filePath

        const fileLink = new FileLink(filePath)
        this.#fileLink = fileLink

        this.markdown = markdown != null ? markdown : fs.readFileSync(filePath, "utf-8")

        // Markdown changes
        this.title = this.extractTitle()

        // Initial HTML from markdown
        this.#initialHtml = this.generateInitialHtml()
        this.#cheerio = cheerio.load(this.#initialHtml)

        // HTML changes
        this.breadcrumbs = generateBreadcrumbs(fileLink.href)
        this.images = this.generateImages()
        this.tabs = this.generateTabs()
        this.toc = this.generateTOC()
        this.tags = this.generateTags()
        this.references = [
            { name: "Verwandte Artikel", linkList: this.generateRelated() },
            { name: "Hier erwähnt", linkList: this.generateMentions() },
        ]
        this.wrapImgTagsForFancyBox()
        this.overviewHtml = this.extractOverview()

        // Final HTML
        this.html = this.#cheerio.html()

        this.href = this.#fileLink.href
    }

    generateInitialHtml() {
        const unsanitized = marked(this.markdown) as string
        const sanitized = '<!DOCTYPE html>' + DOMPurify.sanitize(unsanitized)
        return sanitized
    }

    extractOverview() {
        const $ = this.#cheerio

        let overviewHtml = ""
        if ($('h1, h2, h3, h4, h5, h6').length != 0) {
            $('body').children().each((_, element) => {
                if ($(element).is('h1, h2, h3, h4, h5, h6')) {
                    return false;
                } else {
                    overviewHtml += $.html(element);
                    $(element).remove();
                }
            });
        }

        return overviewHtml
    }

    generateImages(): LinkObject[] {
        const folderPath = this.#fileLink.path
        const galleryPath = folderPath + path.sep + "images"

        let images: LinkObject[] = []
        if (fs.existsSync(galleryPath)) {
            images = getFilePathsInFolder(galleryPath, [".png", ".jpg", ".jpeg", ".webp"], 1)
                .reverse()
                .map(file => {
                    const filePath = galleryPath + path.sep + file.split(path.sep).at(-1)!
                    const fileLink = new FileLink(filePath)

                    return {
                        text: fileLink.text,
                        href: fileLink.href.replace("/content", "")
                    }
                })
        }

        return images
    }


    wrapImgTagsForFancyBox() {
        const fileName = this.#fileLink.fileName
        const folderHref = this.#fileLink.href.replace("/content", "").replace(`${fileName}.${this.#fileLink.extension}`, "")

        const $ = this.#cheerio
        $('img').each((_, img) => {
            const imgElement = $(img);
            let src = imgElement.attr('src')
            if (imgElement.attr('src')?.startsWith(".")) {
                src = folderHref + imgElement.attr('src')?.substring(1)
                imgElement.attr('src', src)
            }
            imgElement.attr('loading', "lazy")
            imgElement.addClass("thumbnail")
            const link = $('<a></a>').attr('href', src).attr('data-fancybox', 'gallery');
            imgElement.wrap(link);
        });
    }

    extractTitle() {
        // Extract first header as title (fallback to file name)
        let title = this.#fileLink.fileName
        this.markdown = this.markdown.replace(REGEX_FIRST_HEADER, (_, header) => {
            title = header
            return ''
        })
        return title
    }

    generateTOC() {
        const $ = this.#cheerio
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
        return tocTree
    }

    generateRelated() {
        const parentFolderPath = this.#filePath.substring(0, this.#filePath.lastIndexOf(path.sep))
        const related: FileLink[] = getFolderPathsInFolder(parentFolderPath, 0)
            .filter(folder => folder != path.sep+"images") // the image folder is instead realised as additional tab
            .map(folder => folder + path.sep + "index.md")
            .map(relative => new FileLink(parentFolderPath + relative))
        return related
    }

    generateTabs() {
        const parentFolderPath = this.#filePath.substring(0, this.#filePath.lastIndexOf(path.sep))
        const tabLinks: FileLink[] = getFilePathsInFolder(parentFolderPath, [".md"], 0)
            .map(sibling => new FileLink(parentFolderPath + sibling))
            .sort((a, b) => {
                if (a.fileName == "index") {
                    return -1
                }
                return a.fileName.localeCompare(b.fileName)
            })

        // First tab special naming
        tabLinks.forEach(link => {
            if (link.fileName == "index") {
                link.text = "Index"
            }
        })

        const tabs: LinkObject[] = tabLinks.map(link => ({text: link.text, href: link.href}))

        // Add gallery tab
        const fileName = this.#fileLink.fileName
        const folderHref = this.#fileLink.href.split("/").slice(0, -1).join("/")
        if (this.images.length > 0) {
            tabs.push({
                text: "Gallerie",
                href: folderHref+"/images"
            })
        }

        return tabs
    }

    generateMentions() {
        const $ = this.#cheerio
        const folderPath = this.#fileLink.path
        const mentioned: LinkObject[] = []
        $('a[href$=".md"]:not(nav a)').each(function (_, element) {
            const linkInText = $(element)
            const href = linkInText.attr('href')
            if (!href) {
                throw new ReferenceError('Missing href attribute')
            }
            let linkedFile = getLinkedFilePath(href, folderPath)
            let link = new FileLink(linkedFile)
            mentioned.push(link)
        })

        return mentioned
    }

    generateTags() {
        const regex = /<!--TAGS\[(.*?)\]-->/
        const matches = this.markdown.match(regex)
        const tags = []
        if (matches) {
            tags.push(...matches[1].split(','))
        }
        tags.push(...this.#fileLink.getTags())
        return tags.map(tag => ({
            href: "/content/search?tags=" + encodeURIComponent(tag),
            text: tag
        }))
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
            images: this.images,
            overviewHtml: this.overviewHtml
        }

        return JSON.stringify(result)
    }
}