<script lang="ts">
	import { goto } from '$app/navigation';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import SearchEntry from '$lib/components/SearchEntry.svelte';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';

	export let data;

	let searchInput = data.query;
	let includeCategories = data.activeFilters.includeCategories;
	let includeContent = data.activeFilters.includeContent;
	let sortInput = data.sort;
	let selectedDomains = [...data.activeFilters.domains];
	let selectedPageTypes = [...data.activeFilters.pageTypes];
	let selectedCategories = [...data.activeFilters.categories];

	$: activeChips = [
		...selectedDomains.map((value) => ({ kind: 'domain', value, label: `Bereich: ${value}` })),
		...selectedPageTypes.map((value) => ({ kind: 'pageType', value, label: `Seitentyp: ${value}` })),
		...selectedCategories.map((value) => ({ kind: 'category', value, label: `Kategorie: ${value}` })),
		...data.parsedQuery.exclusions.map((value) => ({ kind: 'query', value, label: `-${value}` }))
	];

	function toggleFilterValue(values: string[], value: string) {
		return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
	}

	function newSearch() {
		const params = new URLSearchParams();
		const trimmedSearch = searchInput.trim();

		if (trimmedSearch) {
			params.set('q', trimmedSearch);
		}

		params.set('includeCategories', includeCategories ? 'true' : 'false');
		params.set('includeContent', includeContent ? 'true' : 'false');
		params.set('sort', sortInput);

		for (const domain of selectedDomains) {
			params.append('domain', domain);
		}

		for (const pageType of selectedPageTypes) {
			params.append('pageType', pageType);
		}

		for (const category of selectedCategories) {
			params.append('category', category);
		}

		goto(trimmedSearch || params.toString() ? `?${params.toString()}` : '');
	}

	function toggleDomain(domainKey: string) {
		selectedDomains = toggleFilterValue(selectedDomains, domainKey);
		newSearch();
	}

	function togglePageType(pageTypeKey: string) {
		selectedPageTypes = toggleFilterValue(selectedPageTypes, pageTypeKey);
		newSearch();
	}

	function toggleCategory(categoryKey: string) {
		selectedCategories = toggleFilterValue(selectedCategories, categoryKey);
		newSearch();
	}

	const title = 'Suchergebnisse';
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
				Durchsuche das Wiki mit Bereichen, Seitentypen, Kategorien und einer knappen
				Erweiterungssyntax.
			</p>
		</div>

		<div class="utility-content search-layout" slot="content">
			<section class="search-main">
				<section class="search-controls">
					<form on:submit|preventDefault={newSearch} id="searchbar">
						<input type="text" bind:value={searchInput} placeholder="Im Wiki suchen..." />
						<button type="submit" aria-label="Suche ausfÃ¼hren">
							<Icon src={MagnifyingGlass} solid size="16" />
						</button>
					</form>

					<div class="syntax-help" id="syntax-help">
						<strong>Syntax:</strong>
						<span>"Zitat"</span>
						<span>-Ausschluss</span>
						<span>title:</span>
						<span>category:</span>
						<span>path:</span>
						<span>type:</span>
					</div>

					<div class="toolbar-row">
						<div id="search-options">
							<p>Suchen in</p>
							<label>
								<input type="checkbox" bind:checked={includeCategories} on:change={newSearch} />
								Kategorien
							</label>
							<label>
								<input type="checkbox" bind:checked={includeContent} on:change={newSearch} />
								Inhalt
							</label>
						</div>

						<label class="sort-control">
							<span>Sortierung</span>
							<select bind:value={sortInput} on:change={newSearch}>
								<option value="relevance">Relevanz</option>
								<option value="title-asc">Titel A-Z</option>
								<option value="domain">Bereich</option>
							</select>
						</label>
					</div>

					{#if activeChips.length > 0}
						<div class="active-chips" id="active-chips">
							{#each activeChips as chip}
								<span class="chip">{chip.label}</span>
							{/each}
						</div>
					{/if}
				</section>

				<section id="results" aria-live="polite">
					<div class="results-header">
						{#if data.query}
							<h2>Treffer fÃ¼r "{data.query}"</h2>
							<p>{data.results.length} Ergebnis{data.results.length === 1 ? '' : 'se'}</p>
						{:else}
							<h2>Suche starten</h2>
							<p>Gib einen Begriff ein, um das Wiki zu durchsuchen.</p>
						{/if}
					</div>

					{#if !data.query}
						<p class="empty-state">
							Die Suchseite durchsucht standardmÃ¤ÃŸig Titel, Kategorien und Artikelinhalte.
							Mit Filtern und Syntax lÃ¤sst sich die Suche gezielt eingrenzen.
						</p>
					{:else if data.results.length === 0}
						<div class="empty-state">
							<p>Keine Treffer gefunden.</p>
							{#if data.suggestions.broadenSearch}
								<p>Die Suche kann erweitert werden, indem Filter oder AusschlÃ¼sse entfernt werden.</p>
							{/if}
							{#if data.suggestions.nearbyQueries.length > 0}
								<p>Nahe Suchanfragen: {data.suggestions.nearbyQueries.join(', ')}</p>
							{/if}
						</div>
					{:else}
						{#each data.results as result}
							<SearchEntry
								title={result.item.title}
								href={result.item.href}
								excerpts={result.excerpts}
								titleHighlights={result.titleHighlights ?? []}
								domainLabel={result.domain?.label ?? ''}
								pageType={result.pageType ?? ''}
								categories={result.categories ?? []}
							/>
						{/each}
					{/if}
				</section>
			</section>

			<aside class="facet-rail">
				<section class="facet-group">
					<h3>Bereiche</h3>
					<div class="facet-list">
						{#each data.facets.domains as facet}
							<label class="facet-option">
								<input
									type="checkbox"
									checked={selectedDomains.includes(facet.key)}
									on:change={() => toggleDomain(facet.key)}
								/>
								<span>{facet.label}</span>
								<small>{facet.count}</small>
							</label>
						{/each}
					</div>
				</section>

				<section class="facet-group">
					<h3>Seitentypen</h3>
					<div class="facet-list">
						{#each data.facets.pageTypes as facet}
							<label class="facet-option">
								<input
									type="checkbox"
									checked={selectedPageTypes.includes(facet.key)}
									on:change={() => togglePageType(facet.key)}
								/>
								<span>{facet.label}</span>
								<small>{facet.count}</small>
							</label>
						{/each}
					</div>
				</section>

				<section class="facet-group">
					<h3>Kategorien</h3>
					<div class="facet-list">
						{#each data.facets.categories as facet}
							<label class="facet-option">
								<input
									type="checkbox"
									checked={selectedCategories.includes(facet.key)}
									on:change={() => toggleCategory(facet.key)}
								/>
								<span>{facet.label}</span>
								<small>{facet.count}</small>
							</label>
						{/each}
					</div>
				</section>
			</aside>
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
		max-width: 44rem;
		color: rgba(0, 0, 0, 0.7);
		line-height: 1.6;
	}

	.search-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 18rem;
		gap: 1.25rem;
		align-items: start;
	}

	.search-main {
		display: grid;
		gap: 1.25rem;
	}

	.search-controls,
	#results,
	.facet-group {
		padding: 1.15rem 1.25rem;
		border-radius: 0.9rem;
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
			background: var(--secondary-background-color);
		}
	}

	.syntax-help {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.65rem;
		margin-top: 0.95rem;
		font-size: 0.88rem;
		color: rgba(0, 0, 0, 0.68);

		span {
			padding: 0.25rem 0.5rem;
			border-radius: 999px;
			background: rgba(0, 0, 0, 0.04);
		}
	}

	.toolbar-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	#search-options {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;

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

	.sort-control {
		display: grid;
		gap: 0.35rem;
		font-size: 0.92rem;

		select {
			padding: 0.55rem 0.8rem;
			border-radius: 0.7rem;
			border: 1px solid rgba(0, 0, 0, 0.14);
			background: var(--secondary-background-color);
		}
	}

	.active-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.chip {
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.05);
		font-size: 0.86rem;
	}

	.results-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;

		h2,
		p {
			margin: 0;
		}

		p {
			color: rgba(0, 0, 0, 0.68);
		}
	}

	#results {
		display: grid;
		gap: 1rem;
	}

	.facet-rail {
		display: grid;
		gap: 1rem;
	}

	.facet-group {
		display: grid;
		gap: 0.85rem;

		h3 {
			margin: 0;
			font-size: 1rem;
		}
	}

	.facet-list {
		display: grid;
		gap: 0.55rem;
	}

	.facet-option {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.55rem;
		align-items: center;
		font-size: 0.92rem;
	}

	.empty-state {
		margin: 0;
		color: rgba(0, 0, 0, 0.72);
		line-height: 1.65;
	}

	@media (max-width: 900px) {
		.search-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
