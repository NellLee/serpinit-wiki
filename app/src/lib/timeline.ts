import fs from 'fs';
import path from 'path';
import { FileLink } from './fileLink';
import { getFilePathsInFolder } from './utilities/files';
import { isStructuralLine } from './markdownRenderHooks';
import { TIMELINE_CATEGORIES } from './timelineCategories';
import { WIKI_PATH } from './wiki';

const REGEX_EVENT_HOOK = /^\s*<!--\s*event:(?<attrs>.*?)-->\s*$/i;
const REGEX_ATTR = /(\w+)="([^"]*)"|(\w+)=(\S+)|(\w+)/g;
const REGEX_MARKDOWN_LINK = /\[([^\]]*)\]\([^)]*\)/g;

let initialized = false;

export let timeline: Timeline = [];

export async function initTimeline() {
	if (!initialized) {
		console.log('Initializing timeline');
		timeline = scrapeTimelineEvents();
		initialized = true;
	}
}

function scrapeTimelineEvents(): TimelineEvent[] {
	const events: TimelineEvent[] = [];
	const files = getFilePathsInFolder(WIKI_PATH, ['.md']);

	for (const file of files) {
		const fullPath = path.resolve(WIKI_PATH, file.substring(1));
		const raw = fs.readFileSync(fullPath, 'utf-8');

		if (!raw.includes('<!-- event:') && !raw.includes('<!--event:')) {
			continue;
		}

		const href = new FileLink(fullPath).href;
		events.push(...extractEventsFromRawMarkdown(raw, href));
	}

	return events;
}

function parseAttrs(attrs: string): Record<string, string | true> {
	const result: Record<string, string | true> = {};
	let match: RegExpExecArray | null;
	REGEX_ATTR.lastIndex = 0;
	while ((match = REGEX_ATTR.exec(attrs))) {
		if (match[1] !== undefined) {
			result[match[1]] = match[2];
		} else if (match[3] !== undefined) {
			result[match[3]] = match[4];
		} else if (match[5] !== undefined) {
			result[match[5]] = true;
		}
	}
	return result;
}

function captureFollowingParagraph(lines: string[], startIndex: number): string | undefined {
	let cursor = startIndex;
	while (cursor < lines.length && lines[cursor].trim() === '') {
		cursor++;
	}

	if (cursor >= lines.length || isStructuralLine(lines[cursor]) || lines[cursor].trim() === '') {
		return undefined;
	}

	const collected: string[] = [];
	while (cursor < lines.length && lines[cursor].trim() !== '' && !isStructuralLine(lines[cursor])) {
		collected.push(lines[cursor].trim());
		cursor++;
	}

	if (collected.length === 0) {
		return undefined;
	}

	return collected
		.join(' ')
		.replace(REGEX_MARKDOWN_LINK, '$1')
		.trim();
}

export function extractEventsFromRawMarkdown(raw: string, href: string): TimelineEvent[] {
	const lines = raw.split(/\r?\n/);
	const results: TimelineEvent[] = [];

	for (let index = 0; index < lines.length; index++) {
		const hookMatch = lines[index].match(REGEX_EVENT_HOOK);
		if (!hookMatch) {
			continue;
		}

		const attrs = parseAttrs(hookMatch.groups?.attrs ?? '');
		const start = attrs.start !== undefined ? Number(attrs.start) : NaN;
		const text = typeof attrs.text === 'string' ? attrs.text : undefined;
		const category = typeof attrs.category === 'string' ? attrs.category : undefined;

		if (Number.isNaN(start) || !text || !category) {
			console.warn(`Skipping malformed event hook in "${href}": ${lines[index].trim()}`);
			continue;
		}

		const end = attrs.end !== undefined ? Number(attrs.end) : start;
		const categoryObj = TIMELINE_CATEGORIES.find((c) => c.name === category) ?? null;
		if (!categoryObj) {
			console.warn(`Unknown timeline category "${category}" in "${href}"`);
		}

		results.push({
			start,
			end: Number.isNaN(end) ? start : end,
			text,
			fuzzy_start: Boolean(attrs.fuzzy) || Boolean(attrs.fuzzy_start),
			fuzzy_end: Boolean(attrs.fuzzy) || Boolean(attrs.fuzzy_end),
			category: categoryObj,
			href,
			description: captureFollowingParagraph(lines, index + 1)
		});
	}

	return results;
}
