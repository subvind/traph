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