// Turns the raw Discord and Notion exports into readable Markdown files plus an index.
// Input:  <archive>/raw/discord/*.json (browser export), <archive>/raw/notion/pages/*.json (notion-crawl.mjs)
// Output: <archive>/md/discord/*.md, <archive>/md/notion/*.md, <archive>/md/index.md, <archive>/md/index.json
// Usage:  node .claude/skills/midjourney/tools/build-archive.mjs [archiveDir]
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.argv[2] ?? '.claude/skills/midjourney/archive';
const out = path.join(root, 'md');

const slug = (t) =>
	t
		.normalize('NFKD')
		.replace(/\p{M}/gu, '')
		.replace(/\p{Extended_Pictographic}/gu, '')
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase()
		.slice(0, 60) || 'untitled';
const front = (o) =>
	'---\n' +
	Object.entries(o)
		.map(([k, v]) => `${k}: ${JSON.stringify(v ?? null)}`)
		.join('\n') +
	'\n---\n\n';
const squash = (s) => s.replace(/\n{3,}/g, '\n\n').trim() + '\n';
const fileName = (u) => {
	try {
		const last = decodeURIComponent(new URL(u).pathname.split('/').pop() ?? '');
		return last.includes(':') ? last.split(':').pop() : last;
	} catch {
		return String(u).slice(0, 80);
	}
};
const versionsOf = (t) => {
	const v = new Set();
	for (const m of t.matchAll(/(?:\bv|--v\s?)\s?(\d(?:\.\d)?)/gi)) v.add('V' + m[1]);
	return [...v];
};

// ---------- Discord ----------

const KIND = /^[\p{Extended_Pictographic}️‍\s ]+/u;
const isSystem = (t) => /hat den Post-Titel zu .* geändert/.test(t);
const isBoilerplate = (t) => /What do you think of this FAQ\?|^Have a discovery\?/i.test(t);

function renderDiscord(post) {
	const lines = [];
	const dropped = { system: 0, bump: 0, boilerplate: 0 };
	let guideChars = 0;
	let communityChars = 0;
	let kept = 0;
	let lastKey = null;
	let lastDay = null;
	const roleOf = new Map();
	for (const m of post.messages) {
		const text = m.text ?? '';
		const media =
			(m.images?.length ?? 0) +
			(m.videos?.length ?? 0) +
			(m.files?.length ?? 0) +
			(m.embeds?.length ?? 0);
		if (isSystem(text)) {
			dropped.system++;
			continue;
		}
		if (!media && text && !/[\p{L}\p{N}]/u.test(text) && text.length <= 12) {
			dropped.bump++;
			continue;
		}
		if (text && isBoilerplate(text)) {
			dropped.boilerplate++;
			continue;
		}
		if (!text && !media) continue;
		const author = (m.author ?? '').split('\n')[0].trim();
		if (m.header && !m.authorInferred) roleOf.set(author, /\bGuide\b/.test(m.header));
		const guide = roleOf.get(author) ?? false;
		const day = (m.time ?? '').slice(0, 10);
		const key = (guide ? 'G:' : 'C:') + author;
		if (key !== lastKey || day !== lastDay) {
			lines.push(`**${guide ? '[Guide] ' : ''}${author}** · ${day}`, '');
			lastKey = key;
			lastDay = day;
		}
		if (m.replyTo) lines.push('> ↩ ' + m.replyTo.replace(/\s+/g, ' '), '');
		if (text) {
			lines.push(text, '');
			if (guide) guideChars += text.length;
			else communityChars += text.length;
		}
		if (m.images?.length)
			lines.push(`[images: ${m.images.map((i) => fileName(i.name)).join(', ')}]`, '');
		if (m.videos?.length)
			lines.push(`[videos: ${m.videos.map((v) => fileName(v.name)).join(', ')}]`, '');
		if (m.files?.length)
			lines.push(`[files: ${m.files.map((f) => fileName(f.name)).join(', ')}]`, '');
		for (const e of m.embeds ?? [])
			lines.push(
				`[embed: ${e.text.split('\n').slice(0, 2).join(' | ')}${e.links[0] ? ' — ' + e.links[0] : ''}]`,
				''
			);
		kept++;
	}
	return {
		body: squash(lines.join('\n')),
		dropped,
		guideChars,
		communityChars,
		kept
	};
}

// ---------- Notion ----------

const wrap = (t, mark) => {
	const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(t);
	return m[2] ? m[1] + mark + m[2] + mark + m[3] : t;
};

