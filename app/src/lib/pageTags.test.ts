import path from 'path';
import { describe, expect, test } from 'vitest';
import { resolvePageTags } from './pageTags';

const ROOT = path.resolve('/wiki/content');

function createContext(files: Record<string, string>) {
	return {
		contentRoot: ROOT,
		readFile: (fullPath: string) =>
			files[path.relative(ROOT, fullPath).split(path.sep).join('/')] ?? ''
	};
}

const FILES = {
	'Volk/index.md': '<!-- folder-tag -->\n# Volk Index\n',
	'Volk/Lateralen/index.md': '<!-- folder-tag -->\n# Lateralen Index\n',
	'Volk/Lateralen/Conius/index.md': '<!-- tags: inherit=1 -->\n# Conius\n',
	'Volk/Lateralen/Conius/Charakter/index.md': '<!-- folder-tag -->\n# Charakter Index\n',
	'Volk/Lateralen/Conius/Charakter/Lysandra/index.md': '# Lysandra\n'
};

describe('resolvePageTags', () => {
	test('reads folder-tag hooks from the index pages of the ancestor folders', () => {
		const fullPath = path.join(ROOT, 'Volk/Lateralen/Conius/Charakter/Lysandra/index.md');
		const result = resolvePageTags(
			fullPath,
			FILES['Volk/Lateralen/Conius/Charakter/Lysandra/index.md'],
			createContext(FILES)
		);

		expect(result.tags.map((tag) => tag.text)).toEqual(['Lysandra', 'Charakter']);
		expect(result.warnings).toEqual([]);
	});

	test('applies inherit from the page own hook block', () => {
		const fullPath = path.join(ROOT, 'Volk/Lateralen/Conius/index.md');
		const result = resolvePageTags(
			fullPath,
			FILES['Volk/Lateralen/Conius/index.md'],
			createContext(FILES)
		);

		expect(result.tags.map((tag) => tag.text)).toEqual(['Conius', 'Lateralen', 'Volk']);
	});

	test('a folder without an index page is not a tag folder', () => {
		const fullPath = path.join(ROOT, 'Volk/Lateralen/Sodili/index.md');
		const result = resolvePageTags(fullPath, '# Sodili\n', createContext(FILES));

		expect(result.tags.map((tag) => tag.text)).toEqual(['Sodili', 'Lateralen']);
	});

	test('collects hook warnings and resolver warnings together', () => {
		const fullPath = path.join(ROOT, 'Volk/Lateralen/Conius/Kultur.md');
		const markdown = '# Kultur\n<!-- tags: inherit=1 -->\n';
		const result = resolvePageTags(fullPath, markdown, createContext(FILES));

		expect(result.warnings).toHaveLength(2);
	});

	test('handles a page directly in the content root', () => {
		const result = resolvePageTags(
			path.join(ROOT, 'Charaktere.md'),
			'# Charaktere\n',
			createContext({})
		);

		expect(result.tags).toEqual([{ text: 'Charaktere', source: 'name' }]);
	});
});
