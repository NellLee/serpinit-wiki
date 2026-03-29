const REGEX_OVERVIEW_HOOK = /^\s*<!--\s*layout:\s*overview\s*-->\s*$/i;
const REGEX_FOLDER_INDEX_HOOK = /^\s*<!--\s*render:\s*folder-index\s*-->\s*$/gim;
const REGEX_TABLE_LINE = /^\s*\|.*\|\s*$/;
const REGEX_TABLE_SEPARATOR = /^\s*\|?[\s:-]+\|[\s|:-]*$/;
const REGEX_IMAGE = /^\s*!\[[^\]]*\]\([^)]+\)\s*$/;
const REGEX_LIST = /^\s*(?:[-+*]|\d+\.)\s+/;
const REGEX_BLOCKQUOTE = /^\s*>\s?/;
const REGEX_HEADING = /^\s*#{1,6}\s+/;
const REGEX_HTML = /^\s*<[^>]+>\s*$/;

function isOverviewContentLine(line: string) {
	const trimmed = line.trim();
	if (trimmed === "") {
		return true;
	}

	return (
		REGEX_IMAGE.test(line) ||
		REGEX_TABLE_LINE.test(line) ||
		REGEX_TABLE_SEPARATOR.test(line) ||
		REGEX_LIST.test(line) ||
		REGEX_BLOCKQUOTE.test(line) ||
		REGEX_HTML.test(line)
	);
}

function transformOverviewHooks(markdown: string) {
	const lines = markdown.split(/\r?\n/);
	const output: string[] = [];

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];

		if (!REGEX_OVERVIEW_HOOK.test(line)) {
			output.push(line);
			continue;
		}

		let cursor = index + 1;
		while (cursor < lines.length && lines[cursor].trim() === "") {
			cursor++;
		}

		const overviewLines: string[] = [];
		while (cursor < lines.length) {
			const currentLine = lines[cursor];

			if (
				overviewLines.length > 0 &&
				currentLine.trim() !== "" &&
				!isOverviewContentLine(currentLine)
			) {
				break;
			}

			if (REGEX_HEADING.test(currentLine)) {
				break;
			}

			overviewLines.push(currentLine);
			cursor++;
		}

		if (overviewLines.length === 0) {
			continue;
		}

		while (overviewLines.length > 0 && overviewLines.at(-1)?.trim() === "") {
			overviewLines.pop();
		}

		output.push(":::overview", "", ...overviewLines, ":::");
		index = cursor - 1;
	}

	return output.join("\n");
}

export function applyMarkdownRenderHooks(markdown: string) {
	return transformOverviewHooks(markdown).replace(REGEX_FOLDER_INDEX_HOOK, "<!-- INDEX -->");
}
