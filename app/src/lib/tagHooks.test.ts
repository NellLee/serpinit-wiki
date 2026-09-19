import { describe, expect, test } from 'vitest';
import { parseTagHooks } from './tagHooks';

describe('parseTagHooks', () => {
	test('returns empty defaults for a page without tag hooks', () => {
		const result = parseTagHooks('# Titel\n\nText.\n', { isIndexPage: false });

		expect(result).toEqual({ tags: [], inherit: 0, folderTag: false, warnings: [] });
	});

	test('parses a comma separated tags hook on line 1', () => {
		const result = parseTagHooks('<!-- tags: Diebesgilde Brauner-Ring, Schmuggler -->\n# Titel\n', {
			isIndexPage: false
		});

		expect(result.tags).toEqual(['Diebesgilde Brauner-Ring', 'Schmuggler']);
		expect(result.warnings).toEqual([]);
	});

	test('treats items with "=" as options and everything else as tags', () => {
		const result = parseTagHooks('<!-- tags: Schmuggler, inherit=1 -->\n# Titel\n', {
			isIndexPage: false
		});

		expect(result.tags).toEqual(['Schmuggler']);
		expect(result.inherit).toBe(1);
		expect(result.warnings).toEqual([]);
	});

	test('accepts a page with only options and no free tags', () => {
		const result = parseTagHooks('<!-- tags: inherit=2 -->\n# Titel\n', { isIndexPage: true });

		expect(result.tags).toEqual([]);
		expect(result.inherit).toBe(2);
		expect(result.warnings).toEqual([]);
	});

	test('warns about an unknown option and ignores it', () => {
		const result = parseTagHooks('<!-- tags: A, colour=red -->\n# Titel\n', { isIndexPage: false });

		expect(result.tags).toEqual(['A']);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toContain('colour=red');
	});

	test.each(['inherit=abc', 'inherit=-1', 'inherit=1.5', 'inherit='])(
		'warns about an invalid inherit value "%s" and keeps inherit at 0',
		(option) => {
			const result = parseTagHooks(`<!-- tags: ${option} -->\n# Titel\n`, { isIndexPage: false });

			expect(result.inherit).toBe(0);
			expect(result.warnings).toHaveLength(1);
			expect(result.warnings[0]).toContain(option);
		}
	);

	test('ignores empty list items', () => {
		const result = parseTagHooks('<!-- tags: A,, B, -->\n', { isIndexPage: false });

		expect(result.tags).toEqual(['A', 'B']);
	});

	test('recognises the folder-tag hook in an index page', () => {
		const result = parseTagHooks('<!-- folder-tag -->\n# Charaktere\n', { isIndexPage: true });

		expect(result.folderTag).toBe(true);
		expect(result.warnings).toEqual([]);
	});

	test('warns when folder-tag is used outside an index page but still applies it', () => {
		const result = parseTagHooks('<!-- folder-tag -->\n# Titel\n', { isIndexPage: false });

		expect(result.folderTag).toBe(true);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toContain('index.md');
	});

	test('accepts several hook lines and blank lines in the top block', () => {
		const markdown = '<!-- folder-tag -->\n<!-- tags: A -->\n\n<!-- tags: B -->\n\n# Titel\n';
		const result = parseTagHooks(markdown, { isIndexPage: true });

		expect(result.folderTag).toBe(true);
		expect(result.tags).toEqual(['A', 'B']);
		expect(result.warnings).toEqual([]);
	});

	test('lets other single-line comments stay inside the top block', () => {
		const markdown = '<!-- todo: Stamm klären -->\n<!-- tags: A -->\n# Titel\n';
		const result = parseTagHooks(markdown, { isIndexPage: false });

		expect(result.tags).toEqual(['A']);
		expect(result.warnings).toEqual([]);
	});

	test('warns about a tags hook below content but still applies it', () => {
		const markdown = '# Titel\n\nText.\n\n<!-- tags: Spät -->\n';
		const result = parseTagHooks(markdown, { isIndexPage: false });

		expect(result.tags).toEqual(['Spät']);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toContain('line 5');
	});

	test('warns about a folder-tag hook below content but still applies it', () => {
		const markdown = '# Titel\n<!-- folder-tag -->\n';
		const result = parseTagHooks(markdown, { isIndexPage: true });

		expect(result.folderTag).toBe(true);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toContain('line 2');
	});

	test('a multi-line comment ends the top block', () => {
		const markdown = '<!--\nNotiz\n-->\n<!-- tags: A -->\n';
		const result = parseTagHooks(markdown, { isIndexPage: false });

		expect(result.tags).toEqual(['A']);
		expect(result.warnings).toHaveLength(1);
	});

	test('warns about a misspelled tag hook instead of ignoring it silently', () => {
		const result = parseTagHooks('<!-- tag: A -->\n# Titel\n', { isIndexPage: false });

		expect(result.tags).toEqual([]);
		expect(result.warnings).toHaveLength(1);
		expect(result.warnings[0]).toContain('<!-- tag: A -->');
	});

	test('does not treat unrelated comments as tag hooks', () => {
		const markdown =
			'# Titel\n<!-- ## Anmerkungen -->\n<!-- layout: overview -->\n<!-- todo: X -->\n';
		const result = parseTagHooks(markdown, { isIndexPage: false });

		expect(result).toEqual({ tags: [], inherit: 0, folderTag: false, warnings: [] });
	});

	test('handles CRLF line endings and case-insensitive hook names', () => {
		const result = parseTagHooks('<!-- Tags: A -->\r\n# Titel\r\n', { isIndexPage: false });

		expect(result.tags).toEqual(['A']);
		expect(result.warnings).toEqual([]);
	});
});
