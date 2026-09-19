import { describe, expect, test } from 'vitest';
import { resolveTags, type TagSource } from './tags';
import type { TagHooks } from './tagHooks';

const NO_HOOKS: TagHooks = { tags: [], inherit: 0, folderTag: false };
const TAG_FOLDER_NAMES = new Set([
	'Volk',
	'Lateralen',
	'Charakter',
	'Clan',
	'Fauna',
	'Kontinent',
	'Himmelskoerper',
	'A',
	'B',
	'C'
]);
const isKnownTagFolder = (folder: string[]) => TAG_FOLDER_NAMES.has(folder.at(-1)!);

function resolve(
	segments: string[],
	hooks: Partial<TagHooks> = {},
	isTagFolder: (folder: string[]) => boolean = isKnownTagFolder
) {
	return resolveTags({ segments, hooks: { ...NO_HOOKS, ...hooks }, isTagFolder });
}

function texts(segments: string[], hooks: Partial<TagHooks> = {}) {
	return resolve(segments, hooks).tags.map((tag) => tag.text);
}

describe('resolveTags: name tags', () => {
	test('a page file is tagged with its own file name', () => {
		expect(texts(['Volk', 'Vorenkai', 'Blutrituale.md'])).toEqual(['Blutrituale']);
	});

	test('an index page is tagged with its own folder name', () => {
		expect(texts(['Allgemein', 'Vorenkai', 'index.md'])).toEqual(['Vorenkai']);
	});

	test('names are split at underscores', () => {
		expect(
			texts(['Himmelskoerper', 'Agranum', 'Kontinent', 'Gurontis', 'Dorf_Akuelon', 'index.md'])
		).toEqual(['Dorf', 'Akuelon']);
	});

	test('the content root index has no tags', () => {
		expect(texts(['index.md'])).toEqual([]);
	});

	test('name tags carry the source "name"', () => {
		expect(resolve(['Allgemein', 'Vorenkai', 'index.md']).tags).toEqual([
			{ text: 'Vorenkai', source: 'name' }
		]);
	});
});

describe('resolveTags: folder tags are flat', () => {
	test('a file directly inside a tag folder gets the folder tag', () => {
		const result = resolve(['Himmelskoerper', 'Aridess', 'Fauna', 'Lurper.md']);

		expect(result.tags).toEqual([
			{ text: 'Lurper', source: 'name' },
			{ text: 'Fauna', source: 'folder' }
		]);
	});

	test('the index page of a direct subfolder gets the folder tag', () => {
		expect(texts(['Volk', 'Lateralen', 'Conius', 'Charakter', 'Lysandra', 'index.md'])).toEqual([
			'Lysandra',
			'Charakter'
		]);
	});

	test('a page deeper inside an entry folder gets no folder tag', () => {
		expect(
			texts(['Volk', 'Lateralen', 'Conius', 'Charakter', 'Lysandra', 'Geschichte.md'])
		).toEqual(['Geschichte']);
	});

	test('a member of a clan does not get the clan tag', () => {
		const segments = [
			'Volk',
			'Lateralen',
			'Sodili',
			'Politik',
			'Clan',
			'Diebesgilde_Brauner-Ring',
			'Charakter',
			'Garrick',
			'index.md'
		];

		expect(texts(segments)).toEqual(['Garrick', 'Charakter']);
	});

	test('the index page of a tag folder gets the tag of its parent tag folder', () => {
		expect(texts(['Volk', 'Lateralen', 'index.md'])).toEqual(['Lateralen', 'Volk']);
	});

	test('a tag folder name with underscores becomes a tag with spaces', () => {
		const result = resolve(
			['Politik', 'Diebesgilde_Brauner-Ring', 'Garrick', 'index.md'],
			{},
			(folder) => folder.at(-1) === 'Diebesgilde_Brauner-Ring'
		);

		expect(result.tags.map((tag) => tag.text)).toEqual(['Garrick', 'Diebesgilde Brauner-Ring']);
	});

	test('only marked folders give tags', () => {
		const result = resolve(['Volk', 'Vorenkai', 'Blutrituale.md'], {}, () => false);

		expect(result.tags.map((tag) => tag.text)).toEqual(['Blutrituale']);
	});

	test('the folder lookup receives the folder path from the content root', () => {
		const asked: string[] = [];
		resolve(['Volk', 'Lateralen', 'Conius', 'index.md'], { inherit: 1 }, (folder) => {
			asked.push(folder.join('/'));
			return isKnownTagFolder(folder);
		});

		expect(asked).toContain('Volk/Lateralen');
		expect(asked).toContain('Volk');
	});
});

