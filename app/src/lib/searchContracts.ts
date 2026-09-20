export type SearchFieldFilterKey = 'title' | 'category' | 'path' | 'type';

export type ParsedSearchQuery = {
	rawQuery: string;
	freeTextTerms: string[];
	phrases: string[];
	exclusions: string[];
	fieldFilters: Record<SearchFieldFilterKey, string[]>;
};

export type SearchSortMode = 'relevance' | 'title-asc' | 'domain';

export type SearchFacetValue = {
	key: string;
	label: string;
	count: number;
};

export type SearchActiveFilters = {
	domains: string[];
	pageTypes: string[];
	categories: string[];
	includeTitle: boolean;
	includeCategories: boolean;
	includeContent: boolean;
};

export type SearchSuggestions = {
	broadenSearch: boolean;
	removeFilters: string[];
	nearbyQueries: string[];
};

export type SearchFacets = {
	domains: SearchFacetValue[];
	pageTypes: SearchFacetValue[];
	categories: SearchFacetValue[];
};

export type SearchCatalog = {
	categories: SearchFacetValue[];
};

export type SearchResultPayload<T> = {
	item: T;
	excerpts: string[];
	titleHighlights?: [number, number][];
	domain?: {
		key: string;
		label: string;
	};
	pageType?: string;
	categories?: string[];
};

export type SearchApiResponse<T> = {
	query: string;
	parsedQuery: ParsedSearchQuery;
	activeFilters: SearchActiveFilters;
	sort: SearchSortMode;
	facets: SearchFacets;
	suggestions: SearchSuggestions;
	results: SearchResultPayload<T>[];
};

export type SearchPreviewResponse = {
	query: string;
	results: Array<{
		item: string;
		titleHighlights?: [number, number][];
	}>;
};
