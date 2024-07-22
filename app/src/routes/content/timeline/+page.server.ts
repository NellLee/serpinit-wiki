import { TIMELINE_API_URL, type EvCatPair } from "$lib/timeline.js";
import { error } from "@sveltejs/kit";

export async function load({ fetch, params, url }) {
    let fetchResult = await fetch(TIMELINE_API_URL)
    if (!fetchResult.ok) {
        const { message } = await fetchResult.json();
        throw error(fetchResult.status, message);
    }
    let timeline: EvCatPair[] = await fetchResult.json()
    return {
        timeline
    }
}