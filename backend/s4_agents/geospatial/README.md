# 4.3 Geospatial Reasoning Agent

Boundaries, place resolution and spatial pathfinding.

- `geo_agent.py` — point-in-polygon geofencing against EEZ, Marine
  Protected Areas and restricted zones; distance/bearing helpers.
- `location_agent.py` — place name (English + Devanagari) to coordinates.
- `route_agent.py` — wave-aware safe route waypoints.

## Note

`route_agent.py` is the Route Optimization Agent, which CLAUDE.md lists
as its own agent and the flowchart does not draw as a separate box. It
sits here because it is spatial pathfinding; move it out if it grows.
