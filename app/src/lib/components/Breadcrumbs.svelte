<script lang="ts">
	import { Home, Icon } from 'svelte-hero-icons';

	interface Props {
		linkList: LinkObject[];
	}

	let { linkList }: Props = $props();
</script>

{#if linkList.length > 0}
	<nav class="breadcrumbs" aria-label="Breadcrumb">
		<ul>
			{#each linkList as link, i}
				{#if i == 0}
					<li>
						<a href={link.href}>
							<Icon style="transform: translateY(2px);" src={Home} solid size="16" />
						</a>
					</li>
				{:else}
					<li><a href={link.href}>{link.text.replaceAll('_', ' ').replaceAll('-', ' ')}</a></li>
				{/if}
				<li class="delimiter">
					{#if i != linkList.length - 1}
						{link.tagFolder ? '-' : '/'}
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style lang="scss">
	.breadcrumbs {
		width: fit-content;
		max-width: 100%;
		padding: 0.6rem 0.9rem;
		border-radius: 999px;
		background-color: rgba(255, 250, 241, 0.86);
		border: 1px solid var(--border-subtle);
		box-shadow: var(--shadow-soft);

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
		}

		li {
			display: flex;
			align-items: center;
			color: var(--primary-color);
			font-size: 0.84rem;
			line-height: 1.3;

			a {
				text-decoration: none;
				color: var(--text-muted);

				&:hover {
					text-decoration: underline;
					color: var(--primary-color);
				}
			}
		}

		.delimiter {
			margin: 0 0.35rem;
			opacity: 0.55;
		}

		ul {
			gap: 0.05rem;
		}

		.delimiter {
			margin: 0 0.45rem;
		}
	}
</style>
