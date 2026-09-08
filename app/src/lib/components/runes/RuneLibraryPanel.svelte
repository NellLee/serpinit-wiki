<script lang="ts">
	import type { ResolvedRunicLibraryGroup } from '$lib/runes/contracts';

	interface Props {
		groups: ResolvedRunicLibraryGroup[];
		selectedId: string;
	}

	let { groups, selectedId }: Props = $props();
</script>

<nav class="library-panel" aria-label="Runic library">
	{#each groups as group}
		<section>
			<h2>{group.name}</h2>
			<div class="entry-list">
				{#each group.entries as entry}
					<a class:selected={entry.id === selectedId} href={`?id=${entry.id}`}>
						<strong>{entry.name}</strong>
						<span>{entry.id}</span>
					</a>
				{/each}
			</div>
		</section>
	{/each}
</nav>

<style lang="scss">
	.library-panel {
		display: grid;
		gap: 1rem;
		padding: 1rem;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: 1rem;
		box-shadow: var(--shadow-soft);
	}

	section {
		display: grid;
		gap: 0.65rem;
	}

	h2 {
		margin: 0;
		font-size: 0.95rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--accent-strong);
	}

	.entry-list {
		display: grid;
		gap: 0.45rem;
	}

	a {
		display: grid;
		gap: 0.2rem;
		padding: 0.75rem 0.85rem;
		border-radius: 0.8rem;
		text-decoration: none;
		color: inherit;
		background: var(--surface-sunken);
		border: 1px solid transparent;
	}

	a.selected {
		border-color: rgba(112, 88, 48, 0.4);
		background: rgba(239, 229, 214, 0.96);
	}

	span {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
</style>
