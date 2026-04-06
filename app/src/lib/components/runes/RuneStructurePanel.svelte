<script lang="ts">
	import type { RunicDocument } from '$lib/runes/contracts';

	export let document: RunicDocument;
</script>

<section class="detail-panel">
	<h2>Structure</h2>
	<p>{document.description}</p>

	<div class="detail-block">
		<h3>Semantics</h3>
		<p><strong>Ontology:</strong> {document.semantics.ontologyClasses.join(', ')}</p>
		<p><strong>Process roles:</strong> {document.semantics.processRoles.join(', ')}</p>
	</div>

	<div class="detail-block">
		<h3>Topology</h3>
		<p><strong>Flow:</strong> {document.topology.flow.direction}</p>
		<p><strong>Allows return:</strong> {document.topology.flow.allowsReturn ? 'yes' : 'no'}</p>
		<p><strong>Elements:</strong> {document.topology.elements.length}</p>
		<p><strong>Relations:</strong> {document.topology.relations.length}</p>
		<p><strong>Layers:</strong> {document.topology.layers.map((layer) => `${layer.index}:${layer.name}`).join(' · ')}</p>
	</div>

	{#if document.instances?.length}
		<div class="detail-block">
			<h3>Instances</h3>
			<ul>
				{#each document.instances as instance}
					<li><strong>{instance.id}</strong> -&gt; {instance.documentId} ({instance.role})</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if document.constraints?.length}
		<div class="detail-block">
			<h3>Constraints</h3>
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
