<script lang="ts">
	import { goto } from '$app/navigation';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import SearchEntry from '$lib/components/SearchEntry.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';

	let searchInput: string = '';
	let includeCategories: boolean = false;
	let includeContent: boolean = false;

	function newSearch() {
		const params = new URLSearchParams();
		if (searchInput) {
			params.set('q', encodeURIComponent(searchInput));
		}
		if (includeCategories) {
			params.set('includeCategories', 'true');
		}
		if (includeContent) {
			params.set('includeContent', 'true');
		}
		goto(`?${params.toString()}`);
	}

	const title = 'Suchergebnisse';

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		searchInput = params.get('q') || '';
		includeCategories = params.get('includeCategories') === 'true';
		includeContent = params.get('includeContent') === 'true';
	});

	export let data;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>

<div style="width: 70%">
	<MidPanel>
		<div id="head" slot="head">
			<h1>{title}</h1>
		</div>

		<div id="content" slot="content">
			<form on:submit|preventDefault={newSearch} id="searchbar">
				<input type="text" bind:value={searchInput} placeholder="Search..." />
				<button type="submit">
					<Icon src={MagnifyingGlass} solid size="16" />
				</button>
			</form>
			<div id="search-options">
				<p>Search in:</p>
				<label>
					<input type="checkbox" bind:checked={includeCategories} on:change={newSearch} />
					Categories
				</label>
				<label>
					<input type="checkbox" bind:checked={includeContent} on:change={newSearch} />
					Content
				</label>
			</div>
			<div id="results">
				{#if data.searchResults.length === 0}
					<p>No results found</p>
				{:else}
					{#each data.searchResults as result}
						<SearchEntry
							title={result.item.title}
							href={result.item.href}
							excerpts={result.excerpts}
						></SearchEntry>
					{/each}
				{/if}
			</div>
		</div>
	</MidPanel>
</div>

<div style="width: 15%">
	<Sidebar></Sidebar>
</div>

<style lang="scss">
	#content {
		width: 85%;
		margin: auto;

		#searchbar {
			display: flex;
			flex-flow: row nowrap;
			gap: 20px;

			input {
				width: 100%;
				font-size: 16px;
				padding-left: 10px;
				border-radius: 5px;
				border: 2px solid var(--tertiary-background-color);
			}

			button {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				border: none;
				cursor: pointer;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: border-color 0.3s ease;
				border: 2px solid var(--secondary-background-color);

				&:hover {
					border-color: var(--secondary-color);
				}

				&:focus {
					outline: none;
				}
			}
		}

		#search-options {
			width: 100%;
			margin: 40px 0;
			padding: 5px 15px;
			border-left: 3px solid var(--secondary-border-color);

			p {
				margin: 0 0 10px;
				font-weight: bold;
				font-size: 16px;
			}

			label {
				display: flex;
				align-items: center;
				margin-bottom: 10px;

				input {
					margin-right: 10px;
					transform: scale(1.2);
				}
			}
		}

		#results {
			display: flex;
			flex-flow: column nowrap;
			gap: 20px;
		}
	}
</style>
