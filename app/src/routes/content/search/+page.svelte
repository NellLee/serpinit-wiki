<script lang="ts">

	import * as cheerio from 'cheerio';
	import type { MarkdownPage } from '$lib/markdownPage';

	let searchInput: string;

	export let data;

	function findQueryIn(page: MarkdownPage) {
		const $ = cheerio.load(page.html)
		const firstParagraph = $('p:contains(' + data.query + ')').first().text()
		if(firstParagraph.length > 0) {
			const querySentenceRegex = new RegExp(`[^.]*\\b${data.query}\\b[^.]*\\.`);
			const matchedQuerySentence = firstParagraph.match(querySentenceRegex) ?? [];
			if(matchedQuerySentence.length > 0) {
				const surroundingContent = matchedQuerySentence[0]!;
				const highlightedContent = surroundingContent.replace(new RegExp(`\\b${data.query}\\b`, 'gi'), `<strong>${data.query}</strong>`);

				return highlightedContent
			}
			const sentenceRegex = new RegExp(`[^.]*\\.`)
			const matchedSentence = firstParagraph.match(sentenceRegex) ?? [];
			if(matchedSentence.length > 0) {
				return matchedSentence[0]
			}
			return firstParagraph.substring(0, 100)+"..."
		}
		return $("body").text().substring(0, 100)+"..."



		// const previewLength = 250
		// const keywordIndex = firstParagraph.indexOf(data.query);
		// const surroundingText = firstParagraph.substring(
		// 	Math.max(0, keywordIndex - previewLength/2), // Start position
		// 	Math.min(firstParagraph.length, keywordIndex + data.query.length + previewLength/2) // End position
		// );
		// return surroundingText
	}
</script>

<div id="table-of-content" class="sidebar"></div>

<div id="content-body">
	<div class="header">
		<h1>Search</h1>
	</div>

	<!-- <input type="text" bind:value={searchInput} on:input={} placeholder="Search..." /> -->
	<!-- <button on:click={fullSearch}>Search</button> -->

	<div id="search-result">
		{#if data.pages.length === 0}
			<p>No results found</p>
		{:else}
			<ul>
				{#each data.pages as page}
					<li>
						<a href={page.href}>{page.title}</a>
						<p>{ @html findQueryIn(page)}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
<div id="quick-links" class="sidebar">
	<aside></aside>
</div>

<style>
	#search-result {
		max-width: 65%;
		margin: auto;
	}
	#search-result li {
		list-style: none;
		margin-bottom: 40px;
	}
	#search-result p {
		white-space:normal;
	}
</style>