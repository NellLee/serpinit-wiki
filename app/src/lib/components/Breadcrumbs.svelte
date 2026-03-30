<script lang="ts">
	import { Home, Icon } from "svelte-hero-icons";

	export let linkList: LinkObject[];
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
					<li><a href={link.href}>{link.text.replaceAll("_", " ").replaceAll("-", " ")}</a></li>
				{/if}
				<li class="delimiter">
					{#if i != linkList.length - 1}
						{link.text.endsWith("_") ? "-" : "/"}
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
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
			flex-wrap: wrap;
			align-items: center;
		}

		li {
			display: flex;
			align-items: center;
			color: var(--primary-color);
			font-size: 14px;
			line-height: 1.3;

			a {
				text-decoration: none;
				color: var(--primary-color);

				&:hover {
					text-decoration: underline;
					color: var(--secondary-color);
				}
			}
		}

		.delimiter {
			margin: 0 0.35rem;
			opacity: 0.55;
		}

		@media (min-width: 960px) {
			width: fit-content;
			max-width: 100%;
			padding: 0.55rem 0.85rem;
			border-radius: 999px;
			background-color: var(--primary-background-color);
			border: 1px solid rgba(0, 0, 0, 0.08);
			box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);

			ul {
				gap: 0.05rem;
			}

			li {
				font-size: 0.84rem;
			}

			.delimiter {
				margin: 0 0.45rem;
			}
		}
	}
</style>
