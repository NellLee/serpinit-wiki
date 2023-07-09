<template>
  <v-stage :config="stageConfig" :width="stageWidth" :height="stageHeight">
    <v-layer :config="layerConfig">
      <v-rect
        :config="{ x: 0, y: 0, width: props.layerSize, height: props.layerSize, fill: 'white' }"
      />
      <v-line
        v-for="x in gridLinesX"
        :key="x"
        :config="{ points: [x, 0, x, layerSize], stroke: 'darkgrey', strokeWidth: 1 }"
      />
      <v-line
        v-for="x in gridLinesX"
        :key="x"
        :config="{ points: [x, middle - 10, x, middle + 10], stroke: 'black', strokeWidth: 1 }"
      />
      <v-line
        :config="{ points: [0, middle, layerSize, middle], stroke: 'black', strokeWidth: 1 }"
      />
      <slot></slot>
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// import { Stage, Layer, Line, Rect } from 'vue-konva';

// Props
const props = defineProps({
  layerSize: {
    type: Number,
    default: 30000,
  },
  stageWidth: {
    type: Number,
    default: 1200,
  },
  stageHeight: {
    type: Number,
    default: 600,
  },
  stepSize: {
    type: Number,
    default: 50,
  },
});

const middle = ref<number>(props.layerSize / 2);


// Stage configuration
const stageConfig = {
  draggable: true,
  scalable: true,
  offsetX: middle.value - (props.stageWidth / 2),
  offsetY: middle.value - (props.stageHeight / 2)
};

// Layer configuration
const layerConfig = {
  width: props.layerSize,
  height: props.layerSize,
};

// Computed properties for grid lines
const gridLinesX = Array.from({ length: Math.ceil(props.layerSize / props.stepSize) }, (_, index) =>
  index * props.stepSize
);
</script>

<style scoped>
  .konvajs-content {
    cursor: grab;
  }
</style>
