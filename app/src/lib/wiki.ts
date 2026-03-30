import { MarkdownPage } from '$lib/markdownPage';
import path from 'path';
import { getFilePathsInFolder, getFrontendSafePath } from './utilities/files';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import * as cheerio from 'cheerio';
import { initTimeline } from './timeline';
import { buildSearchIndex, normalizeSearchText, searchDocuments, type SearchCoreIndex } from './searchCore';

export const wiki: Map<string, MarkdownPage> = new Map();
export const cache: Map<string, string> = new Map();
const __dirname = new URL('.', import.meta.url).pathname.substring(1);

let initialized = false;
let initializationPromise: Promise<void> | null = null;
let searchIndex: SearchCoreIndex | null = null;
let searchIndexDirty = true;

export const WIKI_PATH = path.resolve(__dirname, '../../../content');

export async function initWiki() {
	if (!initialized) {
		console.log('Initializing all wiki pages');
		await initTimeline();
		const files = getFilePathsInFolder(WIKI_PATH, ['.md']);
		for (const file of files) {
			loadMarkdownPage(path.resolve(WIKI_PATH, file.substring(1)));
		}
		initialized = true;
	}
}

export async function ensureWikiInitialized() {
	if (initialized) {
		return;
	}
	if (!initializationPromise) {
		initializationPromise = initWiki().finally(() => {
			if (initialized) {
				return;
			}
			initializationPromise = null;
		});
	}
	await initializationPromise;
}

export function loadMarkdownPage(fullPath: string): MarkdownPage {
	let markdownForCache;
	let page: MarkdownPage;
	if (!fs.existsSync(fullPath)) {
		if (fullPath.endsWith('index.md')) {
			const folderPath = fullPath.substring(0, fullPath.lastIndexOf(path.sep));
			page = MarkdownPage.constructIndexPage(folderPath);
			markdownForCache = page.markdown;
		} else {
			throw error(404, `File ${getFrontendSafePath(fullPath)} not found`);
		}
	} else {
		markdownForCache = fs.readFileSync(fullPath, 'utf-8');
		if (cache.get(markdownForCache) == fullPath) {
			console.log(`File "${getFrontendSafePath(fullPath)}" has been loaded from the cache.`);
			if (!wiki.has(fullPath)) {
				throw error(
					500,
					`Cache has entry for "${getFrontendSafePath(fullPath)}", but wiki has not.`
				);
			}
			page = wiki.get(fullPath)!;
		} else {
			console.log(
				`First page load for "${getFrontendSafePath(fullPath)}" or markdown content has changed.`
			);
			page = new MarkdownPage(fullPath);
		}
	}
	wiki.set(fullPath, page);
	updateCache(fullPath, markdownForCache);
	searchIndexDirty = true;
	return page;
}

export function search(
	query: string,
	includeCategories: boolean = false,
	includeContent: boolean = false
): SearchResult<MarkdownPage>[] {
	const normalizedQuery = normalizeSearchText(query);
	if (normalizedQuery.length === 0) {
		return [];
	}

	if (searchIndex == null || searchIndexDirty) {
		searchIndex = buildSearchIndex(
			Array.from(wiki.values()).map((page) => ({
				title: page.title,
				href: page.href,
				categories: page.categories.map((category) => category.text),
				contentText: extractSearchableText(page),
				contentHtml: page.contentHtml
			}))
		);
		searchIndexDirty = false;
	}

	return searchDocuments(searchIndex, query, { includeCategories, includeContent }).map((result) => {
		const page = Array.from(wiki.values()).find((candidate) => candidate.href === result.item.href);
		if (!page) {
			throw error(500, `Search result page "${result.item.href}" not found in wiki cache`);
		}

		return {
			item: page,
			excerpts: includeContent ? createExcerpts(page.contentHtml, query, page.href) : []
		};
	});
}

function extractSearchableText(page: MarkdownPage): string {
	const content = cheerio.load(page.contentHtml).text();
	const overview = page.overviewHtml ? cheerio.load(page.overviewHtml).text() : '';
	return [page.title, ...page.categories.map((category) => category.text), overview, content]
		.filter(Boolean)
		.join(' ');
}

function createExcerpts(html: string, query: string, pageHref: string): string[] {
	const $ = cheerio.load(html);
	const normalizedQuery = normalizeSearchText(query);

	$('img').each((_, img) => {
		const altText = $(img).attr('alt');
		const altTextFormatted = `[Image${altText ? ': ' + altText : ''}]`;
		$(img).replaceWith($(`<p>${altTextFormatted}</p>`));
	});

	const headerParagraphMap: { [key: string]: string } = {};

	$('body > *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6)').each((_, element) => {
		const tagName = $(element).prop('tagName').toLowerCase();
		const content = $(element).text();
		const contentHtml = $(element).html()!;

		if (normalizeSearchText(content).includes(normalizedQuery)) {
			let parentHeader = $(element).prevAll('h1, h2, h3, h4, h5, h6').first();
			if (parentHeader.length === 0) {
				parentHeader = $(element).parent().prevAll('h1, h2, h3, h4, h5, h6').first();
			}

			const headerHtml = $.html($(parentHeader));
			const headerId = parentHeader.attr('id');
			const headerLink = headerId
				? `<a href="${pageHref}#${headerId}">${headerHtml}</a>`
				: `<a href="${pageHref}">${headerHtml || pageHref}</a>`;

			const highlightedContentHtml = highlightQueryMatches(contentHtml, query);
			const trimmedContentHtml = trimToWordLimit(highlightedContentHtml, query, 50);
			if (headerParagraphMap[headerLink]) {
				headerParagraphMap[headerLink] += `<${tagName}>${trimmedContentHtml}</${tagName}>`;
			} else {
				headerParagraphMap[headerLink] = `<${tagName}>${trimmedContentHtml}</${tagName}>`;
			}
		}
	});
	const excerpts: string[] = Object.keys(headerParagraphMap).map(
		(headerWithLink) => headerWithLink + headerParagraphMap[headerWithLink]
	);

	return excerpts;
}

function highlightQueryMatches(html: string, query: string): string {
	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
	if (!escapedQuery) {
		return html;
	}

	return html.replace(new RegExp(`(${escapedQuery})`, 'gi'), '<mark>$1</mark>');
}

function trimToWordLimit(paragraph: string, query: string, wordLimit: number): string {
	const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
	const queryWords = query.split(' ');

	const queryIndices = sentences.reduce((indices, sentence, index) => {
		if (queryWords.some((qw) => sentence.toLowerCase().includes(qw.toLowerCase()))) {
			indices.push(index);
		}
		return indices;
	}, [] as number[]);

	if (queryIndices.length === 0) {
		const words = paragraph.split(' ').slice(0, wordLimit);
		return words.join(' ') + (words.length < paragraph.split(' ').length ? ' [...]' : '');
	}

	const start = Math.max(0, queryIndices[0]);
	let end = start;

	let wordCount = sentences[start].split(' ').length;

	while (
		end + 1 < sentences.length &&
		wordCount + sentences[end + 1].split(' ').length <= wordLimit
	) {
		end++;
		wordCount += sentences[end].split(' ').length;
	}

	let result = sentences.slice(start, end + 1).join(' ');

	if (start > 0) {
		result = '[...] ' + result;
	}

	if (end < sentences.length - 1) {
		result = result + ' [...]';
	}

	return result;
}

function updateCache(fullPath: string, markdownForCache: string) {
	cache.forEach((value, key) => {
		if (value === fullPath) {
			cache.delete(key);
		}
	});
	cache.set(markdownForCache, fullPath);
}
