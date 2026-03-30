<script lang="ts">
	import type { SearchPreviewResponse } from '$lib/searchContracts';
	import { buildHighlightedHtml } from '$lib/searchCore';
	import { debounce } from '$lib/utilities/utilities';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';

	type SearchPreviewItem = {
		href: string;
		title: string;
	};

	type SearchResultPreview = {
		href: string;
		text: string;
	};

	let searchText = '';
	let searchResults: SearchResultPreview[] = [];
	let showResults = false;
	let isFocused = false;

	const handleSearchInput = debounce(async () => {
		if (searchText.trim().length > 0) {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchText.trim())}&preview=true`);
			const previewResponse = (await response.json()) as SearchPreviewResponse;
			searchResults = previewResponse.results.map((result) => {
				const item = JSON.parse(result.item) as SearchPreviewItem;
				return {
					href: item.href,
					text: buildHighlightedHtml(item.title, result.titleHighlights ?? [])
				};
			});
			showResults = searchResults.length > 0;
		} else {
			searchResults = [];
			showResults = false;
		}
	}, 100);

	const submitHandler = (event: Event) => {
		if (!searchText.trim()) {
			event.preventDefault();
		}
	};

	const handleFocus = () => {
		isFocused = true;
		if (searchText.trim().length > 0 && searchResults.length > 0) {
			showResults = true;
		}
	};

	const handleBlur = () => {
		setTimeout(() => {
			isFocused = false;
			showResults = false;
		}, 300);
	};
</script>

<form id="searchbar" action="/content/search" method="get" on:submit={submitHandler}>
	<input
		type="text"
		name="q"
		placeholder="Im Wiki suchen..."
		bind:value={searchText}
		on:input={handleSearchInput}
		on:focus={handleFocus}
		on:blur={handleBlur}
		autocomplete="off"
	/>
	<button type="submit">
		<Icon src={MagnifyingGlass} solid size="16" />
	</button>

	{#if showResults && isFocused}
		<div id="search-results">
			<div id="result-list">
				<ul>
					{#each searchResults as result}
						<li>
							<a href={result.href} on:focus={handleFocus} on:blur={handleBlur}>
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html result.text}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div id="content-search">
				<a href={`/content/search?q=${encodeURIComponent(searchText.trim())}&includeContent=true`}>
					Nach Seiten mit "{searchText}" im Inhalt suchen
				</a>
			</div>
		</div>
	{/if}
</form>

<style lang="scss">
	#searchbar {
		display: flex;
		flex-flow: row nowrap;
		gap: 0.65rem;
		width: 100%;
		max-width: 320px;
		position: relative;

		input {
			width: 100%;
			font-size: 0.94rem;
			padding: 0.8rem 1rem;
			border-radius: 999px;
			border: 1px solid rgba(112, 88, 48, 0.15);
			background: rgba(247, 242, 232, 0.96);
			color: var(--primary-color);

			&:focus {
				outline: none;
				border-color: rgba(112, 88, 48, 0.32);
				box-shadow: 0 0 0 4px rgba(141, 95, 32, 0.08);
			}
		}

		button {
			width: 2.9rem;
			height: 2.9rem;
			border-radius: 50%;
			flex-shrink: 0;
			border: 1px solid rgba(112, 88, 48, 0.15);
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			transition:
				border-color 0.2s ease,
				background-color 0.2s ease,
				transform 0.2s ease;
			background: linear-gradient(180deg, rgba(244, 235, 219, 0.98), rgba(231, 216, 188, 0.98));

			&:hover {
				border-color: rgba(112, 88, 48, 0.34);
				background-color: rgba(231, 216, 188, 1);
				transform: translateY(-1px);
			}

			&:focus {
				outline: none;
			}
		}

		#search-results {
			margin: 0;
			padding: 0;
			position: absolute;
			top: 100%;
			left: 0;
			width: 100%;
			background-color: var(--surface-strong);
			border: 1px solid var(--border-subtle);
			border-radius: 0.75rem;
			box-shadow: var(--shadow-soft);
			z-index: 1000;
			font-size: 14px;
			min-width: min(100vw - 2rem, 24rem);

			#result-list {
				padding: 0.5rem;
				max-height: 18rem;
				overflow-y: auto;

				ul {
					margin: 0;
					padding: 0;
					list-style-type: none;

					li {
						padding: 0;

						a {
							color: var(--primary-color);
							text-decoration: none;
							padding: 0.75rem 0.8rem;
							border-radius: 0.75rem;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							display: block;
							width: 100%;

							&:hover {
								background-color: var(--secondary-background-color);
							}
						}
					}
				}
			}

			#content-search {
				padding: 0.9rem 1rem 1rem;
				border-top: 1px solid var(--border-subtle);
				text-align: center;

				a {
					color: var(--accent-strong);
					text-decoration: none;
					font-size: 0.92rem;

					&:hover {
						text-decoration: underline;
					}
				}
			}
		}
	}
</style>
