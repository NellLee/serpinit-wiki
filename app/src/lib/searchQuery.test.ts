import { describe, expect, test } from 'vitest';
import { parseSearchQuery } from './searchQuery';

describe('searchQuery', () => {
	test('parses mixed filters and exclusions', () => {
		const parsed = parseSearchQuery('title:"Do Uspil" foo -Lateralen path:Sodili type:article');

		expect(parsed.freeTextTerms).toEqual(['foo']);
		expect(parsed.phrases).toEqual([]);
		expect(parsed.exclusions).toEqual(['Lateralen']);
		expect(parsed.fieldFilters.title).toEqual(['Do Uspil']);
		expect(parsed.fieldFilters.path).toEqual(['Sodili']);
		expect(parsed.fieldFilters.type).toEqual(['article']);
	});

	test('keeps repeated filters in order', () => {
		const repeatedFilters = parseSearchQuery('category:Religion category:Politik type:article type:index');
		expect(repeatedFilters.fieldFilters.category).toEqual(['Religion', 'Politik']);
		expect(repeatedFilters.fieldFilters.type).toEqual(['article', 'index']);
	});

	test('separates path filters, plain terms, and phrases', () => {
		const mixedTerms = parseSearchQuery('path:Sodili Lateralen "Do Uspil"');
		expect(mixedTerms.fieldFilters.path).toEqual(['Sodili']);
		expect(mixedTerms.freeTextTerms).toEqual(['Lateralen']);
		expect(mixedTerms.phrases).toEqual(['Do Uspil']);
	});
});
