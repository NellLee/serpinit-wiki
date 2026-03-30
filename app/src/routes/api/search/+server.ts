import { ensureWikiInitialized, search } from '$lib/wiki';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	await ensureWikiInitialized();
	const query = url.searchParams.get('q')?.trim() ?? '';
	if (!query) {
		return json([]);
	}
	const isPreview = url.searchParams.get('preview') === 'true';
	const includeCategories = isPreview
		? true
		: url.searchParams.get('includeCategories') !== 'false';
	const includeContent = isPreview
		? false
		: url.searchParams.get('includeContent') !== 'false';
	const searchResults = search(query, includeCategories, includeContent);

	return json(isPreview ? searchResults.slice(0, 8) : searchResults);
}
