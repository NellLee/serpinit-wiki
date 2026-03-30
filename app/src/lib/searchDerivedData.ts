import type { PageClass } from './presentation/pagePresentation';
import { normalizeSearchText } from './searchCore';

const MEDIA_BRANCHES = new Set(['gallery', 'galleries', 'images']);

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

const PAGE_TYPE_LABELS: Record<PageClass, string> = {
	article: 'Artikel',
	hub: 'Hub',
	index: 'Index',
	media: 'Medien',
	utility: 'Werkzeug'
};

function compareGermanLabels(left: string, right: string): number {
	return left.localeCompare(right, 'de-DE');
}

function toContentRelativeSegments(pagePath: string): string[] {
	return pagePath
		.replace(/\\/g, '/')
		.replace(/^\/+/, '')
		.split('/')
		.filter(Boolean);
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
	return Array.from(counts.values()).sort((left, right) => compareGermanLabels(left.label, right.label));
}

export function buildFacetCatalogs(entries: SearchFacetSource[]): SearchFacetCatalogs {
	const domains = new Map<string, SearchFacetValue>();
	const pageTypes = new Map<string, SearchFacetValue>();
	const categories = new Map<string, SearchFacetValue>();

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
			label: PAGE_TYPE_LABELS[entry.pageClass],
			count: 0
		};
		pageTypeFacet.count++;
		pageTypes.set(entry.pageClass, pageTypeFacet);

		for (const category of entry.categories) {
			const categoryKey = normalizeSearchText(category);
			const categoryFacet = categories.get(categoryKey) ?? {
				key: categoryKey,
				label: category,
				count: 0
			};
			categoryFacet.count++;
			categories.set(categoryKey, categoryFacet);
		}
	}

	return {
		domains: buildFacetValues(domains),
		pageTypes: buildFacetValues(pageTypes),
		categories: buildFacetValues(categories)
	};
}
