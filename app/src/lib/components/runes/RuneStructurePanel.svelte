<script lang="ts">
	import type { RunicDocument } from '$lib/runes/contracts';

	export let document: RunicDocument;
</script>

<section class="detail-panel">
	<h2>Struktur</h2>
	<p>{document.description}</p>

	<div class="detail-block">
		<h3>Semantik</h3>
		<p><strong>Ontologie:</strong> {document.semantics.ontologyClasses.join(', ')}</p>
		<p><strong>Wirkrollen:</strong> {document.semantics.processRoles.join(', ')}</p>
	</div>

	<div class="detail-block">
		<h3>Gefuege</h3>
		<p><strong>Fluss:</strong> {document.topology.flow.direction}</p>
		<p><strong>Rueckfluss:</strong> {document.topology.flow.allowsReturn ? 'ja' : 'nein'}</p>
		<p><strong>Elemente:</strong> {document.topology.elements.length}</p>
		<p><strong>Beziehungen:</strong> {document.topology.relations.length}</p>
		<p><strong>Schalen:</strong> {document.topology.layers.map((layer) => `${layer.index}:${layer.name}`).join(' · ')}</p>
	</div>

	{#if document.instances?.length}
		<div class="detail-block">
			<h3>Instanzen</h3>
			<ul>
				{#each document.instances as instance}
					<li><strong>{instance.id}</strong> -&gt; {instance.documentId} ({instance.role})</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if document.constraints?.length}
		<div class="detail-block">
			<h3>Bindungen</h3>
			<ul>
				{#each document.constraints as constraint}
					<li>{constraint}</li>
				{/each}
			</ul>
		</div>
	{/if}
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
