import { Graph, GPS, Map } from '../index.js'; // Import the Graph class

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
let roads = new Map(network, timeGraph, distanceGraph);

async function runExample() {
  await roads.generateAndWait();
  
  // show estimated time of arrival by time
  let etaTimePath = roads.timeGraph.getPath('A', 'Z');
  const etaTimePathTotal = roads.timeGraph.getPathTotal(etaTimePath);
  console.log(`Shortest etaTime from A to Z: ${etaTimePath.join(' -> ')} in ${etaTimePathTotal} seconds`);
  
  // show estimated time of arrival by distance
  let etaDistancePath = roads.distanceGraph.getPath('A', 'Z');
  const etaDistancePathTotal = roads.distanceGraph.getPathTotal(etaDistancePath);
  console.log(`Shortest etaDistance from A to Z: ${etaDistancePath.join(' -> ')} in ${etaDistancePathTotal} miles`);
}

runExample().catch(console.error);