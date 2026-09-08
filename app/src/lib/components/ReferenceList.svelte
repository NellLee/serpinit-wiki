<script lang="ts">
	import EllipsisText from './EllipsisText.svelte';
	import Card from './Card.svelte';

	interface Props {
		namedLinkList: NamedLinkList;
	}

	let { namedLinkList }: Props = $props();
</script>

{#if namedLinkList.linkList.length > 0}
	<nav class="reference-list" aria-label={namedLinkList.name}>
		<Card name={namedLinkList.name}>
			<ul>
				{#each namedLinkList.linkList as link}
					<li>
						<a href={link.href}>
							<EllipsisText>{link.text}</EllipsisText>
						</a>
					</li>
				{/each}
			</ul>
		</Card>
	</nav>
{/if}

<style lang="scss">
	.reference-list {
		width: 100%;
		max-width: 100%;
	}

	.reference-list :global(.card) {
		width: min(100%, 24rem);
		margin-left: auto;
		background-color: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-left: 4px solid var(--accent-strong);
		box-shadow: var(--shadow-soft);
	}

	.reference-list :global(.card h2) {
		margin-bottom: 0.15rem;
		font-size: 0.98rem;
		font-weight: 650;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.reference-list :global(.card hr) {
		margin: 0;
		opacity: 0.35;
	}

	.reference-list :global(.card #slot) {
		padding: 0.9rem 0.35rem 0.45rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.45rem;
	}

	li {
		margin: 0;
	}

	a {
		display: flex;
		min-width: 0;
		align-items: center;
		padding: 0.5rem 0.7rem;
		border-radius: 0.6rem;
		border: 1px solid transparent;
		background: rgba(244, 235, 219, 0.9);
		color: var(--primary-color);
		text-decoration: none;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
	}

	a:hover {
		background: rgba(235, 226, 209, 0.94);
		border-color: var(--border-subtle);
		color: var(--accent-strong);
		transform: translateX(1px);
	}

	@media (min-width: 960px) {
		.reference-list {
			width: min(100%, 25rem);
			margin-left: auto;
		}
	}
</style>
