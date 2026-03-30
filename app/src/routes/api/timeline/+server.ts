import { timeline } from '$lib/timeline';
import { ensureWikiInitialized } from '$lib/wiki.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	await ensureWikiInitialized();
	return json(timeline);
}
