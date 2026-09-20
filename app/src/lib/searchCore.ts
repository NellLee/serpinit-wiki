import Fuse, { type FuseResult, type RangeTuple } from 'fuse.js';

export type SearchDocument = {
	title: string;
	href: string;
	categories: string[];
	contentText: string;
	contentHtml: string;
};

type IndexedSearchDocument = SearchDocument & {
	normalizedTitle: string;
	normalizedTitleIndexMap: number[];
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

export type HighlightRange = [number, number];

function normalizeSearchFragment(value: string): string {
	return value
		.toLowerCase()
		.replace(/\u00e4/g, 'ae')
		.replace(/\u00f6/g, 'oe')
		.replace(/\u00fc/g, 'ue')
		.replace(/\u00df/g, 'ss')
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[_/\\-]+/g, ' ')
		.replace(/[^\p{L}\p{N}\s]+/gu, ' ');
}

function normalizeSearchTextWithIndexMap(value: string): {
	normalizedText: string;
	indexMap: number[];
} {
	let normalizedText = '';
	const indexMap: number[] = [];

	for (let index = 0; index < value.length; index++) {
		const fragment = normalizeSearchFragment(value[index]);
		for (const character of fragment) {
			const isWhitespace = /\s/.test(character);
			if (isWhitespace) {
				if (normalizedText.length === 0 || normalizedText.endsWith(' ')) {
					continue;
				}
				normalizedText += ' ';
				indexMap.push(index);
				continue;
			}

			normalizedText += character;
			indexMap.push(index);
		}
	}

	if (normalizedText.endsWith(' ')) {
		normalizedText = normalizedText.slice(0, -1);
		indexMap.pop();
	}

	return {
		normalizedText,
		indexMap
	};
}

