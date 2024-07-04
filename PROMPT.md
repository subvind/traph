Please follow the instructions within ./TODO.md! Thank you :)
### ./index.js

```js
import Customer from './src/customer.js';
import Dijkstra from './src/dijkstra.js';
import * as Genetic from './src/genetic.js';
import GPS from './src/gps.js';
import Graph from './src/graph.js'; 
import Location from './src/location.js';
import Field from './src/field.js';
import PriorityQueue from './src/priorityQueue.js';
import Simulation from './src/simulation.js';
import Skill from './src/skill.js';
import Task from './src/task.js';
import TSP from './src/traveling-salesman-problem.js';
import Vehicle from './src/vehicle.js';
import Worker from './src/worker.js';

export {
  Customer,
  Dijkstra,
  Genetic,
  GPS,
  Graph,
  Location,
  Field,
  PriorityQueue,
  Simulation,
  Skill,
  Task,
  TSP,
  Vehicle,
  Worker
}
```

### ./src/graph.js

```js
import Dijkstra from './dijkstra.js'; // Import the Dijkstra class

// A class representing a weighted graph
class Graph {
  constructor() {
    this.nodes = new Map(); // Map to store nodes and their neighbors
  }

  // Method to add a node to the graph
  addNode(node) {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, new Map());
    }
  }

  // Method to add an edge between two nodes with a weight
  addEdge(node1, node2, weight) {
    if (!this.nodes.has(node1)) {
      this.addNode(node1);
    }
    if (!this.nodes.has(node2)) {
      this.addNode(node2);
    }
    this.nodes.get(node1).set(node2, weight);
    this.nodes.get(node2).set(node1, weight);// If the graph is undirected
  }

  // Method to get all nodes in the graph
  getNodes() {
    return this.nodes.keys();
  }

  // Method to get neighbors of a node
  getNeighbors(node) {
    return Array.from(this.nodes.get(node), ([node, weight]) => ({ node, weight }));
  }
  
  // Method to get a specific node and its edges
  getNode(node) {
    return this.getNeighbors(node);
  }
  
  // Method to find the shortest path between two nodes
  getPath(start, end) {
     return Dijkstra.findShortestPath(this, start, end);
  }

  // Method to calculate the total weight of a path
  getPathTotal(path) {
    if (!Array.isArray(path) || path.length < 2) {
      console.log('Warning: Path is empty or contains only one node');
      return 0;
    }

    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const currentNode = path[i];
      const nextNode = path[i + 1];
      const weight = this.nodes.get(currentNode).get(nextNode);

      if (weight === undefined) {
        console.log(`Warning: No edge between ${currentNode} and ${nextNode}`);
        return total;
      }

      total += weight;
    }

    return total;
  }
  
  // Method to export the graph to JSON
  toJSON() {
    const obj = {};
    this.nodes.forEach((edges, node) => {
      obj[node] = Array.from(edges, ([neighbor, weight]) => ({ node: neighbor, weight }));
    });
    return JSON.stringify(obj, null, 2);
  }
  
  // Method to import a graph from JSON
  fromJSON(json) {
    const obj = JSON.parse(json);
    this.nodes.clear();
    for (const [node, edges] of Object.entries(obj)) {
      this.addNode(node);
      if (Array.isArray(edges)) {
        edges.forEach(edge => {
          this.addEdge(node, edge.node, edge.weight);
        });
      }
    }
  }
}

export default Graph; // Export the Graph class as a module

```

### ./src/priorityQueue.js

```js

// Priority queue class used in Dijkstra's algorithm
class PriorityQueue {
  constructor() {
    this.collection = []; // Array to store the elements of the priority queue
  }

  // Method to add an element to the queue with a priority
  enqueue(value, priority) {
    this.collection.push({ value, priority });
    this.sort(); // Ensure the queue is sorted after adding a new element
  }

  // Method to remove and return the element with the highest priority (lowest value)
  dequeue() {
    return this.collection.shift();
  }

  // Method to check if the queue is empty
  isEmpty() {
    return this.collection.length === 0;
  }

  // Method to sort the queue based on priorities
  sort() {
    this.collection.sort((a, b) => a.priority - b.priority);
  }
}

export default PriorityQueue; // Export the PriorityQueue class as a module
```

### ./src/gps.js

