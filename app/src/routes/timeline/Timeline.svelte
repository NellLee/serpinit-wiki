<script lang="ts">
	import { Stage, Layer, Rect, Text } from 'svelte-konva';
	import type { EvCatPair, EventConfig, TimelineConfig } from '$lib/types';
	import { onMount } from 'svelte';

	export let originX: number = 0;
	export let originY: number = 0;
	export let eventHeight: number = 40;
	export let availableWidth: number = 600;
	export let availableHeight: number = 400;
    export let evCatPairs: EvCatPair[] | null = null

    let timelineConfig: TimelineConfig = {
        availableWidth,
        availableHeight,
        originX,
        originY,
        eventHeight
    }

	let eventConfigs: EventConfig[] = [];
    onMount(() => {
        if(!evCatPairs) {
            throw "No event-category pairs provided."
        }
        calculateEventConfigs(timelineConfig, evCatPairs).then(result => eventConfigs = result);
    })
    

	const stageConfig = { width: availableWidth, height: availableHeight };

	function calculateEventConfigs(config: { originX: number; originY: number; availableWidth: number; }, evCatPairs: EvCatPair[]): Promise<EventConfig[]> {
		return new Promise((resolve, reject) => {
			const result: EventConfig[] = [];
			for (let evCatPair of evCatPairs) {
				const event = evCatPair.event;
				const category = evCatPair.category;

				let rectX = config.originX + event.start;
				let rectY = config.originY + 50 * evCatPair.index;

				result.push({
					rect: {
						x: rectX,
						y: rectY,
						width: config.originX + (event.end - event.start) / config.availableWidth,
						height: 40,
						fill: category.color
					},
					text: {
						x: rectX + 5,
						y: rectY + 3,
						text: event.text,
						fontSize: 14,
						fill: category.font_color
					}
				});
			}

			if (result.length > 0) {
				resolve(result);
			} else {
				reject();
			}
		});
	}
</script>

{#each eventConfigs as config}
<Rect config={config.rect} />
<Text config={config.text} />
{/each}

<style>
</style>
