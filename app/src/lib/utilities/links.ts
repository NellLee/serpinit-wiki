import { FileLink, readContentFile } from '$lib/fileLink';
import { parseTagHooks } from '$lib/tagHooks';
import path from 'path';
import { WIKI_PATH } from '../wiki';
import { WIKI_URL } from '$lib/constants';

export function linkTreeToList(linkTree: LinkTree, name: string, depth = 0) {
	const namedLinkList: NamedLinkList = { name, linkList: [] };

	function traverse(node: LinkNode, currentDepth: number) {
		const indent = '&nbsp'.repeat(currentDepth * 2);
		const indentedText = `${indent}${node.link.text}`;

		namedLinkList.linkList.push({ href: node.link.href, text: indentedText });

		// Recursively traverse children
		for (const childNode of node.children) {
			traverse(childNode, currentDepth + 1);
		}
	}

	// Start traversal from the root
	for (const rootNode of linkTree.children) {
		traverse(rootNode, depth);
	}

	return namedLinkList;
}

function isTagFolder(linkedFolderPath: string): boolean {
	const indexMarkdown = readContentFile(path.join(linkedFolderPath, 'index.md'));
	return parseTagHooks(indexMarkdown, { isIndexPage: true }).folderTag;
}

export function generateBreadcrumbs(url: string) {
	let breadcrumbs: LinkObject[] = [];
	let constructed = '';
	const segments = url.split('/').filter((segment) => segment !== '' && !segment.endsWith('.md'));
	for (const segment of segments) {
		constructed += '/' + segment;
		const linkedFilePath = getLinkedFilePath(constructed);
		let text = new FileLink(linkedFilePath).fileName;
		if (segment == 'content') {
			text = 'Home';
		}
		breadcrumbs.push({
			text,
			href: constructed,
			tagFolder: isTagFolder(linkedFilePath)
		});
	}
	if (breadcrumbs.length <= 1) {
		breadcrumbs = [];
	}
	return breadcrumbs;
}

export function getLinkedFilePath(link: string, currentFolder: string | null = null): string {
	if (link.startsWith(WIKI_URL)) {
		link = link.substring(WIKI_URL.length + 1);
	}

	if (link.startsWith('.')) {
		if (!currentFolder) {
			throw new TypeError("Current folder must not be null if link starts with '.'");
		}
		link = path.resolve(currentFolder, link);
	}

	const filePath = decodeURIComponent(link.replace(/\//g, path.sep));
	const fullPath = path.resolve(WIKI_PATH, filePath);

	return fullPath;
}
