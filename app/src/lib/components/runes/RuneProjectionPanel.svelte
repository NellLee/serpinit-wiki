<script lang="ts">
	import type { RunicDocument } from '$lib/runes/contracts';

	export let document: RunicDocument;
</script>

<section class="detail-panel">
	<h2>Projection</h2>
	<p><strong>Orientation:</strong> {document.projection2d.system.orientationFrame.gravityReference} / {document.projection2d.system.orientationFrame.anchorReference}</p>
	<p>{document.projection2d.system.orientationFrame.notes}</p>

	<div class="detail-block">
		<h3>Projection System</h3>
		<p><strong>Layers:</strong> {document.projection2d.system.layerCount}</p>
		<p><strong>Sectors:</strong> {document.projection2d.system.sectors.map((sector) => sector.name).join(', ')}</p>
	</div>

	<div class="detail-block">
		<h3>Placements</h3>
		<ul>
			{#each document.projection2d.placements as placement}
				<li>
					<strong>{placement.ref}</strong>
					-&gt; layer {placement.layer}, sector {placement.sector}, spans {placement.radialSpan} radial / {placement.sectorSpan} sector, family {placement.shapeFamily}
				</li>
			{/each}
		</ul>
	</div>

	<div class="detail-block">
		<h3>Relation Paths</h3>
		<ul>
			{#if document.projection2d.relationPaths.length === 0}
				<li>No relation paths</li>
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
		padding: 1rem;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
		box-shadow: var(--shadow-soft);
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
