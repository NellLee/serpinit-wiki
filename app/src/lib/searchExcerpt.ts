import * as cheerio from 'cheerio';
import { buildHighlightedHtml, normalizeSearchText, type HighlightRange } from './searchCore';

type ExcerptBlock = {
	headerLink: string;
	text: string;
};

export function createSearchExcerpts(html: string, query: string, pageHref: string): string[] {
	const $ = cheerio.load(html);

	$('img').each((_, img) => {
		const altText = $(img).attr('alt');
		const altTextFormatted = `[Image${altText ? ': ' + altText : ''}]`;
		$(img).replaceWith($(`<p>${altTextFormatted}</p>`));
	});

	const excerptsByHeader = new Map<string, string[]>();

	$('body > *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6)').each((_, element) => {
		const block = buildExcerptBlock($, element, pageHref);
		if (!block) {
			return;
		}

		const highlightRanges = findExcerptHighlightRanges(block.text, query);
		if (highlightRanges.length === 0) {
			return;
		}

		const snippet = createHighlightedSnippet(block.text, highlightRanges);
		const excerpts = excerptsByHeader.get(block.headerLink) ?? [];
		excerpts.push(`<p>${snippet}</p>`);
		excerptsByHeader.set(block.headerLink, excerpts);
	});

	return Array.from(excerptsByHeader.entries()).map(
		([headerLink, excerpts]) => headerLink + excerpts.join('')
	);
}

function buildExcerptBlock(
	$: cheerio.CheerioAPI,
	element: cheerio.Element,
	pageHref: string
): ExcerptBlock | null {
	const text = $(element).text().replace(/\s+/g, ' ').trim();
	if (!text) {
		return null;
	}

	let parentHeader = $(element).prevAll('h1, h2, h3, h4, h5, h6').first();
	if (parentHeader.length === 0) {
		parentHeader = $(element).parent().prevAll('h1, h2, h3, h4, h5, h6').first();
	}

	const headerHtml = $.html($(parentHeader));
	const headerId = parentHeader.attr('id');
	const headerLink = headerId
		? `<a href="${pageHref}#${headerId}">${headerHtml}</a>`
		: `<a href="${pageHref}">${headerHtml || pageHref}</a>`;

	return {
		headerLink,
		text
	};
}

function findExcerptHighlightRanges(text: string, query: string): HighlightRange[] {
	const normalizedQuery = normalizeSearchText(query);
	if (!normalizedQuery) {
		return [];
	}

	const normalizedText = normalizeTextWithIndexMap(text);
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

function createHighlightedSnippet(text: string, highlightRanges: HighlightRange[]): string {
	const [firstHighlight] = highlightRanges;
	const snippetStart = findSnippetBoundary(text, Math.max(0, firstHighlight[0] - 90), -1);
	const snippetEnd = findSnippetBoundary(
		text,
		Math.min(text.length, firstHighlight[1] + 140),
		1
	);
	const snippetText = text.slice(snippetStart, snippetEnd).trim();
	const adjustedHighlights = clipHighlightRanges(highlightRanges, snippetStart, snippetEnd);
	const highlightedSnippet = buildHighlightedHtml(snippetText, adjustedHighlights);

	const prefix = snippetStart > 0 ? '[...] ' : '';
	const suffix = snippetEnd < text.length ? ' [...]' : '';
	return prefix + highlightedSnippet + suffix;
}

type WordCandidate = {
	normalized: string;
	start: number;
	end: number;
};

type NormalizedTextWithIndexMap = {
	normalizedText: string;
	indexMap: number[];
};

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

function normalizeTextWithIndexMap(value: string): NormalizedTextWithIndexMap {
	let normalizedText = '';
	const indexMap: number[] = [];

	for (let index = 0; index < value.length; index++) {
		const fragment = normalizeSearchFragment(value[index]);
		for (const character of fragment) {
			if (/\s/.test(character)) {
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

function findExactNormalizedMatchRanges(
	normalizedText: NormalizedTextWithIndexMap,
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

function clipHighlightRanges(
	ranges: HighlightRange[],
	snippetStart: number,
	snippetEnd: number
): HighlightRange[] {
	return ranges
		.map(([start, end]) => [Math.max(start, snippetStart), Math.min(end, snippetEnd - 1)] as HighlightRange)
		.filter(([start, end]) => start <= end)
		.map(([start, end]) => [start - snippetStart, end - snippetStart] as HighlightRange);
}

function findSnippetBoundary(text: string, target: number, direction: -1 | 1): number {
	if (direction === -1) {
		for (let index = target; index > 0; index--) {
			if (/\s/.test(text[index])) {
				return index + 1;
			}
		}
		return 0;
	}

	for (let index = target; index < text.length; index++) {
		if (/\s/.test(text[index])) {
			return index;
		}
	}
	return text.length;
}
