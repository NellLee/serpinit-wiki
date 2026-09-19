import { describe, expect, test } from 'vitest';
import { generateBreadcrumbs } from './links';

describe('generateBreadcrumbs', () => {
	test('marks the tag folders in the path', () => {
		const breadcrumbs = generateBreadcrumbs('/content/Volk/Lateralen/Conius/index.md');

		expect(breadcrumbs.map((crumb) => [crumb.text, crumb.tagFolder])).toEqual([
			['Home', false],
			['Volk', true],
			['Lateralen', true],
			['Conius', false]
		]);
	});

	test('a folder without a folder-tag hook is not a tag folder', () => {
		const breadcrumbs = generateBreadcrumbs('/content/Allgemein/Magie/index.md');

		expect(breadcrumbs.every((crumb) => crumb.tagFolder === false)).toBe(true);
	});

	test('keeps the folder hrefs and drops the page itself', () => {
		const breadcrumbs = generateBreadcrumbs('/content/Volk/Vorenkai/Blutrituale.md');

		expect(breadcrumbs.map((crumb) => crumb.href)).toEqual([
			'/content',
			'/content/Volk',
			'/content/Volk/Vorenkai'
		]);
	});
});
