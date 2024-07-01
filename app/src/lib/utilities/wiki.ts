
import { MarkdownPage } from '$lib/markdownPage';
import path from 'path'
import { getFilePathsInFolder } from './files';
import { error } from '@sveltejs/kit';
import fs from 'fs'
import * as cheerio from 'cheerio'
import { extractFirstSentenceOrWords, removeDuplicatesAndPartials } from './utilities';
import Fuse, { type FuseResult } from 'fuse.js';

export const wiki: Map<string, MarkdownPage> = new Map()
export const cache: Map<string, string> = new Map() //maps 
const __dirname = new URL(".", import.meta.url).pathname.substring(1)

let initialized = false

export const WIKI_URL = '/content'
export const PAGE_API_URL = "/api/page"
export const SEARCH_API_URL = "/api/search"
export const WIKI_PATH = path.resolve(__dirname, "../../../../content")

export function initWiki() {
    if (!initialized) {
        console.log("Initializing all wiki pages")
        const files = getFilePathsInFolder(WIKI_PATH, [".md"])
        for (let file of files) {
            loadMarkdownPage(path.resolve(WIKI_PATH, file.substring(1)))
        }
        initialized = true
    }
}

export function loadMarkdownPage(fullPath: string): MarkdownPage {
    let markdownForCache;
    let page: MarkdownPage
    if (!fs.existsSync(fullPath)) {
        if (fullPath.endsWith("index.md")) {
            const folderPath = fullPath.substring(0, fullPath.lastIndexOf(path.sep))
            page = MarkdownPage.constructIndexPage(folderPath)
            markdownForCache = page.markdown
        } else {
            throw error(404, `File ${fullPath} not found`)
        }
    } else {
        markdownForCache = fs.readFileSync(fullPath, "utf-8")
        if (cache.get(markdownForCache) == fullPath) {
            console.log(`File "${fullPath}" has been loaded from the cache.`)
            if (!wiki.has(fullPath)) {
                let fileName = fullPath.split(path.sep).at(-1)
                throw error(500, `Cache has entry for '${fileName}', but wiki has not.`)
            }
            page = wiki.get(fullPath)!
        } else {
            console.log(`First page load for '${fullPath}' or markdown content has changed.`)
            page = new MarkdownPage(fullPath)
        }
    }
    wiki.set(fullPath, page)
    updateCache(fullPath, markdownForCache)
    return page
}

export type SearchResult<T> = {
    item: T;
    excerpts: string[];
}

export function search(query: string): SearchResult<MarkdownPage>[] {
    const pages: MarkdownPage[] = Array.from(wiki.values());

    const fuse = new Fuse(pages, {
        keys: [
            { name: 'tags', weight: 10 },
            { name: 'title', weight: 5 },
            { name: 'contentHtml', weight: 1 }
        ],
        threshold: 0.0,
        ignoreLocation: true,
        includeScore: true,
        findAllMatches: true,
        ignoreFieldNorm: true,
    });

    const fuseResults = fuse.search(query);

    const queryInLink = (contentHtml: string, query: string): boolean => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(contentHtml)) !== null) {
            const linkText = match[1];
            const linkUrl = match[2];
            if (linkText.toLowerCase().includes(query.toLowerCase()) || linkUrl.toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    const result: SearchResult<MarkdownPage>[] = fuseResults
        .filter(result => !queryInLink(result.item.contentHtml, query))
        .map(result => {
            const { contentHtml, href } = result.item;

            const excerpts = createExcerpts(contentHtml, query, href);
            return {
                item: result.item,
                excerpts
            };
        })
    return result
}

function createExcerpts(html: string, query: string, pageHref: string): string[] {
    const $ = cheerio.load(html);

    $('img').each((_, img) => {
        const altText = $(img).attr('alt');
        const altTextFormatted = `[Image${altText ? ": " + altText : ""}]`;
        $(img).replaceWith($(`<p>${altTextFormatted}</p>`));
    });

    const headerParagraphMap: { [key: string]: string } = {}

    $('body > *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6)').each((_, element) => {
        const tagName = $(element).prop('tagName').toLowerCase();
        const content = $(element).text();
        const contentHtml = $(element).html()!;

        if (content.toLowerCase().includes(query.toLowerCase())) {
            let parentHeader = $(element).prevAll('h1, h2, h3, h4, h5, h6').first();
            if (parentHeader.length === 0) {
                parentHeader = $(element).parent().prevAll('h1, h2, h3, h4, h5, h6').first();
            }

            const headerHtml = $.html($(parentHeader));
            const headerLink = `<a href="${pageHref}#${parentHeader.attr('id')}">${headerHtml}</a>`;

            const highlightedContentHtml = contentHtml.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
            const trimmedContentHtml = trimToWordLimit(highlightedContentHtml, query, 50);
            if (headerParagraphMap[headerLink]) {
                headerParagraphMap[headerLink] += `<${tagName}>${trimmedContentHtml}</${tagName}>`
            } else {
                headerParagraphMap[headerLink] = `<${tagName}>${trimmedContentHtml}</${tagName}>`
            }
        }
    });
    const excerpts: string[] = Object.keys(headerParagraphMap).map(headerWithLink => headerWithLink + headerParagraphMap[headerWithLink]);

    return excerpts;
}

function trimToWordLimit(paragraph: string, query: string, wordLimit: number): string {
    const sentences = paragraph.match(/[^\.!\?]+[\.!\?]+/g) || [paragraph];
    const queryWords = query.split(' ');

    const queryIndices = sentences.reduce((indices, sentence, index) => {
        if (queryWords.some(qw => sentence.toLowerCase().includes(qw.toLowerCase()))) {
            indices.push(index);
        }
        return indices;
    }, [] as number[]);

    if (queryIndices.length === 0) {
        const words = paragraph.split(' ').slice(0, wordLimit);
        return words.join(' ') + (words.length < paragraph.split(' ').length ? " [...]" : "");
    }

    let start = Math.max(0, queryIndices[0]);
    let end = start;

    let wordCount = sentences[start].split(' ').length;

    while (end + 1 < sentences.length && wordCount + sentences[end + 1].split(' ').length <= wordLimit) {
        end++;
        wordCount += sentences[end].split(' ').length;
    }

    let result = sentences.slice(start, end + 1).join(' ');

    if (start > 0) {
        result = "[...] " + result;
    }

    if (end < sentences.length - 1) {
        result = result + " [...]";
    }

    return result;
}




function updateCache(fullPath: string, markdownForCache: string) {
    cache.forEach((value, key) => {
        if (value === fullPath) {
            cache.delete(key);
        }
    });
    cache.set(markdownForCache, fullPath)
}
