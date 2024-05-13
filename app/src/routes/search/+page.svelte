<script lang="ts">
	import type { MarkdownPage } from '$lib/markdownPage.js';
	import { onMount } from 'svelte';
	import * as cheerio from 'cheerio';

	let searchInput = '';
	let currentResults = new Map<string, number>();
	let displayedResults: { key: string; title: string; preview: string }[] = [];

	//FIXME Wiki is empty

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const initialSearch: string = urlParams.get('tags') ?? '';
		if (initialSearch) {
			searchInput = initialSearch;
			fullSearch();
		}
	});

	function fullSearch() {
		currentResults.clear();
		for (let searchTag of searchInput.split(',')) {
			search((page) => page.title.toLowerCase().includes(searchTag.toLowerCase()), 3)
			search((page) => page.tags.map((tag) => tag.text.toLowerCase()).includes(searchTag.toLowerCase()), 2)
			search((page) => page.markdown.toLowerCase().includes(searchTag.toLowerCase()), 1)
		}
		displayedResults = Array.from(currentResults)
			.sort((a, b) => b[1] - a[1])
			.map(([key, _]) => {
				const page = wiki.get(key)!;
				return {
					key,
					title: page.title,
					preview: cheerio.load(page.html).text().substring(0, 100)
				};
			});
	}

	function search(criterium: (page: MarkdownPage) => boolean, priority: number) {
		for (let [key, page] of wiki.entries()) {
			const priority = criterium(page);
			if (priority != null) {
				currentResults.set(key, priority);
			}
		}
	}
</script>

<h1>Search Page</h1>

<input type="text" bind:value={searchInput} on:input={fullSearch} placeholder="Search..." />
<button on:click={fullSearch}>Search</button>

{#if displayedResults.length === 0}
	<p>No results found</p>
{:else}
	<ul>
		{#each displayedResults as { key, title, preview }}
			<li>
				<a href={`/page/${key}`}>{title}</a>
				<p>{preview}</p>
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
