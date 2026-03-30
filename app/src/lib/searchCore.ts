import Fuse from 'fuse.js';

export type SearchDocument = {
	title: string;
	href: string;
	categories: string[];
	contentText: string;
	contentHtml: string;
};

type IndexedSearchDocument = SearchDocument & {
	normalizedTitle: string;
	normalizedCategories: string[];
	normalizedContentText: string;
};

type SearchMode = 'title' | 'title+categories' | 'full';

export type SearchCoreIndex = {
	documents: IndexedSearchDocument[];
	titleIndex: Fuse<IndexedSearchDocument>;
	titleCategoryIndex: Fuse<IndexedSearchDocument>;
	fullIndex: Fuse<IndexedSearchDocument>;
};

export type SearchOptions = {
	includeCategories?: boolean;
	includeContent?: boolean;
	limit?: number;
};

export function normalizeSearchText(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/\u00e4/g, 'ae')
		.replace(/\u00f6/g, 'oe')
		.replace(/\u00fc/g, 'ue')
		.replace(/\u00df/g, 'ss')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[_/\\-]+/g, ' ')
		.replace(/[^\p{L}\p{N}\s]+/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function createFuse(
	documents: IndexedSearchDocument[],
	mode: SearchMode
): Fuse<IndexedSearchDocument> {
	const keys =
		mode === 'title'
			? [{ name: 'normalizedTitle', weight: 8 }]
			: mode === 'title+categories'
				? [
						{ name: 'normalizedTitle', weight: 8 },
						{ name: 'normalizedCategories', weight: 3 }
					]
				: [
						{ name: 'normalizedTitle', weight: 8 },
						{ name: 'normalizedCategories', weight: 3 },
						{ name: 'normalizedContentText', weight: 1 }
					];

	return new Fuse(documents, {
		keys,
		threshold: mode === 'full' ? 0.32 : 0.24,
		ignoreLocation: true,
		includeScore: true,
		findAllMatches: true,
		ignoreFieldNorm: true,
		minMatchCharLength: 1
	});
}

export function buildSearchIndex(documents: SearchDocument[]): SearchCoreIndex {
	const indexedDocuments = documents.map((document) => ({
		...document,
		normalizedTitle: normalizeSearchText(document.title),
		normalizedCategories: document.categories.map(normalizeSearchText),
		normalizedContentText: normalizeSearchText(document.contentText)
	}));

	return {
		documents: indexedDocuments,
		titleIndex: createFuse(indexedDocuments, 'title'),
		titleCategoryIndex: createFuse(indexedDocuments, 'title+categories'),
		fullIndex: createFuse(indexedDocuments, 'full')
	};
}

export function searchDocuments(index: SearchCoreIndex, query: string, options: SearchOptions = {}) {
	const normalizedQuery = normalizeSearchText(query);
	if (normalizedQuery.length === 0) {
		return [];
	}

	const includeCategories = options.includeCategories ?? false;
	const includeContent = options.includeContent ?? false;
	const fuse = includeContent
		? index.fullIndex
		: includeCategories
			? index.titleCategoryIndex
			: index.titleIndex;

	return fuse
		.search(normalizedQuery, options.limit != null ? { limit: options.limit } : undefined)
		.map((result) => ({
			item: result.item,
			score: result.score ?? 0
		}));
}
