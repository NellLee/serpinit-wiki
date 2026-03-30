import assert from 'node:assert/strict';
import { buildFacetCatalogs, deriveDomainInfo } from './searchDerivedData';

assert.deepEqual(deriveDomainInfo('content/Volk_/Lateralen_/Sodili/index.md'), {
	key: 'volk',
	label: 'Volk'
});

assert.deepEqual(deriveDomainInfo('content/Himmelskoerper_/index.md'), {
	key: 'himmelskoerper',
	label: 'Himmelskoerper'
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
		categories: ['Kulturen', 'Politik']
	},
	{
		domain: { key: 'volk', label: 'Volk' },
		pageClass: 'index',
		categories: ['Kulturen']
	},
	{
		domain: { key: 'himmelskoerper', label: 'Himmelskoerper' },
		pageClass: 'article',
		categories: ['Orte']
	}
]);

assert.deepEqual(facets.domains, [
	{ key: 'himmelskoerper', label: 'Himmelskoerper', count: 1 },
	{ key: 'volk', label: 'Volk', count: 2 }
]);

assert.deepEqual(facets.pageTypes, [
	{ key: 'article', label: 'Artikel', count: 2 },
	{ key: 'index', label: 'Index', count: 1 }
]);

assert.deepEqual(facets.categories, [
	{ key: 'kulturen', label: 'Kulturen', count: 2 },
	{ key: 'orte', label: 'Orte', count: 1 },
	{ key: 'politik', label: 'Politik', count: 1 }
]);
