<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Category, Event, EvCatPair } from '$lib/timeline';
	import { assert } from 'console';
	import { partitionArray } from '$lib/utilities/utilities';

	export let timeline: EvCatPair[];

	type RowConfig = {
		start: number;
		end: number;
		yOffset: number;
		height: number;
		containerId?: number;
	};

	type EventConfig = {
		x: number;
		width: number;
		y: number;
		height: number
		isMoment: boolean;
		containerId: number | null;
		isContainer: boolean;
		index: number;
		event: Event;
		category: Category;
		text: string;
	};

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

		const eventData: EventConfig[] = timeline.map((d) => {

			let isContainer = false;
			let containerId = null;
			let containerDeclarationMatch = d.event.text.match(/^\[(\d+)\]/); // e.g. "[14]"
			let containerReferenceMatch = d.event.text.match(/^\((\d+)\)/); // e.g. "(14)"
			let text = d.event.text
			if (containerDeclarationMatch) {
				isContainer = true;
				containerId = parseInt(containerDeclarationMatch[1]);
				text = d.event.text.slice(containerDeclarationMatch[0].length)
			} else if (containerReferenceMatch) {
				containerId = parseInt(containerReferenceMatch[1]);
				text = d.event.text.slice(containerReferenceMatch[0].length)
			}

			let y = effectiveHeight / 2;
			let width = scale(d.event.end) - scale(d.event.start);
			let isMoment = width === 0;
			if (isMoment) {
				width = Math.max(getTextWidth(text, '14px Arial') + 10, 10);
			}

			return {
				...d,
				x: scale(d.event.start),
				width,
				y,
				height: eventHeight,
				isMoment,
				containerId,
				isContainer,
				text
			};
		});

		eventData.sort((a, b) => a.x - b.x).reverse();
		
		// This also ensures correct render order
		const partitionedEvents = partitionArray(eventData, (event: EventConfig) => {
			if (event.isMoment) {
				return 0;
			} else if (event.isContainer) {
				return 1;
			} else if (event.containerId !== null) {
				return 2;
			} else {
				return 3;
			}
		}, 4)
		const [momentEvents, containerEvents, containedEvents, normalEvents] = partitionedEvents

		layoutUpperRows(momentEvents)
		layoutLowerRows(containerEvents, containedEvents, normalEvents)

		events
		.selectAll('rect.event')
		.data(partitionedEvents.flat())
		.enter()
		.append('rect')
		.attr('class', 'event')
		.attr('x', (d) => d.x)
		.attr('width', (d) => d.width)
		.attr('y', (d) => d.y)
		.attr('height', (d) => d.height)
		.attr('fill', (d) => d.category.color)
		.attr("style", "outline: thin solid black;")
		.append('title')
		.text((d) => d.text);

		events
			.selectAll('text.event-label')
			.data(partitionedEvents.flat())
			.enter()
			.append('text')
			.attr('class', 'event-label')
			.attr('x', (d) => d.x + 5) // Adjust label positioning
			.attr('y', (d) => d.y + 15) // Adjust as necessary
			.attr('fill', (d) => d.category.font_color)
			.text((d) => d.text);
	}


	function calculateRows(events: EventConfig[], upwards: boolean, offset: number = eventAxisOffset): RowConfig[] {
		const o = upwards ? -1 : 1;
		
		const result: RowConfig[] = [];

		for (let event of events) {
			let row = 0;

			while (result[row] && result[row].end <= event.x + event.width) {
				row++;
			}
			let prevRow = result[row - 1] ?? null;
			let newYOffset = o*offset;
			if (prevRow) {
				newYOffset = prevRow.yOffset + o*(prevRow.height + eventRowSpacing);
			}
			result[row] = {
				start: result[row]?.start ?? event.x + event.width,
				end: event.x,
				yOffset: newYOffset,
				height: eventHeight
			};
			event.y += result[row].yOffset;
		}

		return result
	}
	
	function layoutUpperRows(momentEvents: EventConfig[]) {
		calculateRows(momentEvents, true)
	}

	function layoutLowerRows(containerEvents: EventConfig[], containedEvents: EventConfig[], normalEvents: EventConfig[]) {
		const rowConfig: RowConfig[] = [];

		for (let container of containerEvents) {
			const containerId = container.containerId;
			assert(containerId !== null)
			let row = 0;

			while (rowConfig[row] && rowConfig[row].end <= container.x + container.width) {
				row++;
			}
			let prevRow = rowConfig[row - 1] ?? null;
			let newY = eventAxisOffset;
			if (prevRow) {
				newY = prevRow.yOffset + prevRow.height + eventRowSpacing;
			}

			const containerRowConfig = calculateRows(containedEvents.filter(event => event.containerId == containerId), false, newY)
			const containerHeight = containerRowConfig.reduce((acc, event, index) => {
				if (index === containerRowConfig.length - 1) {
					return acc + event.height;
				} else {
					return acc + event.height + eventRowSpacing;
				}
			}, 0)

			rowConfig[row] = {
				start: rowConfig[row]?.start ?? container.x + container.width,
				end: container.x,
				yOffset: newY,
				height: containerHeight
			};
			container.y += rowConfig[row].yOffset - 2;
			container.height = rowConfig[row].height + 4;

		}

		let nonContainerOffset = eventAxisOffset
		const lastContainerRow = rowConfig.at(-1)
		if(lastContainerRow) {
			nonContainerOffset = lastContainerRow.yOffset + lastContainerRow.height + eventRowSpacing
		}

		calculateRows(normalEvents, false, nonContainerOffset)
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
