<script lang="ts">
	import { Home, Icon } from 'svelte-hero-icons';

	export let linkList: LinkObject[];
</script>

{#if linkList.length > 0}
	<div class="breadcrumbs">
		<ul>
			{#each linkList as link, i}
				{#if i == 0}
					<li>
						<a href={link.href}>
							<Icon style="transform: translateY(3px);" src={Home} solid size="16" />
						</a>
					</li>
				{:else}
					<li><a href={link.href}>{link.text}</a></li>
				{/if}
			{/each}
			<li>...</li>
		</ul>
	</div>
{/if}

<style lang="scss">
	.breadcrumbs {
		width: 75%;
		padding: 10px 20px;

		ul {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
		}

		li {
			display: flex;
			align-items: center;
			color: var(--primary-color);
			font-size: 14px;

			&:not(:last-child)::after {
				content: '/';
				margin: 0 10px;
			}

			a {
				text-decoration: none;
				color: var(--primary-color);

				&:hover {
					text-decoration: underline;
					color: var(--secondary-color);
				}
			}
		}
	}
</style>
