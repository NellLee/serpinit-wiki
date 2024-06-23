
import { MarkdownPage } from '$lib/markdownPage';
import path from 'path'
import { getFilePathsInFolder } from './files';
import { error } from '@sveltejs/kit';
import fs from 'fs'
import * as cheerio from 'cheerio'
import { extractFirstSentenceOrWords, removeDuplicatesAndPartials } from './utilities';

export const wiki: Map<string, MarkdownPage> = new Map()
export const cache: Map<string, string> = new Map() //maps 
const __dirname = new URL(".", import.meta.url).pathname.substring(1)

let initialized = false

export const WIKI_URL = '/content'
export const PAGE_API_URL = "/api/page"
export const SEARCH_API_URL = "/api/search"
export const WIKI_PATH = path.resolve(__dirname, "../../../../content")

export function initWiki() {
    if(!initialized) {
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

export type SearchResult = {
    page: MarkdownPage;
    priority: number;
    excerpt: string;
}

export function search(query: string): SearchResult[] {
    query = query.trim().toLowerCase()
    const results: SearchResult[] = [];

    for (let page of wiki.values()) {
        let priority = 0;
        let excerpts: string[] = [];
        
        // Load the HTML content
        const $ = cheerio.load(page.contentHtml);
        
        const fallbackExcerpt = extractFirstSentenceOrWords($('p').first().text())

        // Search in the title
        if (page.title.toLowerCase().includes(query)) {
            priority += 100;
        }

        // Search in the tags
        page.tags.forEach(tag => {
            if (tag.text.toLowerCase().includes(query)) {
                priority += 80;
            }
        });

        // Search in headers and paragraphs
        const headers = $('h1, h2, h3, h4, h5, h6');
        const paragraphs = $('p');

        headers.each((i, header) => {
            if ($(header).text().toLowerCase().includes(query)) {
                priority += 20
                const siblingParagraph = $(header).next('p');
                const siblingExcerpt = extractFirstSentenceOrWords(siblingParagraph.text())
                let excerpt = $(header).text()
                if(siblingExcerpt != "") {
                    excerpt += `: ${siblingExcerpt}`
                } 
                excerpts.push(excerpt)
            }
        });

        paragraphs.each((i, paragraph) => {
            if ($(paragraph).text().toLowerCase().includes(query)) {
                priority += 10
                excerpts.push(extractFirstSentenceOrWords($(paragraph).text()))
            }
        });

        excerpts = removeDuplicatesAndPartials(excerpts)

        if(excerpts.length == 0) {
            excerpts = [fallbackExcerpt]
        }

        // If the priority is greater than 0, add the result
        if (priority > 0) {
            results.push({
                page,
                priority,
                excerpt: "..." + excerpts.join('... ') + "..."
            });
        }
    }

    // Sort results by priority in descending order
    results.sort((a, b) => b.priority - a.priority);

    return results;
    // const maxExcerptChars = 500
    // const querySentenceRegex = new RegExp(`[^.]*\\b${query}\\b[^.]*\\.`);
    // const sentenceRegex = new RegExp(`[^.]*\\.`)

    // const results: SearchResult[] = []
    // for (let page of wiki.values()) {

    //     // Search in page title
    //     if(page.title.includes(query)) {
    //         const $ = cheerio.load(page.contentHtml)

    //         let excerpt = ""

    //         const firstParagraphText = $('p').first().text()
    //         const matchedSentence = firstParagraphText.match(sentenceRegex) ?? [];
    //         if(matchedSentence.length > 0) {
    //             excerpt = matchedSentence[0]! + "..."
    //         } else {
    //             excerpt = firstParagraphText.substring(0, 100)+"..."
    //         }

    //         results.push({ 
    //             page: page,
    //             priority: 1,
    //             excerpt,
    //         })
    //     }

    //     // Search in page tags

    //     // Search in page headers

    //     // Search in page content
    //     const $ = cheerio.load(page.contentHtml)
    //     const paragraphs = $('p:contains(' + query + ')')
    //     if(paragraphs.length > 0) {
    //         let excerpt = ""

    //         paragraphs.each(function(_, paragraph) {
    //             const matchedQuerySentence = $(paragraph).text().match(querySentenceRegex) ?? [];
    //             if(matchedQuerySentence.length > 0) {
    //                 const highlightedQuerySentence = matchedQuerySentence[0]!.replace(new RegExp(`\\b${query}\\b`, 'gi'), `<strong>${query}</strong>`);

    //                 if(excerpt.length + highlightedQuerySentence.length < maxExcerptChars) {
    //                     excerpt += "..." + highlightedQuerySentence
    //                 } else {
    //                     excerpt += "..."
    //                 }
    //             }
    //         })
    //         if(excerpt = "") { // Fallback to first Sentence of paragraph with query match (or first 100 chars)
    //             const firstParagraphText = paragraphs.first().text()
    //             const matchedSentence = firstParagraphText.match(sentenceRegex) ?? [];
    //             if(matchedSentence.length > 0) {
    //                 excerpt = matchedSentence[0]! + "..."
    //             } else {
    //                 excerpt = firstParagraphText.substring(0, 100)+"..."
    //             }
    //         }


    //         results.push({
    //             page: page,
    //             priority: 2,
    //             excerpt
    //         })
    //         continue
    //     }
    // }

    // return results


    // // const previewLength = 250
    // // const keywordIndex = firstParagraph.indexOf(data.query);
    // // const surroundingText = firstParagraph.substring(
    // // 	Math.max(0, keywordIndex - previewLength/2), // Start position
    // // 	Math.min(firstParagraph.length, keywordIndex + data.query.length + previewLength/2) // End position
    // // );
    // // return surroundingText
}

function updateCache(fullPath: string, markdownForCache: string) {
    cache.forEach((value, key) => {
        if (value === fullPath) {
            cache.delete(key);
        }
    });
    cache.set(markdownForCache, fullPath)
}
