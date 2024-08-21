
import { timeline } from '$lib/timeline';
import { initWiki } from '$lib/wiki.js';
import { json } from '@sveltejs/kit';

initWiki()

export function GET({url}) {
    return json(timeline)
}