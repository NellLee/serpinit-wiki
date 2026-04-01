import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { getContentPagePresentation, getUtilityPagePresentation } from './pagePresentation';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

describe('pagePresentation', () => {
	test('classifies content routes by page type', () => {
		expect(getContentPagePresentation('/content')).toEqual({
			pageClass: 'hub',
			showToc: false,
			showContextRail: false,
			contentWidth: 'wide',
			emphasizeOverview: true
		});

		expect(getContentPagePresentation('/content/atlas/index.md')).toEqual({
			pageClass: 'index',
			showToc: false,
			showContextRail: true,
			contentWidth: 'wide',
			emphasizeOverview: true
		});

		expect(getContentPagePresentation('/content/atlas/notes.md')).toEqual({
			pageClass: 'article',
			showToc: true,
			showContextRail: true,
			contentWidth: 'standard',
			emphasizeOverview: false
		});

		expect(getContentPagePresentation('/content/images/gallery/index.md')).toEqual({
			pageClass: 'media',
			showToc: false,
			showContextRail: false,
			contentWidth: 'wide',
			emphasizeOverview: true
		});

		expect(getContentPagePresentation('/content/atlas/images/diagram.md')).toEqual({
			pageClass: 'article',
			showToc: true,
			showContextRail: true,
			contentWidth: 'standard',
			emphasizeOverview: false
		});

		expect(getContentPagePresentation('/content/atlas/media/index.md')).toEqual({
			pageClass: 'index',
			showToc: false,
			showContextRail: true,
			contentWidth: 'wide',
			emphasizeOverview: true
		});
	});

	test('classifies utility routes', () => {
		expect(getUtilityPagePresentation('search')).toEqual({
			pageClass: 'utility',
			showToc: false,
			showContextRail: false,
			contentWidth: 'wide',
			emphasizeOverview: false
		});

		expect(getUtilityPagePresentation('timeline')).toEqual({
			pageClass: 'utility',
			showToc: false,
			showContextRail: true,
			contentWidth: 'wide',
			emphasizeOverview: false
		});

		expect(getUtilityPagePresentation('convert')).toEqual({
			pageClass: 'utility',
			showToc: false,
			showContextRail: false,
			contentWidth: 'standard',
			emphasizeOverview: false
		});
	});

	test('wires presentation helpers into route loaders', () => {
		const searchRouteSource = readAppFile('src/routes/content/search/+page.server.ts');
		expect(searchRouteSource).toMatch(/getUtilityPagePresentation/);
		expect(searchRouteSource).toMatch(/presentation:\s*getUtilityPagePresentation\(["']search["']\)/);

		const timelineRouteSource = readAppFile('src/routes/content/timeline/+page.server.ts');
		expect(timelineRouteSource).toMatch(/getUtilityPagePresentation/);
		expect(timelineRouteSource).toMatch(/presentation:\s*getUtilityPagePresentation\(["']timeline["']\)/);

		const convertRoutePath = path.resolve(APP_ROOT, 'src/routes/convert/+page.ts');
		expect(fs.existsSync(convertRoutePath)).toBe(true);

		const convertRouteSource = fs.readFileSync(convertRoutePath, 'utf8');
		expect(convertRouteSource).toMatch(/getUtilityPagePresentation/);
		expect(convertRouteSource).toMatch(/presentation:\s*getUtilityPagePresentation\(["']convert["']\)/);
	});
});
