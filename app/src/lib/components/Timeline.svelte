<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let svg: SVGSVGElement;

    let effectiveWidth: number;
    let width: number;
    let effectiveHeight: number;
    let height: number;
	let zoomScale = 1;
	let translateX = 0;

	function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
		zoomScale = event.transform.k;
		translateX = width / 2 - event.transform.x;
		renderTimeline();
	}

	function renderTimeline() {
		const scale = d3
			.scaleLinear()
			.domain([
				(translateX - width / 2) / zoomScale,
				(translateX + width / 2) / zoomScale
			])
			.range([0, width]);

		const axis = d3.axisBottom(scale);

		d3.select(svg).select<SVGGElement>('g.axis').transition().duration(10).call(axis)
	}

	onMount(() => {
        width = Math.max(effectiveWidth, 600);
        height = Math.max(effectiveHeight, 300);
        translateX = width/2;

		const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.01, 100]).on('zoom', zoomed);

		d3.select(svg).call(zoom);

		renderTimeline();
	});
</script>

<div class="timeline" bind:clientWidth={effectiveWidth} bind:clientHeight={effectiveHeight}>
	<svg bind:this={svg} {width} {height}>
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
			.axis {
				transform: translateY(50px);
			}
		}
	}
</style>
