<script setup lang="ts">
import { ref } from "vue";
import Grid from "./Grid.vue";
import XmlVisualizer from "./XmlVisualizer.vue";


const layerSize = ref(30000);
const stageWidth = ref(1200);
const stageHeight = ref(600);
const stepSize = ref(50);


const originX = ref(layerSize.value / 2);
const originY = ref(layerSize.value / 2);
const eventHeight = ref(40);

</script>

<template>
  <Grid :layerSize="layerSize" :initialStageWidth="stageWidth" :initialStageHeight="stageHeight" :stepSize="stepSize">
    <XmlVisualizer :originX="originX" :originY="originY" :availableHeight="stageHeight" :availableWidth="stageWidth" :eventHeight="eventHeight"/>
  </Grid>
</template>

<style scoped>

</style>
