<script lang="ts">
	import type { RunicDocument } from '$lib/runes/contracts';
	import RuneLegend from './RuneLegend.svelte';
	import RuneProjectionPanel from './RuneProjectionPanel.svelte';
	import type { RunePresentation } from './runePresentation';
	import RuneStructurePanel from './RuneStructurePanel.svelte';

	export let document: RunicDocument;
	export let presentation: RunePresentation;

	type DetailTab = 'struktur' | 'projektion' | 'legende';

	const tabs: Array<{ id: DetailTab; label: string }> = [
		{ id: 'struktur', label: 'Struktur' },
		{ id: 'projektion', label: 'Projektion' },
		{ id: 'legende', label: 'Legende' }
	];

	let activeTab: DetailTab = 'struktur';
</script>

<section class="detail-tabs panel">
	<div class="tab-list" role="tablist" aria-label="Runic detail views">
		{#each tabs as tab}
			<button
				type="button"
				role="tab"
				class:active={tab.id === activeTab}
				id={`rune-detail-tab-${tab.id}`}
				aria-selected={tab.id === activeTab}
				aria-controls={`rune-detail-panel-${tab.id}`}
				on:click={() => {
					activeTab = tab.id;
				}}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div
		class="tab-panel"
		role="tabpanel"
		id={`rune-detail-panel-${activeTab}`}
		aria-labelledby={`rune-detail-tab-${activeTab}`}
	>
		{#if activeTab === 'struktur'}
			<RuneStructurePanel {document} />
		{:else if activeTab === 'projektion'}
			<RuneProjectionPanel {document} />
		{:else}
			<RuneLegend {presentation} />
		{/if}
	</div>
</section>

<style lang="scss">
	.panel {
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
		box-shadow: var(--shadow-soft);
	}

	.detail-tabs {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		min-height: min(44rem, calc(100vh - 13rem));
	}

	.tab-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	button {
		border: 1px solid rgba(112, 88, 48, 0.22);
		background: rgba(244, 235, 219, 0.92);
		color: inherit;
		padding: 0.6rem 0.9rem;
		border-radius: 999px;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
	}

	button:hover {
		border-color: rgba(112, 88, 48, 0.45);
		background: rgba(239, 229, 214, 0.98);
	}

	button.active,
	button[aria-selected='true'] {
		background: rgba(112, 88, 48, 0.16);
		border-color: rgba(112, 88, 48, 0.68);
		color: var(--accent-strong);
	}

	button:focus-visible {
		outline: 2px solid rgba(112, 88, 48, 0.8);
		outline-offset: 2px;
	}

	.tab-panel {
		min-height: 0;
	}
</style>
