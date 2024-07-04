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

  getDistance(node1, node2) {
    const loc1 = this.locations.get(node1);
    const loc2 = this.locations.get(node2);
    if (!loc1 || !loc2) {
      throw new Error('One or both nodes not found');
    }
    return this.calculateDistance(loc1.lat, loc1.long, loc2.lat, loc2.long);
  }

  // Method to calculate distance between two nodes (in km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  }

  // Helper method to convert degrees to radians
  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Method to generate edges for a specific number of nearest neighbors
  genEdgesPer(edgeCount) {
    const nodes = Array.from(this.getNodes());

    nodes.forEach(node => {
      const distances = nodes
        .filter(n => n !== node)
        .map(n => ({ node: n, distance: this.getDistance(node, n) }))
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
        const distance = this.getDistance(startNode, node);
        this.addEdge(startNode, node, distance);
      }
    });
  }

  toJSON() {
    const graphJson = JSON.parse(super.toJSON());
    const locationsJson = {};
    this.locations.forEach((value, key) => {
      locationsJson[key] = value;
    });
    return JSON.stringify({
      locations: locationsJson,
      graph: graphJson
    }, null, 2);
  }

  fromJSON(json) {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    if (json.locations) {
      Object.keys(json.locations).forEach((location) => {
        let node = json.locations[location];
        this.addNode(location, node.lat, node.long);
      })
    }
    
    if (json.graph) {
      Object.keys(json.graph).forEach((node1) => {
        json.graph[node1].forEach((node2) => {
          let nodeOne = this.getNode(node1);
          let nodeTwo = this.getNode(node2.node);
          this.addEdge(nodeOne, nodeTwo, node2.weight);
        })
      })
    }
  }
}

export default GPS;