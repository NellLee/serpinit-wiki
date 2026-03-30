import type { MarkdownPage } from '$lib/markdownPage.js';
import { getLinkedFilePath } from '$lib/utilities/links';
import { ensureWikiInitialized, loadMarkdownPage } from '$lib/wiki';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
	await ensureWikiInitialized();
	const file = url.searchParams.get('file');
	if (!file) {
		throw error(400, "URL parameter 'file' required");
	}

	const page: MarkdownPage = loadMarkdownPage(getLinkedFilePath(file));
	return json(page);
}
