<script lang="ts">
	import { ContainerConfig } from 'konva/lib/Container';
	import { Stage, Layer, Rect, Line, Text } from 'svelte-konva';
	import type { KonvaWheelEvent } from 'svelte-konva';

	export let layerWidth: number;
	export let layerHeight: number;
	export let initialStageWidth = 1200;
	export let initialStageHeight = 600;
	export let stepBaseX: number = 0;
	export let stepBaseY: number = 0;
	export let xAxis = true;
	export let yAxis = true;

    let stage: Stage;

	$: startX = layerWidth / 2; //FIXME not adapting to zoom drag
	$: startY = layerHeight / 2;
	$: console.log('startX: ' + startX);
	$: console.log('startY: ' + startY);


    let stageConfig: ContainerConfig;
    $: stageConfig = {
        draggable: true,
        offsetX: startX - initialStageWidth / 2,
        offsetY: startY - initialStageHeight / 2,
        width: initialStageWidth,
        height: initialStageHeight
    };

    $: layerConfig = {
        width: layerWidth,
        height: layerHeight
    };

    $: scaledStageWidth = (stageConfig.width ?? 0) / (stageConfig.scaleX ?? 1);
    $: scaledStageHeight = (stageConfig.height ?? 0) / (stageConfig.scaleY ?? 1);

    $: stageX = startX - scaledStageWidth / 2;
    $: stageY = startY - scaledStageWidth / 2;
	$: console.log('stageX: ' + stageX);

	$: amountX = xAxis ? Math.floor(scaledStageWidth / stepBaseX) : 0;
	$: amountY = yAxis ? Math.floor(scaledStageHeight / stepBaseY) : 0;
	$: console.log('amountX: ' + amountX);
	$: console.log('amountY: ' + amountY);

	$: gridLinesX =
		amountX > 0
			? Array.from({ length: amountX }, (_, index) => index * stepBaseX + stageX)
			: [];
	$: gridLinesY =
		amountY > 0
			? Array.from({ length: amountY }, (_, index) => index * stepBaseY + stageY)
			: [];
	$: console.log('gridLinesX: ' + gridLinesX);
	$: console.log('gridLinesY: ' + gridLinesY);

	function zoomStage(event: KonvaWheelEvent) {
		event.preventDefault();

		const detailEvent = event.detail.evt;

		let oldScale = stageConfig.scaleX ?? 1;
		let pointer = {
			x: detailEvent.pageX,
			y: detailEvent.pageY
		};

		let mouse = {
			x: (pointer.x - (stageConfig.x ?? 0)) / oldScale,
			y: (pointer.y - (stageConfig.y ?? 0)) / oldScale
		};

		let direction = detailEvent.deltaY > 0 ? -1 : 1;

		if (detailEvent.ctrlKey) {
			direction = -direction;
		}

		let newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;

		stageConfig.scaleX = newScale;
		stageConfig.scaleY = newScale;

		stageConfig.x = pointer.x - mouse.x * newScale;
		stageConfig.y = pointer.y - mouse.y * newScale;

		//   let visibleStepAmount = Math.floor((initialStageWidth / newScale) / stepSize);

		//   if (visibleStepAmount > 100) {
		//     stepSize *= 10;
		//   }

		//   if (visibleStepAmount < 10) {
		//     stepSize /= 10;
		//   }
	}
</script>

<div id="main">
	<div class="canvasContainer">
		<Stage bind:this={stage} on:wheel={zoomStage} bind:config={stageConfig}>
			<Layer config={layerConfig}>
				<Rect
					config={{
						x: 0,
						y: 0,
						width: layerWidth,
						height: layerWidth,
						fill: 'white'
					}}
				/>
				{#if xAxis}
					{#each gridLinesX as x}
						<Line
							config={{
								points: [x, 0, x, layerHeight],
								stroke: 'darkgrey',
								strokeWidth: 1
							}}
						/>
						<Line
							config={{
								points: [x, startY - 10, x, startY + 10],
								stroke: 'black',
								strokeWidth: 1
							}}
						/>
						<Text
							config={{
								text: x.toString(),
								x: x,
								y: startY + 10,
								fill: 'black',
								fontSize: 18,
								fontFamily: 'Calibri',
								align: 'center'
							}}
						/>
					{/each}
				{/if}
				{#if yAxis}
					{#each gridLinesY as y}
						<Line
							config={{
								points: [0, y, layerWidth, y],
								stroke: 'darkgrey',
								strokeWidth: 1
							}}
						/>
						<Line
							config={{
								points: [startX - 10, y, startX + 10, y],
								stroke: 'black',
								strokeWidth: 1
							}}
						/>
						<Text
							config={{
								text: y.toString(),
								y: y,
								x: startX - 10,
								fill: 'black',
								fontSize: 18,
								fontFamily: 'Calibri',
								align: 'center'
							}}
						/>
					{/each}
				{/if}
				<slot />
			</Layer>
		</Stage>
	</div>
</div>

<style>
	.konvajs-content {
		cursor: grab;
	}
</style>
