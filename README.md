traph
========
a simple route optimizer with AI enhancements that is...

built with:
- NestJS for maintaining the finite state machine
- node-dijkstra for weighted graph path calculations
- abstract-level for key value/storage
- socket.io for handling events between browser and server

supports:
- weighted graphs (speed limit graph, distance graph)
- event timeline (fast forward, pause, play, rewind)
- layers and tunnels (many weighted graphs linked together)
- current state (as events happen in real time)
- history state (as events happened in the past)
- upcoming state (as events will happen in the future)
- simulated state (as events happen in the event timeline)
- transport machines (vehicles, packets, boats, planes)
- transport types (goods and services)

integrates with:
- complete road network from Planet OSM

goals:
- maintain field service systems
- maintain factory production systems
- maintain internet wide database systems
- maintain bio eco systems