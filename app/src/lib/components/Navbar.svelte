<script lang="ts">
	import SearchBar from '$lib/components/Searchbar.svelte';

	export let items: LinkObject[];
</script>

<nav id="nav-bar" aria-label="Primary">
	<div class="nav-frame">
		<ul>
			{#each items as item}
				<li>
					<a href={item.href}>{item.text}</a>
				</li>
			{/each}
		</ul>
		<SearchBar />
	</div>
</nav>

<style lang="scss">
	#nav-bar {
		width: 100%;
		padding: 12px var(--shell-inline-padding, 24px) 10px;
	}

	.nav-frame {
		width: min(100%, var(--shell-max-width, 1600px));
		margin: 0 auto;
		padding: 10px 18px;
		background-color: var(--secondary-background-color);
		border: 1px solid var(--primary-border-color);
		border-radius: 14px;
		display: flex;
		flex-flow: row wrap;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-flow: row wrap;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		gap: 18px;
		flex: 1 1 360px;
		min-width: 0;
	}

	:global(#searchbar) {
		flex: 0 1 300px;
	}

	li a {
		color: var(--primary-color);
		text-decoration: none;
		padding: 4px 0;
		line-height: 1.2;

		&:hover {
			color: var(--secondary-color);
		}
	}
</style>
