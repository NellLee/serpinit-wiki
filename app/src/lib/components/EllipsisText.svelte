<script lang="ts">
	import { onMount } from 'svelte';

	let container: HTMLDivElement;
	let textOverflows = false;
	let tooltipStyle = {
		top: '0',
		left: '0',
		maxWidth: '0'
	};

	function checkOverflow() {
		if (container) {
			textOverflows = container.scrollWidth > container.clientWidth;
		}
	}

	onMount(() => {
		checkOverflow();
		const resizeObserver = new ResizeObserver(checkOverflow);
		resizeObserver.observe(container);
		return () => resizeObserver.disconnect();
	});

	function handleMouseEnter() {
		if (textOverflows) {
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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	bind:this={container}
	class="container {textOverflows ? 'hoverable' : ''}"
	on:mouseenter={handleMouseEnter}
>
	<slot />
	{#if textOverflows}
		<div
			class="tooltip"
			style="top: {tooltipStyle.top}; left: {tooltipStyle.left}; max-width: {tooltipStyle.maxWidth};"
		>
			<slot />
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
