<template>
  <v-stage ref="konva" @wheel="zoom" :config="stageConfig" :width="initialStageWidth" :height="initialStageHeight">
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
// import Konva from 'konva';

// Props
const props = defineProps({
  layerSize: {
    type: Number,
    default: 30000,
  },
  initialStageWidth: {
    type: Number,
    default: 1200,
  },
  initialStageHeight: {
    type: Number,
    default: 600,
  },
  stepSize: {
    type: Number,
    default: 50,
  },
});

const middle = ref<number>(props.layerSize / 2);
const konva = ref<any | null>(null)
// const stageWidth = ref<number>(props.initialStageWidth);
// const stageHeight = ref<number>(props.initialStageHeight);

// Stage configuration
const stageConfig = {
  draggable: true,
  offsetX: middle.value - (props.initialStageWidth / 2),
  offsetY: middle.value - (props.initialStageHeight / 2)
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

function zoom(e: {evt: WheelEvent}) {
  var scaleBy = 1.1;

  // stop default scrolling
  e.evt.preventDefault();

  let stage = konva.value!.getStage();

  var oldScale = stage.scaleX();
  var pointer = stage.getPointerPosition()!;

  var mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  let direction = e.evt.deltaY > 0 ? -1 : 1;

  if (e.evt.ctrlKey) {
    direction = -direction;
  }

  var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
}
</script>

<style scoped>
  .konvajs-content {
    cursor: grab;
  }
</style>
