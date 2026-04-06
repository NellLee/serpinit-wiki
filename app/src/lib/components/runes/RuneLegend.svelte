<script lang="ts">
	import type { RunePresentation } from './runePresentation';

	export let presentation: RunePresentation;
</script>

<section class="detail-panel">
	<h2>Legend</h2>
	<p><strong>Orientation summary:</strong> {presentation.orientationSummary}</p>

	<div class="detail-block">
		<h3>Sector Oppositions</h3>
		<ul>
			{#each presentation.oppositions as pair}
				<li>{pair.left} &lt;-&gt; {pair.right}</li>
			{/each}
		</ul>
	</div>

	<div class="detail-block">
		<h3>Shape Families</h3>
		<ul>
			{#each presentation.shapeFamilies as shapeFamily}
				<li>{shapeFamily}</li>
			{/each}
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
