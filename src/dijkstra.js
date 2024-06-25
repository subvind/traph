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
