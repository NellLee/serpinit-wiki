<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { SEARCH_CATALOG_URL } from '$lib/constants';
	import HintTooltip from '$lib/components/HintTooltip.svelte';
	import type { SearchCatalog } from '$lib/searchContracts';
	import MidPanel from '$lib/components/MidPanel.svelte';
	import SearchEntry from '$lib/components/SearchEntry.svelte';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';

	let { data } = $props();

	/* eslint-disable svelte/valid-compile -- intentional initial-value-only reads, not reactive to prop changes */
	let searchInput = $state(data.query);
	let includeCategories = $state(data.activeFilters.includeCategories);
	let includeContent = $state(data.activeFilters.includeContent);
	let sortInput = $state(data.sort);
	let fuzzinessInput = $state(data.activeFilters.fuzziness);
	let selectedDomains = $state([...data.activeFilters.domains]);
	let selectedPageTypes = $state([...data.activeFilters.pageTypes]);
	let selectedCategories = $state([...data.activeFilters.categories]);
	/* eslint-enable svelte/valid-compile */

	const fuzzinessLabels = ['Exakt', 'Streng', 'Normal', 'Locker', 'Sehr locker'];

	// The category list is only needed for the tooltip, so it must not delay the page.
	let catalog: SearchCatalog | null = $state(null);
	let catalogFailed = $state(false);

	onMount(async () => {
		try {
			const response = await fetch(SEARCH_CATALOG_URL);
			if (!response.ok) {
				throw new Error(`Catalog request failed with status ${response.status}`);
			}
			catalog = await response.json();
		} catch {
			catalogFailed = true;
		}
	});

	const asFilterValue = (label: string) => (/\s/.test(label) ? `"${label}"` : label);

	function findFacetLabel(
		facets: Array<{ key: string; label: string }>,
		key: string,
		fallback = key
	) {
		return facets.find((facet) => facet.key === key)?.label ?? fallback;
	}

	let activeChips = $derived([
		...selectedDomains.map((value) => ({
			kind: 'domain',
			value,
			label: `Bereich: ${findFacetLabel(data.facets.domains, value)}`
		})),
		...selectedPageTypes.map((value) => ({
			kind: 'pageType',
			value,
			label: `Seitentyp: ${findFacetLabel(data.facets.pageTypes, value)}`
		})),
		...selectedCategories.map((value) => ({
			kind: 'category',
			value,
			label: `Kategorie: ${findFacetLabel(data.facets.categories, value)}`
		})),
		...data.parsedQuery.fieldFilters.title.map((value) => ({
			kind: 'title',
			value,
			label: `title:${value}`
		})),
		...data.parsedQuery.fieldFilters.category.map((value) => ({
			kind: 'query-category',
			value,
			label: `category:${value}`
		})),
		...data.parsedQuery.fieldFilters.path.map((value) => ({
			kind: 'path',
			value,
			label: `path:${value}`
		})),
		...data.parsedQuery.fieldFilters.type.map((value) => ({
			kind: 'type',
			value,
			label: `type:${value}`
		})),
		...data.parsedQuery.exclusions.map((value) => ({
			kind: 'query',
			value,
			label: `-${value}`
		}))
	]);

	let hasFacets = $derived(
		data.facets.domains.length > 0 ||
			data.facets.pageTypes.length > 0 ||
			data.facets.categories.length > 0
	);

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
		params.set('fuzziness', String(fuzzinessInput));

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
		{#snippet head()}
			<div class="utility-head">
				<p class="eyebrow">Werkzeug</p>
				<h1>{title}</h1>
				<p class="lede">
					Durchsuche das Wiki mit Bereichen, Seitentypen, Kategorien und einer knappen
					Erweiterungssyntax.
				</p>
			</div>
		{/snippet}

		{#snippet content()}
			<div class="utility-content search-layout">
				<section class="search-main">
					<section class="search-controls">
						<form
							onsubmit={(event) => {
								event.preventDefault();
								newSearch();
							}}
							id="searchbar"
						>
							<input type="text" bind:value={searchInput} placeholder="Im Wiki suchen..." />
							<button type="submit" aria-label="Suche ausführen">
								<Icon src={MagnifyingGlass} solid size="16" />
							</button>
						</form>

						<div class="syntax-help" id="syntax-help">
							<strong>Feldfilter:</strong>
							<HintTooltip id="hint-phrase" label={'"Zitat"'}>
								<p>
									Anführungszeichen halten Wörter mit Leerzeichen zusammen, vor allem bei
									Feldfiltern.
								</p>
								<ul class="examples">
									<li><code>"Krieg um Navura"</code></li>
									<li><code>title:"Krieg um Navura"</code></li>
								</ul>
							</HintTooltip>
							<HintTooltip id="hint-exclusion" label="-Ausschluss">
								<p>
									Schließt Seiten aus, in denen das Wort in Titel, Pfad, Kategorien oder Text
									vorkommt.
								</p>
								<ul class="examples">
									<li><code>Krieg -Navura</code></li>
									<li><code>Magie -Rune</code></li>
								</ul>
							</HintTooltip>
							<HintTooltip id="hint-title" label="title:">
								<p>Nur Seiten, deren Titel den Begriff enthält.</p>
								<ul class="examples">
									<li><code>title:Vorenkai</code></li>
									<li>
										<code>title:Krieg Navura</code> (Titel enthält „Krieg“, Text enthält „Navura“)
									</li>
								</ul>
							</HintTooltip>
							<HintTooltip id="hint-category" label="category:">
								<p>Nur Seiten mit dieser Kategorie. Auch Seitennamen zählen als Kategorie.</p>
								<p class="hint-heading">Verfügbare Kategorien</p>
								{#if catalog}
									<ul class="category-list">
										{#each catalog.categories as category}
											<li>
												<code>{asFilterValue(category.label)}</code><small>{category.count}</small>
											</li>
										{/each}
									</ul>
								{:else if catalogFailed}
									<p>Die Kategorien konnten nicht geladen werden.</p>
								{:else}
									<p>Die Kategorien werden geladen …</p>
								{/if}
								<ul class="examples">
									<li><code>category:Fauna</code></li>
								</ul>
							</HintTooltip>
							<HintTooltip id="hint-path" label="path:" align="right">
								<p>Nur Seiten, deren Pfad den Text enthält. Ordner werden mit / getrennt.</p>
								<ul class="examples">
									<li><code>path:Volk</code></li>
									<li><code>path:Sodili/Charakter</code></li>
									<li><code>path:Himmelskörper/Agranum</code></li>
								</ul>
							</HintTooltip>
							<HintTooltip id="hint-type" label="type:" align="right">
								<p>Nur Seiten dieses Seitentyps.</p>
								<ul class="types">
									<li><code>article</code> Artikel</li>
									<li><code>index</code> Ordner-Übersicht</li>
									<li><code>media</code> Galerie</li>
									<li><code>hub</code> Startseite</li>
								</ul>
								<ul class="examples">
									<li><code>type:index</code></li>
								</ul>
							</HintTooltip>
						</div>

						<div class="toolbar-row">
							<div id="search-options">
								<p>Suchen in</p>
								<label>
									<input type="checkbox" bind:checked={includeCategories} onchange={newSearch} />
									Kategorien
								</label>
								<label>
									<input type="checkbox" bind:checked={includeContent} onchange={newSearch} />
									Inhalt
								</label>
							</div>

							<label class="sort-control">
								<span>Sortierung</span>
								<select bind:value={sortInput} onchange={newSearch}>
									<option value="relevance">Relevanz</option>
									<option value="title-asc">Titel A-Z</option>
									<option value="domain">Bereich</option>
								</select>
							</label>

							<label
								class="fuzziness-control"
								title="Wie tolerant die Suche gegenüber Tippfehlern ist. Exakt findet nur genau den eingegebenen Text."
							>
								<span>Unschärfe: <strong>{fuzzinessLabels[fuzzinessInput]}</strong></span>
								<input
									type="range"
									min="0"
									max={fuzzinessLabels.length - 1}
									step="1"
									bind:value={fuzzinessInput}
									onchange={newSearch}
									aria-valuetext={fuzzinessLabels[fuzzinessInput]}
								/>
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
								<h2>Treffer für "{data.query}"</h2>
								<p>{data.results.length} Ergebnis{data.results.length === 1 ? '' : 'se'}</p>
							{:else}
								<h2>Suche starten</h2>
								<p>Gib einen Begriff ein oder nutze Filter, um die Suche vorzubereiten.</p>
							{/if}
						</div>

						{#if !data.query}
							<div class="empty-state prose-state">
								<p>Die Suchseite durchsucht standardmäßig Titel, Kategorien und Artikelinhalte.</p>
								<p>Mit Filtern und Syntax lässt sich die Suche gezielt eingrenzen.</p>
							</div>
						{:else if data.results.length === 0}
							<div class="empty-state">
								<p>Keine Treffer gefunden.</p>
								{#if data.suggestions.broadenSearch}
									<p>
										Die Suche kann erweitert werden, indem Filter oder Ausschlüsse entfernt werden.
									</p>
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

				{#if data.query && hasFacets}
					<aside class="facet-rail">
						<section class="facet-group">
							<h3>Bereiche</h3>
							<div class="facet-list">
								{#each data.facets.domains as facet}
									<label class="facet-option">
										<input
											type="checkbox"
											checked={selectedDomains.includes(facet.key)}
											onchange={() => toggleDomain(facet.key)}
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
											onchange={() => togglePageType(facet.key)}
										/>
										<span>{facet.label}</span>
										<small>{facet.count}</small>
									</label>
								{/each}
							</div>
						</section>

						{#if data.facets.categories.length > 0}
							<section class="facet-group">
								<h3>Suche verfeinern</h3>
								<div class="facet-list">
									{#each data.facets.categories as facet}
										<label class="facet-option">
											<input
												type="checkbox"
												checked={selectedCategories.includes(facet.key)}
												onchange={() => toggleCategory(facet.key)}
											/>
											<span>{facet.label}</span>
											<small>{facet.count}</small>
										</label>
									{/each}
								</div>
							</section>
						{/if}
					</aside>
				{/if}
			</div>
		{/snippet}
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

		p {
			margin: 0;
		}

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			display: grid;
			gap: 0.25rem;
		}

		code {
			padding: 0.05rem 0.3rem;
			border-radius: 0.35rem;
			background: rgba(0, 0, 0, 0.06);
			font-size: 0.84rem;
		}

		.hint-heading {
			font-weight: 700;
		}

		.category-list {
			display: flex;
			flex-wrap: wrap;
			gap: 0.3rem 0.5rem;
			max-height: 15rem;
			overflow-y: auto;

			li {
				display: inline-flex;
				gap: 0.25rem;
				align-items: baseline;
			}

			small {
				color: rgba(0, 0, 0, 0.55);
			}
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

	.fuzziness-control {
		display: grid;
		align-content: start;
		gap: 0.35rem;
		font-size: 0.92rem;

		input[type='range'] {
			width: 11rem;
			margin: 0;
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

	.prose-state {
		display: grid;
		gap: 0.5rem;

		p {
			margin: 0;
		}
	}

	@media (max-width: 900px) {
		.search-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