function rich(segs, ctx) {
	return (segs ?? [])
		.map(([text, fmts = []]) => {
			const has = (k) => fmts.find((f) => f[0] === k);
			if (text === '‣') {
				const p = has('p');
				if (p) return `[[${ctx.title(p[1]) || 'page'}]]`;
				const d = has('d');
				if (d) return d[1]?.start_date ?? '';
				return has('u') ? '@user' : '';
			}
			let t = text;
			if (has('c')) t = wrap(t, '`');
			if (has('b')) t = wrap(t, '**');
			if (has('i')) t = wrap(t, '*');
			if (has('s')) t = wrap(t, '~~');
			const a = has('a');
			if (a && t.trim()) t = t.trim() === a[1] ? a[1] : `[${t.trim()}](${a[1]})`;
			return t;
		})
		.join('');
}

function block(id, ctx, depth) {
	const b = ctx.blocks[id];
	if (!b) return [];
	const text = rich(b.properties?.title, ctx).trim();
	const ind = '  '.repeat(depth);
	const kids = (d) => (b.content ?? []).flatMap((c) => block(c, ctx, d));
	switch (b.type) {
		case 'header':
			return ['', '## ' + text, '', ...kids(depth)];
		case 'sub_header':
			return ['', '### ' + text, '', ...kids(depth)];
		case 'sub_sub_header':
			return ['', '#### ' + text, '', ...kids(depth)];
		case 'header_4':
			return ['', '##### ' + text, '', ...kids(depth)];
		case 'text':
			return [text, '', ...kids(depth)];
		case 'bulleted_list':
			return [ind + '- ' + text, ...kids(depth + 1)];
		case 'numbered_list':
			return [ind + '1. ' + text, ...kids(depth + 1)];
		case 'to_do':
			return [
				ind + (b.properties?.checked?.[0]?.[0] === 'Yes' ? '- [x] ' : '- [ ] ') + text,
				...kids(depth + 1)
			];
		case 'toggle':
			return [ind + '- ▸ ' + text, ...kids(depth + 1)];
		case 'quote':
			return ['> ' + text, '', ...kids(depth)];
		case 'callout': {
			const icon =
				typeof b.format?.page_icon === 'string' && b.format.page_icon.length <= 4
					? b.format.page_icon + ' '
					: '';
			let inner = [icon + text, ...kids(0)];
			while (inner.length && !inner[0].trim()) inner.shift();
			while (inner.length && !inner.at(-1).trim()) inner.pop();
			inner = inner.filter((l, i) => l.trim() || (inner[i - 1] ?? '').trim());
			return ['', ...inner.map((l) => (l ? '> ' + l : '>')), ''];
		}
		case 'code': {
			const lang = (b.properties?.language?.[0]?.[0] ?? '').toLowerCase().replace('plain text', '');
			const raw = (b.properties?.title ?? []).map((s) => s[0]).join('');
			return ['', '```' + lang, raw, '```', ''];
		}
		case 'divider':
			return ['', '---', ''];
		case 'image': {
			const src = b.properties?.source?.[0]?.[0] ?? b.format?.display_source ?? '';
			const cap = rich(b.properties?.caption, ctx).trim();
			return [`[image: ${[cap, src ? fileName(src) : ''].filter(Boolean).join(' — ')}]`, ''];
		}
		case 'table': {
			const cols = b.format?.table_block_column_order ?? [];
			const rows = (b.content ?? []).map((rid) =>
				cols.map((c) =>
					rich(ctx.blocks[rid]?.properties?.[c], ctx)
						.replace(/\|/g, '\\|')
						.replace(/\n/g, ' ')
						.trim()
				)
			);
			if (!rows.length) return [];
			return [
				'',
				'| ' + rows[0].join(' | ') + ' |',
				'| ' + rows[0].map(() => '---').join(' | ') + ' |',
				...rows.slice(1).map((r) => '| ' + r.join(' | ') + ' |'),
				''
			];
		}
		case 'column_list':
		case 'column':
		case 'transclusion_container':
			return kids(depth);
		case 'table_of_contents':
		case 'transclusion_reference': // synced blocks point into databases without public access
		case 'collection_view_page':
			return [];
		case 'page':
			return [ind + `- 📄 [[${ctx.title(id) || 'page'}]]`];
		case 'alias':
			return [ind + `- 📄 [[${ctx.title(b.format?.alias_pointer?.id) || 'page'}]]`];
		case 'bookmark':
		case 'embed':
		case 'video':
		case 'file':
		case 'pdf': {
			const link = b.properties?.link?.[0]?.[0] ?? b.properties?.source?.[0]?.[0] ?? '';
			return [`[${b.type}: ${text || link}${text && link ? ' — ' + link : ''}]`, ''];
		}
		default:
			ctx.skipped[b.type] = (ctx.skipped[b.type] ?? 0) + 1;
			return text ? [text, '', ...kids(depth)] : kids(depth);
	}
}

