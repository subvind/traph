npm run map-route

> traph@1.0.0 map-route
> node ./examples/map-route.js --env-file=.env

Shortest path from A to Z: A -> Z
Neighbors of node B: [
  { node: 'A', weight: 1971.6905958229313 },
  { node: 'X', weight: 236.50634244314017 },
  { node: 'C', weight: 292.3237603934154 },
  { node: 'Y', weight: 1280.3886678328656 },
  { node: 'C', weight: 292.3237603934154 },
  { node: 'X', weight: 236.50634244314017 },
  { node: 'Y', weight: 1280.3886678328656 },
  { node: 'Z', weight: 2437.2457774473787 },
  { node: 'A', weight: 1971.6905958229313 },
  { node: 'Z', weight: 2437.2457774473787 }
]
file:///Users/subvind/Projects/traph/src/graph.js:51
      throw new Error('Path must be an array of at least two nodes');
            ^

Error: Path must be an array of at least two nodes
    at Graph.getPathTotal (file:///Users/subvind/Projects/traph/src/graph.js:51:13)
    at file:///Users/subvind/Projects/traph/examples/map-route.js:47:42
    at ModuleJob.run (node:internal/modules/esm/module_job:192:25)
    at async DefaultModuleLoader.import (node:internal/modules/esm/loader:228:24)
    at async loadESM (node:internal/process/esm_loader:40:7)
    at async handleMainPromise (node:internal/modules/run_main:66:12)