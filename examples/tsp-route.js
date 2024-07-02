import { Graph, TSPSolver } from '../index.js'; // Import the Graph class

// Create and populate the graph
const graph = new Graph();

graph.addNode('A');
graph.addNode('B');
graph.addNode('C');
graph.addNode('D');
graph.addNode('E');
graph.addNode('F');
graph.addNode('G');
graph.addNode('H');
graph.addNode('I');
graph.addNode('J');
graph.addNode('K');

graph.addEdge("A", "B", 10);
graph.addEdge("A", "C", 15);
graph.addEdge("A", "D", 20);
graph.addEdge("B", "C", 35);
graph.addEdge("B", "D", 25);
graph.addEdge("C", "D", 10);
graph.addEdge("C", "E", 35);
graph.addEdge("C", "F", 30);
graph.addEdge("D", "G", 10);
graph.addEdge("E", "G", 15);
graph.addEdge("F", "G", 10);
graph.addEdge("G", "H", 20);
graph.addEdge("G", "I", 15);
graph.addEdge("G", "J", 40);
graph.addEdge("H", "K", 30);
graph.addEdge("I", "K", 10);
graph.addEdge("J", "K", 45);

const start = "A";
const finish = "A";
const nodesToVisit = ["G", "K"];

// Solve the TSP
const solver = new TSPSolver(graph, start, finish, nodesToVisit, { generations: 1000 });
const solution = solver.solve();

console.log('Best tour:', solution.path);
console.log('Tour length:', solution.distance);

if (solution.error) {
  console.error('Error:', solution.error);
}