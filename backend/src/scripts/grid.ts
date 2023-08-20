
import Konva from 'konva';
import { JSDOM } from "jsdom";

//TODO move into hbs (frontend)

export function loadGrid(): string {

    let dom = new JSDOM('<div id="stage-container"></div>');
    
    const $: JQueryStatic = require("jquery")(dom.window);

    // Get the screen width
    const screenWidth = window.innerWidth;

    // Create a Konva stage
    const stage = new Konva.Stage({
    container: 'stage-container', // Replace with your container ID
    width: screenWidth,
    height: window.innerHeight,
    });

    // Create a layer for the grid
    const gridLayer = new Konva.Layer();
    stage.add(gridLayer);

    // Define grid parameters
    const gridSize = 20; // Size of each grid cell
    let zoomLevel = 1; // Initial zoom level
    let numLines = Math.floor(screenWidth / gridSize); // Initial number of grid lines

    // Function to update the grid lines based on zoom level
    function updateGridLines() {
    numLines = Math.floor(screenWidth / (gridSize * zoomLevel));
    gridLayer.destroyChildren();

    for (let i = -numLines; i < numLines; i++) {
        const line = new Konva.Line({
        points: [i * gridSize, -screenWidth, i * gridSize, screenWidth],
        stroke: '#ddd',
        strokeWidth: 1 / zoomLevel,
        });
        gridLayer.add(line);
    }
    gridLayer.batchDraw();
    }

    // Update grid initially
    updateGridLines();

    // Function to handle zoom
    function handleZoom(e: WheelEvent) {
    e.preventDefault();
    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomLevel *= scaleFactor;
    stage.scaleX(zoomLevel);
    stage.scaleY(zoomLevel);
    updateGridLines();
    }

    // Attach zoom event listener
    stage.container().addEventListener('wheel', handleZoom);

    // Function to handle drag
    let lastPosition: Konva.Vector2d | null = null;
    stage.on('mousedown', (e) => {
    lastPosition = stage.getPointerPosition();
    });

    stage.on('mousemove', (e) => {
    if (lastPosition && stage.isDragging()) {
        const newPosition = stage.getPointerPosition();
        if(newPosition == null) return;
        const dx = newPosition.x - lastPosition.x;
        const dy = newPosition.y - lastPosition.y;

        stage.x(stage.x() + dx);
        stage.y(stage.y() + dy);
        lastPosition = newPosition;
        gridLayer.batchDraw();
    }
    });

    stage.on('mouseup', () => {
    lastPosition = null;
    });

    // Initialize viewport in the center
    stage.x(screenWidth / 2);
    stage.y(window.innerHeight / 2);

    // Add stage to the container
    $('#stage-container').append(stage.container());

    return dom.serialize();
}
