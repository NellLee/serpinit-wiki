<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { Category, Event, EvCatPair } from '$lib/timeline';
	import { assert, time } from 'console';
	import { getTextMeasure, partitionArray } from '$lib/utilities/utilities';

	export let timeline: EvCatPair[];
	export let selectedEvCatPair: EvCatPair | null = null; // Exported variable for selected event

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
		height: number;
		isMoment: boolean;
		containerId: number | null;
		isContainer: boolean;
		index: number;
		event: Event;
		category: Category;
		text: string;
	};

	let svg: SVGSVGElement;

	// 2 below: bound, not available until AFTER first mount hook
	let effectiveWidth: number | undefined;
	let effectiveHeight: number | undefined;

	let zoomScale = 1;
	let translateX: number | undefined;
	let translateY: number | undefined;

	let scale: d3.ScaleLinear<number, number>;
	let axis: d3.Axis<d3.NumberValue>;
	let zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
	let localeFormatter = d3.formatLocale({
		decimal: ',',
		thousands: '.',
		grouping: [3],
		currency: ['€', '']
	});

	let initialXAxisOffset: number | undefined;
	$: initialXAxisOffset = effectiveWidth && effectiveWidth / 2
	let initialYAxisOffset: number | undefined;
	$: initialYAxisOffset = effectiveHeight && effectiveHeight / 2

	$: if (effectiveWidth !== undefined && effectiveHeight !== undefined) {
		if(translateX === undefined) {
			translateX = effectiveWidth / 2;
		}
		if(translateY === undefined) {
			translateY = effectiveHeight / 2;
		}
		renderTimeline(translateX, translateY, zoomScale)
	}

	const eventHeight = 25;
	const eventRowSpacing = 10;
	const eventAxisOffset = 40;
	const flagWidth = 7;
	const eventTextPadding = 5;
	const defaultMeasureFont = '14px Arial';

	function renderTimeline(translateX: number, translateY: number, zoomScale: number) {
		if (!effectiveWidth || !effectiveHeight) {
			console.error("Timeline cannot be rendered: container has effective size 0")
			return
		}
		scale = d3
			.scaleLinear()
			.domain([translateX / zoomScale, (translateX + effectiveWidth) / zoomScale])
			.range([0, effectiveWidth]);

		axis = d3.axisBottom(scale).tickFormat(localeFormatter.format(','));
		const axisGroup = d3.select(svg).select<SVGGElement>('g.axis');
		axisGroup.transition().duration(10).call(axis);
		axisGroup.attr('transform', `translate(0, ${translateY})`);

		zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
				if (!effectiveWidth || !effectiveHeight) {
					console.error("Timeline cannot be zoomed: container has effective size 0")
					return
				}
				translateX = initialXAxisOffset! - event.transform.x;
				translateY = initialYAxisOffset! + event.transform.y;
				if(zoomScale == event.transform.k){
					console.error("panning: y="+event.transform.y)
				} else {
					console.error("zooming: y="+event.transform.y)
				}
				zoomScale = event.transform.k;

				renderTimeline(translateX, translateY, zoomScale)
			});
		d3.select(svg).call(zoom);

		renderTickLines();
		renderEvents();
	}

	function renderTickLines() {
		d3.select(svg).selectAll('line.tick').remove();
		d3.select(svg).selectAll('line.zero-line').remove();

		d3.select(svg)
			.selectAll('line.tick')
			.data(scale.ticks())
			.enter()
			.append('line')
			.attr('class', 'tick')
			.attr('x1', (tick) => scale(tick))
			.attr('x2', (tick) => scale(tick))
			.attr('y1', 0)
			.attr('y2', effectiveHeight!)
			.attr('stroke', 'black')
			.attr('stroke-dasharray', '2,2')
			.attr('stroke-opacity', 0.5);

		const zeroTick = scale(0);
		d3.select(svg)
			.append('line')
			.attr('class', 'zero-line')
			.attr('x1', zeroTick)
			.attr('x2', zeroTick)
			.attr('y1', 0)
			.attr('y2', effectiveHeight!)
			.attr('stroke', 'red')
			.attr('stroke-width', 1);
	}

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
			let text = d.event.text;
			if (containerDeclarationMatch) {
				isContainer = true;
				containerId = parseInt(containerDeclarationMatch[1]);
				text = d.event.text.slice(containerDeclarationMatch[0].length);
			} else if (containerReferenceMatch) {
				containerId = parseInt(containerReferenceMatch[1]);
				text = d.event.text.slice(containerReferenceMatch[0].length);
			}

			let y = translateY!;
			let width = scale(d.event.end) - scale(d.event.start);
			let isMoment = width === 0;
			if (isMoment) {
				width = Math.max(getTextMeasure(text, defaultMeasureFont)?.width ?? 0 + 10, 10);
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
		const partitionedEvents = partitionArray(
			eventData,
			(event: EventConfig) => {
				if (event.isMoment) {
					return 0;
				} else if (event.isContainer) {
					return 1;
				} else if (event.containerId !== null) {
					return 2;
				} else {
					return 3;
				}
			},
			4
		);
		const [momentEvents, containerEvents, containedEvents, normalEvents] = partitionedEvents;

		layoutUpperRows(momentEvents);
		layoutLowerRows(containerEvents, containedEvents, normalEvents);

		let getOriginY = (d: EventConfig) => {
			let result = null;
			if (d.containerId !== null) {
				result = containedEvents.find((c) => c.containerId == d.containerId)?.y;
			}
			if (result == null) {
				result = translateY!;
			} else {
				result -= 2;
			}
			return result;
		};

		const handleEventClick = (clickEvent: any, eventConfig: EventConfig) => {
			// Handle click event
			if (selectedEvCatPair?.event !== eventConfig.event) {
				selectedEvCatPair = timeline.find(evCatPair => evCatPair.event == eventConfig.event)!;
			} else {
				selectedEvCatPair = null; // Deselect if already selected
			}
			console.log(selectedEvCatPair)
			renderEvents();
		};

		const conditionalSelectedColor = (d: EventConfig) => {
			if(d.event == selectedEvCatPair?.event) {
				return "red"
			} else {
				return "black"
			}
		}
		
		const conditionalSelectedWidth = (d: EventConfig) => {
			if(d.event == selectedEvCatPair?.event) {
				return 3
			} else {
				return 1
			}
		}

		events
			.selectAll('line.moment')
			.data(momentEvents)
			.enter()
			.append('line')
			.attr('class', 'moment')
			.attr('x1', (d) => d.x)
			.attr('x2', (d) => d.x)
			.attr('y1', (d) => d.y + d.height)
			.attr('y2', (d) => getOriginY(d))
			.attr('stroke', 'black');

		events
			.selectAll('circle.moment-dot')
			.data(momentEvents)
			.enter()
			.append('circle')
			.attr('class', 'moment-dot')
			.attr('cx', (d) => d.x)
			.attr('cy', (d) => getOriginY(d))
			.attr('r', 3)
			.attr('fill', 'black');

		events
			.selectAll('path.moment-flag')
			.data(momentEvents)
			.enter()
			.append('path')
			.attr('class', 'moment-flag')
			.attr('d', (d) => {
				const flagHeight = d.height;
				const flagX = d.x + d.width;
				const flagY = d.y;
				return `M${d.x},${flagY} L${flagX + flagWidth},${flagY} L${flagX},${flagY + flagHeight / 2} L${flagX + flagWidth},${flagY + flagHeight} L${d.x},${flagY + flagHeight} Z`;
			})
			.attr('fill', (d) => d.category.color)
			.attr('stroke', conditionalSelectedColor)
			.attr('stroke-width', conditionalSelectedWidth)
			.on('click', handleEventClick)
			.style("cursor", "pointer")
			.append('title')
			.text((d) => d.event.text ?? '');

		events
			.selectAll('rect.event')
			.data([containerEvents, containedEvents, normalEvents].flat())
			.enter()
			.append('rect')
			.attr('class', 'event')
			.attr('x', (d) => d.x)
			.attr('width', (d) => d.width)
			.attr('y', (d) => d.y)
			.attr('height', (d) => d.height)
			.attr('fill', (d) => d.category.color)
			.attr('stroke', conditionalSelectedColor)
			.attr('stroke-width', conditionalSelectedWidth)
			.on('click', handleEventClick)
			.style("cursor", "pointer")
			.append('title')
			.text((d) => d.event.text ?? '');

		events
			.selectAll('text.event-label')
			.data(partitionedEvents.flat())
			.enter()
			.append('text')
			.attr('class', 'event-label')
			.attr('x', (d) => d.x + eventTextPadding)
			.attr(
				'y',
				(d) =>
					d.y + eventHeight / 2 + (getTextMeasure('W', defaultMeasureFont)?.emHeightAscent ?? 0) / 2
			)
			.attr('fill', (d) => d.category.font_color)
			.text((d) => d.text)
			.each((d, i, nodes) => stripText(nodes[i], d.width))
			.on('click', handleEventClick)
			.style("cursor", "pointer")
			.append('title')
			.text((d) => d.event.text ?? '');
	}

	function layoutUpperRows(momentEvents: EventConfig[]) {
		calculateRows(momentEvents, true);
	}

	function layoutLowerRows(
		containerEvents: EventConfig[],
		containedEvents: EventConfig[],
		normalEvents: EventConfig[]
	) {
		const rowConfig: RowConfig[] = [];

		for (let container of containerEvents) {
			const containerId = container.containerId;
			assert(containerId !== null);
			let row = 0;

			while (rowConfig[row] && rowConfig[row].end <= container.x + container.width) {
				row++;
			}
			let prevRow = rowConfig[row - 1] ?? null;
			let newY = eventAxisOffset;
			if (prevRow) {
				newY = prevRow.yOffset + prevRow.height + eventRowSpacing;
			}

			const containerRowConfig = calculateRows(
				containedEvents.filter((event) => event.containerId == containerId),
				false,
				newY
			);
			const containerHeight = containerRowConfig.reduce((acc, event, index) => {
				if (index === containerRowConfig.length - 1) {
					return acc + event.height;
				} else {
					return acc + event.height + eventRowSpacing;
				}
			}, 0);

			rowConfig[row] = {
				start: rowConfig[row]?.start ?? container.x + container.width,
				end: container.x,
				yOffset: newY,
				height: containerHeight
			};
			container.y += rowConfig[row].yOffset - 2;
			container.height = rowConfig[row].height + 4;
		}

		let nonContainerOffset = eventAxisOffset;
		const lastContainerRow = rowConfig.at(-1);
		if (lastContainerRow) {
			nonContainerOffset = lastContainerRow.yOffset + lastContainerRow.height + eventRowSpacing;
		}

		calculateRows(normalEvents, false, nonContainerOffset);
	}

	function calculateRows(
		events: EventConfig[],
		isMoment: boolean,
		offset: number = eventAxisOffset
	): RowConfig[] {
		const o = isMoment ? -1 : 1;

		const result: RowConfig[] = [];

		for (let event of events) {
			let row = 0;

			while (result[row] && result[row].end <= event.x + event.width + (isMoment ? flagWidth : 0)) {
				row++;
			}
			let prevRow = result[row - 1] ?? null;
			let newYOffset = o * offset;
			if (prevRow) {
				newYOffset = prevRow.yOffset + o * (prevRow.height + eventRowSpacing);
			}
			result[row] = {
				start: result[row]?.start ?? event.x + event.width,
				end: event.x,
				yOffset: newYOffset,
				height: eventHeight
			};
			event.y += result[row].yOffset;
		}

		return result;
	}

	function stripText(node: SVGTextElement, width: number) {
		let self = d3.select(node);
		let textLength = self.node()!.getComputedTextLength();
		let text = self.text();
		while (textLength > width - 2 * eventTextPadding && text.length > 0) {
			text = text.slice(0, -1);
			self.text(text + '\u2026');
			textLength = self.node()!.getComputedTextLength();
		}
		if (text.length == 0) {
			text = '...';
			while (textLength > width - 2 * eventTextPadding && text.length > 0) {
				text = text.slice(0, -1);
				self.text(text);
				textLength = self.node()!.getComputedTextLength();
			}
		}
	}
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
		margin: 0;
		overflow: hidden;

		svg {
			width: 100%;
			height: 100%;
		}
	}
</style>
