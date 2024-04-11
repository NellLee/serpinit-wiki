
import fs from "fs";
import path from "path";
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import * as cheerio from 'cheerio';
import { generateHeaderId, linkTreeToList } from '$lib/utilities';

export class MarkdownPage {
    markdown: string;
    title: string;
    references: NamedLinkList[];
    toc: NamedLinkList;
    #initialHtml: string;

    get domScraper() {
        return cheerio.load('<!DOCTYPE html>' + this.#initialHtml)
    }

    constructor(filePath: string) {
        const fileName = filePath.substring(filePath.lastIndexOf(path.sep) + 1)
        this.markdown = fs.readFileSync(filePath, "utf-8")

        // Extract first header as title (fallback to file name)
        this.title = fileName
        this.markdown = this.markdown.replace(/^# (.+)$/m, (_, header) => {
            this.title = header;
            return '';
        });

        // Parse markdown to html
        let unsanitized = marked(this.markdown) as string
        this.#initialHtml = DOMPurify.sanitize(unsanitized);
        const $ = this.domScraper

        // Generate table of contents
        const tocTree: LinkTree = {
            children: []
        }
        let prevNode = tocTree
        let prevLevel = 0
        $('h1, h2, h3, h4, h5, h6').each(function(_, element) {
            const header = $(element);
            const headerLevel = parseInt(element.tagName.slice(1));
            const headerId = generateHeaderId(header.text());
            header.attr('id', headerId);
            let parent
            if(headerLevel > prevLevel) {
                parent = prevNode
            } else {
                parent = (prevNode as unknown as LinkNode).parent // trust me bro
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
        });

        // Generate related content
        const related: LinkObject[] = []
        const parentFolder = filePath.substring(0, filePath.lastIndexOf(path.sep))
        fs.readdirSync(parentFolder).forEach((file) => {
            if (file != fileName) {
                let link: LinkObject = {
                    href: file,
                    text: file.endsWith('index.md') ? file.slice(0, -9) : path.basename(file, '.md')
                }
                related.push(link)
            }
        });

        // Generate references
        const referred: LinkObject[] = []
        $('a[href$=".md"]').each(function(_, element) {
            const linkInText = $(element)
            let link: LinkObject = {
                href: linkInText.attr('href') || "",
                text: linkInText.text()
            }
            referred.push(link)
        });

        this.toc = linkTreeToList(tocTree, "Inhalt") // FIXME: Not indented

        this.references = [
            { name: "Verwandte Artikel", linkList: related },
            { name: "Hier erwähnt", linkList: referred },
        ]
    }
}