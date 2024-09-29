<script lang="ts">
	import SearchBar from '$lib/components/Searchbar.svelte';
	export let items: LinkObject[];
</script>

<nav id="nav-bar">
	<ul>
		{#each items as item}
			<li>
				<a href={item.href}>{item.text}</a>
			</li>
		{/each}
	</ul>
	<SearchBar />
</nav>

<style lang="scss">
	#nav-bar {
		width: 100%;
		background-color: var(--tertiary-background-color);
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		padding: 0 20px;
		height: 50px;
		align-items: center;

		> ul {
			list-style-type: none;
			margin: 0;
			padding: 0;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-start;
			align-items: baseline;
			gap: 15px;

			li a {
				color: var(--primary-color);
				text-decoration: none;
				&:hover {
					color: var(--secondary-color);
				}
			}
		}
	}
</style>
