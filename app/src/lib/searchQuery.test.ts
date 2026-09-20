import { describe, expect, test } from 'vitest';
import { parseSearchQuery } from './searchQuery';

describe('searchQuery', () => {
	test('parses mixed filters and exclusions', () => {
		const parsed = parseSearchQuery('titel:"Do Uspil" foo -Lateralen pfad:Sodili typ:Artikel');

		expect(parsed.freeTextTerms).toEqual(['foo']);
		expect(parsed.phrases).toEqual([]);
		expect(parsed.exclusions).toEqual(['Lateralen']);
		expect(parsed.fieldFilters.title).toEqual(['Do Uspil']);
		expect(parsed.fieldFilters.path).toEqual(['Sodili']);
		expect(parsed.fieldFilters.type).toEqual(['Artikel']);
	});

	test('keeps repeated filters in order', () => {
		const repeatedFilters = parseSearchQuery(
			'kategorie:Religion kategorie:Politik typ:Artikel typ:Übersicht'
		);
		expect(repeatedFilters.fieldFilters.category).toEqual(['Religion', 'Politik']);
		expect(repeatedFilters.fieldFilters.type).toEqual(['Artikel', 'Übersicht']);
	});

	test('separates path filters, plain terms, and phrases', () => {
		const mixedTerms = parseSearchQuery('pfad:Sodili Lateralen "Do Uspil"');
		expect(mixedTerms.fieldFilters.path).toEqual(['Sodili']);
		expect(mixedTerms.freeTextTerms).toEqual(['Lateralen']);
		expect(mixedTerms.phrases).toEqual(['Do Uspil']);
	});
});
