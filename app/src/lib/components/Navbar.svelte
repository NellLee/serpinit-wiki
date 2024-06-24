<script lang="ts">
	import { onMount } from "svelte";
	import { Icon, MagnifyingGlass } from "svelte-hero-icons";

	export let items: LinkObject[];
	let path: string = ""

	// TODO: is not updated on navigation.
	onMount(() => {
		path = window.location.pathname;
	})
	$: onSearchPage = path.startsWith('/content/search')
</script>

<nav id="nav-bar">
	<ul>
		{#each items as item}
			<li>
				<a href={item.href}>{item.text}</a>
			</li>
		{/each}

		<!-- TODO: styling -->
		{#if !onSearchPage}
			<li>
				<form action="/content/search" method="get">
					<input type="text" name="q" placeholder="Search..." />
					<button type="submit">
						<Icon src={MagnifyingGlass} solid size="16" />
					</button>
				</form>
			</li>
		{/if}
	</ul>
</nav>

<style lang="scss">
	#nav-bar {
		width: 100%;
		ul {
			list-style-type: none;
			margin: 0;
			padding: 0 15px;
			overflow: hidden;
			background-color: var(--tertiary-background-color);
			height: 50px;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-start;
			align-items: center;
			gap: 15px;
		}

		li {
			a {
				display: block;
				color: var(--primary-color);
				text-align: center;
				padding: 0;
				text-decoration: none;

				&:hover {
					color: var(--secondary-color);
				}
			}

			&:first-of-type {
				a {
					font-size: 18px;
				}
			}
		}
	}
</style>
