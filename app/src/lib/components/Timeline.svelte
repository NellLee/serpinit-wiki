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
	const eventAxisOffset = 50;

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
	 * visual difference between moments (pin & flag) and non-moments
	 * adjust row calculation for container layout
	 * create view for event description
	 * vertical dashed lines at axis steps
	 */

	function renderEvents() {
		const eventGroup = d3.select(svg).select<SVGGElement>('.events');

		if (!eventGroup.empty()) {
			eventGroup.remove();
		}

		const events = d3.select(svg).append('g').attr('class', 'events');

		const eventData = timeline.map((d) => {
			let width = scale(d.event.end) - scale(d.event.start);
			let isMoment = width === 0;
			let y = effectiveHeight / 2;
			if (isMoment) {
				width = Math.max(getTextWidth(d.event.text, '14px Arial') + 10, 10);
				y -= eventAxisOffset;
			} else {
				y += eventAxisOffset;
			}

			let isContainer = false;
			let containerId = null;
			let containerDeclarationMatch = d.event.text.match(/^\[(\d+)\]/); // e.g. "[14]"
			let containerReferenceMatch = d.event.text.match(/^\((\d+)\)/); // e.g. "(14)"
			if (containerDeclarationMatch) {
				isContainer = true;
				containerId = parseInt(containerDeclarationMatch[1]);
			} else if (containerReferenceMatch) {
				containerId = parseInt(containerReferenceMatch[1]);
			}

			return {
				...d,
				x: scale(d.event.start),
				width,
				y,
				isMoment,
				containerId,
				isContainer
			};
		});

		eventData.sort((a, b) => a.x - b.x).reverse();

		const eventRows: { [key: number]: number } = {}; // Stores the y position for each row

		for (let isMoment of [true, false]) {
			for (let event of eventData.filter((event) => event.isMoment === isMoment)) {
            
				let momentFactor = isMoment ? -1 : 1;
				let row = momentFactor;

				while (eventRows[row] && eventRows[row] <= event.x + event.width) {
					row += momentFactor;
				}

				// Update y position and store the end position of the current row
				event.y += (row - momentFactor) * (eventHeight + eventRowSpacing);
				eventRows[row] = event.x;
			}
		}

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
