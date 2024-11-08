<script lang="ts">
	import MidPanel from "$lib/components/MidPanel.svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import Timeline from "$lib/components/Timeline.svelte";
	import { WIKI_URL } from "$lib/constants.js";
	import { onMount } from "svelte";
	import Card from "$lib/components/Card.svelte";

	const title = "Timeline";
	export let data;

	let selectedEvent: TimelineEvent | null = null;
	let linkedPage: string | null;
	$: linkedPage = selectedEvent?.description?.startsWith(WIKI_URL)
		? selectedEvent!.description!
		: null;

	onMount(() => {
		selectedEvent = data.selectedEvent;
		if (selectedEvent?.description?.startsWith(WIKI_URL)) {
			linkedPage = selectedEvent!.description!;
		}
	});
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
				<Timeline bind:selectedEvent timeline={data.timeline} initialViewOffset={data.selectedEvent?.start ?? null}></Timeline>
			</div>
			{#if selectedEvent}
				<div id="event-card">
					<Card>
						<div id="event-card-content">
							<h2 id="event-title">
								{selectedEvent?.text}
							</h2>
							{#if selectedEvent}
								<a id="page-link" href={linkedPage}>Artikel öffnen</a>
							{/if}
						</div>
					</Card>
				</div>
			{/if}
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
			height: 60vh;
			width: 90%;
			max-width: 100%;
		}

		#event-card {
			height: fit-content;
			width: 400px;

			#event-card-content {
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
				align-items: center;

				#page-link {
					background-color: var(--tertiary-background-color);
					color: var(--primary-color);
					padding: 10px 20px;
					border-radius: 8px;
					text-decoration: none;
					display: inline-block;
					font-size: 16px;
					text-align: center;

					&:hover {
						background-color: var(--alternative-secondary-background-color);
					}
				}
			}
		}
	}
</style>
