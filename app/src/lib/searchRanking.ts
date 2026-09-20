import {
	buildSearchIndex,
	getExactHighlightRanges,
	normalizeSearchText,
	searchDocuments
} from './searchCore';
import type { PageClass } from './presentation/pagePresentation';
import { getPageTypeLabel, type SearchDomainInfo } from './searchDerivedData';
import type { ParsedSearchQuery, SearchSortMode } from './searchContracts';

export type SearchRankingRecord = {
	title: string;
	href: string;
	path: string;
	domain: SearchDomainInfo;
	pageClass: PageClass;
	categories: string[];
	contentText: string;
	contentHtml: string;
};

export type SearchRankingOptions = {
	includeCategories: boolean;
	includeContent: boolean;
	sort: SearchSortMode;
	activeFilters: {
		domains: string[];
		pageTypes: string[];
		categories: string[];
	};
};

export type SearchRankingResult = {
	item: SearchRankingRecord;
	titleHighlights?: [number, number][];
	score?: number;
};

export type SearchRankingOutput = {
	results: SearchRankingResult[];
};

function matchesAnyNormalizedValue(value: string, filters: string[]): boolean {
	const normalizedValue = normalizeSearchText(value);
	return filters.some((filterValue) => normalizedValue.includes(normalizeSearchText(filterValue)));
}

function matchesCategoryFilters(record: SearchRankingRecord, filters: string[]): boolean {
	if (filters.length === 0) {
		return true;
	}

	return record.categories.some((category) => matchesAnyNormalizedValue(category, filters));
}

function matchesPathFilters(record: SearchRankingRecord, filters: string[]): boolean {
	if (filters.length === 0) {
		return true;
	}

	const normalizedPath = normalizeSearchText(record.path);
	return filters.some((filterValue) => normalizedPath.includes(normalizeSearchText(filterValue)));
}

function matchesTypeFilters(record: SearchRankingRecord, filters: string[]): boolean {
	if (filters.length === 0) {
		return true;
	}

	const typeNames = [record.pageClass, getPageTypeLabel(record.pageClass)].map(normalizeSearchText);
	return filters.some((filterValue) => typeNames.includes(normalizeSearchText(filterValue)));
}

function matchesDomainFilters(record: SearchRankingRecord, filters: string[]): boolean {
	if (filters.length === 0) {
		return true;
	}

	return filters.some((filterValue) => normalizeSearchText(filterValue) === record.domain.key);
}

function matchesTitleFilters(record: SearchRankingRecord, filters: string[]): boolean {
	if (filters.length === 0) {
		return true;
	}

	return filters.some((filterValue) => matchesAnyNormalizedValue(record.title, [filterValue]));
}

function matchesExclusion(record: SearchRankingRecord, exclusions: string[]): boolean {
	if (exclusions.length === 0) {
		return false;
	}

	const haystack = [
		record.title,
		record.path,
		record.domain.label,
		...record.categories,
		record.contentText
	]
		.map(normalizeSearchText)
		.join(' ');

	return exclusions.some((exclusion) => haystack.includes(normalizeSearchText(exclusion)));
}

// Quoted phrases are exact: they must appear (ignoring case, umlauts and punctuation) in the
// fields the search looks at, and they get no typo tolerance.
function matchesPhrases(
	record: SearchRankingRecord,
	phrases: string[],
	options: { includeCategories: boolean; includeContent: boolean }
): boolean {
	if (phrases.length === 0) {
		return true;
	}

	const fields = [
		record.title,
		...(options.includeCategories ? record.categories : []),
		...(options.includeContent ? [record.contentText] : [])
	].map(normalizeSearchText);

	return phrases.every((phrase) => {
		const normalizedPhrase = normalizeSearchText(phrase);
		return fields.some((field) => field.includes(normalizedPhrase));
	});
}

function compareGerman(left: string, right: string): number {
	return left.localeCompare(right, 'de-DE');
}

function sortResults(results: SearchRankingResult[], sort: SearchSortMode): SearchRankingResult[] {
	const sortedResults = [...results];

	if (sort === 'title-asc') {
		sortedResults.sort((left, right) => compareGerman(left.item.title, right.item.title));
		return sortedResults;
	}

	if (sort === 'domain') {
		sortedResults.sort((left, right) => {
			const domainComparison = compareGerman(left.item.domain.label, right.item.domain.label);
			if (domainComparison !== 0) {
				return domainComparison;
			}

			return compareGerman(left.item.title, right.item.title);
		});
		return sortedResults;
	}

	return sortedResults;
}

export function runSearchRanking(
	records: SearchRankingRecord[],
	parsedQuery: ParsedSearchQuery,
	options: SearchRankingOptions
): SearchRankingOutput {
	const filteredRecords = records.filter((record) => {
		if (!matchesTitleFilters(record, parsedQuery.fieldFilters.title)) {
			return false;
		}
		if (!matchesDomainFilters(record, options.activeFilters.domains)) {
			return false;
		}
		if (!matchesTypeFilters(record, options.activeFilters.pageTypes)) {
			return false;
		}
		if (!matchesCategoryFilters(record, options.activeFilters.categories)) {
			return false;
		}
		if (!matchesCategoryFilters(record, parsedQuery.fieldFilters.category)) {
			return false;
		}
		if (!matchesPathFilters(record, parsedQuery.fieldFilters.path)) {
			return false;
		}
		if (!matchesTypeFilters(record, parsedQuery.fieldFilters.type)) {
			return false;
		}
		if (matchesExclusion(record, parsedQuery.exclusions)) {
			return false;
		}
		if (!matchesPhrases(record, parsedQuery.phrases, options)) {
			return false;
		}

		return true;
	});

	const freeTextQuery = parsedQuery.freeTextTerms.join(' ').trim();
	if (!freeTextQuery) {
		const phraseResults = filteredRecords.map((record) => {
			const titleHighlights = parsedQuery.phrases.flatMap((phrase) =>
				getExactHighlightRanges(record.title, phrase)
			);
			return {
				item: record,
				titleHighlights: titleHighlights.length > 0 ? titleHighlights : undefined
			};
		});
		// Pages that carry the phrase in their title come first (the sort is stable).
		phraseResults.sort(
			(left, right) => Number(right.titleHighlights != null) - Number(left.titleHighlights != null)
		);
		return { results: sortResults(phraseResults, options.sort) };
	}

	const index = buildSearchIndex(
		filteredRecords.map((record) => ({
			title: record.title,
			href: record.href,
			categories: record.categories,
			contentText: record.contentText,
			contentHtml: record.contentHtml
		}))
	);

	const searchResults = searchDocuments(index, freeTextQuery, {
		includeCategories: options.includeCategories,
		includeContent: options.includeContent
	});

	const mappedResults: SearchRankingResult[] = [];
	for (const searchResult of searchResults) {
		const record = filteredRecords.find((candidate) => candidate.href === searchResult.item.href);
		if (!record) {
			continue;
		}

		mappedResults.push({
			item: record,
			titleHighlights: searchResult.titleHighlights,
			score: searchResult.score
		});
	}

	return {
		results: sortResults(mappedResults, options.sort)
	};
}
