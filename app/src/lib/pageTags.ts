import path from 'path';
import { parseTagHooks } from './tagHooks';
import { resolveTags, type Tag } from './tags';

export type PageTagContext = {
	contentRoot: string;
	readFile: (fullPath: string) => string;
};

export function resolvePageTags(
	fullPath: string,
	markdown: string,
	context: PageTagContext
): { tags: Tag[]; warnings: string[] } {
	const segments = path.relative(context.contentRoot, fullPath).split(path.sep);
	const isIndexPage = segments.at(-1)?.toLowerCase() === 'index.md';
	const hooks = parseTagHooks(markdown, { isIndexPage });

	const isTagFolder = (folderSegments: string[]) => {
		const indexPath = path.join(context.contentRoot, ...folderSegments, 'index.md');
		return parseTagHooks(context.readFile(indexPath), { isIndexPage: true }).folderTag;
	};

	const resolved = resolveTags({ segments, hooks, isTagFolder });
	return { tags: resolved.tags, warnings: [...hooks.warnings, ...resolved.warnings] };
}
