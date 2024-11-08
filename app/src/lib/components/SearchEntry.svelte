<script lang="ts">
	import { onMount, afterUpdate } from "svelte";
	import { ChevronDown, ChevronUp, Icon } from "svelte-hero-icons";

	export let title: string;
	export let href: string;
	export let excerpts: string[];

	let expanded = false;
	let containerRef: HTMLDivElement | null = null;
	const maxHeight = 300;
	const fuzzyAllowedHeightOffset = 40

	function toggleExpand() {
		expanded = !expanded;
	}

	$: shouldShowExpandButton = containerRef && containerRef.scrollHeight > containerRef.clientHeight + fuzzyAllowedHeightOffset;
</script>

<div class="search-result">
	<div class="title">
		<a {href}>{title}</a>
	</div>

	<div
		class="excerpts"
		style={expanded ? "max-height: none;" : `max-height: ${maxHeight}px;`}
		bind:this={containerRef}
	>
		{#each excerpts as excerpt, index}
			<div class="excerpt">
				<hr />
				{@html excerpt}
			</div>
		{/each}
	</div>
	{#if !expanded && shouldShowExpandButton}
		<div class="overlay"></div>
	{/if}

	{#if expanded || shouldShowExpandButton}
		<button id="result-expander" on:click={toggleExpand}>
			{#if expanded}
				<Icon src={ChevronUp} solid size="16" />
				Weniger anzeigen
				<Icon src={ChevronUp} solid size="16" />
			{:else}
				<Icon src={ChevronDown} solid size="16" />
				Mehr anzeigen
				<Icon src={ChevronDown} solid size="16" />
			{/if}
		</button>
	{/if}
</div>

<style lang="scss">
	.search-result {
		padding: 15px;
		border: 1px solid var(--primary-border-color);
		border-radius: 5px;
		background-color: var(--alternative-primary-background-color);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		.title {
			font-size: 1.6em;
			margin-bottom: 5px;

			a {
				text-decoration: none;
				font-weight: bold;

				&:hover {
					text-decoration: underline;
				}
			}
		}

		hr {
			border: 1px dashed rgba(black, 0.5);
			border-style: none none dashed;
			color: white;
			background-color: white;
		}

		.excerpts {
			overflow: hidden;

			.excerpt {
				font-size: 90%;
				margin: 10px 0;

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

				:global(mark) {
					color: rgb(207, 19, 19);
					background-color: transparent;
				}
			}
		}
		.overlay {
			position: relative;
			top: -80px;
			width: 100%;
			height: 80px;
			margin-bottom: -80px;
			background: linear-gradient(
				to bottom,
				rgba(2, 0, 36, 0) 0%,
				rgba(249, 249, 249, 0.2) 50%,
				rgba(249, 249, 249, 0.4) 70%,
				rgba(249, 249, 249, 0.8) 100%
			);
			pointer-events: none;
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
