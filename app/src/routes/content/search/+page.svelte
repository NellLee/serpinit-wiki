<script lang="ts">
	import { goto } from '$app/navigation';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import SearchEntry from '$lib/components/SearchEntry.svelte';
	import { onMount } from 'svelte';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';

	export let data;

	let searchInput = '';
	let includeCategories = false;
	let includeContent = false;

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
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="utility-page search-page">
	<MidPanel contentWidth={data.presentation.contentWidth}>
		<div class="utility-head" slot="head">
			<p class="eyebrow">Werkzeug</p>
			<h1>{title}</h1>
			<p class="lede">
				Durchsuche Treffer schneller und grenze die Ergebnisliste mit leichten Filtern ein.
			</p>
		</div>

		<div class="utility-content search-content" slot="content">
			<section class="search-controls">
				<form on:submit|preventDefault={newSearch} id="searchbar">
					<input type="text" bind:value={searchInput} placeholder="Search..." />
					<button type="submit" aria-label="Suche ausführen">
						<Icon src={MagnifyingGlass} solid size="16" />
					</button>
				</form>

				<div id="search-options">
					<p>Suchen in</p>
					<label>
						<input type="checkbox" bind:checked={includeCategories} on:change={newSearch} />
						Categories
					</label>
					<label>
						<input type="checkbox" bind:checked={includeContent} on:change={newSearch} />
						Content
					</label>
				</div>
			</section>

			<section id="results" aria-live="polite">
				<div class="results-header">
					<h2>Treffer</h2>
					<p>{data.searchResults.length} Ergebnis{data.searchResults.length === 1 ? '' : 'se'}</p>
				</div>

				{#if data.searchResults.length === 0}
					<p class="empty-state">Keine Treffer gefunden.</p>
				{:else}
					{#each data.searchResults as result}
						<SearchEntry
							title={result.item.title}
							href={result.item.href}
							excerpts={result.excerpts}
						/>
					{/each}
				{/if}
			</section>
		</div>
	</MidPanel>
</div>

<style lang="scss">
	.utility-page {
		width: 100%;
	}

	.utility-head {
		display: grid;
		gap: 0.55rem;

		h1 {
			margin: 0;
		}
	}

	.eyebrow {
		margin: 0;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--secondary-color);
	}

	.lede {
		margin: 0;
		max-width: 42rem;
		color: rgba(0, 0, 0, 0.7);
		line-height: 1.6;
	}

	.search-content {
		display: grid;
		gap: 1.5rem;
	}

	.search-controls,
	#results {
		padding: 1.2rem 1.35rem;
		border-radius: 1rem;
		background: var(--primary-background-color);
		border: 1px solid rgba(0, 0, 0, 0.08);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
	}

	#searchbar {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.9rem;

		input {
			width: 100%;
			font-size: 1rem;
			padding: 0.8rem 1rem;
			border-radius: 999px;
			border: 1px solid rgba(0, 0, 0, 0.14);
			background: var(--secondary-background-color);
		}

		button {
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			border: 1px solid rgba(0, 0, 0, 0.12);
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			transition:
				border-color 0.2s ease,
				background-color 0.2s ease;
			background: var(--secondary-background-color);

			&:hover {
				border-color: var(--secondary-color);
				background: var(--alternative-primary-background-color);
			}

			&:focus {
				outline: none;
			}
		}
	}

	#search-options {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);

		p {
			margin: 0;
			font-weight: 700;
		}

		label {
			display: inline-flex;
			align-items: center;
			gap: 0.55rem;
			margin: 0;
		}
	}

	.results-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1rem;

		h2,
		p {
			margin: 0;
		}
	}

	#results {
		display: grid;
		gap: 1rem;
	}

	.empty-state {
		margin: 0;
		color: rgba(0, 0, 0, 0.72);
	}
</style>
