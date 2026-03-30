import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getHomepageData } from './homepage';

const APP_ROOT = process.cwd();

function readAppFile(relativePath: string): string {
	return fs.readFileSync(path.resolve(APP_ROOT, relativePath), 'utf8');
}

const homepageData = getHomepageData();

assert.equal(homepageData.primaryBrowse.length >= 4, true);
assert.equal(homepageData.featuredSections.length >= 2, true);
assert.equal(homepageData.quickLinks.length >= 3, true);
assert.equal(homepageData.stats.length, 0);

assert.deepEqual(
	homepageData.primaryBrowse.map((item) => item.title),
	['Himmelskörper', 'Völker', 'Allgemein', 'Charaktere']
);

for (const item of homepageData.primaryBrowse) {
	assert.equal(item.href.startsWith('/content/'), true);
	assert.equal(item.title.length > 0, true);
	assert.equal(item.description.length > 0, true);
}

for (const section of homepageData.featuredSections) {
	assert.equal(section.items.length > 0, true);
}

const homepageServerRouteSource = readAppFile('src/routes/content/+page.server.ts');
assert.match(homepageServerRouteSource, /getHomepageData/);
assert.match(homepageServerRouteSource, /getContentPagePresentation\(['"]content['"]\)/);

const homepageRouteSource = readAppFile('src/routes/content/+page.svelte');
assert.match(homepageRouteSource, /primaryBrowse/);
assert.match(homepageRouteSource, /featuredSections/);
assert.match(homepageRouteSource, /quickLinks/);
assert.doesNotMatch(homepageRouteSource, /homepage\.stats/);

const contentCardSource = readAppFile('src/lib/components/ContentCard.svelte');
assert.match(contentCardSource, /font-size:\s*clamp\(2\.1rem,\s*3\.2vw,\s*3rem\)/);

const allgemeinStubPath = path.resolve(APP_ROOT, '../content/Allgemein/index.md');
assert.equal(fs.existsSync(allgemeinStubPath), true);

const charaktereStubPath = path.resolve(APP_ROOT, '../content/Charaktere.md');
assert.equal(fs.existsSync(charaktereStubPath), true);
