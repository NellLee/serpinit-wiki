import { MarkdownPage } from '$lib/markdownPage';
import path from 'path';
import { getFilePathsInFolder, getFrontendSafePath } from './utilities/files';
import { error } from '@sveltejs/kit';
import fs from 'fs';
import * as cheerio from 'cheerio';
import { initTimeline } from './timeline';
import { createSearchExcerpts } from './searchExcerpt';
import {
	buildDerivedRecord,
	buildFacetCatalogs,
	type SearchDerivedRecord
} from './searchDerivedData';
import { getContentPagePresentation, type PageClass } from './presentation/pagePresentation';
import { parseSearchQuery } from './searchQuery';
import { runSearchRanking } from './searchRanking';
import { buildZeroResultSuggestions } from './searchZeroResults';
import type {
	SearchActiveFilters,
	SearchApiResponse,
	SearchPreviewResponse,
	SearchResultPayload,
	SearchSortMode
} from './searchContracts';

export const wiki: Map<string, MarkdownPage> = new Map();
export const cache: Map<string, string> = new Map();
const __dirname = new URL('.', import.meta.url).pathname.substring(1);

let initialized = false;
let initializationPromise: Promise<void> | null = null;
let searchIndexDirty = true;
let searchRecords: SearchDerivedRecord[] = [];
let searchFacets = buildFacetCatalogs([]);

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

type SearchWikiOptions = {
	includeCategories?: boolean;
	includeContent?: boolean;
	sort?: SearchSortMode;
	activeFilters?: Partial<SearchActiveFilters>;
};

function ensureSearchState() {
	if (!searchIndexDirty) {
		return;
	}

	searchRecords = Array.from(wiki.values()).map((page) =>
		buildDerivedRecord({
			title: page.title,
			href: page.href,
			path: page.href,
			pageClass: getContentPagePresentation(page.href).pageClass as PageClass,
			categories: page.categories.map((category) => category.text),
			contentText: extractSearchableText(page),
			contentHtml: page.contentHtml
		})
	);
	searchFacets = buildFacetCatalogs(searchRecords);
	searchIndexDirty = false;
}

function createActiveFilters(options: SearchWikiOptions | undefined): SearchActiveFilters {
	return {
		domains: options?.activeFilters?.domains ?? [],
		pageTypes: options?.activeFilters?.pageTypes ?? [],
		categories: options?.activeFilters?.categories ?? [],
		includeTitle: true,
		includeCategories: options?.includeCategories ?? true,
		includeContent: options?.includeContent ?? true
	};
}

function buildSearchResultPayload(
	record: SearchDerivedRecord,
	query: string,
	includeContent: boolean,
	titleHighlights?: [number, number][]
): SearchResultPayload<MarkdownPage> {
	const page = Array.from(wiki.values()).find((candidate) => candidate.href === record.href);
	if (!page) {
		throw error(500, `Search result page "${record.href}" not found in wiki cache`);
	}

	return {
		item: page,
		excerpts: includeContent ? createSearchExcerpts(page.contentHtml, query, page.href) : [],
		titleHighlights,
		domain: record.domain,
		pageType: record.pageClass,
		categories: record.categories
	};
}

function buildRelaxedQueries(query: string): string[] {
	const parsedQuery = parseSearchQuery(query);
	if (parsedQuery.exclusions.length === 0) {
		return [];
	}

	return [[...parsedQuery.freeTextTerms, ...parsedQuery.phrases].join(' ').trim()].filter(Boolean);
}

export function search(
	query: string,
	options: SearchWikiOptions = {}
): SearchApiResponse<MarkdownPage> {
	ensureSearchState();

	const activeFilters = createActiveFilters(options);
	const parsedQuery = parseSearchQuery(query);
	const sort = options.sort ?? 'relevance';
	const rankingOutput = runSearchRanking(searchRecords, parsedQuery, {
		includeCategories: activeFilters.includeCategories,
		includeContent: activeFilters.includeContent,
		sort
	});

	return {
		query,
		parsedQuery,
		activeFilters,
		sort,
		facets: searchFacets,
		suggestions: buildZeroResultSuggestions({
			parsedQuery,
			activeFilters,
			resultsCount: rankingOutput.results.length,
			relaxedQueries: buildRelaxedQueries(query)
		}),
		results: rankingOutput.results.map((result) =>
			buildSearchResultPayload(
				result.item,
				query,
				activeFilters.includeContent,
				result.titleHighlights
			)
		)
	};
}

export function searchPreview(query: string): SearchPreviewResponse {
	const searchResponse = search(query, {
		includeCategories: true,
		includeContent: false,
		sort: 'relevance'
	});

	return {
		query,
		results: searchResponse.results.slice(0, 8).map((result) => ({
			item: JSON.stringify(result.item),
			titleHighlights: result.titleHighlights
		}))
	};
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
