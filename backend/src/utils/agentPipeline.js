/**
 * ORCA Agent Pipeline Step Definitions
 * Describes each agent in the multi-agent LangGraph orchestration pipeline.
 * Used by both the backend service and the frontend trace panel.
 */
export const AGENT_PIPELINE_STEPS = [
  {
    id: "marine_data_agent",
    name: "🌊 Marine Data Agent",
    role: "Oceansat-3 & INCOIS PFZ Harvester",
    details: "Querying ISRO Oceansat-3 OCM-3 sensor data for Sea Surface Temperature (SST) & Chlorophyll-a fronts...",
    duration: 800
  },
  {
    id: "weather_agent",
    name: "🌦️ Weather & Ocean State Specialist",
    role: "INSAT-3DR & Atmospheric Forecaster",
    details: "Analyzing wind velocity vectors, wave heights, swell period, and doppler storm cell trajectory...",
    duration: 900
  },
  {
    id: "risk_agent",
    name: "🛡️ Risk Assessment & Geofencing Agent",
    role: "INCOIS Advisory & Naval Boundary Checker",
    details: "Evaluating maritime hazard alert levels, EEZ boundaries, and coastal high wave warning zones...",
    duration: 700
  },
  {
    id: "route_agent",
    name: "🧭 Safe Route Optimizer Agent",
    role: "A* Hydrodynamic Waypoint Planner",
    details: "Computing bathymetry-constrained safe navigation path avoiding swell convergences...",
    duration: 850
  },
  {
    id: "synthesis_agent",
    name: "📊 Multilingual Synthesis Agent",
    role: "LangGraph Evidence Synthesizer",
    details: "Combining geospatial features, generating evidence trace, and localizing advisory response...",
    duration: 600
  }
];
