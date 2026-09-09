import type { MarkdownPage } from '$lib/markdownPage.js';
import { getLinkedFilePath } from '$lib/utilities/links';
import { loadSingleMarkdownPage } from '$lib/wiki';
import { initTimeline } from '$lib/timeline';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
	const file = url.searchParams.get('file');
	if (!file) {
		throw error(400, "URL parameter 'file' required");
	}

	await initTimeline();
	const page: MarkdownPage = loadSingleMarkdownPage(getLinkedFilePath(file));
	return json(page);
}
