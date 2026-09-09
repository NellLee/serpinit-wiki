import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { WIKI_PATH } from '../wiki';

// During initWiki()'s one-time bulk load, many pages share the same parent folder and
// each independently re-lists it (siblings, related, gallery, index-content) - identical
// readdirSync/lstatSync calls repeated for a folder tree that cannot change mid-batch.
// Under WSL/DrvFs each such call carries real latency, so this compounds badly. Caching
// is scoped to an explicit batch (see beginFolderListingBatch/endFolderListingBatch) so
// live single-page edits outside a batch keep listing fresh, unchanged behavior.
let batchCache: Map<string, string[]> | null = null;

export function beginFolderListingBatch() {
	batchCache = new Map();
}

export function endFolderListingBatch() {
	batchCache = null;
}

export function getFilePathsInFolder(
	folderPath: string,
	fileTypes: string[] = [],
	maxDepth: number = -1
) {
	const cacheKey = batchCache && `files|${folderPath}|${fileTypes.join(',')}|${maxDepth}`;
	if (cacheKey && batchCache!.has(cacheKey)) {
		return [...batchCache!.get(cacheKey)!];
	}

	if (!fs.existsSync(folderPath)) {
		throw error(404, `Folder ${getFrontendSafePath(folderPath)} not found`);
	}
	const folderStat = fs.lstatSync(folderPath);
	if (!folderStat || !folderStat.isDirectory()) {
		throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!";
	}

	const aggregator: string[] = [];
	const result = getFilePathsInFolderRec(aggregator, folderPath, fileTypes, maxDepth);
	if (cacheKey) {
		batchCache!.set(cacheKey, result);
	}
	return result;
}

function getFilePathsInFolderRec(
	aggregator: string[],
	folderPath: string,
	fileTypes: string[] = [],
	maxDepth: number,
	startPath = folderPath
) {
	fs.readdirSync(folderPath).forEach((fileOrFolder) => {
		const fullPath = folderPath + path.sep + fileOrFolder;
		try {
			const stat = fs.lstatSync(fullPath);
			if (stat.isDirectory()) {
				if (maxDepth != 0) {
					return getFilePathsInFolderRec(aggregator, fullPath, fileTypes, maxDepth - 1, startPath);
				}
			} else if (stat.isFile()) {
				if (fileTypes.length === 0 || fileTypes.includes(path.extname(fileOrFolder))) {
					aggregator.push(fullPath.replace(startPath, ''));
				}
			}
		} catch {
			//ignored
		}
	});
	return aggregator;
}

export function getFolderPathsInFolder(folderPath: string, maxDepth: number = -1) {
	const cacheKey = batchCache && `folders|${folderPath}|${maxDepth}`;
	if (cacheKey && batchCache!.has(cacheKey)) {
		return [...batchCache!.get(cacheKey)!];
	}

	const folderStat = fs.lstatSync(folderPath);
	if (!folderStat || !folderStat.isDirectory()) {
		throw "InvalidArgument. Argument 'folderPath' is not a path to a directory!";
	}

	const aggregator: string[] = [];
	const result = getFolderPathsInFolderRec(aggregator, folderPath, maxDepth);
	if (cacheKey) {
		batchCache!.set(cacheKey, result);
	}
	return result;
}

function getFolderPathsInFolderRec(
	aggregator: string[],
	folderPath: string,
	maxDepth: number,
	startPath = folderPath
) {
	fs.readdirSync(folderPath).forEach((fileOrFolder) => {
		const fullPath = folderPath + path.sep + fileOrFolder;
		const stat = fs.lstatSync(fullPath);
		if (stat.isDirectory()) {
			aggregator.push(fullPath.replace(startPath, ''));
			if (maxDepth != 0) {
				return getFolderPathsInFolderRec(aggregator, fullPath, maxDepth - 1, startPath);
			}
		}
	});
	return aggregator;
}

export function getFrontendSafePath(fullPath: string): string {
	return fullPath.replace(WIKI_PATH + path.sep, '').replaceAll(path.sep, '/');
}
