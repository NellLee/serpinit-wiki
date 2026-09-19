import path from 'path';
import { REGEX_FIRST_HEADER } from './markdownPage';
import fs from 'fs';

// During initWiki()'s one-time bulk load, the same file is read here over and over: once as
// "the page itself", again whenever it turns up as a sibling, a related index, or a mention
// in another page's constructor. Under WSL/DrvFs each fs.readFileSync carries real latency,
// so this compounds badly across ~131 pages. Caching is scoped to an explicit batch (see
// beginFileLinkBatch/endFileLinkBatch) so live single-page edits outside a batch stay fresh.
let contentCache: Map<string, string> | null = null;

export function beginFileLinkBatch() {
	contentCache = new Map();
}

export function endFileLinkBatch() {
	contentCache = null;
}

export function readContentFile(fullPath: string): string {
	if (contentCache?.has(fullPath)) {
		return contentCache.get(fullPath)!;
	}

	let content = '';
	try {
		content = fs.readFileSync(fullPath, 'utf-8');
	} catch {
		// A missing file reads as empty, like in the FileLink constructor.
	}
	contentCache?.set(fullPath, content);
	return content;
}

export class FileLink {
	href: string;
	text: string;
	descriptiveText: string;
	fileName: string;
	extension: string;
	path: string;

	constructor(fullPath: string, enforceFileExistence = false, defaultExtension = '.md') {
		const relPath = fullPath.substring(fullPath.lastIndexOf(path.sep + 'content' + path.sep) + 1);
		let content = '';
		if (contentCache?.has(fullPath)) {
			content = contentCache.get(fullPath)!;
		} else if (enforceFileExistence) {
			content = fs.readFileSync(fullPath, 'utf-8'); // no try catch
			contentCache?.set(fullPath, content);
		} else {
			try {
				content = fs.readFileSync(fullPath, 'utf-8');
			} catch {
				// Ignore missing files when existence is not required.
			}
			contentCache?.set(fullPath, content);
		}

		const lastSlash = fullPath.lastIndexOf(path.sep);

		this.path = fullPath.substring(0, lastSlash);
		const file = fullPath.substring(lastSlash + 1);
		if (fullPath.lastIndexOf('.') < lastSlash) {
			this.fileName = file;
			this.extension = defaultExtension;
		} else {
			const lastDot = file.lastIndexOf('.');
			this.fileName = file.substring(0, lastDot);
			this.extension = file.substring(lastDot + 1);
		}

		this.text = this.fileName;
		const firstHeader = REGEX_FIRST_HEADER.exec(content)?.pop();
		if (this.extension == 'md' && firstHeader) {
			this.text = firstHeader;
		} else if (this.fileName == 'index') {
			this.text = this.path.substring(this.path.lastIndexOf(path.sep) + 1);
		}

		this.href = '/' + relPath.replaceAll(path.sep, '/');

		this.descriptiveText = this.text;

		const folderNameSegment = this.href.split('/').at(-2);
		const folderName = decodeURIComponent((folderNameSegment ?? '').replaceAll('_', ' '));
		if (this.fileName != 'index') {
			this.descriptiveText = folderName + ' > ' + this.descriptiveText;
		} else {
			if (folderName == 'images') {
				this.descriptiveText =
					decodeURIComponent(this.href.split('/').at(-3) ?? '') + ' > Gallerie';
			}
		}
	}

	getFolderCategory() {
		const segments = this.href.split('/');
		const category = segments.at(-2);
		return category == 'content' ? 'Serpinit' : category;
	}
}
