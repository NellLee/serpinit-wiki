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
      <v-line
        v-for="x in gridLinesX"
        :key="x"
        :config="{ points: [x, middle - 10, x, middle + 10], stroke: 'black', strokeWidth: 1 }"
      />
      <v-text
        v-for="x in gridLinesX"
        :key="x"
        :config="{ text: x, x: x, y: middle + 10, fill: 'black', fontSize: 18,
        fontFamily: 'Calibri', align: 'center' }"
        />
      <slot></slot>
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';


import Konva from 'konva';

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
  initialStepSize: {
    type: Number,
    default: 50,
  },
});

const middle = ref<number>(props.layerSize / 2);
const stepSize = ref<number>(props.initialStepSize)

const konva = ref<any | null>(null)
const stage = computed(() => konva.value?.getStage() as Konva.Stage | null)
// const layer = computed(() => stage.value?.getLayers()[0])



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
const gridLinesX = computed(() => Array.from({ length: Math.ceil(props.layerSize / stepSize.value) }, (_, index) =>
  index * stepSize.value
));

function zoom(e: {evt: WheelEvent}) {
  var scaleBy = 1.1;

  // stop default scrolling
  e.evt.preventDefault();

  let st = stage.value;
  if(!st) return

  var oldScale = st.scaleX();
  var pointer = st.getPointerPosition()!;

  var mousePointTo = {
    x: (pointer.x - st.x()) / oldScale,
    y: (pointer.y - st.y()) / oldScale,
  };

  let direction = e.evt.deltaY > 0 ? -1 : 1;

  if (e.evt.ctrlKey) {
    direction = -direction;
  }

  var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  st.scale({ x: newScale, y: newScale });

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  st.position(newPos);
  

  let visibleStepAmount = Math.floor((props.initialStageWidth / newScale) / stepSize.value)
  console.log("---")
  console.log(visibleStepAmount)
  console.log("---")

  if(visibleStepAmount > 100) {
    stepSize.value *= 10
  }

  if(visibleStepAmount < 10) {
    stepSize.value /= 10
  }
}
</script>

<style scoped>
  .konvajs-content {
    cursor: grab;
  }
</style>
