<script lang="ts">
	import { onMount } from 'svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let container: HTMLDivElement | undefined = $state();
	let textOverflows = $state(false);
	let tooltipStyle = $state({
		top: '0',
		left: '0',
		maxWidth: '0'
	});

	function checkOverflow() {
		if (container) {
			textOverflows = container.scrollWidth > container.clientWidth;
		}
	}

	onMount(() => {
		checkOverflow();
		const resizeObserver = new ResizeObserver(checkOverflow);
		resizeObserver.observe(container!);
		return () => resizeObserver.disconnect();
	});

	function handleMouseEnter() {
		if (textOverflows && container) {
			const rect = container.getBoundingClientRect();

			let top = rect.top;
			let left = rect.left;
			const maxWidth = window.innerWidth - left;

			tooltipStyle = {
				top: `${top}px`,
				left: `${left}px`,
				maxWidth: `${maxWidth}px`
			};
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={container}
	class="container {textOverflows ? 'hoverable' : ''}"
	onmouseenter={handleMouseEnter}
>
	{@render children?.()}
	{#if textOverflows}
		<div
			class="tooltip"
			style="top: {tooltipStyle.top}; left: {tooltipStyle.left}; max-width: {tooltipStyle.maxWidth};"
		>
			{@render children?.()}
		</div>
	{/if}
</div>

<style lang="scss">
	.container {
		position: relative;
		display: inline-block;
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;

		&.hoverable:hover .tooltip {
			visibility: visible;
		}
	}

	.tooltip {
		visibility: hidden;
		background-color: white;
		text-align: left;
		width: fit-content;
		position: fixed;
		white-space: normal; // Allow text wrapping
		z-index: 10;
		word-wrap: break-word; // Break long words if necessary
		padding: 0;
	}
</style>
