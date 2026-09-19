import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, test } from 'vitest';
import { FileLink } from './fileLink';
import { resolvePageTags } from './pageTags';
import { normalizeSearchText } from './searchCore';

const CONTENT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../content');

function listMarkdownFiles(directory: string): string[] {
	const files: string[] = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...listMarkdownFiles(fullPath));
		} else if (entry.isFile() && entry.name.endsWith('.md')) {
			files.push(fullPath);
		}
	}
	return files;
}

function readFile(fullPath: string) {
	try {
		return fs.readFileSync(fullPath, 'utf-8');
	} catch {
		return '';
	}
}

describe('tag parity with the underscore rule', () => {
	test('every page resolves to the same tags as before, except the known differences', () => {
		const differences: Record<string, { removed: string[]; added: string[] }> = {};
		const warnings: string[] = [];

		for (const file of listMarkdownFiles(CONTENT_ROOT)) {
			const oldTags = new Map(
				new FileLink(file).getCategories().map((text) => [normalizeSearchText(text), text])
			);
			const resolved = resolvePageTags(file, readFile(file), {
				contentRoot: CONTENT_ROOT,
				readFile
			});
			const newTags = new Map(
				resolved.tags.map((tag) => [normalizeSearchText(tag.text), tag.text])
			);
			warnings.push(...resolved.warnings.map((warning) => `${file}: ${warning}`));

			const removed = [...oldTags].filter(([key]) => !newTags.has(key)).map(([, text]) => text);
			const added = [...newTags].filter(([key]) => !oldTags.has(key)).map(([, text]) => text);
			if (removed.length > 0 || added.length > 0) {
				differences[path.relative(CONTENT_ROOT, file).split(path.sep).join('/')] = {
					removed,
					added
				};
			}
		}

		expect(warnings).toEqual([]);
		expect(differences).toEqual({
			'Volk_/Lateralen_/Do-Uspil.md': { removed: ['Volk'], added: [] },
			'Volk_/Lateralen_/Hybridisierung.md': { removed: ['Volk'], added: [] }
		});
	});
});
