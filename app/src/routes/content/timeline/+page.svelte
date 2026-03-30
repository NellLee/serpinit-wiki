<script lang="ts">
	import MidPanel from '$lib/components/MidPanel.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { WIKI_URL } from '$lib/constants.js';
	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';

	const title = 'Timeline';

	export let data;

	let selectedEvent: TimelineEvent | null = null;
	let linkedPage: string | null;
	$: linkedPage = selectedEvent?.description?.startsWith(WIKI_URL)
		? selectedEvent.description
		: null;

	onMount(() => {
		selectedEvent = data.selectedEvent;
		if (selectedEvent?.description?.startsWith(WIKI_URL)) {
			linkedPage = selectedEvent.description;
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="utility-page timeline-page">
	<MidPanel contentWidth={data.presentation.contentWidth}>
		<div class="utility-head" slot="head">
			<p class="eyebrow">Werkzeug</p>
			<h1>{title}</h1>
			<p class="lede">
				Erkunde die Zeitleiste visuell und prüfe danach das aktuell ausgewählte Ereignis.
			</p>
		</div>

		<div class="timeline-layout" slot="content">
			<section class="timeline-surface">
				<div id="timeline">
					<Timeline
						bind:selectedEvent
						timeline={data.timeline}
						initialViewOffset={data.selectedEvent?.start ?? null}
					/>
				</div>
			</section>

			<section class="event-panel">
				<Card name="Ausgewähltes Ereignis">
					<div id="event-card-content">
						{#if selectedEvent}
							<h2 id="event-title">{selectedEvent.text}</h2>
							<p class="event-range">
								{selectedEvent.start}
								{#if selectedEvent.end}
									<span> bis {selectedEvent.end}</span>
								{/if}
							</p>
							{#if linkedPage}
								<a id="page-link" href={linkedPage}>Artikel öffnen</a>
							{/if}
						{:else}
							<p class="empty-state">
								Wähle ein Ereignis in der Zeitleiste aus, um es hier anzuzeigen.
							</p>
						{/if}
					</div>
				</Card>
			</section>
		</div>
	</MidPanel>
</div>

<style lang="scss">
	.utility-page {
		width: 100%;
	}

	.utility-head {
		display: grid;
		gap: 0.55rem;

		p,
		h1 {
			margin: 0;
		}
	}

	.eyebrow {
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--secondary-color);
	}

	.lede {
		max-width: 44rem;
		color: rgba(0, 0, 0, 0.7);
		line-height: 1.6;
	}

	.timeline-layout {
		display: grid;
		gap: 1.5rem;

		@media (min-width: 1100px) {
			grid-template-columns: minmax(0, 1.75fr) minmax(18rem, 24rem);
		}
	}

	.timeline-surface,
	.event-panel :global(.card) {
		background: var(--primary-background-color);
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
	}

	.timeline-surface {
		padding: 1rem 1.2rem 1.2rem;
		border-radius: 1rem;
	}

	#timeline {
		height: 62vh;
		width: 100%;
		max-width: 100%;
	}

	.event-panel {
		align-self: start;
	}

	#event-card-content {
		display: grid;
		gap: 0.9rem;
	}

	#event-title,
	.event-range,
	.empty-state {
		margin: 0;
	}

	.event-range {
		font-size: 0.94rem;
		color: rgba(0, 0, 0, 0.68);
	}

	#page-link {
		width: fit-content;
		background-color: var(--tertiary-background-color);
		color: var(--primary-color);
		padding: 0.7rem 1rem;
		border-radius: 999px;
		text-decoration: none;
		display: inline-block;
		font-size: 0.95rem;
		text-align: center;
		transition:
			background-color 0.2s ease,
			color 0.2s ease;

		&:hover {
			background-color: var(--alternative-secondary-background-color);
			color: var(--secondary-color);
		}
	}
</style>
