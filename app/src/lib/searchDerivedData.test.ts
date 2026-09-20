import { describe, expect, test } from 'vitest';
import {
	buildCategoryCatalog,
	buildDerivedRecord,
	buildFacetCatalogs,
	deriveDomainInfo,
	selectFrequentCategories
} from './searchDerivedData';

describe('searchDerivedData', () => {
	test('derives domain metadata from content paths', () => {
		expect(deriveDomainInfo('content/Volk/Lateralen/Sodili/index.md')).toEqual({
			key: 'volk',
			label: 'Volk'
		});

		expect(deriveDomainInfo('content/Himmelskörper/index.md')).toEqual({
			key: 'himmelskoerper',
			label: 'Himmelskörper'
		});

		expect(deriveDomainInfo('content/index.md')).toEqual({
			key: 'allgemein',
			label: 'Allgemein'
		});

		expect(deriveDomainInfo('content/Volk/gallery/index.md')).toEqual({
			key: 'volk',
			label: 'Volk'
		});
	});

	test('builds normalized facet catalogs from records', () => {
		const frequentCategories = [
			{ key: 'charakter', label: 'Charakter', count: 41 },
			{ key: 'fauna', label: 'Fauna', count: 6 }
		];
		const facets = buildFacetCatalogs(
			[
				{
					domain: { key: 'volk', label: 'Volk' },
					pageClass: 'article',
					categories: ['Charakter', 'Magie', '2024.10.03', 'TODO']
				},
				{
					domain: { key: 'volk', label: 'Volk' },
					pageClass: 'index',
					categories: ['charakter', 'Theologie', 'und']
				},
				{
					domain: { key: 'himmelskoerper', label: 'Himmelskörper' },
					pageClass: 'article',
					categories: ['Fauna', 'images']
				}
			],
			frequentCategories
		);

		expect(facets.domains).toEqual([
			{ key: 'himmelskoerper', label: 'Himmelskörper', count: 1 },
			{ key: 'volk', label: 'Volk', count: 2 }
		]);

		expect(facets.pageTypes).toEqual([
			{ key: 'article', label: 'Artikel', count: 2 },
			{ key: 'index', label: 'Übersicht', count: 1 }
		]);

		expect(facets.categories).toEqual([
			{ key: 'charakter', label: 'Charakter', count: 2 },
			{ key: 'fauna', label: 'Fauna', count: 1 }
		]);
	});

	test('the start page is listed as an overview page', () => {
		const record = buildDerivedRecord({
			title: 'Start',
			href: '/content/index.md',
			path: '/content/index.md',
			pageClass: 'hub',
			categories: [],
			contentText: '',
			contentHtml: ''
		});

		expect(record.pageClass).toBe('index');
	});

	test('only categories with more than one page count as frequent', () => {
		expect(
			selectFrequentCategories([
				{ key: 'charakter', label: 'Charakter', count: 41 },
				{ key: 'dorf', label: 'Dorf', count: 1 },
				{ key: 'see', label: 'See', count: 2 }
			]).map((category) => category.label)
		).toEqual(['Charakter', 'See']);
	});
});

describe('buildCategoryCatalog', () => {
	const pageTags = [
		[
			{ text: 'Garrick-Filben-Tornbad', source: 'name' },
			{ text: 'Charakter', source: 'folder' }
		],
		[
			{ text: 'Lysandra', source: 'name' },
			{ text: 'charakter', source: 'folder' }
		],
		[
			{ text: 'Akuelon', source: 'name' },
			{ text: 'Dorf', source: 'hook' }
		],
		[
			{ text: 'Conius', source: 'name' },
			{ text: 'Lateralen', source: 'folder' },
			{ text: 'Volk', source: 'inherit' }
		]
	] as const;

	test('lists every explicit tag once with its page count, sorted by label', () => {
		expect(buildCategoryCatalog(pageTags)).toEqual([
			{ key: 'charakter', label: 'Charakter', count: 2 },
			{ key: 'dorf', label: 'Dorf', count: 1 },
			{ key: 'lateralen', label: 'Lateralen', count: 1 },
			{ key: 'volk', label: 'Volk', count: 1 }
		]);
	});

	test('leaves out tags that only come from page names', () => {
		const labels = buildCategoryCatalog(pageTags).map((entry) => entry.label);

		expect(labels).not.toContain('Akuelon');
		expect(labels).not.toContain('Conius');
	});

	test('sorts German labels with umlauts in place', () => {
		const catalog = buildCategoryCatalog([
			[{ text: 'Zirkel', source: 'folder' }],
			[{ text: 'Ätherwesen', source: 'hook' }],
			[{ text: 'Fauna', source: 'folder' }]
		]);

		expect(catalog.map((entry) => entry.label)).toEqual(['Ätherwesen', 'Fauna', 'Zirkel']);
	});

	test('returns an empty list for pages without tags', () => {
		expect(buildCategoryCatalog([])).toEqual([]);
	});
});
