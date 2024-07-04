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

### ./examples/example-field.json

```json
{
  "gpsNetwork": {
    "locations": {
      "A": {
        "lat": 34.052235,
        "long": -118.243683
      },
      "B": {
        "lat": 30.2727,
        "long": -97.7394
      },
      "C": {
        "lat": 32.779167,
        "long": -96.808891
      },
      "X": {
        "lat": 29.749907,
        "long": -95.358421
      },
      "Y": {
        "lat": 40.014984,
        "long": -105.270546
      },
      "Z": {
        "lat": 40.73061,
        "long": -73.935242
      }
    },
    "graph": {
      "A": [
        {
          "node": "Y",
          "weight": 1326.7972334600158
        },
        {
          "node": "B",
          "weight": 1971.6905958229313
        },
        {
          "node": "C",
          "weight": 1990.8434973081692
        },
        {
          "node": "X",
          "weight": 2207.6737445469907
        },
        {
          "node": "Z",
          "weight": 3941.5662057095674
        }
      ],
      "B": [
        {
          "node": "A",
          "weight": 1971.6905958229313
        },
        {
          "node": "X",
          "weight": 236.50634244314017
        },
        {
          "node": "C",
          "weight": 292.3237603934154
        },
        {
          "node": "Y",
          "weight": 1280.3886678328656
        },
        {
          "node": "Z",
          "weight": 2437.2457774473787
        }
      ],
      "C": [
        {
          "node": "A",
          "weight": 1990.8434973081692
        },
        {
          "node": "B",
          "weight": 292.3237603934154
        },
        {
          "node": "X",
          "weight": 363.9460377090879
        },
        {
          "node": "Y",
          "weight": 1103.8837236062436
        },
        {
          "node": "Z",
          "weight": 2212.8307101245787
        }
      ],
      "X": [
        {
          "node": "B",
          "weight": 236.50634244314017
        },
        {
          "node": "C",
          "weight": 363.9460377090879
        },
        {
          "node": "Y",
          "weight": 1454.0552066119153
        },
        {
          "node": "Z",
          "weight": 2287.4325000232516
        },
        {
          "node": "A",
          "weight": 2207.6737445469907
        }
      ],
      "Y": [
        {
          "node": "A",
          "weight": 1326.7972334600158
        },
        {
          "node": "B",
          "weight": 1280.3886678328656
        },
        {
          "node": "C",
          "weight": 1103.8837236062436
        },
        {
          "node": "X",
          "weight": 1454.0552066119153
        },
        {
          "node": "Z",
          "weight": 2641.5615203776956
        }
      ],
      "Z": [
        {
          "node": "C",
          "weight": 2212.8307101245787
        },
        {
          "node": "X",
          "weight": 2287.4325000232516
        },
        {
          "node": "B",
          "weight": 2437.2457774473787
        },
        {
          "node": "A",
          "weight": 3941.5662057095674
        },
        {
          "node": "Y",
          "weight": 2641.5615203776956
        }
      ]
    }
  },
  "timeGraph": {
    "A": [
      {
        "node": "B",
        "weight": 76773.05
      },
      {
        "node": "C",
        "weight": 79042.35
      },
      {
        "node": "X",
        "weight": 84657.52
      },
      {
        "node": "Y",
        "weight": 58784.67
      },
      {
        "node": "Z",
        "weight": 161400.08
      }
    ],
    "B": [
      {
        "node": "A",
        "weight": 76773.05
      },
      {
        "node": "C",
        "weight": 11158.46
      },
      {
        "node": "X",
        "weight": 10306.62
      },
      {
        "node": "Y",
        "weight": 56899.31
      },
      {
        "node": "Z",
        "weight": 104126.48
      }
    ],
    "C": [
      {
        "node": "A",
        "weight": 79042.35
      },
      {
        "node": "B",
        "weight": 11158.46
      },
      {
        "node": "X",
        "weight": 13913.79
      },
      {
        "node": "Y",
        "weight": 49507.78
      },
      {
        "node": "Z",
        "weight": 93398.07
      }
    ],
    "X": [
      {
        "node": "A",
        "weight": 84657.52
      },
      {
        "node": "B",
        "weight": 10306.62
      },
      {
        "node": "C",
        "weight": 13913.79
      },
      {
        "node": "Y",
        "weight": 63072.57
      },
      {
        "node": "Z",
        "weight": 99597.74
      }
    ],
    "Y": [
      {
        "node": "A",
        "weight": 58784.67
      },
      {
        "node": "B",
        "weight": 56899.31
      },
      {
        "node": "C",
        "weight": 49507.78
      },
      {
        "node": "X",
        "weight": 63072.57
      },
      {
        "node": "Z",
        "weight": 106020.28
      }
    ],
    "Z": [
      {
        "node": "A",
        "weight": 161400.08
      },
      {
        "node": "B",
        "weight": 104126.48
      },
      {
        "node": "C",
        "weight": 93398.07
      },
      {
        "node": "X",
        "weight": 99597.74
      },
      {
        "node": "Y",
        "weight": 106020.28
      }
    ]
  },
  "distanceGraph": {
    "A": [
      {
        "node": "B",
        "weight": 1378.6
      },
      {
        "node": "C",
        "weight": 1440.42
      },
      {
        "node": "X",
        "weight": 1549.79
      },
      {
        "node": "Y",
        "weight": 1037.76
      },
      {
        "node": "Z",
        "weight": 2793.88
      }
    ],
    "B": [
      {
        "node": "A",
        "weight": 1378.6
      },
      {
        "node": "C",
        "weight": 194.91
      },
      {
        "node": "X",
        "weight": 166
      },
      {
        "node": "Y",
        "weight": 946.68
      },
      {
        "node": "Z",
        "weight": 1748.08
      }
    ],
    "C": [
      {
        "node": "A",
        "weight": 1440.42
      },
      {
        "node": "B",
        "weight": 194.91
      },
      {
        "node": "X",
        "weight": 242.25
      },
      {
        "node": "Y",
        "weight": 898
      },
      {
        "node": "Z",
        "weight": 1553.93
      }
    ],
    "X": [
      {
        "node": "A",
        "weight": 1549.79
      },
      {
        "node": "B",
        "weight": 166
      },
      {
        "node": "C",
        "weight": 242.25
      },
      {
        "node": "Y",
        "weight": 1140.44
      },
      {
        "node": "Z",
        "weight": 1631.94
      }
    ],
    "Y": [
      {
        "node": "A",
        "weight": 1037.76
      },
      {
        "node": "B",
        "weight": 946.68
      },
      {
        "node": "C",
        "weight": 898
      },
      {
        "node": "X",
        "weight": 1140.44
      },
      {
        "node": "Z",
        "weight": 1796.19
      }
    ],
    "Z": [
      {
        "node": "A",
        "weight": 2793.88
      },
      {
        "node": "B",
        "weight": 1748.08
      },
      {
        "node": "C",
        "weight": 1553.93
      },
      {
        "node": "X",
        "weight": 1631.94
      },
      {
        "node": "Y",
        "weight": 1796.19
      }
    ]
  }
}
```

