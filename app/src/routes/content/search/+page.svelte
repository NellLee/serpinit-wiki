<script lang="ts">

	let searchInput: string;

	export let data;
</script>

<div id="table-of-content" class="sidebar"></div>

<div id="content-body">
	<div class="header">
		<h1>Search</h1>
	</div>

	<!-- <input type="text" bind:value={searchInput} on:input={} placeholder="Search..." /> -->
	<!-- <button on:click={fullSearch}>Search</button> -->

	<div id="search-result">
		{#if data.searchResults.length === 0}
			<p>No results found</p>
		{:else}
			<ul>
				{#each data.searchResults as result}
					<li>
						<a href={result.item.href}>{result.item.title}</a>
						<p>{ @html result.matches?.map(match => match.value).join(" ... ")}</p>
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