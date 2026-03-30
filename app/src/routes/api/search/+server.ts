import { ensureWikiInitialized, search, searchPreview } from '$lib/wiki';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	await ensureWikiInitialized();
	const query = url.searchParams.get('q')?.trim() ?? '';
	const isPreview = url.searchParams.get('preview') === 'true';
	if (isPreview) {
		return json(query ? searchPreview(query) : { query: '', results: [] });
	}

	const includeCategories = url.searchParams.get('includeCategories') !== 'false';
	const includeContent = url.searchParams.get('includeContent') !== 'false';
	const sort = (url.searchParams.get('sort') as 'relevance' | 'title-asc' | 'domain' | null) ?? 'relevance';

	return json(
		search(query, {
			includeCategories,
			includeContent,
			sort
		})
	);
}
