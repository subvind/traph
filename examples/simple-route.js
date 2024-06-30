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