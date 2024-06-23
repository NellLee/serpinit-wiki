<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronDown, ChevronUp, Icon } from 'svelte-hero-icons';

	export let title: string;
	export let href: string;
	export let excerpts: string[];

	let expanded = false;
	let totalHeight = 0;
	let container: HTMLDivElement | null = null;

	onMount(() => {
		if (container) {
			totalHeight = container.scrollHeight;
		}
	});

	function toggleExpand() {
		expanded = !expanded;
	}

	$: shouldShowExpandButton = totalHeight > 500;
</script>

<!-- TODO: expander is sometimes visible when there is nothing to expand -->

<div class="search-result">
	<div class="title">
		<a {href}>{title}</a>
	</div>

	<div
		class="excerpts"
		style={expanded
			? 'max-height: none; overflow: visible;'
			: 'max-height: 300px; overflow: hidden;'}
		bind:this={container}
	>
		{#each excerpts as excerpt}
			<hr />
			<div class="excerpt">{@html excerpt}</div>
		{/each}
	</div>

	{#if expanded || shouldShowExpandButton}
		{#if !expanded && shouldShowExpandButton}
			<hr />
		{/if}
		<button id="result-expander" on:click={toggleExpand}>
			{#if expanded}
				<Icon src={ChevronUp} solid size="16" />
				Show less
				<Icon src={ChevronUp} solid size="16" />
			{:else}
				<Icon src={ChevronDown} solid size="16" />
				Show more
				<Icon src={ChevronDown} solid size="16" />
			{/if}
		</button>
	{/if}
</div>

<style lang="scss">
	.search-result {
		padding: 15px;
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f9f9f9;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		.title {
			font-size: 1.6em;
			margin-bottom: 5px;

			a {
				text-decoration: none;
				color: #1a0dab;
				font-weight: bold;

				&:hover {
					text-decoration: underline;
				}
			}
		}

		hr {
			border: 1px dashed #00000080;
			border-style: none none dashed;
			color: #fff;
			background-color: #fff;
		}

		.excerpts {
			overflow: hidden; /* Hide overflowing content */
		}

		.excerpt {
			font-size: 90%;
			margin: 10px 0;
			color: #333;

			:global(a) {
				text-decoration: none;
				color: inherit;

				&:hover {
					text-decoration: underline;
				}
			}

			:global(:is(h1, h2, h3, h4, h5, h6)) {
				font-size: medium;
				margin: 5px 0;
			}
		}

		#result-expander {
			width: 100%;
			height: 30px;
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			gap: 10px;
			background-color: var(--primary-background-color);
			border: 1px solid #dadada;
			border-radius: 5px;
			margin: auto;

			&:hover {
				background-color: var(--secondary-background-color);
			}
		}
	}

	button {
		margin-top: 10px;
	}
</style>
