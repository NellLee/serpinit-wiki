
import fs from "fs"
import path from "path"
import { Marked, marked } from 'marked'
import { createDirectives, presetDirectiveConfigs, type DirectiveConfig } from 'marked-directive'
import DOMPurify from 'isomorphic-dompurify'
import * as cheerio from 'cheerio'
import { generateHeaderId, resolveRelativeUrl } from '$lib/utilities/utilities'
import { generateBreadcrumbs, getLinkedFilePath } from "./utilities/links"
import { getFilePathsInFolder, getFolderPathsInFolder } from "./utilities/files"
import { FileLink } from "./fileLink"
import markedKatex from "marked-katex-extension"
import { timeline } from "./timeline"

export const REGEX_FIRST_HEADER = /^# (.+)$/m

class DOMPart {
    cheerio: cheerio.CheerioAPI

    constructor(html: string) {
        this.cheerio = cheerio.load(html)
    }

    get html(): string {
        return this.cheerio.html()
    }

    set html(newHtml: string) {
        this.cheerio = cheerio.load(newHtml)
    }

    toString() {
        return this.cheerio.html()
    }

    toJSON() {
        return this.cheerio.html()
    }
}
class SectionizedDOM {
    content: DOMPart
    overview: DOMPart | null

    constructor(content: DOMPart, overview: DOMPart | null) {
        this.content = content;
        this.overview = overview;
    }

    sanitize() {
        for (const domPart of this.getParts()) {
            domPart.html = DOMPurify.sanitize(domPart.html, { USE_PROFILES: { html: true } })
            // console.log(DOMPurify.removed.map(element => element.element?.constructor?.name ?? "unknown")) // log removed elements
        }
    }
    getParts(): DOMPart[] {
        const result: DOMPart[] = []
        result.push(this.content);
        if(this.overview) {
            result.push(this.overview);
        }
        return result;
    }

}

export class MarkdownPage {
    #filePath: string
    #fileLink: FileLink
    #dom: SectionizedDOM

    markdown: string
    breadcrumbs: LinkObject[]
    title: string
    images: LinkObject[]
    toc: LinkTree
    categories: LinkObject[]
    references: NamedLinkList[]
    contentHtml: string
    overviewHtml: string | null
    event: TimelineEvent | null

    href: string

    static constructIndexPage(folderPath: string): MarkdownPage {
        const filePath = folderPath + path.sep + "index.md"
        let constructedMarkdown = MarkdownPage.createIndexContent(folderPath);
        constructedMarkdown = "# " + new FileLink(filePath).text + "\n" + constructedMarkdown
        if (folderPath.endsWith("images")) {
            return new MarkdownPage(folderPath, constructedMarkdown)
        }
        return new MarkdownPage(filePath, constructedMarkdown)
    }

    static createIndexContent(folderPath: string): string {
        let constructedMarkdown = ""

        const markdownFiles = []
        markdownFiles.push(...getFilePathsInFolder(folderPath, [".md"], 0).filter(file => !file.endsWith("index.md")))
        markdownFiles.push(...getFolderPathsInFolder(folderPath, 0).map(folder => folder + path.sep + "index.md"))

        for (let file of markdownFiles) {
            const fileLink = new FileLink(folderPath + file)
            constructedMarkdown += `* [${fileLink.text}](${fileLink.href})\n`
        }

        const imageFiles = getFilePathsInFolder(folderPath, [".jpg", ".jpeg", ".png"], 0)

        if (imageFiles.length > 0) {

            constructedMarkdown += "::::div{#gallery}\n"

            for (let file of imageFiles) {
                const fileLink = new FileLink(folderPath + file)

                constructedMarkdown += `
:::figure{style="width: 400px;"}
![${fileLink.text}](${fileLink.href.replace("/content", "")})
::figcaption[${fileLink.text.replaceAll("_", " ")}]
:::
`
            }

            constructedMarkdown += "\n::::"
        }
        return constructedMarkdown;
    }

