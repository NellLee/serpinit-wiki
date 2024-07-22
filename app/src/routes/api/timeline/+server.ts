
import { loadTimeline, timeline } from '$lib/timeline';
import { json } from '@sveltejs/kit';

loadTimeline()

export function GET({url}) {
    return json(timeline)
}