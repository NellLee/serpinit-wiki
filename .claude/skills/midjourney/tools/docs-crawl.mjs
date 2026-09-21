// Downloads the article list of the official Midjourney help center (docs.midjourney.com) through its public Zendesk API.
// The site refuses requests without a browser user agent. Two requests fetch all articles.
// Usage: node .claude/skills/midjourney/tools/docs-crawl.mjs [outDir]
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const outDir = process.argv[2] ?? '.claude/skills/midjourney/archive/raw/docs';
const UA = 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await mkdir(outDir, { recursive: true });
let url = 'https://docs.midjourney.com/api/v2/help_center/en-us/articles.json?per_page=100&page=1';
let page = 0;
let articles = 0;
while (url) {
	page++;
	const res = await fetch(url, { headers: { 'user-agent': UA } });
	if (!res.ok) throw new Error(`docs.midjourney.com answered ${res.status} for ${url}`);
	const json = await res.json();
	await writeFile(path.join(outDir, `articles-${page}.json`), JSON.stringify(json));
	articles += json.articles.length;
	url = json.next_page;
	if (url) await sleep(1500);
}
console.log(`Docs crawl: ${articles} articles in ${page} pages.`);
