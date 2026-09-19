import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { parseTagHooks } from '../app/src/lib/tagHooks.ts';
import { filterContentMarkdownPaths } from './check-content-mojibake.mjs';

const CONTENT_ROOT = 'content';

export function findTagHookWarnings(content, filePath) {
	const isIndexPage = path.basename(filePath).toLowerCase() === 'index.md';

	return parseTagHooks(content, { isIndexPage }).warnings.map((message) => ({
		filePath,
		message
	}));
}

function listMarkdownFiles(rootDirectory) {
	const files = [];

	for (const entry of fs.readdirSync(rootDirectory, { withFileTypes: true })) {
		const fullPath = path.join(rootDirectory, entry.name);

		if (entry.isDirectory()) {
			files.push(...listMarkdownFiles(fullPath));
		} else if (entry.isFile() && fullPath.endsWith('.md')) {
			files.push(fullPath);
		}
	}

	return files;
}

function resolveFilesFromArgs(args) {
	const filesArgumentIndex = args.indexOf('--files');

	if (filesArgumentIndex !== -1) {
		return filterContentMarkdownPaths(args.slice(filesArgumentIndex + 1));
	}

	return listMarkdownFiles(CONTENT_ROOT).map((filePath) => filePath.replace(/\\/g, '/'));
}

// Warnings never block a commit: a misplaced hook is still applied by the wiki.
function main() {
	const targetFiles = resolveFilesFromArgs(process.argv.slice(2));
	const warnings = targetFiles.flatMap((filePath) =>
		findTagHookWarnings(fs.readFileSync(filePath, 'utf8'), filePath)
	);

	for (const warning of warnings) {
		console.warn(`Tag hook warning in ${warning.filePath}: ${warning.message}`);
	}

	console.log(
		`Checked ${targetFiles.length} content markdown file(s) for tag hooks. ${warnings.length} warning(s).`
	);
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}
