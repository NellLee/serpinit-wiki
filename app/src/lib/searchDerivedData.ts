import type { PageClass } from './presentation/pagePresentation';
import { normalizeSearchText } from './searchCore';

const MEDIA_BRANCHES = new Set(['gallery', 'galleries', 'images']);
// A category counts as frequent when more than this many pages carry it.
const FREQUENT_CATEGORY_THRESHOLD = 1;

export type SearchDomainInfo = {
	key: string;
	label: string;
};

export type SearchFacetValue = {
	key: string;
	label: string;
	count: number;
};

export type SearchFacetCatalogs = {
	domains: SearchFacetValue[];
	pageTypes: SearchFacetValue[];
	categories: SearchFacetValue[];
};

export type SearchFacetSource = {
	domain: SearchDomainInfo;
	pageClass: PageClass;
	categories: string[];
};

export type SearchDerivedRecord = SearchFacetSource & {
	title: string;
	href: string;
	path: string;
	contentText: string;
	contentHtml: string;
};

const PAGE_TYPE_LABELS: Record<PageClass, string> = {
	article: 'Artikel',
	hub: 'Startseite',
	index: 'Übersicht',
	media: 'Medien',
	utility: 'Werkzeug'
};

export function getPageTypeLabel(pageClass: PageClass): string {
	return PAGE_TYPE_LABELS[pageClass];
}

function compareGermanLabels(left: string, right: string): number {
	return left.localeCompare(right, 'de-DE');
}

function toContentRelativeSegments(pagePath: string): string[] {
	return pagePath.replace(/\\/g, '/').replace(/^\/+/, '').split('/').filter(Boolean);
}

function normalizeDomainLabel(segment: string): string {
	return segment.replace(/_+/g, ' ').trim().replace(/\s+/g, ' ');
}

function getPrimaryDomainSegment(segments: string[]): string | null {
	const contentIndex = segments.indexOf('content');
	const contentSegments = contentIndex >= 0 ? segments.slice(contentIndex + 1) : segments;
	const pathWithoutLeaf = contentSegments.slice(0, -1);

	for (let index = 0; index < pathWithoutLeaf.length; index++) {
		const segment = pathWithoutLeaf[index];
		if (!segment || MEDIA_BRANCHES.has(segment.toLowerCase())) {
			continue;
		}

		return segment;
	}

	return null;
}

export function deriveDomainInfo(pagePath: string): SearchDomainInfo {
	const segments = toContentRelativeSegments(pagePath);
	const domainSegment = getPrimaryDomainSegment(segments);

	if (!domainSegment) {
		return {
			key: 'allgemein',
			label: 'Allgemein'
		};
	}

	return {
		key: normalizeSearchText(domainSegment),
		label: normalizeDomainLabel(domainSegment)
	};
}

function buildFacetValues(counts: Map<string, SearchFacetValue>): SearchFacetValue[] {
	return Array.from(counts.values()).sort((left, right) =>
		compareGermanLabels(left.label, right.label)
	);
}

// Every category a page carries explicitly (folder, inherited or hook tag), independent of any
// search result. Tags that only mirror a page's own name are left out.
export function buildCategoryCatalog(
	pageTags: ReadonlyArray<ReadonlyArray<{ text: string; source: string }>>
): SearchFacetValue[] {
	const catalog = new Map<string, SearchFacetValue>();

	for (const tags of pageTags) {
		const seenOnThisPage = new Set<string>();
		for (const tag of tags) {
			const key = normalizeSearchText(tag.text);
			if (tag.source === 'name' || !key || seenOnThisPage.has(key)) {
				continue;
			}
			seenOnThisPage.add(key);

			const entry = catalog.get(key);
			if (entry) {
				entry.count++;
			} else {
				catalog.set(key, { key, label: tag.text, count: 1 });
			}
		}
	}

	return buildFacetValues(catalog);
}

export function selectFrequentCategories(catalog: SearchFacetValue[]): SearchFacetValue[] {
	return catalog.filter((category) => category.count > FREQUENT_CATEGORY_THRESHOLD);
}

export function buildFacetCatalogs(
	entries: SearchFacetSource[],
	categoryCatalog: SearchFacetValue[] = []
): SearchFacetCatalogs {
	const domains = new Map<string, SearchFacetValue>();
	const pageTypes = new Map<string, SearchFacetValue>();
	const categoryCounts = new Map<string, number>();

	for (const entry of entries) {
		const domainFacet = domains.get(entry.domain.key) ?? {
			key: entry.domain.key,
			label: entry.domain.label,
			count: 0
		};
		domainFacet.count++;
		domains.set(entry.domain.key, domainFacet);

		const pageTypeFacet = pageTypes.get(entry.pageClass) ?? {
			key: entry.pageClass,
			label: getPageTypeLabel(entry.pageClass),
			count: 0
		};
		pageTypeFacet.count++;
		pageTypes.set(entry.pageClass, pageTypeFacet);

		for (const categoryKey of new Set(entry.categories.map(normalizeSearchText))) {
			categoryCounts.set(categoryKey, (categoryCounts.get(categoryKey) ?? 0) + 1);
		}
	}

	const categories = categoryCatalog
		.map((category) => ({ ...category, count: categoryCounts.get(category.key) ?? 0 }))
		.filter((facet) => facet.count > 0);

	return {
		domains: buildFacetValues(domains),
		pageTypes: buildFacetValues(pageTypes),
		categories
	};
}

export function buildDerivedRecord(entry: {
	title: string;
	href: string;
	path: string;
	pageClass: PageClass;
	categories: string[];
	contentText: string;
	contentHtml: string;
}): SearchDerivedRecord {
	return {
		title: entry.title,
		href: entry.href,
		path: entry.path,
		domain: deriveDomainInfo(entry.path),
		// The start page is the only hub, and a filter with a single page is of no use.
		pageClass: entry.pageClass === 'hub' ? 'index' : entry.pageClass,
		categories: entry.categories,
		contentText: entry.contentText,
		contentHtml: entry.contentHtml
	};
}
