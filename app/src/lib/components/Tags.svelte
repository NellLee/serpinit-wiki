<script lang="ts">
	import SmallNamedCard from './SmallNamedCard.svelte';

	export let tags: LinkObject[];
</script>

{#if tags.length > 0}
	<nav>
		<div class="tags">
			<SmallNamedCard name="Tags">
				<ul>
					{#each tags as link}
						<li><a href={link.href}>{link.text}</a></li>
					{/each}
				</ul>
			</SmallNamedCard>
		</div>
	</nav>
{/if}

<style lang="scss">
	.tags {
		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-flow: row wrap;
			justify-content: space-evenly;

			li {
				width: fit-content !important;

				a {
					text-decoration: none;
					display: inline-block;
					padding: 0.25rem 0.5rem;
					margin: 0.25rem;
					background-color: var(--tertiary-background-color);
					border-radius: 16px;
					color: var(--primary-color);
					font-size: 14px;
					font-family: Arial, sans-serif;
					transition: background-color 0.3s ease;

					&:hover {
						background-color: var(--quaternary-background-color);
					}
				}
			}
		}
	}
</style>
