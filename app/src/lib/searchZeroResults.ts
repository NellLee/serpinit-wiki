import type { ParsedSearchQuery } from './searchContracts';

type SearchZeroResultInput = {
	parsedQuery: ParsedSearchQuery;
	activeFilters: {
		domains: string[];
		pageTypes: string[];
		categories: string[];
		includeTitle: boolean;
		includeCategories: boolean;
		includeContent: boolean;
	};
	resultsCount: number;
	relaxedQueries: string[];
};

type SearchZeroResultOutput = {
	broadenSearch: boolean;
	removeFilters: string[];
	nearbyQueries: string[];
};

function toDisplayLabel(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function buildZeroResultSuggestions(
	input: SearchZeroResultInput
): SearchZeroResultOutput {
	const hasHardFilters =
		input.activeFilters.domains.length > 0 ||
		input.activeFilters.pageTypes.length > 0 ||
		input.activeFilters.categories.length > 0 ||
		!input.activeFilters.includeCategories ||
		!input.activeFilters.includeContent;

	const broadenSearch = hasHardFilters || input.parsedQuery.exclusions.length > 0;

	const removeFilters = [
		...input.parsedQuery.exclusions.map((exclusion) => `-${exclusion}`),
		...input.activeFilters.domains.map((domain) => `Bereich: ${toDisplayLabel(domain)}`),
		...input.activeFilters.pageTypes.map((pageType) => `Seitentyp: ${pageType}`),
		...input.activeFilters.categories.map((category) => `Kategorie: ${category}`)
	];

	if (!input.activeFilters.includeCategories) {
		removeFilters.push('Kategorien aus');
	}

	if (!input.activeFilters.includeContent) {
		removeFilters.push('Inhalt aus');
	}

	const hasFreeTextQuery =
		input.parsedQuery.freeTextTerms.length > 0 || input.parsedQuery.phrases.length > 0;
	const nearbyQueries =
		hasFreeTextQuery && input.resultsCount === 0 ? input.relaxedQueries : [];

	return {
		broadenSearch,
		removeFilters,
		nearbyQueries
	};
}