### ./examples/example-field-demo.js

```js
import { Field } from '../index.js';
import fs from 'fs/promises';

async function runExampleField() {
  try {
    // Read the JSON file
    const jsonData = await fs.readFile('./examples/example-field.json', 'utf8');
    const fieldData = JSON.parse(jsonData);

    // Create a new Field instance
    const field = new Field();

    // Import the field from JSON
    field.fromJSON(fieldData);

    // Example: Find the shortest path from A to Z using the time graph
    const shortestTimePath = field.timeGraph.getPath('A', 'Z');
    const totalTime = field.timeGraph.getPathTotal(shortestTimePath);
    console.log('Shortest time path from A to Z:', shortestTimePath.join(' -> '));
    console.log('Total time:', totalTime, 'seconds');

    // Example: Find the shortest path from A to Z using the distance graph
    const shortestDistancePath = field.distanceGraph.getPath('A', 'Z');
    const totalDistance = field.distanceGraph.getPathTotal(shortestDistancePath);
    console.log('Shortest distance path from A to Z:', shortestDistancePath.join(' -> '));
    console.log('Total distance:', totalDistance, 'miles');

    // Example: Get GPS coordinates for a specific node
    const nodeA = field.gpsNetwork.getNode('A');
    console.log('GPS coordinates for node A:', nodeA);

    // Example: Calculate distance between two nodes using GPS network
    const distanceAB = field.gpsNetwork.getDistance('A', 'B');
    console.log('Distance between A and B (as the crow flies):', distanceAB, 'km');

  } catch (error) {
    console.error('Error running example:', error);
  }
}

runExampleField();
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

