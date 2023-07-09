

<template>
  <template v-for="config in configs">
    <v-rect :config="config.rect">
      <v-text :config="config.text"></v-text>
    </v-rect>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Category, Event, Timeline } from '../../scripts/types';
import { parseString } from 'xml2js';
import { parseBooleans, parseNumbers } from "xml2js/lib/processors";
import { isTimeline } from "../../scripts/types.guard.ts";

interface EvCatPair { index: number, event: Event, category: Category }

interface RectangleConfig {
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
}
interface TextConfig {
  x: number,
  y: number,
  text: string,
  fontSize: number,
  fill: string,
}

const props = defineProps({
  originX: {
    type: Number,
    default: 0
  },
  originY: {
    type: Number,
    default: 0
  },
  availableHeight: {
    type: Number,
    default: 600
  },
  availableWidth: {
    type: Number,
    required: true
  },
  eventHeight: {
    type: Number,
    default: 40
  }
})

const xml = ref<string | null>(null)
const timeline = ref<Timeline | null>(null)

const evCatPairs = ref<EvCatPair[]>([])

const configs = computed<{rect: RectangleConfig, text: TextConfig}[]>(() => {

  const result = []
  for(let evCatPair of evCatPairs.value) {
    const event = evCatPair.event
    const category = evCatPair.category

    let rectX = props.originX + event.start
    let rectY = props.originY + 50 * evCatPair.index

    result.push({
      rect: {
        x: rectX,
        y: rectY,
        width: props.originX + (event.end - event.start) / props.availableWidth,
        height: 40,
        fill: category.color,
      },
      text: {
        x: rectX + 5,
        y: rectY + 3,
        text: event.text,
        fontSize: 14,
        fill: category.font_color,
      }
    })
  }

  return result;
})


onMounted(() => {

  fetch("http://localhost:5173/timeline.xml").then(result =>
    result.text()
  ).then(result => {
    xml.value = result;
    // console.log(xml.value)
    return parseTimeline(xml.value!);
  }).then(result => {
    timeline.value = result

    let tl: Timeline = timeline.value!;
    evCatPairs.value = tl.events.map((event, index) => {
      const category = tl.categories.find(
        (cat) => cat.name === event.category
      );
      if (category) {
        return { index, event, category };
      }
      return null
    }).filter(v => !!v) as EvCatPair[];
  })
})


function parseRgbs(value: string) {
  if (/(\d{1,3}),(\d{1,3}),(\d{1,3})/.test(value)) {
    return `rgb(${value})`
  }
  return value;
}

function parseTimeline(xml: string): Promise<Timeline> {
  return new Promise((resolve, reject) => {
    parseString(xml, { valueProcessors: [parseNumbers, parseBooleans, parseRgbs], explicitArray: false }, (err, result) => {
      result.timeline.categories = result.timeline.categories.category
      result.timeline.events = result.timeline.events.event
      console.log(JSON.stringify(result, null, 2))


      if (err) {
        console.error('Error parsing XML:', err);
        reject(err)
        return;
      }

      const timeline = result.timeline;
      if (isTimeline(timeline)) {

        console.log('Valid timeline object:', timeline);
        resolve(timeline);
      } else {
        let message = 'Invalid timeline object format';
        console.error(message);
        reject(message)
      }
    });
  })

}

</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.canvasContainer {
  flex-shrink: 0;
  width: 1600px;
  height: 700px;
  border: 1px solid black;
}
</style>
