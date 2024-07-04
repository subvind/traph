import { Field } from '../index.js';
import fs from 'fs/promises';

async function runExampleField() {
  try {
    // Read the JSON file
    const jsonData = await fs.readFile('./examples/example-field.json', 'utf8');
    const fieldData = JSON.parse(jsonData);

    // Create a new Field instance
    const field = new Field();

    // Import the field from JSON
    field.fromJSON(fieldData);

    // Example: Find the shortest path from A to Z using the time graph
    const shortestTimePath = field.timeGraph.getPath('A', 'Z');
    const totalTime = field.timeGraph.getPathTotal(shortestTimePath);
    console.log('Shortest time path from A to Z:', shortestTimePath.join(' -> '));
    console.log('Total time:', totalTime, 'seconds');

    // Example: Find the shortest path from A to Z using the distance graph
    const shortestDistancePath = field.distanceGraph.getPath('A', 'Z');
    const totalDistance = field.distanceGraph.getPathTotal(shortestDistancePath);
    console.log('Shortest distance path from A to Z:', shortestDistancePath.join(' -> '));
    console.log('Total distance:', totalDistance, 'miles');

    // Example: Get GPS coordinates for a specific node
    const nodeA = field.gpsNetwork.getNode('A');
    console.log('GPS coordinates for node A:', nodeA);

    // Example: Calculate distance between two nodes using GPS network
    const distanceAB = field.gpsNetwork.getDistance('A', 'B');
    console.log('Distance between A and B (as the crow flies):', distanceAB, 'km');

  } catch (error) {
    console.error('Error running example:', error);
  }
}

runExampleField();