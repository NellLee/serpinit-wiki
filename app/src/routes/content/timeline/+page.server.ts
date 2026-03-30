import { TIMELINE_API_URL } from '$lib/constants';
import { getUtilityPagePresentation } from '$lib/presentation/pagePresentation';
import { error } from '@sveltejs/kit';

export async function load({ fetch, url }) {
	const fetchResult = await fetch(TIMELINE_API_URL);
	const selectedEventTitle = url.searchParams.get('selected');
	if (!fetchResult.ok) {
		const { message } = await fetchResult.json();
		throw error(fetchResult.status, message);
	}
	const timeline: TimelineEvent[] = await fetchResult.json();
	const selectedEvent = timeline.find((event) => event.text === selectedEventTitle) ?? null;
	return {
		timeline,
		selectedEvent,
		presentation: getUtilityPagePresentation('timeline')
	};
}
