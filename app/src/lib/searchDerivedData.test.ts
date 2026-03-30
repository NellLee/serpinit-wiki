import assert from 'node:assert/strict';
import { buildFacetCatalogs, deriveDomainInfo } from './searchDerivedData';

assert.deepEqual(deriveDomainInfo('content/Volk_/Lateralen_/Sodili/index.md'), {
	key: 'volk',
	label: 'Volk'
});

assert.deepEqual(deriveDomainInfo('content/Himmelskoerper_/index.md'), {
	key: 'himmelskoerper',
	label: 'Himmelskörper'
});

assert.deepEqual(deriveDomainInfo('content/index.md'), {
	key: 'allgemein',
	label: 'Allgemein'
});

assert.deepEqual(deriveDomainInfo('content/Volk_/gallery/index.md'), {
	key: 'volk',
	label: 'Volk'
});

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

assert.deepEqual(facets.domains, [
	{ key: 'himmelskoerper', label: 'Himmelskörper', count: 1 },
	{ key: 'volk', label: 'Volk', count: 2 }
]);

assert.deepEqual(facets.pageTypes, [
	{ key: 'article', label: 'Artikel', count: 2 },
	{ key: 'index', label: 'Index', count: 1 }
]);

assert.deepEqual(facets.categories, [
	{ key: 'charaktere', label: 'Charaktere', count: 2 },
	{ key: 'fauna', label: 'Fauna', count: 1 },
	{ key: 'magie', label: 'Magie', count: 1 },
	{ key: 'theologie', label: 'Theologie', count: 1 }
]);
