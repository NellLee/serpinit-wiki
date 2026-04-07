<script lang="ts">
	import type { ResolvedRunicLibraryGroup } from '$lib/runes/contracts';

	export let groups: ResolvedRunicLibraryGroup[];
	export let selectedId: string;
</script>

<nav class="library-panel" aria-label="Runic library">
	{#each groups as group}
		<section>
			<h2>{group.name}</h2>
			<div class="entry-list">
				{#each group.entries as entry}
					<a
						class:selected={entry.id === selectedId}
						aria-current={entry.id === selectedId ? 'page' : undefined}
						href={`?id=${entry.id}`}
					>
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
		align-self: start;
		max-height: min(48rem, calc(100vh - 13rem));
		overflow-y: auto;
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
		position: sticky;
		top: 0;
		z-index: 1;
		padding: 0.15rem 0;
		background: var(--surface-raised);
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
		border: 1px solid rgba(0, 0, 0, 0);
		border-left: 0.3rem solid transparent;
		transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
	}

	a.selected {
		border-color: rgba(112, 88, 48, 0.56);
		border-left-color: rgba(112, 88, 48, 0.92);
		background: rgba(236, 222, 198, 0.98);
		box-shadow: inset 0 0 0 1px rgba(112, 88, 48, 0.18);
		transform: translateX(0.1rem);
	}

	a:hover {
		border-color: rgba(112, 88, 48, 0.26);
		background: rgba(239, 229, 214, 0.96);
	}

	a.selected strong {
		color: var(--accent-strong);
	}

	span {
		font-size: 0.8rem;
		color: var(--text-muted);
	}

	a.selected span {
		color: rgba(54, 36, 13, 0.88);
	}
</style>
