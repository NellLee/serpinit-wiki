<script lang="ts">
	import TabbedContentCard from '$lib/components/TabbedContentCard.svelte';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { PAGE_API_URL, WIKI_URL } from '$lib/constants.js';
	import { error } from '@sveltejs/kit';
	import type { MarkdownPage } from '$lib/markdownPage.js';

	const title = 'Timeline';
	export let data;

	let selectedEvent: TimelineEvent | null = null;

	let cardTitle: string | null = null;
	let cardContentHtml: string | null = null;
	let cardOverviewHtml: string | null = null;

	$: if (selectedEvent) {
		if (selectedEvent.text.startsWith(WIKI_URL)) {
			cardTitle = cardContentHtml = cardOverviewHtml = null

			let linkedFile = selectedEvent.text;
			fetch(`${PAGE_API_URL}?file=${linkedFile}`)
				.then((fetchResult) => {
					if (!fetchResult.ok) {
						return fetchResult.json().then(({ message }) => {
							throw error(fetchResult.status, message);
						});
					}
					return fetchResult.json();
				})
				.then((fetchJson) => {
					let page: MarkdownPage = JSON.parse(fetchJson);
					cardTitle = page.title
					cardContentHtml = page.contentHtml;
					cardOverviewHtml = page.overviewHtml;
				});
		} else {
			cardTitle = selectedEvent.text
			cardContentHtml = selectedEvent.description ?? null
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>

<div style="width: 70%">
	<MidPanel>
		<div id="head" slot="head">
			<h1>{title}</h1>
		</div>

		<div id="content" slot="content">
			<div id="timeline">
				<Timeline bind:selectedEvent timeline={data.timeline}></Timeline>
			</div>
			<div id="event-card">
				<TabbedContentCard
					tabLinkList={[]}
					title={cardTitle ?? ''}
					contentHtml={cardContentHtml ?? ''}
					overviewHtml={cardOverviewHtml ?? ''}
					contentMinHeight="300px"
				></TabbedContentCard>
			</div>
		</div>
	</MidPanel>
</div>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>

<style lang="scss">
	#head {
		width: 100%;

		h1 {
			text-align: center;
		}
	}

	#content {
		width: 100%;
		height: fit-content;

		#timeline {
			height: 400px;
			width: 1200px;
			max-width: 100%;
		}

		#event-card {
			margin: 100px;
			height: fit-content;
		}
	}
</style>
