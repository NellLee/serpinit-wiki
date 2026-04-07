<script lang="ts">
	import type { RunicDocument } from '$lib/runes/contracts';

	export let document: RunicDocument;
</script>

<section class="detail-panel">
	<h2>Projektion</h2>
	<p><strong>Ausrichtung:</strong> {document.projection2d.system.orientationFrame.gravityReference} / {document.projection2d.system.orientationFrame.anchorReference}</p>
	<p>{document.projection2d.system.orientationFrame.notes}</p>

	<div class="detail-block">
		<h3>Projektionssystem</h3>
		<p><strong>Schalen:</strong> {document.projection2d.system.layerCount}</p>
		<p><strong>Sektoren:</strong> {document.projection2d.system.sectors.map((sector) => sector.name).join(', ')}</p>
	</div>

	<div class="detail-block">
		<h3>Setzungen</h3>
		<ul>
			{#each document.projection2d.placements as placement}
				<li>
					<strong>{placement.ref}</strong>
					-&gt; Schale {placement.layer}, Sektor {placement.sector}, Spannen {placement.radialSpan} radial / {placement.sectorSpan} sektoral, Wirkform {placement.shapeFamily}
				</li>
			{/each}
		</ul>
	</div>

	<div class="detail-block">
		<h3>Beziehungsbahnen</h3>
		<ul>
			{#if document.projection2d.relationPaths.length === 0}
				<li>Keine Beziehungsbahnen</li>
			{:else}
				{#each document.projection2d.relationPaths as path}
					<li><strong>{path.relationId}</strong> -&gt; {path.mode} ({path.source} -&gt; {path.target})</li>
				{/each}
			{/if}
		</ul>
	</div>
</section>

<style lang="scss">
	.detail-panel {
		display: grid;
		gap: 0.9rem;
		min-height: 0;
	}

	h2,
	h3,
	p,
	ul {
		margin: 0;
	}

	.detail-block {
		display: grid;
		gap: 0.35rem;
	}

	ul {
		padding-left: 1.2rem;
	}
</style>