describe('resolveTags: inherit', () => {
	test('inherit=1 adds the next tag folder above the parent tag folder', () => {
		const result = resolve(['Volk', 'Lateralen', 'Conius', 'index.md'], { inherit: 1 });

		expect(result.tags).toEqual([
			{ text: 'Conius', source: 'name' },
			{ text: 'Lateralen', source: 'folder' },
			{ text: 'Volk', source: 'inherit' }
		]);
		expect(result.warnings).toEqual([]);
	});

	test('inherit skips folders that are not tag folders', () => {
		const segments = ['Volk', 'Politik', 'Clan', 'Diebesgilde', 'index.md'];

		expect(texts(segments, { inherit: 1 })).toEqual(['Diebesgilde', 'Clan', 'Volk']);
	});

	test('inherit works on a file entry too', () => {
		expect(texts(['Volk', 'Lateralen', 'Do-Uspil.md'], { inherit: 1 })).toEqual([
			'Do-Uspil',
			'Lateralen',
			'Volk'
		]);
	});

	test('inherit=2 walks two tag folders up, nearest first', () => {
		const segments = ['A', 'B', 'C', 'Entry', 'index.md'];

		expect(texts(segments, { inherit: 2 })).toEqual(['Entry', 'C', 'B', 'A']);
	});

	test('without inherit, nothing above the parent tag folder is taken', () => {
		expect(texts(['Volk', 'Lateralen', 'Conius', 'index.md'])).toEqual(['Conius', 'Lateralen']);
	});

	test('warns when the page is not a direct entry of a tag folder', () => {
		const result = resolve(['Volk', 'Lateralen', 'Conius', 'Kultur.md'], { inherit: 1 });

		expect(result.tags.map((tag) => tag.text)).toEqual(['Kultur']);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toContain('inherit');
	});

	test('warns when inherit asks for more tag folders than exist', () => {
		const result = resolve(['Volk', 'Lateralen', 'Conius', 'index.md'], { inherit: 3 });

		expect(result.tags.map((tag) => tag.text)).toEqual(['Conius', 'Lateralen', 'Volk']);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toContain('inherit=3');
	});

	test('inherit=0 changes nothing and does not warn', () => {
		const result = resolve(['Volk', 'Lateralen', 'Conius', 'index.md'], { inherit: 0 });

		expect(result.tags.map((tag) => tag.text)).toEqual(['Conius', 'Lateralen']);
		expect(result.warnings).toEqual([]);
	});
});

describe('resolveTags: hook tags and merging', () => {
	test('hook tags come last and carry the source "hook"', () => {
		const result = resolve(
			['Politik', 'Garrick', 'index.md'],
			{ tags: ['Schmuggler'] },
			() => false
		);

		expect(result.tags).toEqual([
			{ text: 'Garrick', source: 'name' },
			{ text: 'Schmuggler', source: 'hook' }
		]);
	});

	test('tags that normalize to the same key are merged into one', () => {
		const result = resolve(['Volk', 'Vorenkai', 'Blutrituale.md'], {
			tags: ['blutrituale', 'Blutrituale']
		});

		expect(result.tags).toHaveLength(1);
	});

	test('a stronger source replaces the text and source of a name tag', () => {
		const result = resolve(
			['Himmelskoerper', 'index.md'],
			{ tags: ['Himmelskörper'] },
			() => false
		);

		expect(result.tags).toEqual([{ text: 'Himmelskörper', source: 'hook' }]);
	});

	test('an explicit hook tag upgrades an equal folder tag to the source "hook"', () => {
		const result = resolve(['Kontinent', 'Gurontis.md'], { tags: ['Kontinent'] });

		expect(result.tags).toEqual([
			{ text: 'Gurontis', source: 'name' },
			{ text: 'Kontinent', source: 'hook' }
		]);
	});

	test('the resolved source values are limited to the known set', () => {
		const known: TagSource[] = ['name', 'folder', 'inherit', 'hook'];
		const result = resolve(['Volk', 'Lateralen', 'Conius', 'index.md'], {
			inherit: 1,
			tags: ['X']
		});

		for (const tag of result.tags) {
			expect(known).toContain(tag.source);
		}
	});
});
