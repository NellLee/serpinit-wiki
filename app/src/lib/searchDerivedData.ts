import type { PageClass } from './presentation/pagePresentation';
import { normalizeSearchText } from './searchCore';

const MEDIA_BRANCHES = new Set(['gallery', 'galleries', 'images']);
const DOMAIN_LABEL_OVERRIDES: Record<string, string> = {
	Himmelskoerper_: 'Himmelskörper'
};
const CURATED_CATEGORY_DEFINITIONS = [
	{ key: 'charaktere', label: 'Charaktere', sourceKeys: ['charakter', 'charaktere'] },
	{ key: 'clans', label: 'Clans', sourceKeys: ['clan'] },
	{ key: 'dynastien', label: 'Dynastien', sourceKeys: ['dynastie'] },
	{ key: 'familien', label: 'Familien', sourceKeys: ['familie'] },
	{ key: 'fauna', label: 'Fauna', sourceKeys: ['fauna'] },
	{ key: 'flora', label: 'Flora', sourceKeys: ['flora'] },
	{ key: 'gebirge', label: 'Gebirge', sourceKeys: ['gebirge'] },
	{ key: 'kontinente', label: 'Kontinente', sourceKeys: ['kontinent'] },
	{ key: 'doerfer', label: 'Dörfer', sourceKeys: ['dorf'] },
	{ key: 'seen', label: 'Seen', sourceKeys: ['see'] },
	{ key: 'magie', label: 'Magie', sourceKeys: ['magie'] },
	{ key: 'theologie', label: 'Theologie', sourceKeys: ['theologie'] }
] as const;
const CURATED_CATEGORY_SOURCE_KEYS = new Map<string, string[]>(
	CURATED_CATEGORY_DEFINITIONS.map((definition) => [definition.key, [...definition.sourceKeys]])
);

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
	hub: 'Hub',
	index: 'Index',
	media: 'Medien',
	utility: 'Werkzeug'
};

export function getPageTypeLabel(pageClass: PageClass): string {
	return PAGE_TYPE_LABELS[pageClass];
}

export function expandCuratedCategoryFilter(filterKey: string): string[] {
	return CURATED_CATEGORY_SOURCE_KEYS.get(filterKey) ?? [filterKey];
}

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
	const override = DOMAIN_LABEL_OVERRIDES[segment];
	if (override) {
		return override;
	}

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
	const rawCategoryCounts = new Map<string, number>();

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

		for (const category of entry.categories) {
			const categoryKey = normalizeSearchText(category);
			rawCategoryCounts.set(categoryKey, (rawCategoryCounts.get(categoryKey) ?? 0) + 1);
		}
	}

	const categories = CURATED_CATEGORY_DEFINITIONS.map((definition) => ({
		key: definition.key,
		label: definition.label,
		count: definition.sourceKeys.reduce(
			(total, sourceKey) => total + (rawCategoryCounts.get(sourceKey) ?? 0),
			0
		)
	})).filter((facet) => facet.count > 0);

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
		pageClass: entry.pageClass,
		categories: entry.categories,
		contentText: entry.contentText,
		contentHtml: entry.contentHtml
	};
}