export function normalizeSearchText(value: string): string {
	return normalizeSearchTextWithIndexMap(value).normalizedText;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function mergeHighlightRanges(ranges: HighlightRange[]): HighlightRange[] {
	const sortedRanges = [...ranges].sort((left, right) => left[0] - right[0]);
	if (sortedRanges.length === 0) {
		return [];
	}

	const mergedRanges: HighlightRange[] = [sortedRanges[0]];
	for (const range of sortedRanges.slice(1)) {
		const current = mergedRanges[mergedRanges.length - 1];
		if (range[0] <= current[1] + 1) {
			current[1] = Math.max(current[1], range[1]);
			continue;
		}

		mergedRanges.push([...range]);
	}

	return mergedRanges;
}

export function buildHighlightedHtml(text: string, ranges: HighlightRange[]): string {
	const mergedRanges = mergeHighlightRanges(ranges);
	if (mergedRanges.length === 0) {
		return escapeHtml(text);
	}

	let result = '';
	let lastIndex = 0;

	for (const [start, end] of mergedRanges) {
		result += escapeHtml(text.slice(lastIndex, start));
		result += `<mark>${escapeHtml(text.slice(start, end + 1))}</mark>`;
		lastIndex = end + 1;
	}

	result += escapeHtml(text.slice(lastIndex));
	return result;
}

export function getExactHighlightRanges(text: string, phrase: string): HighlightRange[] {
	const normalizedPhrase = normalizeSearchText(phrase);
	if (normalizedPhrase.length === 0) {
		return [];
	}

	return findExactNormalizedMatchRanges(normalizeSearchTextWithIndexMap(text), normalizedPhrase);
}

export function getFuzzyHighlightRanges(text: string, query: string): HighlightRange[] {
	const normalizedQuery = normalizeSearchText(query);
	if (normalizedQuery.length === 0) {
		return [];
	}

	const normalizedText = normalizeSearchTextWithIndexMap(text);
	if (normalizedText.normalizedText.length === 0) {
		return [];
	}

	const fuse = new Fuse(
		[
			{
				value: normalizedText.normalizedText,
				indexMap: normalizedText.indexMap
			}
		],
		{
			keys: [{ name: 'value', weight: 1 }],
			threshold: 0.32,
			ignoreLocation: true,
			includeMatches: true,
			findAllMatches: true,
			ignoreFieldNorm: true,
			minMatchCharLength: 1
		}
	);

	const result = fuse.search(normalizedQuery).at(0);
	const match = result?.matches?.find((entry) => entry.key === 'value');
	if (!match) {
		return [];
	}

	return mapNormalizedRangesToSource(match.indices, normalizedText.indexMap);
}

function findControlledHighlightRanges(text: string, query: string): HighlightRange[] {
	const normalizedQuery = normalizeSearchText(query);
	if (!normalizedQuery) {
		return [];
	}

	const normalizedText = normalizeSearchTextWithIndexMap(text);
	const phraseMatches = findExactNormalizedMatchRanges(normalizedText, normalizedQuery);
	if (phraseMatches.length > 0) {
		return phraseMatches;
	}

	const queryTokens = normalizedQuery.split(' ').filter(Boolean);
	const wordCandidates = extractWordCandidates(text);
	const exactTokenMatches = mergeHighlightRanges(
		queryTokens.flatMap((token) =>
			wordCandidates
				.filter((candidate) => candidate.normalized === token)
				.map((candidate) => [candidate.start, candidate.end] as HighlightRange)
		)
	);
	if (exactTokenMatches.length > 0) {
		return exactTokenMatches;
	}

	return mergeHighlightRanges(
		queryTokens
			.filter((token) => token.length >= 4)
			.map((token) => findBestFuzzyWordCandidate(wordCandidates, token))
			.filter((candidate): candidate is WordCandidate => candidate != null)
			.map((candidate) => [candidate.start, candidate.end] as HighlightRange)
	);
}

function mapNormalizedRangesToSource(
	ranges: ReadonlyArray<RangeTuple>,
	indexMap: number[]
): HighlightRange[] {
	return mergeHighlightRanges(
		ranges
			.map(([start, end]) => {
				const sourceStart = indexMap[start];
				const sourceEnd = indexMap[end];
				if (sourceStart == null || sourceEnd == null) {
					return null;
				}

				return [sourceStart, sourceEnd] satisfies HighlightRange;
			})
			.filter((range): range is HighlightRange => range != null)
	);
}

type WordCandidate = {
	normalized: string;
	start: number;
	end: number;
};

function findExactNormalizedMatchRanges(
	normalizedText: { normalizedText: string; indexMap: number[] },
	normalizedQuery: string
): HighlightRange[] {
	const ranges: HighlightRange[] = [];
	let searchStart = 0;

	while (searchStart < normalizedText.normalizedText.length) {
		const matchStart = normalizedText.normalizedText.indexOf(normalizedQuery, searchStart);
		if (matchStart === -1) {
			break;
		}

		const sourceStart = normalizedText.indexMap[matchStart];
		const sourceEnd = normalizedText.indexMap[matchStart + normalizedQuery.length - 1];
		if (sourceStart != null && sourceEnd != null) {
			ranges.push([sourceStart, sourceEnd]);
		}

		searchStart = matchStart + normalizedQuery.length;
	}

	return ranges;
}

function extractWordCandidates(text: string): WordCandidate[] {
	const candidates: WordCandidate[] = [];
	const wordRegex = /[\p{L}\p{N}]+(?:[-–—][\p{L}\p{N}]+)*/gu;

	for (const match of text.matchAll(wordRegex)) {
		const rawWord = match[0];
		const matchStart = match.index ?? 0;
		const rawParts = rawWord.split(/[-–—]/);
		let partOffset = 0;

		for (const rawPart of rawParts) {
			const start = matchStart + partOffset;
			const end = start + rawPart.length - 1;
			const normalized = normalizeSearchText(rawPart);
			if (normalized) {
				candidates.push({ normalized, start, end });
			}
			partOffset += rawPart.length + 1;
		}
	}

	return candidates;
}

function findBestFuzzyWordCandidate(
	candidates: WordCandidate[],
	token: string
): WordCandidate | null {
	let bestCandidate: WordCandidate | null = null;
	let bestDistance = Number.POSITIVE_INFINITY;

	for (const candidate of candidates) {
		const lengthDelta = Math.abs(candidate.normalized.length - token.length);
		if (lengthDelta > 2) {
			continue;
		}

		const distance = getLevenshteinDistance(candidate.normalized, token);
		const maxLength = Math.max(candidate.normalized.length, token.length);
		if (distance > 2 || distance / maxLength > 0.3) {
			continue;
		}

		if (distance < bestDistance) {
			bestCandidate = candidate;
			bestDistance = distance;
		}
	}

	return bestCandidate;
}

function getLevenshteinDistance(left: string, right: string): number {
	const distances = Array.from({ length: right.length + 1 }, (_, index) => index);

	for (let leftIndex = 1; leftIndex <= left.length; leftIndex++) {
		let previousDiagonal = leftIndex - 1;
		distances[0] = leftIndex;

		for (let rightIndex = 1; rightIndex <= right.length; rightIndex++) {
			const previousValue = distances[rightIndex];
			if (left[leftIndex - 1] === right[rightIndex - 1]) {
				distances[rightIndex] = previousDiagonal;
			} else {
				distances[rightIndex] =
					Math.min(distances[rightIndex - 1], distances[rightIndex], previousDiagonal) + 1;
			}
			previousDiagonal = previousValue;
		}
	}

	return distances[right.length];
}

function getTitleHighlights(
	result: FuseResult<IndexedSearchDocument>,
	query: string
): HighlightRange[] {
	return findControlledHighlightRanges(result.item.title, query);
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
		includeMatches: true,
		findAllMatches: true,
		ignoreFieldNorm: true,
		minMatchCharLength: 1
	});
}

export function buildSearchIndex(documents: SearchDocument[]): SearchCoreIndex {
	const indexedDocuments = documents.map((document) => {
		const normalizedTitle = normalizeSearchTextWithIndexMap(document.title);
		return {
			...document,
			normalizedTitle: normalizedTitle.normalizedText,
			normalizedTitleIndexMap: normalizedTitle.indexMap,
			normalizedCategories: document.categories.map(normalizeSearchText),
			normalizedContentText: normalizeSearchText(document.contentText)
		};
	});

	return {
		documents: indexedDocuments,
		titleIndex: createFuse(indexedDocuments, 'title'),
		titleCategoryIndex: createFuse(indexedDocuments, 'title+categories'),
		fullIndex: createFuse(indexedDocuments, 'full')
	};
}

export function searchDocuments(
	index: SearchCoreIndex,
	query: string,
	options: SearchOptions = {}
) {
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
			score: result.score ?? 0,
			titleHighlights: getTitleHighlights(result, query)
		}));
}
