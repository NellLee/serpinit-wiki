import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { getHomepageData } from './homepage';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

describe('homepage', () => {
	test('returns the expected homepage section structure', () => {
		const homepageData = getHomepageData();

		expect(homepageData.primaryBrowse.length).toBe(4);
		expect(homepageData.utilityLinks.length).toBe(3);
		expect(homepageData.stats.length).toBe(0);
		expect(homepageData.utilityLinks.map((item) => item.title)).toEqual([
			'Zeitleiste',
			'Suche',
			'Umrechner'
		]);

		for (const item of homepageData.primaryBrowse) {
			expect(item.href.startsWith('/content/')).toBe(true);
			expect(item.title.length > 0).toBe(true);
			expect(item.description.length > 0).toBe(true);
		}

		for (const item of homepageData.utilityLinks) {
			expect(item.href.length > 0).toBe(true);
			expect(item.title.length > 0).toBe(true);
			expect(item.description.length > 0).toBe(true);
		}
	});

	test('keeps homepage routes and supporting stubs wired correctly', () => {
		const homepageServerRouteSource = readAppFile('src/routes/content/+page.server.ts');
		expect(homepageServerRouteSource).toMatch(/getHomepageData/);
		expect(homepageServerRouteSource).toMatch(/getContentPagePresentation\(['"]content['"]\)/);

		const homepageRouteSource = readAppFile('src/routes/content/+page.svelte');
		expect(homepageRouteSource).toMatch(/primaryBrowse/);
		expect(homepageRouteSource).toMatch(/utilityLinks/);
		expect(homepageRouteSource).not.toMatch(/featuredSections/);
		expect(homepageRouteSource).not.toMatch(/quickLinks/);
		expect(homepageRouteSource).not.toMatch(/homepage\.stats/);

		const contentCardSource = readAppFile('src/lib/components/ContentCard.svelte');
		expect(contentCardSource).toMatch(/font-size:\s*clamp\(2\.1rem,\s*3\.2vw,\s*3rem\)/);

		const allgemeinStubPath = path.resolve(APP_ROOT, '../content/Allgemein/index.md');
		expect(fs.existsSync(allgemeinStubPath)).toBe(true);

		const charaktereStubPath = path.resolve(APP_ROOT, '../content/Charaktere.md');
		expect(fs.existsSync(charaktereStubPath)).toBe(true);
	});
});