// The page properties come from a database whose schema is not public, so the values are told apart by shape.
function sniff(props) {
	const strs = new Set();
	const walk = (x) => {
		if (typeof x === 'string') strs.add(x);
		else if (Array.isArray(x)) x.forEach(walk);
	};
	Object.entries(props).forEach(([k, v]) => k !== 'title' && walk(v));
	const meta = {
		discord_thread: null,
		versions: [],
		type: null,
		status: null,
		confidence: null,
		review: null,
		language: null,
		platform: null,
		other: []
	};
	for (const s of strs) {
		const link = /discord\.com\/channels\/\d+\/(?:\d+\/threads\/)?(\d+)/.exec(s);
		if (link) meta.discord_thread = link[1];
		else if (/^https?:\/\//.test(s)) continue;
		else if (/^(All Versions|V\d(\.\d)?(,\s*V\d(\.\d)?)*)$/.test(s))
			meta.versions = s.split(',').map((v) => v.trim());
		else if (/sure|close but|needs more review/i.test(s)) meta.confidence = s;
		else if (/^(Tutorial|Command|Parameter|Guide)$/.test(s)) meta.type = s;
		else if (/^(Completed|In progress|Not started)$/.test(s)) meta.status = s;
		else if (/Ready for Review/.test(s)) meta.review = s;
		else if (/^(English|Russian|Spanish)(,.*)?$/.test(s)) meta.language = s;
		else if (/^(Both|Discord|Web)$/.test(s)) meta.platform = s;
		else if (/^[0-9a-f]{8}-[0-9a-f]{4}-/.test(s)) continue;
		else if (s.length > 1 && s !== '‣') meta.other.push(s);
	}
	return meta;
}

// ---------- main ----------

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'discord'), { recursive: true });
await mkdir(path.join(out, 'notion'), { recursive: true });

// Notion pages first, so Discord posts can point to their counterpart.
const pageDir = path.join(root, 'raw/notion/pages');
const pages = [];
for (const f of await readdir(pageDir))
	pages.push(JSON.parse(await readFile(path.join(pageDir, f), 'utf8')));
const titles = new Map(pages.map((p) => [p.id, p.title]));
const notionByThread = new Map();
const notionEntries = [];
const notionOut = [];
const usedSlugs = new Set();
const skipped = {};
for (const p of pages) {
	const ctx = {
		blocks: p.blocks,
		title: (id) => titles.get(id) ?? '',
		skipped
	};
	const rootBlock = p.blocks[p.id];
	const body = squash((rootBlock.content ?? []).flatMap((c) => block(c, ctx, 0)).join('\n'));
	if (!p.title.trim() && body.trim().length < 2) continue;
	const meta = sniff(p.props);
	let name = 'n-' + slug(p.title);
	if (usedSlugs.has(name)) name += '-' + p.id.slice(0, 4);
	usedSlugs.add(name);
	const entry = {
		source: 'notion',
		file: `notion/${name}.md`,
		title: p.title.trim(),
		chars: body.length,
		versions: meta.versions,
		type: meta.type,
		discordThread: meta.discord_thread
	};
	notionEntries.push(entry);
	if (meta.discord_thread)
		notionByThread.set(meta.discord_thread, [
			...(notionByThread.get(meta.discord_thread) ?? []),
			entry
		]);
	notionOut.push({
		entry,
		meta,
		url: 'https://prompt-faqs.notion.site/' + p.id.replace(/-/g, ''),
		body
	});
}

