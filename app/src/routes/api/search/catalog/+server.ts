import { ensureWikiInitialized, getSearchCatalog } from '$lib/wiki';
import { json } from '@sveltejs/kit';

export async function GET() {
	await ensureWikiInitialized();
	return json(getSearchCatalog());
}
