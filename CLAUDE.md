# CLAUDE.md — Project Context for ORCA (SIH26176)

*Place this file in your project's root directory. Claude Code reads it automatically at the start of every session.*

## Project

**ORCA — Marine EcoSystem Reasoning with Collaborative Agents**
Smart India Hackathon 2026, problem statement SIH26176, sponsored by ISRO. Deadline 20 September 2026.

**What it does:** A conversational AI platform where users (fishermen, coastal authorities, researchers) ask natural-language questions about ocean/weather conditions in any Indian language, and get evidence-backed answers with maps and charts. A multi-agent system processes each query: a planner decomposes it, specialist agents fetch/analyze data in parallel, a synthesis agent produces the final answer.

**Example queries it must handle:**
- Where is the nearest Potential Fishing Zone today?
- Is it safe to venture into the sea tomorrow morning?
- Are there any lightning or cyclone alerts in my area?
- What's the safest route for my boat given current weather?
- Why has fish productivity declined in a particular coastal region?
- Which zones should be avoided due to hazards or geofencing restrictions?

## Tech Stack

- Backend: Python 3.11+, FastAPI
- Agent orchestration: LangGraph (or CrewAI)
- Geospatial: GeoPandas, Shapely, PostGIS
- Frontend: React + Tailwind + Leaflet.js (being built separately in Antigravity — see Frontend Status below)
- Multilingual: AI4Bharat IndicTrans2 (preferred for offline reliability) or Bhashini API

## Required Agents (9 total)

1. **Planner/Orchestrator** — parses intent, decomposes query into subtasks, routes to specialists
2. **Language Detection & Translation** — auto-detects query language, translates both directions
3. **Marine Data Agent** — SST, chlorophyll, PFZ data (NASA Ocean Color, Copernicus Marine Service, INCOIS)
4. **Weather Intelligence Agent** — forecast, cyclone/lightning alerts (OpenWeatherMap / IMD/data.gov.in)
5. **Geospatial Reasoning Agent (Geofencing)** — point-in-polygon checks against EEZ boundaries (Marine Regions/VLIZ) and MPAs (Protected Planet/WDPA)
6. **Risk Assessment Agent** — weighted composite score from wave height + wind + cyclone proximity + lightning risk. Keep this a transparent formula, not a black-box model — explainability is a scored requirement.
7. **Route Optimization Agent** — A* search over a hazard-cost grid (NetworkX)
8. **Visualization Agent** — generates GeoJSON layers + chart data for the frontend
9. **Synthesis/Reporting Agent** — combines all agent outputs into one evidence-cited natural-language answer

## API Contract (frontend already built against this — don't break it)

```
POST /api/query
Request: { "text": string, "language": string, "session_id": string }
Response: {
  "answer_text": string,
  "language": string,
  "map_layers": GeoJSON FeatureCollection,
  "charts": [{ "type": "line"|"bar", "title": string, "data": [...] }],
  "risk_alerts": [{ "level": "low"|"medium"|"high", "message": string }],
  "evidence": [{ "claim": string, "source": string }],
  "agent_trace": [{ "agent_name": string, "status": "done"|"running" }]
}
```

## Frontend Status (built separately in Antigravity, not by you unless asked)

1. First version worked but was too cluttered — everything visible on one screen at once.
2. Revised for minimalism: home screen shows only map + collapsible chat + one input box. Charts, alerts detail, and settings moved to their own routes (`/analytics`, `/alerts`, settings drawer).
3. Feature-completeness gap analysis found these missing/incomplete, currently being added:
   - Geofencing (was entirely absent)
   - Proactive/pushed alerts (was a static toggle, not an actual trigger)
   - **Visible agent collaboration trace** (highest priority — the PS explicitly requires demonstrating multi-agent collaboration; nothing showed this in the UI)
   - Multi-turn context (needs verification)
   - Language auto-detection (was manual dropdown only)
   - Diagnostic "why" queries (need historical trend comparison, not just current snapshot)

## What I need help with here

Focus on the **backend**: implementing the 9-agent LangGraph pipeline, wiring up the real data sources (cache datasets in advance — don't rely on live API calls during a demo), implementing the risk-scoring formula, the geofencing point-in-polygon logic, and the `agent_trace` field so the frontend's reasoning-trace panel has real data to show, not mocked data.

## Constraints

- 6-person team, first SIH attempt, working toward the internal-hackathon round first, then Grand Finale if selected.
- Prioritize a working end-to-end demo of 3 core query types over shallow coverage of everything.
