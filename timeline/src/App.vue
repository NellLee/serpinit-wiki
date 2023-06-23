<template>
  <div id="body">
    <canvas ref="timelineCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default defineComponent({
  name: 'TimelineChart',
  setup() {
    const timelineCanvas = ref<HTMLCanvasElement | null>(null);

    onMounted(() => {
      // Read XML data from external file (replace with your XML file path)
      fetch('/trimmed.xml')
        .then(response => response.text())
        .then(xmlData => {
          // Parse XML data
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

          // Extract categories and events from XML
          const categories = xmlDoc.getElementsByTagName('categories')[0].getElementsByTagName('category');
          const events = xmlDoc.getElementsByTagName('event');

          // Prepare data for Chart.js
          const chartData = {
            datasets: [],
          };

          // Create category mappings
          const categoryMappings = {};
          for (let i = 0; i < categories.length; i++) {
            const categoryName = categories[i].getElementsByTagName('name')[0].textContent;
            const categoryColor = categories[i].getElementsByTagName('color')[0].textContent;
            categoryMappings[categoryName] = categoryColor;
          }

          // Process events
          for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const start = parseFloat(event.getElementsByTagName('start')[0].textContent);
            const end = parseFloat(event.getElementsByTagName('end')[0].textContent);
            const category = event.getElementsByTagName('category')[0].textContent;

            // Create dataset for each event
            chartData.datasets.push({
              label: category,
              backgroundColor: `rgba(${categoryMappings[category]}, 0.5)`,
              borderColor: `rgba(${categoryMappings[category]}, 1)`,
              data: [
                {
                  x: start,
                  y: i,
                },
                {
                  x: end,
                  y: i,
                },
              ],
            });
          }

          // Create timeline chart using Chart.js
          new Chart(timelineCanvas.value, {
            type: 'bar',
            data: chartData,
            options: {
              responsive: true,
              scales: {
                x: {
                  type: 'linear',
                  position: 'bottom',
                },
                y: {
                  display: false,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            },
          });
        });
    });

    return {
      timelineCanvas,
    };
  },
});
</script>

<style>
canvas {
  width: 100%;
  height: 100%;
}

#body {
  width: 1600px;
  height: 900px;
}
</style>
