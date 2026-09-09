<script lang="ts">
	import RuneCanvas from '$lib/components/runes/RuneCanvas.svelte';
	import RuneLegend from '$lib/components/runes/RuneLegend.svelte';
	import RuneLibraryPanel from '$lib/components/runes/RuneLibraryPanel.svelte';
	import RuneProjectionPanel from '$lib/components/runes/RuneProjectionPanel.svelte';
	import RuneStructurePanel from '$lib/components/runes/RuneStructurePanel.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Runic Inspector</title>
</svelte:head>

{#if !data.selectedDocument || !data.presentation}
	<p>No runic documents available.</p>
{:else}
	<div class="runes-page">
		<header class="hero panel">
			<p class="eyebrow">Development Surface</p>
			<h1>{data.selectedDocument.name}</h1>
			<p>{data.selectedDocument.id}</p>
		</header>

		<div class="workspace">
			<RuneLibraryPanel groups={data.library.groups} selectedId={data.selectedId} />
			<RuneCanvas presentation={data.presentation} />
			<div class="details">
				<RuneStructurePanel document={data.selectedDocument} />
				<RuneProjectionPanel document={data.selectedDocument} />
				<RuneLegend presentation={data.presentation} />
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.runes-page {
		display: grid;
		gap: 1rem;
		padding-top: 0.5rem;
	}

	.panel {
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
		box-shadow: var(--shadow-soft);
	}

	.hero {
		padding: 1.25rem;
		display: grid;
		gap: 0.35rem;
	}

	.hero h1,
	.hero p {
		margin: 0;
	}

	.eyebrow {
		color: var(--accent-strong);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.workspace {
		display: grid;
		gap: 1rem;

		@media (min-width: 1100px) {
			grid-template-columns: minmax(15rem, 18rem) minmax(0, 1.4fr) minmax(18rem, 24rem);
			align-items: start;
		}
	}

	.details {
		display: grid;
		gap: 1rem;
	}
</style>
