# ORCA — Marine EcoSystem Reasoning with Collaborative Agents
**ISRO SIH26176 | Department of Space | INCOIS Ocean Intelligence System**

---

## 🌊 Overview

**ORCA** is an Agentic AI-powered conversational marine decision-support system developed for **Smart India Hackathon 2026 (Problem Statement SIH26176)**. It integrates ISRO satellite Earth Observation products (Oceansat-3, INSAT-3DR) with INCOIS oceanographic forecasts to provide real-time, explainable, and multi-lingual marine advisory services for fishermen, maritime operators, and coastal authorities.

---

## 🏛️ Project Architecture

```
sih26-main/
├── frontend/                     ← Next.js 16 + React 19 (Tailwind CSS v4, lucide-react)
│   ├── src/app/
│   │   ├── page.tsx               — Main dashboard (map, chat co-pilot, agent pipeline, analytics)
│   │   ├── layout.tsx             — Root layout & fonts
│   │   └── api/chat/route.ts      — Chat API route
│   └── package.json
│
├── backend/                      ← Python 3.11+ / FastAPI, foldered by workflow stage
│   ├── main.py                    — FastAPI app & routes (:8000)
│   ├── s1_query/                  — 1. User query (schemas; today inline in main.py)
│   ├── s2_language/               — 2. Language detection & translation (not yet built)
│   ├── s3_planner/                — 3. Planner / orchestrator
│   ├── s4_agents/                 — 4. Collaborative specialized agents
│   │   ├── marine/                —   4.1 SST, chlorophyll, PFZ
│   │   ├── weather/               —   4.2 forecast, wind, wind grid
│   │   ├── geospatial/            —   4.3 geofencing, location, routing
│   │   └── risk/                  —   4.4 composite safety score
│   ├── s5_synthesis/              — 5. Synthesis / aggregator
│   ├── s6_response/               — 6. Response shaping (not yet built)
│   ├── s7_alerting/               — 7. Proactive alerts (not yet built)
│   ├── s8_knowledge/              — 8. Conversation & knowledge store (not yet built)
│   ├── data_sources/              — Cached datasets (Copernicus NetCDF)
│   └── requirements.txt
│
├── database/                     ← (legacy MongoDB layer, not used by the Python backend — pending cleanup)
│   ├── schemas/                  — PfzZone, Buoy, Alert, Session Mongoose models
│   ├── seeds/                    — seed.js (Pre-populated oceanographic data)
│   └── config/                   — db.config.js
│
├── scripts/
│   └── git-push.js               — One-click automated Git commit & push tool
│
├── package.json                  ← Workspace config (frontend) + dev scripts
└── README.md                     ← Project documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```
This installs the frontend's npm packages and the backend's Python packages (`pip install -r backend/requirements.txt`) — use a virtualenv for the Python side.

### 2. Start Development Servers
```bash
# Start Frontend (port 3000)
npm run dev:frontend

# Start Backend API (port 8000)
npm run dev:backend
```

### 3. Push Updates to GitHub
```bash
npm run push
# or with custom message:
npm run push -- "updated multi-agent pipeline"
```

---

## 🤖 Multi-Agent Architecture (LangGraph Principles)

1. **🧠 Multi-Agent Planner & Router**: Autonomous query intent decomposition & task orchestration.
2. **🌊 Marine Data Specialist**: ISRO Oceansat-3 OCM-3 sensor data (SST & Chlorophyll-a fronts) & INCOIS PFZ.
3. **🌦️ Weather & Ocean State Agent**: INSAT-3DR atmospheric radar, WAVEWATCH-III numerical wave models & squall vectors.
4. **🛡️ Risk & Geofencing Agent**: Ray-casting point-in-polygon checks for EEZ limits, Marine Protected Areas (MPAs), and Naval Restricted waters.
5. **📈 Diagnostic Ocean Analytics Agent**: 6-month historical Chlorophyll-a / SST anomaly correlation vs. 5-year climatological baselines.
6. **🧭 Safe Route Optimizer Agent**: A* hydrodynamic waypoint routing avoiding swell convergence zones.
7. **📊 Multilingual Synthesis Agent**: Evidence citation aggregation, confidence scoring, and Indian regional language translation (Hindi, Tamil, Telugu, Malayalam, Gujarati, Bengali).

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service status |
| `GET` | `/api/status` | Per-agent readiness status |
| `POST` | `/api/query` | Run the query planner only |
| `GET` | `/api/marine` | Marine agent (SST/marine conditions) |
| `GET` | `/api/weather` | Weather agent (wind/forecast) |
| `GET` | `/api/geo` | Geospatial / geofencing agent |
| `GET` | `/api/risk` | Composite risk assessment |
| `POST` | `/api/orca` | Full multi-agent pipeline: planner → location → marine → weather → geo → risk → synthesis |

---

*Developed for Smart India Hackathon 2026 — Problem Statement SIH26176 (ISRO / Department of Space)*