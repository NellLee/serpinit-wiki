<template>
  <div id="timeline-container">
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import {onMounted, ref} from "vue";

interface Datum {
  value: number;
}

interface TimelineData {
  data: Datum[];
}

class Timeline {
  private readonly width: number;
  private readonly height: number;
  private readonly margin: { top: number; right: number; bottom: number; left: number };
  private readonly xScale: d3.ScaleLinear<number, number>;
  private readonly xAxis: d3.Selection<SVGGElement, unknown, null, undefined>;

  constructor(containerId: string) {
    const container = d3.select(`#${containerId}`);
    const containerNode = container.node() as HTMLElement;

    this.width = containerNode.clientWidth;
    this.height = containerNode.clientHeight;
    this.margin = { top: 20, right: 20, bottom: 30, left: 20 };

    this.xScale = d3.scaleLinear()
        .range([this.margin.left, this.width - this.margin.right]);

    this.xAxis = container.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${this.height - this.margin.bottom})`);
  }

  public update(data: TimelineData): void {
    const xExtent = d3.extent(data.data, (d) => d.value) as [number, number];
    const xAxisTicks = this.calculateAxisTicks(xExtent);

    this.xScale.domain(xExtent);

    this.xAxis.call(d3.axisBottom(this.xScale).tickValues(xAxisTicks));
  }

  private calculateAxisTicks(extent: [number, number]): number[] {
    const min = extent[0];
    const max = extent[1];

    const tickCount = Math.floor((this.width - this.margin.left - this.margin.right) / 50);
    const tickStep = Math.ceil((max - min) / tickCount);

    const ticks: number[] = [];
    for (let i = min; i <= max; i += tickStep) {
      ticks.push(i);
    }

    return ticks;
  }
}

const timeline = ref(null);

onMounted(() => {

// Usage
  const data = ref<TimelineData>({
    data: []
  });


// Generate some sample data
  for (let i = -10; i <= 10; i++) {
    data.value.data.push({ value: i });
  }

  timeline.value = new Timeline('timeline-container');

  timeline.value.update(data);
})

</script>

<style>
</style>
