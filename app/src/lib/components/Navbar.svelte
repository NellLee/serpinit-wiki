<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';
	import { page } from '$app/stores';

	export let items: LinkObject[];
	let searchText = '';

	$: onSearchPage = $page.url.pathname.startsWith('/content/search');

	const submitHandler = (event: Event) => {
		if (!searchText.trim()) {
			event.preventDefault(); // Prevent form submission if search text is empty
		}
	};
</script>

<nav id="nav-bar">
	<ul>
		{#each items as item}
			<li>
				<a href={item.href}>{item.text}</a>
			</li>
		{/each}
	</ul>
	{#if !onSearchPage}
		<form id="searchbar" action="/content/search" method="get" on:submit={submitHandler}>
			<input type="text" name="q" placeholder="Search..." bind:value={searchText} />
			<button type="submit">
				<Icon src={MagnifyingGlass} solid size="16" />
			</button>
		</form>
	{/if}
</nav>

<style lang="scss">
	#nav-bar {
		width: 100%;
		background-color: var(--tertiary-background-color);
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		padding: 0 20px;
		height: 50px;
		align-items: center;
		ul {
			list-style-type: none;
			margin: 0;
			padding: 0;
			overflow: hidden;
			height: fit-content;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-start;
			align-items: baseline;
			gap: 15px;
			li {
				a {
					display: block;
					color: var(--primary-color);
					text-align: center;
					padding: 0;
					text-decoration: none;

					&:hover {
						color: var(--secondary-color);
					}
				}

				&:first-of-type {
					a {
						font-size: 18px;
					}
				}
			}
		}

		#searchbar {
			display: flex;
			flex-flow: row nowrap;
			gap: 10px;
			width: 300px;

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
		}
	}
</style>
