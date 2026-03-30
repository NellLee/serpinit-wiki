export type SearchFieldFilterKey = 'title' | 'category' | 'path' | 'type';

export type ParsedSearchQuery = {
	rawQuery: string;
	freeTextTerms: string[];
	phrases: string[];
	exclusions: string[];
	fieldFilters: Record<SearchFieldFilterKey, string[]>;
};

export type SearchSortMode = 'relevance' | 'title-asc' | 'domain';
