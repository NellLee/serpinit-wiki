// Crawls the public Notion FAQ site (prompt-faqs.notion.site) through the page API that its own web pages call.
// Raw API answers are cached in <outDir>/api, so a re-run sends no request for pages fetched before.
// Writes one self-contained file per page to <outDir>/pages.
// Usage: node .claude/skills/midjourney/tools/notion-crawl.mjs [outDir]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const HOST = 'https://prompt-faqs.notion.site';
const TOP = '280024c0-a17e-81af-a91e-e20a41077f85'; // "Midjourney FAQs • Guides • Tutorials"
const DELAY_MS = 1500;
const outDir = process.argv[2] ?? '.claude/skills/midjourney/archive/raw/notion';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const val = (rec) => rec?.value?.value ?? rec?.value ?? null;

async function api(name, body) {
	const file = path.join(outDir, 'api', name + '.json');
	try {
		return JSON.parse(await readFile(file, 'utf8'));
	} catch {
		// not cached yet
	}
	await sleep(DELAY_MS);
	const res = await fetch(HOST + '/api/v3/loadPageChunk', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`Notion answered ${res.status} for ${name}`);
	const json = await res.json();
	await writeFile(file, JSON.stringify(json));
	return json;
}

async function loadPage(id) {
	const blocks = {};
	let cursor = { stack: [] };
	for (let n = 0; n < 6; n++) {
		const d = await api(`pg_${id}_${n}`, {
			page: { id },
			limit: 300,
			cursor,
			chunkNumber: n,
			verticalColumns: false
		});
		Object.assign(blocks, d.recordMap?.block ?? {});
		cursor = d.cursor ?? { stack: [] };
		if (!cursor.stack?.length) break;
	}
	return blocks;
}

const SKIP_TITLE = /^Russian Translation/i; // translated copies, not needed
const titleOf = (v) => (v.properties?.title ?? []).map((s) => s[0]).join('');

async function syncBlocks(name, ids, spaceId) {
	const file = path.join(outDir, 'api', name + '.json');
	let json;
	try {
		json = JSON.parse(await readFile(file, 'utf8'));
	} catch {
		await sleep(DELAY_MS);
		const res = await fetch(HOST + '/api/v3/syncRecordValuesMain', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				requests: ids.map((id) => ({ pointer: { table: 'block', id, spaceId }, version: -1 }))
			})
		});
		if (!res.ok) throw new Error(`Notion answered ${res.status} for ${name}`);
		json = await res.json();
		await writeFile(file, JSON.stringify(json));
	}
	return json.recordMap?.block ?? {};
}

// A page load leaves the children of collapsed toggles out. Fetch them until nothing reachable is missing.
async function fillMissing(pageId, blocks) {
	const tried = new Set();
	const spaceId = blocks[pageId]?.spaceId ?? '839bc13f-c545-40f7-b18f-97f19b99163b';
	for (let round = 0; round < 12; round++) {
		const missing = new Set();
		const walk = (id, isRoot) => {
			const v = val(blocks[id]);
			if (!v?.type || (v.type === 'page' && !isRoot) || v.type === 'alias') return;
			if (SKIP_TITLE.test(titleOf(v))) return;
			for (const c of v.content ?? []) {
				if (blocks[c]) walk(c, false);
				else if (!tried.has(c)) missing.add(c);
			}
		};
		walk(pageId, true);
		if (!missing.size) return;
		const ids = [...missing];
		ids.forEach((i) => tried.add(i));
		for (let i = 0; i < ids.length; i += 50) {
			Object.assign(
				blocks,
				await syncBlocks(`sync_${pageId}_${round}_${i / 50}`, ids.slice(i, i + 50), spaceId)
			);
		}
	}
}

// The blocks that belong to one page, plus the child pages and alias targets it links to.
function collect(pageId, blocks) {
	const root = val(blocks[pageId]);
	if (!root?.type) return null;
	const mine = { [pageId]: root };
	const kids = [];
	const walk = (id) => {
		const v = val(blocks[id]);
		if (!v?.type) return;
		mine[id] = v;
		if (SKIP_TITLE.test(titleOf(v))) return;
		if (v.type === 'page') {
			kids.push(id);
			return;
		}
		if (v.type === 'alias') {
			const target = v.format?.alias_pointer?.id;
			if (target) {
				kids.push(target);
				const tv = val(blocks[target]);
				if (tv?.type === 'page') mine[target] = tv;
			}
			return;
		}
		for (const c of v.content ?? []) walk(c);
	};
	for (const c of root.content ?? []) walk(c);
	return { root, mine, kids };
}

await mkdir(path.join(outDir, 'api'), { recursive: true });
await mkdir(path.join(outDir, 'pages'), { recursive: true });

const seen = new Set();
const skipped = [];
const queue = [TOP];
let written = 0;
while (queue.length) {
	const id = queue.shift();
	if (seen.has(id)) continue;
	seen.add(id);
	const blocks = await loadPage(id);
	await fillMissing(id, blocks);
	const c = collect(id, blocks);
	if (!c) {
		skipped.push(id);
		continue;
	}
	const title = (c.root.properties?.title ?? []).map((s) => s[0]).join('');
	await writeFile(
		path.join(outDir, 'pages', id + '.json'),
		JSON.stringify({
			id,
			parent: c.root.parent_id,
			title,
			props: c.root.properties ?? {},
			blocks: c.mine
		})
	);
	written++;
	for (const k of c.kids) if (!seen.has(k)) queue.push(k);
}
console.log(`Notion crawl: ${written} pages written, ${skipped.length} without access skipped.`);
