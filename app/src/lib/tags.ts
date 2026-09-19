import { normalizeSearchText } from './searchCore';
import type { TagHooks } from './tagHooks';

export type TagSource = 'name' | 'folder' | 'inherit' | 'hook';

export type Tag = {
	text: string;
	source: TagSource;
};

export type TagFolderLookup = (folderSegments: string[]) => boolean;

// A tag that is written down explicitly beats one that is only derived from a name.
const SOURCE_RANK: Record<TagSource, number> = { name: 0, folder: 1, inherit: 1, hook: 2 };

class TagCollector {
	#tags = new Map<string, Tag>();

	add(text: string, source: TagSource) {
		const key = normalizeSearchText(text);
		if (key === '') {
			return;
		}

		const existing = this.#tags.get(key);
		if (!existing) {
			this.#tags.set(key, { text, source });
		} else if (SOURCE_RANK[source] > SOURCE_RANK[existing.source]) {
			this.#tags.set(key, { text, source });
		}
	}

	toArray(): Tag[] {
		return [...this.#tags.values()];
	}
}

function folderNameToTagText(folderName: string): string {
	return folderName.replaceAll('_', ' ').trim();
}

export function resolveTags(input: {
	segments: string[];
	hooks: TagHooks;
	isTagFolder: TagFolderLookup;
}): { tags: Tag[]; warnings: string[] } {
	const { segments, hooks, isTagFolder } = input;
	const collector = new TagCollector();
	const warnings: string[] = [];

	const fileName = segments.at(-1) ?? '';
	const folders = segments.slice(0, -1);
	const isIndexPage = fileName.toLowerCase() === 'index.md';

	const ownName = isIndexPage ? folders.at(-1) : fileName.replace(/\.md$/i, '');
	for (const part of (ownName ?? '').split('_')) {
		if (part !== '') {
			collector.add(part, 'name');
		}
	}

	// An entry is a file directly inside a tag folder, or the index page of a direct subfolder.
	const parentIndex = isIndexPage ? folders.length - 2 : folders.length - 1;
	const hasParentTagFolder = parentIndex >= 0 && isTagFolder(folders.slice(0, parentIndex + 1));
	if (hasParentTagFolder) {
		collector.add(folderNameToTagText(folders[parentIndex]), 'folder');
	}

	if (hooks.inherit > 0) {
		if (!hasParentTagFolder) {
			warnings.push(
				`inherit=${hooks.inherit} only works on a direct entry of a tag folder, and this page is not one`
			);
		} else {
			let taken = 0;
			for (let index = parentIndex - 1; index >= 0 && taken < hooks.inherit; index--) {
				if (isTagFolder(folders.slice(0, index + 1))) {
					collector.add(folderNameToTagText(folders[index]), 'inherit');
					taken++;
				}
			}
			if (taken < hooks.inherit) {
				warnings.push(
					`inherit=${hooks.inherit} asks for ${hooks.inherit} more tag folders above the parent tag folder, but only ${taken} exist`
				);
			}
		}
	}

	for (const tag of hooks.tags) {
		collector.add(tag, 'hook');
	}

	return { tags: collector.toArray(), warnings };
}
