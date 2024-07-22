<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let svg: SVGSVGElement;

    let effectiveWidth: number;
    let effectiveHeight: number;

    let width = 1200;
	let zoomScale = 1;
	let translateX = width / 2;

	function renderTimeline() {
		const scale = d3
			.scaleLinear()
			.domain([
				(translateX - width / 2) / zoomScale - effectiveWidth,
				(translateX + width / 2) / zoomScale
			])
			.range([0, width]);

		const axis = d3.axisBottom(scale);

		d3.select(svg).select<SVGGElement>('g.axis').transition().duration(10).call(axis)

		const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', event => {
            zoomScale = event.transform.k;
            translateX = width / 2 - event.transform.x;
            renderTimeline();
        });

		d3.select(svg).call(zoom);
	}

	onMount(() => {
		renderTimeline();
	});
</script>

<div class="timeline" bind:clientWidth={effectiveWidth} bind:clientHeight={effectiveHeight}>
	<svg bind:this={svg}>
		<g class="axis"></g>
	</svg>
</div>

<style lang="scss">
	.timeline {
		border: 1px solid #ccc;
		width: 100%;
		height: 100%;
		margin: a;
		overflow: hidden;

		svg {
            width: 100%;
            height: 100%;

			.axis {
				transform: translateY(50%);
			}
		}
	}
</style>
