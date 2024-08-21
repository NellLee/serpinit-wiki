
import { TIMELINE_API_URL } from "$lib/constants";
import { error } from "@sveltejs/kit";

export async function load({ fetch, params, url }) {
    let fetchResult = await fetch(TIMELINE_API_URL)
    let selectedEventTitle = url.searchParams.get('selected')
    if (!fetchResult.ok) {
        const { message } = await fetchResult.json();
        throw error(fetchResult.status, message);
    }
    let timeline: TimelineEvent[] = await fetchResult.json()
    let selectedEvent = timeline.find(event => event.text === selectedEventTitle) ?? null
    return {
        timeline,
        selectedEvent
    }
}