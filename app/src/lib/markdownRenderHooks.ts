const REGEX_OVERVIEW_HOOK = /^\s*<!--\s*layout:\s*overview\s*-->\s*$/i;
const REGEX_FOLDER_INDEX_HOOK = /^\s*<!--\s*render:\s*folder-index\s*-->\s*$/gim;
const REGEX_GALLERY_HOOK = /^\s*<!--\s*render:\s*gallery\s*-->\s*$/gim;
const REGEX_CALLOUT_HOOK = /^\s*<!--\s*callout:\s*(note|todo|maybe)\s*-->\s*$/i;
const REGEX_CARD_LINK_HOOK = /^\s*<!--\s*display:\s*card-link(?<attrs>.*?)-->\s*$/i;
const REGEX_MARKDOWN_IMAGE_LINK = /^\s*\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)\s*$/;
const REGEX_TABLE_LINE = /^\s*\|.*\|\s*$/;
const REGEX_TABLE_SEPARATOR = /^\s*\|?[\s:-]+\|[\s|:-]*$/;
const REGEX_IMAGE = /^\s*!\[[^\]]*\]\([^)]+\)\s*$/;
const REGEX_LIST = /^\s*(?:[-+*]|\d+\.)\s+/;
const REGEX_BLOCKQUOTE = /^\s*>\s?/;
const REGEX_HEADING = /^\s*#{1,6}\s+/;
const REGEX_HTML = /^\s*<[^>]+>\s*$/;

function isOverviewContentLine(line: string) {
	const trimmed = line.trim();
	if (trimmed === '') {
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
		while (cursor < lines.length && lines[cursor].trim() === '') {
			cursor++;
		}

		const overviewLines: string[] = [];
		while (cursor < lines.length) {
			const currentLine = lines[cursor];

			if (
				overviewLines.length > 0 &&
				currentLine.trim() !== '' &&
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

		while (overviewLines.length > 0 && overviewLines.at(-1)?.trim() === '') {
			overviewLines.pop();
		}

		output.push(':::overview', '', ...overviewLines, ':::');
		index = cursor - 1;
	}

	return output.join('\n');
}

function normalizeBlockquoteLine(line: string) {
	return line.replace(/^\s*>\s?/, '');
}

function transformCalloutHooks(markdown: string) {
	const lines = markdown.split(/\r?\n/);
	const output: string[] = [];

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		const hookMatch = line.match(REGEX_CALLOUT_HOOK);

		if (!hookMatch) {
			output.push(line);
			continue;
		}

		const calloutType = hookMatch[1].toLowerCase();
		let cursor = index + 1;
		while (cursor < lines.length && lines[cursor].trim() === '') {
			cursor++;
		}

		const blockquoteLines: string[] = [];
		while (cursor < lines.length && REGEX_BLOCKQUOTE.test(lines[cursor])) {
			blockquoteLines.push(normalizeBlockquoteLine(lines[cursor]));
			cursor++;
		}

		if (blockquoteLines.length === 0) {
			continue;
		}

		let content = blockquoteLines.join('\n').trim();
		const labelRegex = new RegExp(`^\\*\\*${calloutType}:\\*\\*\\s*`, 'i');
		content = content.replace(labelRegex, '').trim();

		output.push(
			`::::div{.comment}`,
			`:::div{.comment-indicator .${calloutType}}`,
			calloutType.toUpperCase(),
			`:::`,
			`:::div{.comment-content}`,
			content,
			`:::`,
			`::::`
		);

		index = cursor - 1;
	}

	return output.join('\n');
}

function transformCardLinkHooks(markdown: string) {
	const lines = markdown.split(/\r?\n/);
	const output: string[] = [];

	for (let index = 0; index < lines.length; index++) {
		const line = lines[index];
		const hookMatch = line.match(REGEX_CARD_LINK_HOOK);

		if (!hookMatch) {
			output.push(line);
			continue;
		}

		let cursor = index + 1;
		while (cursor < lines.length && lines[cursor].trim() === '') {
			cursor++;
		}

		const imageLinkMatch = lines[cursor]?.match(REGEX_MARKDOWN_IMAGE_LINK);
		if (!imageLinkMatch) {
			continue;
		}

		const [, , imgSrc, href] = imageLinkMatch;
		cursor++;
		while (cursor < lines.length && lines[cursor].trim() === '') {
			cursor++;
		}

		const text = lines[cursor]?.trim();
		if (!text) {
			continue;
		}

		const attrs = hookMatch.groups?.attrs ?? '';
		const styleMatch = attrs.match(/style="([^"]+)"/i);
		const styleAttribute = styleMatch ? ` style="${styleMatch[1]}"` : '';

		output.push(
			`<a href="${href}" class="img-link no-fancy"${styleAttribute}>`,
			`    <img src="${imgSrc}" alt="${text}"/>`,
			`    <div class="img-link-text">`,
			`        ${text}`,
			`    </div>`,
			`</a>`
		);
		index = cursor;
	}

	return output.join('\n');
}

function buildGalleryMarkup(folderHref: string, imageFiles: string[]) {
	if (imageFiles.length === 0) {
		return '';
	}

	const galleryEntries = imageFiles
		.map((filePath) => {
			const fileName = filePath.split('/').at(-1) ?? filePath;
			const imageHref = `${folderHref}/images/${fileName}`;
			const caption = fileName.replace(/\.[^.]+$/, '').replaceAll('_', ' ');

			return `:::figure{style="width: 400px;"}\n![${caption}](${imageHref})\n::figcaption[${caption}]\n:::`;
		})
		.join('\n\n');

	return `::::div{#gallery}\n${galleryEntries}\n::::`;
}

export function applyMarkdownRenderHooks(
	markdown: string,
	options: {
		folderHref?: string;
		imageFiles?: string[];
		folderIndexMarkdown?: string;
	} = {}
) {
	const transformed = transformCardLinkHooks(
		transformCalloutHooks(transformOverviewHooks(markdown))
	).replace(REGEX_FOLDER_INDEX_HOOK, options.folderIndexMarkdown ?? '');

	return transformed.replace(
		REGEX_GALLERY_HOOK,
		buildGalleryMarkup(options.folderHref ?? '', options.imageFiles ?? [])
	);
}