```js
import Graph from './graph.js';

class GPS extends Graph {
  constructor() {
    super();
    this.locations = new Map(); // Map to store node locations (lat, long)
  }

  // Method to add a node with latitude and longitude
  addNode(node, lat, long) {
    super.addNode(node);
    this.locations.set(node, { lat, long });
  }

  // Method to calculate distance between two nodes (in km)
  calculateDistance(node1, node2) {
    const R = 6371; // Earth's radius in km
    const loc1 = this.locations.get(node1);
    const loc2 = this.locations.get(node2);

    const dLat = this.toRadians(loc2.lat - loc1.lat);
    const dLon = this.toRadians(loc2.long - loc1.long);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(loc1.lat)) * Math.cos(this.toRadians(loc2.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  // Helper method to convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Method to generate edges for a specific number of nearest neighbors
  genEdgesPer(edgeCount) {
    const nodes = Array.from(this.getNodes());

    nodes.forEach(node => {
      const distances = nodes
        .filter(n => n !== node)
        .map(n => ({ node: n, distance: this.calculateDistance(node, n) }))
        .sort((a, b) => a.distance - b.distance);

      const nearestNeighbors = distances.slice(0, edgeCount);

      nearestNeighbors.forEach(neighbor => {
        this.addEdge(node, neighbor.node, neighbor.distance);
      });
    });
  }

  // Method to generate edges from one node to all others
  genEdgesFor(startNode) {
    const nodes = Array.from(this.getNodes());

    nodes.forEach(node => {
      if (node !== startNode) {
        const distance = this.calculateDistance(startNode, node);
        this.addEdge(startNode, node, distance);
      }
    });
  }

  // Override toJSON method to include locations
  toJSON() {
    const baseJson = JSON.parse(super.toJSON());
    const locationsJson = {};
    this.locations.forEach((value, key) => {
      locationsJson[key] = value;
    });
    return JSON.stringify({
      ...baseJson,
      locations: locationsJson
    }, null, 2);
  }

  // Override fromJSON method to include locations
  fromJSON(json) {
    const parsedData = JSON.parse(json);
    super.fromJSON(JSON.stringify(parsedData));
    this.locations.clear();
    for (const [node, location] of Object.entries(parsedData.locations)) {
      this.locations.set(node, location);
    }
  }
}

export default GPS;
```

### ./src/field.js

```js
import Graph from './graph.js';
import GPS from './gps.js';
import fetch from 'node-fetch';

class Field {
  constructor(gpsNetwork, timeGraph, distanceGraph) {
    this.gpsNetwork = gpsNetwork;
    this.timeGraph = timeGraph;
    this.distanceGraph = distanceGraph;
    this.apiKey = process.env.OPENROUTE_API_KEY;
    this.apiUrl = 'https://api.openrouteservice.org/v2/matrix/driving-car';
  }

  async generateGraphs() {
    const nodes = Array.from(this.gpsNetwork.getNodes());
    const locations = nodes.map(node => {
      const loc = this.gpsNetwork.locations.get(node);
      return [loc.long, loc.lat];
    });

    const chunkSize = 50;
    for (let i = 0; i < nodes.length; i += chunkSize) {
      const chunkNodes = nodes.slice(i, i + chunkSize);
      const chunkLocations = locations.slice(i, i + chunkSize);
      await this.processChunk(chunkNodes, chunkLocations);
    }

    console.log('Time and distance graphs generated successfully.');
  }

  async processChunk(chunkNodes, chunkLocations) {
    const body = {
      locations: chunkLocations,
      metrics: ['duration', 'distance'],
      units: 'mi'
    };

    try {
      console.log('API Key:', this.apiKey ? 'Present' : 'Missing');

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.updateGraphs(chunkNodes, data.durations, data.distances);
    } catch (error) {
      console.error('Error fetching data from OpenRouteService:', error);
    }
  }

  updateGraphs(nodes, durations, distances) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const duration = durations[i][j];
          const distance = distances[i][j];
          this.timeGraph.addEdge(nodes[i], nodes[j], duration);
          this.distanceGraph.addEdge(nodes[i], nodes[j], distance);
        }
      }
    }
  }

  async generateAndWait() {
    await this.generateGraphs();
    console.log('Graphs generated and ready to use.');
  }

  // New method to export the Field to JSON
  toJSON() {
    return JSON.stringify({
      gpsNetwork: JSON.parse(this.gpsNetwork.toJSON()),
      timeGraph: JSON.parse(this.timeGraph.toJSON()),
      distanceGraph: JSON.parse(this.distanceGraph.toJSON())
    }, null, 2);
  }

  // New method to import the Field from JSON
  fromJSON(json) {
    const parsedData = JSON.parse(json);
    this.gpsNetwork = new GPS();
    this.gpsNetwork.fromJSON(JSON.stringify(parsedData.gpsNetwork));
    this.timeGraph = new Graph();
    this.timeGraph.fromJSON(JSON.stringify(parsedData.timeGraph));
    this.distanceGraph = new Graph();
    this.distanceGraph.fromJSON(JSON.stringify(parsedData.distanceGraph));
  }
}

export default Field;
```

