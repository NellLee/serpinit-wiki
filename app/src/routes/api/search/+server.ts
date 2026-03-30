import { ensureWikiInitialized, search } from '$lib/wiki';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
	await ensureWikiInitialized();
	const query = url.searchParams.get('q');
	if (!query) {
		throw error(400, 'URL parameter "q" required');
	}
	const includeCategories = !!url.searchParams.get('includeCategories');
	const includeContent = !!url.searchParams.get('includeContent');
	const searchResults = search(query, includeCategories, includeContent);

	return json(searchResults);
}
