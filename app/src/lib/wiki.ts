import { MarkdownPage } from '$lib/markdownPage';
import path from 'path';
import { getFilePathsInFolder, getFrontendSafePath } from './utilities/files';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import * as cheerio from 'cheerio';
import { initTimeline } from './timeline';
import { buildSearchIndex, normalizeSearchText, searchDocuments, type SearchCoreIndex } from './searchCore';
import { createSearchExcerpts } from './searchExcerpt';

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
			excerpts: includeContent ? createSearchExcerpts(page.contentHtml, query, page.href) : [],
			titleHighlights: result.titleHighlights
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

function updateCache(fullPath: string, markdownForCache: string) {
	cache.forEach((value, key) => {
		if (value === fullPath) {
			cache.delete(key);
		}
	});
	cache.set(markdownForCache, fullPath);
}
