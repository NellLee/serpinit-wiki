<script lang="ts">
	export let name = '';
</script>

<div class="card">
	{#if name != ''}
		<h2>{name}</h2>
		<hr />
	{/if}
	<div id="slot">
		<slot />
	</div>
</div>

<style lang="scss">
	.card {
		max-width: 100%;
		min-width: 160px;
		min-height: 100px;
		background-color: var(--surface-raised);
		padding: 0.9rem 1rem;
		border-radius: 0.75rem;
		border: 1px solid var(--border-subtle);
		box-shadow: var(--shadow-soft);

		h2 {
			margin: 0;
			padding-bottom: 0.55rem;
			text-align: left;
			font-size: 1rem;
			text-transform: uppercase;
			letter-spacing: 0.08em;
		}

		hr {
			border: none;
			border-top: 1px solid var(--border-subtle);
			margin: 0;
		}

		#slot {
			padding: 1rem 0.1rem 0.2rem;
		}
	}
</style>
