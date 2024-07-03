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
}

export default GPS;