
import { TIMELINE_API_URL } from "$lib/constants";
import { error } from "@sveltejs/kit";

export async function load({ fetch, params, url }) {
    let fetchResult = await fetch(TIMELINE_API_URL)
    if (!fetchResult.ok) {
        const { message } = await fetchResult.json();
        throw error(fetchResult.status, message);
    }
    let timeline: TimelineEvent[] = await fetchResult.json()
    return {
        timeline
    }
}