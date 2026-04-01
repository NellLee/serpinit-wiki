import { describe, expect, test } from 'vitest';
import { buildFacetCatalogs, deriveDomainInfo } from './searchDerivedData';

describe('searchDerivedData', () => {
	test('derives domain metadata from content paths', () => {
		expect(deriveDomainInfo('content/Volk_/Lateralen_/Sodili/index.md')).toEqual({
			key: 'volk',
			label: 'Volk'
		});

		expect(deriveDomainInfo('content/Himmelskoerper_/index.md')).toEqual({
			key: 'himmelskoerper',
			label: 'Himmelskörper'
		});

		expect(deriveDomainInfo('content/index.md')).toEqual({
			key: 'allgemein',
			label: 'Allgemein'
		});

		expect(deriveDomainInfo('content/Volk_/gallery/index.md')).toEqual({
			key: 'volk',
			label: 'Volk'
		});
	});

	test('builds normalized facet catalogs from records', () => {
		const facets = buildFacetCatalogs([
			{
				domain: { key: 'volk', label: 'Volk' },
				pageClass: 'article',
				categories: ['Charakter', 'Magie', '2024.10.03', 'TODO']
			},
			{
				domain: { key: 'volk', label: 'Volk' },
				pageClass: 'index',
				categories: ['Charaktere', 'Theologie', 'und']
			},
			{
				domain: { key: 'himmelskoerper', label: 'Himmelskörper' },
				pageClass: 'article',
				categories: ['Fauna', 'images']
			}
		]);

		expect(facets.domains).toEqual([
			{ key: 'himmelskoerper', label: 'Himmelskörper', count: 1 },
			{ key: 'volk', label: 'Volk', count: 2 }
		]);

		expect(facets.pageTypes).toEqual([
			{ key: 'article', label: 'Artikel', count: 2 },
			{ key: 'index', label: 'Index', count: 1 }
		]);

		expect(facets.categories).toEqual([
			{ key: 'charaktere', label: 'Charaktere', count: 2 },
			{ key: 'fauna', label: 'Fauna', count: 1 },
			{ key: 'magie', label: 'Magie', count: 1 },
			{ key: 'theologie', label: 'Theologie', count: 1 }
		]);
	});
});
