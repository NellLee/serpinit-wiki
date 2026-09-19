// Dependency-free on purpose: the pre-commit check imports this file directly with Node.
// Keep to erasable TypeScript (no enums, no parameter properties, no path aliases).

export type TagHooks = {
	tags: string[];
	inherit: number;
	folderTag: boolean;
};

export type TagHookParseResult = TagHooks & { warnings: string[] };

const REGEX_TAGS_HOOK = /^\s*<!--\s*tags:(?<items>.*?)-->\s*$/i;
const REGEX_FOLDER_TAG_HOOK = /^\s*<!--\s*folder-tag\s*-->\s*$/i;
const REGEX_COMMENT_LINE = /^\s*<!--.*-->\s*$/;
const REGEX_TAG_LIKE_COMMENT = /^\s*<!--\s*(?:tags?|folder[-_ ]?tags?|inherit)\b/i;
const REGEX_FENCE = /^\s*(```|~~~)/;
const REGEX_WHOLE_NUMBER = /^\d+$/;

export function parseTagHooks(
	markdown: string,
	options: { isIndexPage: boolean }
): TagHookParseResult {
	const result: TagHookParseResult = { tags: [], inherit: 0, folderTag: false, warnings: [] };
	const lines = markdown.split(/\r?\n/);
	let inTopBlock = true;
	let inFence = false;

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		const lineNumber = index + 1;

		if (REGEX_FENCE.test(line)) {
			inFence = !inFence;
			inTopBlock = false;
			continue;
		}
		if (inFence) {
			continue;
		}

		const isBlank = line.trim() === '';
		const isCommentLine = REGEX_COMMENT_LINE.test(line);
		if (!isBlank && !isCommentLine) {
			inTopBlock = false;
			continue;
		}

		const tagsMatch = line.match(REGEX_TAGS_HOOK);
		if (tagsMatch) {
			if (!inTopBlock) {
				result.warnings.push(
					`tags hook on line ${lineNumber} is below page content; move it into the hook block at the top of the page`
				);
			}
			applyTagItems(tagsMatch.groups?.items ?? '', lineNumber, result);
			continue;
		}

		if (REGEX_FOLDER_TAG_HOOK.test(line)) {
			if (!inTopBlock) {
				result.warnings.push(
					`folder-tag hook on line ${lineNumber} is below page content; move it into the hook block at the top of the page`
				);
			}
			if (!options.isIndexPage) {
				result.warnings.push(
					`folder-tag hook on line ${lineNumber} is only valid in an index.md, because it describes the folder`
				);
			}
			result.folderTag = true;
			continue;
		}

		if (isCommentLine && REGEX_TAG_LIKE_COMMENT.test(line)) {
			result.warnings.push(`unrecognized tag hook on line ${lineNumber}: ${line.trim()}`);
		}
	}

	return result;
}

function applyTagItems(items: string, lineNumber: number, result: TagHookParseResult) {
	for (const rawItem of items.split(',')) {
		const item = rawItem.trim();
		if (item === '') {
			continue;
		}

		const separator = item.indexOf('=');
		if (separator === -1) {
			result.tags.push(item);
			continue;
		}

		const key = item.slice(0, separator).trim().toLowerCase();
		const value = item.slice(separator + 1).trim();
		if (key !== 'inherit') {
			result.warnings.push(`unknown tags option "${item}" on line ${lineNumber}`);
			continue;
		}
		if (!REGEX_WHOLE_NUMBER.test(value)) {
			result.warnings.push(
				`invalid inherit value "${item}" on line ${lineNumber}; expected a whole number such as inherit=1`
			);
			continue;
		}
		result.inherit = Number(value);
	}
}
