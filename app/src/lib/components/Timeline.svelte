<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { EvCatPair } from '$lib/timeline';

	export let timeline: EvCatPair[];

	let svg: SVGSVGElement;

	let effectiveWidth: number;
	let effectiveHeight: number;

	let width = 1200;
	let zoomScale = 1;
	let translateX = width / 2;

	let scale: d3.ScaleLinear<number, number>;
	let axis: d3.Axis<d3.NumberValue>;
	let zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;

	const eventHeight = 20;
	const eventRowSpacing = 5;

	function renderTimeline() {
		scale = d3
			.scaleLinear()
			.domain([(translateX - width / 2) / zoomScale, (translateX + width / 2) / zoomScale])
			.range([0, width]);

		axis = d3.axisBottom(scale);
		d3.select(svg).select<SVGGElement>('g.axis').transition().duration(10).call(axis);

		zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
			zoomScale = event.transform.k;
			translateX = width / 2 - event.transform.x;
			renderTimeline();
		});
		d3.select(svg).call(zoom);

		renderEvents();
	}

    /* TODO:
        * Avoid jumping events (apply scale for row calc?)
        * visual difference between moments (pin/flag, above axis) and ranges (rect/container, below axis)
        * parse containers: (14) belongs to container 14, [14] IS container 14
        * create view for event description
        * vertical dashed lines at axis steps
    */

	function renderEvents() {
		const eventGroup = d3.select(svg).select<SVGGElement>('.events');

		if (!eventGroup.empty()) {
			eventGroup.remove();
		}

		const events = d3.select(svg).append('g').attr('class', 'events');

		const eventData = timeline.map((d) => ({
			...d,
			x: scale(d.event.start),
			width:
				d.event.start === d.event.end
					? Math.max(getTextWidth(d.event.text, '14px Arial') + 10, 10)
					: scale(d.event.end) - scale(d.event.start),
			y: effectiveHeight / 2 - 50
		}));

		eventData.sort((a, b) => a.x - b.x);

		const eventRows: { [key: number]: number } = {}; // Stores the y position for each row

		eventData.forEach((event, index) => {
			let row = 0;
			while (eventRows[row] && eventRows[row] >= event.x) {
				row++;
			}

			// Update y position and store the end position of the current row
			event.y -= row * (eventHeight + eventRowSpacing);
			eventRows[row] = event.x + event.width;
		});

		events
			.selectAll('rect.event')
			.data(eventData)
			.enter()
			.append('rect')
			.attr('class', 'event')
			.attr('x', (d) => d.x)
			.attr('width', (d) => d.width)
			.attr('y', (d) => d.y)
			.attr('height', eventHeight)
			.attr('fill', (d) => d.category.color)
			.append('title')
			.text((d) => d.event.text);

		events
			.selectAll('text.event-label')
			.data(eventData)
			.enter()
			.append('text')
			.attr('class', 'event-label')
			.attr('x', (d) => d.x + 5) // Adjust label positioning
			.attr('y', (d) => d.y + 15) // Adjust as necessary
			.attr('fill', (d) => d.category.font_color)
			.text((d) => d.event.text);
	}

	function getTextWidth(text: string, font: string): number {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (context) {
			context.font = font;
			return context.measureText(text).width;
		}
		return 0;
	}

	onMount(() => {
		renderTimeline();
	});
</script>

<div class="timeline" bind:clientWidth={effectiveWidth} bind:clientHeight={effectiveHeight}>
	<svg bind:this={svg}>
		<g class="axis"></g>
		<g class="events"></g>
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
