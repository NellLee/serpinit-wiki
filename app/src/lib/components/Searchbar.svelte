<script lang="ts">
	import { debounce } from '$lib/utilities/utilities';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';

	let searchText = '';
	let searchResults: any[] = [];
	let showResults = false;
	let isFocused = false;

	const handleSearchInput = debounce(async () => {
		if (searchText.trim().length > 0) {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchText.trim())}`);
			const results = await response.json();
			results.forEach(
				(result: any) => (result.item = JSON.parse(result.item as unknown as string))
			);
			searchResults = results.map((result: any) => {
				const regex = new RegExp(`(${searchText.trim()})`, 'gi'); // Create a regex for the search text (case insensitive)
				return {
					href: result.item.href,
					text: result.item.title.replace(regex, `<strong>$1</strong>`) // Replace with bolded version
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
		placeholder="Search..."
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
								{@html result.text}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div id="content-search">
				<a href={`/content/search?q=${encodeURIComponent(searchText.trim())}&includeContent=true`}>
					Search for pages containing '{searchText}'
				</a>
			</div>
		</div>
	{/if}
</form>

<style lang="scss">
	#searchbar {
		display: flex;
		flex-flow: row nowrap;
		gap: 10px;
		width: 100%;
		max-width: 300px;
		position: relative;

		input {
			width: 100%;
			font-size: 12px;
			padding-left: 10px;
			border-radius: 5px;
			border: 2px solid var(--tertiary-background-color);
		}

		button {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			flex-shrink: 0;
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

		#search-results {
			margin: 0;
			padding: 0;
			position: absolute;
			top: 100%;
			left: 0;
			width: 100%;
			background-color: white;
			border: 1px solid var(--primary-border-color);
			border-radius: 5px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			z-index: 1000;
			font-size: 14px;
			#result-list {
				padding: 5px;
				max-height: 200px;
				overflow-y: auto;

				ul {
					margin: 0;
					padding: 0;
					list-style-type: none;

					li {
						padding: 5px 10px;

						&:hover {
							background-color: #f0f0f0;
						}

						a {
							color: var(--primary-color);
							text-decoration: none;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							display: block;
							width: 100%;
						}
					}
				}
			}

			#content-search {
				padding: 10px;
				border-top: 1px solid var(--primary-border-color);
				text-align: center;

				a {
					color: var(--secondary-color);
					text-decoration: underline;
					font-size: 14px;
				}
			}
		}
	}
</style>