// Discord posts: the same post can sit in several export files, the fullest copy wins.
const rawDir = path.join(root, 'raw/discord');
const posts = new Map();
for (const f of (await readdir(rawDir)).filter((n) => n !== 'index.json')) {
	for (const p of JSON.parse(await readFile(path.join(rawDir, f), 'utf8')).posts) {
		if (!posts.has(p.id) || posts.get(p.id).messages.length < p.messages.length) posts.set(p.id, p);
	}
}
const discordEntries = [];
for (const p of [...posts.values()].sort((a, b) => a.order - b.order)) {
	const kind = p.title.match(KIND)?.[0].replace(/[\s ]/g, '') ?? '';
	const title = p.title.replace(KIND, '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
	const r = renderDiscord(p);
	const counterparts = notionByThread.get(p.id) ?? [];
	const name = `d${String(p.order).padStart(3, '0')}-${slug(title)}`;
	const entry = {
		source: 'discord',
		file: `discord/${name}.md`,
		order: p.order,
		kind,
		title,
		messages: r.kept,
		guideChars: r.guideChars,
		communityChars: r.communityChars,
		versions: versionsOf(title),
		notion: counterparts.map((c) => c.file),
		flags: p.flags
	};
	discordEntries.push(entry);
	for (const c of counterparts) (c.discord ??= []).push(entry.file);
	await writeFile(
		path.join(out, entry.file),
		front({
			source: 'discord',
			title,
			kind,
			url: 'https://discord.com' + p.path,
			list_order: p.order,
			versions: entry.versions,
			messages_kept: r.kept,
			messages_total: p.got,
			dropped: r.dropped,
			guide_chars: r.guideChars,
			community_chars: r.communityChars,
			notion: entry.notion,
			flags: p.flags
		}) +
			`# ${title}\n\n` +
			r.body
	);
}

for (const { entry, meta, url, body } of notionOut) {
	await writeFile(
		path.join(out, entry.file),
		front({
			source: 'notion',
			title: entry.title,
			url,
			versions: meta.versions,
			type: meta.type,
			status: meta.status,
			confidence: meta.confidence,
			language: meta.language,
			discord_thread: meta.discord_thread,
			discord_posts: entry.discord ?? [],
			other_properties: meta.other
		}) +
			`# ${entry.title}\n\n` +
			body
	);
}

// Index
const excluded = JSON.parse(await readFile(path.join(rawDir, 'index.json'), 'utf8'))
	.posts.filter((p) => /archived/i.test(p.label))
	.map((p) => p.label.replace(/^Post\s+/, '').replace(/,\s*\d+\s+Nachrichten?$/, ''));
const row = (cells) => '| ' + cells.join(' | ') + ' |';
const kb = (n) => (n / 1000).toFixed(1) + 'k';
const md = [
	'# Archive index (generated by build-archive.mjs)',
	'',
	`Discord posts: ${discordEntries.length}. Notion pages: ${notionEntries.length}. Pairs linked by the Notion page's Discord link: ${discordEntries.filter((d) => d.notion.length).length}.`,
	'The Notion FAQ is the maintained, current-version source. The Discord posts are the older, longer archive with community Q&A.',
	'',
	'## Notion pages',
	'',
	row(['file', 'title', 'versions', 'type', 'chars', 'discord copy']),
	row(['---', '---', '---', '---', '---', '---']),
	...notionEntries
		.sort((a, b) => a.title.localeCompare(b.title))
		.map((n) =>
			row([
				n.file,
				n.title,
				n.versions.join(', ') || '-',
				n.type ?? '-',
				kb(n.chars),
				n.discord?.join(', ') ?? '-'
			])
		),
	'',
	'## Discord posts',
	'',
	row([
		'file',
		'kind',
		'title',
		'versions in title',
		'messages',
		'guide chars',
		'community chars',
		'notion counterpart'
	]),
	row(['---', '---', '---', '---', '---', '---', '---', '---']),
	...discordEntries.map((d) =>
		row([
			d.file,
			d.kind || '-',
			d.title.replace(/\|/g, '/'),
			d.versions.join(', ') || '-',
			d.messages,
			kb(d.guideChars),
			kb(d.communityChars),
			d.notion.join(', ') || '-'
		])
	),
	'',
	'## Left out on purpose',
	'',
	'Archived Discord posts (marked in the title): ' + excluded.join('; ') + '.',
	'Notion sub-pages without public access (private examples and synced blocks).'
].join('\n');
await writeFile(path.join(out, 'index.md'), md + '\n');
await writeFile(
	path.join(out, 'index.json'),
	JSON.stringify({ discord: discordEntries, notion: notionEntries, excluded }, null, 1)
);
console.log(
	`Archive built: ${discordEntries.length} Discord posts, ${notionEntries.length} Notion pages. Unhandled Notion block types:`,
	skipped
);
