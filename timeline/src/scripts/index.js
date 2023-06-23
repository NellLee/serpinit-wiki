

// XML data
const xmlData = `<?xml version="1.0" encoding="utf-8"?>
<timeline>
  <version>2.6.0 (179e39d321f2 2022-02-18)</version>
  <timetype>dectime</timetype>
  <categories>
    <category>
      <name>Planetar</name>
      <color>27,27,27</color>
    </category>
    <category>
      <name>Agranum</name>
      <color>202,132,2</color>
      <parent>Planetar</parent>
    </category>
    <category>
      <name>Aridess</name>
      <color>255,241,185</color>
      <parent>Planetar</parent>
    </category>
  </categories>
  <events>
    <event>
      <start>-12</start>
      <end>1</end>
      <category>Navura</category>
    </event>
    <event>
      <start>1.55</start>
      <end>1.56</end>
      <category>Interplanetar</category>
    </event>
  </events>
</timeline>`;

// Parse XML data using xml2js
const xmlParser = new DOMParser();
const xmlDoc = xmlParser.parseFromString(xmlData, 'text/xml');
const timeline = xmlDoc.getElementsByTagName('timeline')[0];

// Extract categories from XML
const categories = Array.from(timeline.getElementsByTagName('category')).map(categoryNode => {
  const name = categoryNode.getElementsByTagName('name')[0].textContent;
  const color = categoryNode.getElementsByTagName('color')[0].textContent;
  const parent = categoryNode.getElementsByTagName('parent')[0]?.textContent || null;
  return { name, color, parent };
});

// Extract events from XML
const events = Array.from(timeline.getElementsByTagName('event')).map(eventNode => {
  const start = eventNode.getElementsByTagName('start')[0].textContent;
  const end = eventNode.getElementsByTagName('end')[0].textContent;
  const category = eventNode.getElementsByTagName('category')[0].textContent;
  return { start, end, category };
});

// Generate timeline data for Chart.js
const timelineData = categories.map(category => {
  const eventsInCategory = events.filter(event => event.category === category.name);
  return {
    label: category.name,
    backgroundColor: `rgb(${category.color})`,
    data: eventsInCategory.map(event => ({
      x: parseFloat(event.start),
      y: category.name
    }))
  };
});

// Sort events by start time
events.sort((a, b) => parseFloat(a.start) - parseFloat(b.start));

// Prepare timeline chart options
const options = {
  responsive: true,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom'
    },
    y: {
      type: 'category',
      position: 'left',
      labels: categories.map(category => category.name)
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Timeline Chart'
    }
  }
};

// Create timeline chart
const ctx = document.getElementById('timelineChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    datasets: timelineData
  },
  options: options
});