import * as cheerio from 'cheerio';
import { buildHighlightedHtml, getFuzzyHighlightRanges, type HighlightRange } from './searchCore';

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

		const highlightRanges = getFuzzyHighlightRanges(block.text, query);
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
