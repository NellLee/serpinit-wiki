<script lang="ts">
	import * as cheerio from 'cheerio'

	let searchInput: string

	export let data
</script>

<h1>Search Page</h1>

<!-- <input type="text" bind:value={searchInput} on:input={} placeholder="Search..." /> -->
<!-- <button on:click={fullSearch}>Search</button> -->

{#if data.pages.length === 0}
	<p>No results found</p>
{:else}
	<ul>
		{#each data.pages as page}
			<li>
				<a href={page.href}>{page.title}</a>
				<p>{cheerio.load(page.html).text().substring(0, 100)}</p>
			</li>
		{/each}
	</ul>
{/if}

<style>
	input,
	button {
		margin: 5px;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		margin-bottom: 10px;
	}

	a {
		text-decoration: none;
		color: blue;
	}
</style>
