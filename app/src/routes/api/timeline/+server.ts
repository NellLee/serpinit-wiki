import { initTimeline, timeline } from '$lib/timeline';
import { json } from '@sveltejs/kit';

export async function GET() {
	await initTimeline();
	return json(timeline);
}