### ./examples/simple-route.js

```js
import { Graph } from '../index.js'; // Import the Graph class

const graph = new Graph();

// Add nodes to the graph
graph.addNode('A');
graph.addNode('B');
graph.addNode('C');
graph.addNode('D');
graph.addNode('E');

// Add edges with weights to the graph
graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'C', 5);
graph.addEdge('B', 'D', 10);
graph.addEdge('C', 'E', 3);
graph.addEdge('E', 'D', 4);

// Find the shortest path from node 'A' to node 'D' using Dijkstra's algorithm
const shortestPath = graph.getPath('A', 'D');
console.log(`Shortest path from A to D: ${shortestPath.join(' -> ')}`);

// Test getNode method
const nodeC = graph.getNode('C');
console.log('Neighbors of node C:', nodeC);

// Test getPathTotal method
const pathTotal = graph.getPathTotal(['A', 'C', 'E', 'D']);
console.log('Total weight of path A -> C -> E -> D:', pathTotal);

// Export the graph to JSON
const graphJSON = graph.toJSON();
console.log('Graph JSON:', graphJSON);

// Import the graph from JSON
const importedGraph = new Graph();
importedGraph.fromJSON(graphJSON);
console.log('Imported graph neighbors of node C:', importedGraph.getNode('C'));
```

### ./examples/field-route.js

```js
import { Graph, GPS, Field } from '../index.js'; // Import the Graph class

const network = new GPS();

// Add nodes with lat/long to the network
network.addNode('A', 34.052235, -118.243683); // los angeles
network.addNode('B', 30.2727, -97.7394); // austin, tx
network.addNode('C', 32.779167, -96.808891); // dallas, tx
network.addNode('X', 29.749907, -95.358421); // houston, tx
network.addNode('Y', 40.014984, -105.270546); // boulder colorado
network.addNode('Z', 40.730610, -73.935242); // new york

let edgeCount = 3; // limit connections between nodes

// finds the nearest lat/long nodes as a crow flies
// and then adds a new edge with a distance value X times
network.genEdgesPer(edgeCount); // generates 3 edges per node

// B, C, X, and Y should now be connected to at least 3 nodes.

// same as genEdgesPer except it is only 1 node connected to
// all other nodes instead of being 3 edges per node
network.genEdgesFor('A'); // generates N edges for node A
network.genEdgesFor('Z'); // generates N edges for node Z

// A and Z should now be connected to every node.

// Find the shortest path from node 'A' to node 'Z' using Dijkstra's algorithm
const shortestPath = network.getPath('A', 'Z');
console.log(`Shortest path from A to Z: ${shortestPath.join(' -> ')}`);

// Test getNode method
const nodeB = network.getNode('B');
console.log('Neighbors of node B:', nodeB);

const timeGraph = new Graph();
const distanceGraph = new Graph();

// uses openrouteservice.org Time-Distance Matrix
// which takes the as a crow flies edges from the network GPS 
// and generates new edges which are as a vehicle drives
// into a time graph and a distance graph
let roads = new Field(network, timeGraph, distanceGraph);

async function runExample() {
  await roads.generateAndWait();

  // Export network and graphs to JSON
  let roadsJSON = roads.toJSON();
  console.log('Field JSON:', roadsJSON);

  // Import the field from JSON
  const importedRoads = new Field();
  importedRoads.fromJSON(roadsJSON);
  
  // show estimated time of arrival by time
  let etaTimePath = importedRoads.timeGraph.getPath('A', 'Z');
  const etaTimePathTotal = importedRoads.timeGraph.getPathTotal(etaTimePath);
  console.log(`Shortest etaTime from A to Z: ${etaTimePath.join(' -> ')} in ${etaTimePathTotal} seconds`);
  
  // show estimated time of arrival by distance
  let etaDistancePath = importedRoads.distanceGraph.getPath('A', 'Z');
  const etaDistancePathTotal = importedRoads.distanceGraph.getPathTotal(etaDistancePath);
  console.log(`Shortest etaDistance from A to Z: ${etaDistancePath.join(' -> ')} in ${etaDistancePathTotal} miles`);
}

runExample().catch(console.error);
```

### ./CURRENT_ERROR.md

```md

```

### ./TODO.md

```md
after todo: i will update my code base with the submitted files and run
the program ... if there is an error then it will be placed within ./CURRENT_ERROR.md
otherwise assume i have updated my requirements.

durring todo: if there is an error within ./CURRENT_ERROR.md then help me solve that
otherwise don't worry about it and proceed with the following todo rules.

TODO RULES:
 1) return a ./src/<filename>.js file
 2) i'd like JavaScript code in response to my queries!
 3) keep console.log statements for debugging
 4) keep code comments for documentation
```

