<script lang="ts">
	import Grid from './Grid.svelte';
import Timeline from './Timeline.svelte';


	export let data;

    
    let layerSize = 30000;
    let initialStageWidth = 1200;
    let initialStageHeight = 600;
    let initialStepSize = 50;

</script>

<Grid layerWidth={layerSize} layerHeight={layerSize} {initialStageWidth} {initialStageHeight} stepBaseX={initialStepSize} yAxis={false} >
    <Timeline originX={initialStageWidth/2} originY={initialStageHeight/2} evCatPairs={data.evCatPairs}></Timeline>
</Grid>
