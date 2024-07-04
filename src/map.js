import Graph from './graph.js';
import GPS from './gps.js';
import fetch from 'node-fetch';

class Map {
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

  // New method to export the Map to JSON
  toJSON() {
    return JSON.stringify({
      gpsNetwork: JSON.parse(this.gpsNetwork.toJSON()),
      timeGraph: JSON.parse(this.timeGraph.toJSON()),
      distanceGraph: JSON.parse(this.distanceGraph.toJSON())
    }, null, 2);
  }

  // New method to import the Map from JSON
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

export default Map;