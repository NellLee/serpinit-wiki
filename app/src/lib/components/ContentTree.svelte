<script lang="ts">
	import ContentTreeNode from './ContentTreeNode.svelte';
	interface Props {
		linkTree: LinkTree;
	}

	let { linkTree }: Props = $props();
</script>

<div id="table-of-content" class="table-of-content">
	{#if linkTree.children.length > 0}
		<nav aria-label="Table of contents">
			<h2>Inhalt</h2>
			<ul>
				{#each linkTree.children as child}
					<li>
						<ContentTreeNode node={child} level={0} />
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</div>

<style lang="scss">
	.table-of-content {
		width: 100%;
		max-width: 100%;

		nav {
			width: 100%;
			padding: 1rem;
			border-radius: 1rem;
			background-color: var(--surface-raised);
			border: 1px solid var(--border-subtle);
			box-shadow: var(--shadow-soft);
		}

		h2 {
			margin: 0 0 0.7rem;
			font-size: 0.88rem;
			font-weight: 650;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: var(--accent-strong);
		}

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: grid;
			gap: 0.2rem;
		}

		li {
			margin: 0;
		}

		@media (min-width: 960px) {
			max-width: 22rem;

			nav {
				padding: 1rem 1.1rem 1.1rem;
				box-shadow: 0 12px 24px rgba(0, 0, 0, 0.07);
			}

			h2 {
				font-size: 0.9rem;
				letter-spacing: 0.08em;
				opacity: 0.78;
			}
		}
	}
</style>
