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
      console.log('Warning: Path is empty or contains only one node');
      return 0;
    }

    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const currentNode = path[i];
      const nextNode = path[i + 1];
      const neighbors = this.nodes.get(currentNode);
      const edge = neighbors.find(neighbor => neighbor.node === nextNode);

      if (!edge) {
        console.log(`Warning: No edge between ${currentNode} and ${nextNode}`);
        return total;
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