    constructor(filePath: string, customMarkdown: string | null = null) {
        this.#filePath = filePath

        const fileLink = new FileLink(filePath)
        this.#fileLink = fileLink

        this.event = timeline.find(event => event.description == fileLink.href) ?? null

        this.markdown = customMarkdown != null ? customMarkdown : fs.readFileSync(filePath, "utf-8")

        this.processComments()

        // Initial HTML from markdown
        this.#dom = this.generateInitialDOM()

        this.breadcrumbs = generateBreadcrumbs(fileLink.href)
        this.title = this.extractTitle()
        this.images = this.generateImages()
        this.toc = this.generateTOC()
        this.categories = this.generateCategories()

        // HTML changes
        this.extractOverviewSection()
        this.processImages()
        this.references = [
            { name: "Mehr zum Thema '"+this.#fileLink.getFolderCategory()+"'", linkList: this.generateSiblings(true) },
            { name: "Verwandte Artikel", linkList: this.generateRelated() },
            { name: "Hier erwähnt", linkList: this.generateMentions() },
        ]

        // Final HTML
        this.#dom.sanitize()
        this.contentHtml = this.#dom.content.html
        this.overviewHtml = this.#dom.overview?.html ?? null

        this.href = this.#fileLink.href
    }

    processComments() {
        const that = this
        this.markdown = this.markdown.replace(/<!--\s*([A-Z]+)\b(.*?)-->/gs, function (match, p1: string, p2: string) {

            if (p1.trim() == "INDEX") {
                return MarkdownPage.createIndexContent(that.#fileLink.path)
            }
            return `::::div{.comment}\n:::div{.comment-indicator .${p1.trim().toLowerCase()}}\n${p1.trim()}\n:::\n:::div{.comment-content}\n${p2.trim()}\n:::\n::::`;
        });
    }

    extractOverviewSection() {
        const content = this.#dom.content;
        const $ = content.cheerio

        let overviewHtml = null
        let overviewElement = $('overview');

        if (overviewElement.length > 0) {
            overviewHtml = overviewElement.html();

            this.#dom.overview = new DOMPart(overviewHtml!)

            overviewElement.remove();
        }
    }

    generateInitialDOM(): SectionizedDOM {
        let overview: DOMPart | null = null;
        const renderer = new marked.Renderer();
        const that = this;

        const level4Container: DirectiveConfig = {
            level: 'container',
            marker: '::::',
        }
        // FIXME and TODO: swap against pre-marked comment parsing of "<!--INDEX"
        const indexList: DirectiveConfig = {
            level: 'block',
            marker: '§',
            renderer(token) {
              if (token.meta.name === 'index') {
                const listItems = that.generateSiblings()
                  .map((link: LinkObject) => `<li><a href="${link.href}">${link.text}</a></li>`)
                  .join('\n');
          
                return `<ul class="folder-index">\n${listItems}\n</ul>`;
              }
              return false;
            }
          };

        renderer.listitem = function (text) {
            if (text.includes('<p>')) {
                text = text.replace(/<\/?p>/g, '');
            }
            return `<li>${text}</li>\n`;
        };
        const content = new DOMPart(new Marked()
            .setOptions({
            renderer: renderer
            })
            .use(createDirectives([
                ...presetDirectiveConfigs,
                level4Container,
                indexList

            ]))
            .use(markedKatex({
                throwOnError: false
            }))
            .parse(this.markdown) as string)

        return new SectionizedDOM(content, overview)
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

    processImages() {
        const fileName = this.#fileLink.fileName
        const folderHref = this.#fileLink.href.replace("/content", "").replace(`${fileName}.${this.#fileLink.extension}`, "")

        for (let domPart of this.#dom.getParts()) {
            const $ = domPart.cheerio
            let links: string[] = []
            $('img').each((_, img) => {
                const imgElement = $(img);
                let src = imgElement.attr('src')
                if (src) {
                    if (src.startsWith(".")) {
                        src = resolveRelativeUrl(folderHref, src.substring(2))
                        imgElement.attr('src', src)
                    }

                    imgElement.attr('loading', "lazy")
                    imgElement.addClass("thumbnail")
                    if($(img).closest('.no-fancy').length > 0) {
                        return;
                    }
                    const link = $('<a></a>').attr('href', src).attr('data-fancybox', 'gallery');
                    imgElement.wrap(link);
                    links.push(src)
                }
            });
        }
    }

    extractTitle(): string {
        const $ = this.#dom.content.cheerio

        let title = this.#fileLink.fileName // fallback to file name
        if ($('h1').length != 0) {
            $('body').children().each((_, element) => {
                if ($(element).is('h1')) {
                    title = $(element).text()
                    $(element).remove();
                    return false;
                }
            });
        }

        return title
    }

    generateTOC() {
        const $ = this.#dom.content.cheerio
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
            .filter(folder => folder != path.sep + "images") // the image folder is instead realised as sibling
            .map(folder => folder + path.sep + "index.md")
            .map(relative => new FileLink(parentFolderPath + relative))
        return related
    }

    generateSiblings(includeGallery = false) {
        const parentFolderPath = this.#filePath.substring(0, this.#filePath.lastIndexOf(path.sep))
        const filePaths = getFilePathsInFolder(parentFolderPath, [".md"], 0)
        const indexPath = path.sep + "index.md"
        if (!filePaths.find(p => p == indexPath)) {
            filePaths.push(indexPath)
        }
        const siblings: FileLink[] = filePaths
            .map(sibling => new FileLink(parentFolderPath + sibling))
            .filter(sibling => sibling.fileName != this.#fileLink.fileName)
            .sort((a, b) => {
                if (a.fileName == "index") {
                    return -1
                }
                return a.fileName.localeCompare(b.fileName)
            })

        // Index special naming
        siblings.forEach(link => {
            if (link.fileName == "index") {
                link.text = "Index"
            }
        })

        const result: LinkObject[] = siblings.map(link => ({ text: link.text, href: link.href }))

        if (includeGallery) {
            const folderHref = this.#fileLink.href.split("/").slice(0, -1).join("/")
            if (this.images.length > 0) {
                result.push({
                    text: "Gallerie",
                    href: folderHref + "/images"
                })
            }
        }

        return result
    }

    generateMentions() {
        const $ = this.#dom.content.cheerio
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
            mentioned.push({
                href: link.href,
                text: link.descriptiveText,
            })
        })

        return mentioned
    }

    generateCategories() {
        const categories = this.#fileLink.getCategories();
        return categories.map(tag => ({
            href: "/content/search?q=" + encodeURIComponent(tag),
            text: tag
        }))
    }



    toJSON() {
        let result = {
            event: this.event,
            markdown: this.markdown,
            breadcrumbs: this.breadcrumbs,
            title: this.title,
            categories: this.categories,
            toc: this.toc,
            references: this.references,
            href: this.href,
            images: this.images,
            contentHtml: this.contentHtml,
            overviewHtml: this.overviewHtml
        }

        return JSON.stringify(result)
    }
}