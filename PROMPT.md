Please follow the instructions within ./TODO.md! Thank you :)
### ./index.js

```js
import Graph from './src/graph.js'; // Import the Graph class

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

### ./src/dijkstra.js

```js
import Graph from './graph.js'; // Import the Graph class
import PriorityQueue from './priorityQueue.js'; // Import the PriorityQueue class

// Class implementing Dijkstra's algorithm
class Dijkstra {
  // Static method to find the shortest path in the graph from startNode to endNode
  static findShortestPath(graph, startNode, endNode) {
    let distances = {}; // Object to store distances from the startNode to other nodes
    let prev = {}; // Object to store the previous node in the shortest path
    let pq = new PriorityQueue(); // Priority queue to select the next node to process

    // Initialize distances and previous nodes
    for (let node of graph.getNodes()) {
      if (node === startNode) {
        distances[node] = 0;
        pq.enqueue(node, 0);
      } else {
        distances[node] = Infinity;
        pq.enqueue(node, Infinity);
      }
      prev[node] = null;
    }

    // Process nodes in the priority queue
    while (!pq.isEmpty()) {
      let { value: currentNode } = pq.dequeue();
      if (currentNode === endNode) {
        // If the endNode is reached, build and return the shortest path
        let path = [];
        while (prev[currentNode]) {
          path.push(currentNode);
          currentNode = prev[currentNode];
        }
        path.push(startNode);
        return path.reverse();
      }

      // Update distances to neighbors
      for (let neighbor of graph.getNeighbors(currentNode)) {
        let alt = distances[currentNode] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          prev[neighbor.node] = currentNode;
          pq.enqueue(neighbor.node, alt);
        }
      }
    }

    return []; // Return an empty array if no path is found
  }
}

export default Dijkstra; // Export the Dijkstra class as a module

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
      this.nodes.set(node, []);
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
    this.nodes.get(node1).push({ node: node2, weight });
    this.nodes.get(node2).push({ node: node1, weight }); // If the graph is undirected
  }

  // Method to get all nodes in the graph
  getNodes() {
    return this.nodes.keys();
  }

  // Method to get neighbors of a node
  getNeighbors(node) {
    return this.nodes.get(node);
  }
  
  // Method to get a specific node and its edges
  getNode(node) {
    return this.nodes.get(node);
  }
  
  // Method to find the shortest path between two nodes
  getPath(start, end) {
     return Dijkstra.findShortestPath(this, start, end);
  }

  // Method to calculate the total weight of a path
  getPathTotal(path) {
    if (!Array.isArray(path) || path.length < 2) {
      throw new Error('Path must be an array of at least two nodes');
    }

    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const currentNode = path[i];
      const nextNode = path[i + 1];
      const neighbors = this.nodes.get(currentNode);
      const edge = neighbors.find(neighbor => neighbor.node === nextNode);

      if (!edge) {
        throw new Error(`No edge between ${currentNode} and ${nextNode}`);
      }

      total += edge.weight;
    }

    return total;
  }
  
  // Method to export the graph to JSON
  toJSON() {
    const obj = {};
    this.nodes.forEach((edges, node) => {
      obj[node] = edges.map(edge => ({ node: edge.node, weight: edge.weight }));
    });
    return JSON.stringify(obj, null, 2);
  }
  
  // Method to import a graph from JSON
  fromJSON(json) {
    const obj = JSON.parse(json);
    this.nodes.clear();
    const edgesAdded = new Set();
    for (let node in obj) {
      this.addNode(node);
      obj[node].forEach(edge => {
        const edgeKey = `${node}-${edge.node}`;
        const reverseEdgeKey = `${edge.node}-${node}`;
        if (!edgesAdded.has(edgeKey) && !edgesAdded.has(reverseEdgeKey)) {
          this.addEdge(node, edge.node, edge.weight);
          edgesAdded.add(edgeKey);
        }
      });
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

### ./CURRENT_ERROR.md

```md
npm run start

> traph@1.0.0 start
> node index.js

Shortest path from A to D: A -> C -> E -> D
Neighbors of node C: [
  { node: 'A', weight: 2 },
  { node: 'B', weight: 5 },
  { node: 'E', weight: 3 }
]
Total weight of path A -> C -> E -> D: 9
Graph JSON: {
  "A": [
    {
      "node": "B",
      "weight": 4
    },
    {
      "node": "C",
      "weight": 2
    }
  ],
  "B": [
    {
      "node": "A",
      "weight": 4
    },
    {
      "node": "C",
      "weight": 5
    },
    {
      "node": "D",
      "weight": 10
    }
  ],
  "C": [
    {
      "node": "A",
      "weight": 2
    },
    {
      "node": "B",
      "weight": 5
    },
    {
      "node": "E",
      "weight": 3
    }
  ],
  "D": [
    {
      "node": "B",
      "weight": 10
    },
    {
      "node": "E",
      "weight": 4
    }
  ],
  "E": [
    {
      "node": "C",
      "weight": 3
    },
    {
      "node": "D",
      "weight": 4
    }
  ]
}
Imported graph neighbors of node C: [
  { node: 'A', weight: 2 },
  { node: 'B', weight: 5 },
  { node: 'E', weight: 3 }
]
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

