import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const MOJIBAKE_MARKERS = ['\u00c3', '\u00c2', '\u00e2\u20ac'];
const CONTENT_ROOT = 'content';

export function filterContentMarkdownPaths(paths) {
	return paths
		.map((filePath) => filePath.replace(/\\/g, '/'))
		.filter((filePath) => filePath.startsWith(`${CONTENT_ROOT}/`) && filePath.endsWith('.md'));
}

export function findMojibakeIssues(content) {
	const issues = [];
	const lines = content.split(/\r?\n/);

	for (const [index, line] of lines.entries()) {
		for (const marker of MOJIBAKE_MARKERS) {
			if (line.includes(marker)) {
				issues.push({
					line: index + 1,
					marker,
					excerpt: line
				});
				break;
			}
		}
	}

	return issues;
}

function listMarkdownFiles(rootDirectory) {
	const files = [];

	for (const entry of fs.readdirSync(rootDirectory, { withFileTypes: true })) {
		const fullPath = path.join(rootDirectory, entry.name);

		if (entry.isDirectory()) {
			files.push(...listMarkdownFiles(fullPath));
			continue;
		}

		if (entry.isFile() && fullPath.endsWith('.md')) {
			files.push(fullPath);
		}
	}

	return files;
}

function scanFiles(filePaths) {
	const findings = [];

	for (const filePath of filePaths) {
		const content = fs.readFileSync(filePath, 'utf8');
		const issues = findMojibakeIssues(content);

		if (issues.length > 0) {
			findings.push({ filePath, issues });
		}
	}

	return findings;
}

function printFindings(findings) {
	if (findings.length === 0) {
		return;
	}

	console.error('Mojibake detected in content markdown:');

	for (const finding of findings) {
		for (const issue of finding.issues) {
			console.error(`${finding.filePath}:${issue.line} contains "${issue.marker}"`);
			console.error(`  ${issue.excerpt}`);
		}
	}
}

function resolveFilesFromArgs(args) {
	const filesArgumentIndex = args.indexOf('--files');

	if (filesArgumentIndex !== -1) {
		return filterContentMarkdownPaths(args.slice(filesArgumentIndex + 1));
	}

	if (args.includes('--staged')) {
		throw new Error('--staged is only supported through the git hook. Use --files or run a full scan.');
	}

	return listMarkdownFiles(CONTENT_ROOT).map((filePath) => filePath.replace(/\\/g, '/'));
}

function main() {
	const args = process.argv.slice(2);
	const targetFiles = resolveFilesFromArgs(args);

	if (targetFiles.length === 0) {
		console.log('No content markdown files to scan.');
		return;
	}

	const findings = scanFiles(targetFiles);
	printFindings(findings);

	if (findings.length > 0) {
		process.exitCode = 1;
		return;
	}

	console.log(`Checked ${targetFiles.length} content markdown file(s). No mojibake found.`);
}

if (process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main();
}
