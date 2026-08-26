# ORCA — Marine EcoSystem Reasoning with Collaborative Agents
**ISRO SIH26176 | Department of Space | INCOIS Ocean Intelligence System**

---

## 🌊 Overview

**ORCA** is an Agentic AI-powered conversational marine decision-support system developed for **Smart India Hackathon 2026 (Problem Statement SIH26176)**. It integrates ISRO satellite Earth Observation products (Oceansat-3, INSAT-3DR) with INCOIS oceanographic forecasts to provide real-time, explainable, and multi-lingual marine advisory services for fishermen, maritime operators, and coastal authorities.

---

## 🏛️ Project Architecture

```
orca-frontend/
├── frontend/                     ← React 19 + Vite SPA (Tailwind CSS, Leaflet GIS, Recharts)
│   ├── src/divisions/
│   │   ├── shell/                — Layout, TopBar, NavRail, SettingsDrawer, LanguageModal, RiskAlertBanner
│   │   ├── chat/                 — ChatPanel, InputArea, ReasoningTrace, AgentTracePanel, EvidencePanel
│   │   ├── map/                  — MapPanel (Leaflet GIS, Geofence overlays, Buoys, PFZ)
│   │   ├── pages/                — Home (`/`), Analytics (`/analytics`), Alerts (`/alerts`)
│   │   ├── context/              — OrcaContext (State management across routes)
│   │   ├── data/                 — mockBackend.js, geofenceZones.js, presetQueries.js, translations.js
│   │   ├── utils/                — detectLanguage.js (Indic Unicode detection)
│   │   └── hooks/                — useOrcaQuery.js, useVoiceInput.js
│   └── package.json
│
├── backend/                      ← Node.js + Express REST API
│   ├── src/
│   │   ├── app.js                — Express app configuration & middleware
│   │   ├── server.js             — API entry point (:5000)
│   │   ├── routes/               — query, ocean, alert, session routes
│   │   ├── controllers/          — Route handlers
│   │   ├── services/             — OrcaQueryService, OceanDataService, AlertService, SessionService
│   │   ├── middleware/           — errorHandler, rateLimiter
│   │   ├── config/               — MongoDB Mongoose connection
│   │   └── utils/                — agentPipeline.js, scenarios.js
│   └── package.json
│
├── database/                     ← MongoDB Layer
│   ├── schemas/                  — PfzZone, Buoy, Alert, Session Mongoose models
│   ├── seeds/                    — seed.js (Pre-populated oceanographic data)
│   └── config/                   — db.config.js
│
├── scripts/
│   ├── git-push.js               — One-click automated Git commit & push tool
│   └── git-pull.js               — One-click automated Git pull & sync tool
│
├── package.json                  ← Monorepo workspace configuration
└── README.md                     ← Project documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Development Servers
```bash
# Start Frontend (port 5173 / 3000)
npm run dev:frontend

# Start Backend API (port 5000)
npm run dev:backend
```

### 3. Sync Changes with GitHub

```bash
# Push all local changes to GitHub
npm run push
# or with custom message:
npm run push -- "updated multi-agent pipeline"

# Pull latest changes from GitHub to your PC
npm run pull
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
| `GET` | `/api/health` | Service health status |
| `POST` | `/api/query` | Run Multi-Agent reasoning pipeline |
| `GET` | `/api/query/agents` | Get agent step definitions |
| `GET` | `/api/ocean/pfz` | List Potential Fishing Zones |
| `GET` | `/api/ocean/buoys` | Ocean buoy telemetry streams |
| `GET` | `/api/ocean/geojson` | Complete GIS feature collection |
| `GET` | `/api/alerts` | Active maritime risk bulletins |
| `GET` | `/api/sessions/:userId`| User conversation history |

---

*Developed for Smart India Hackathon 2026 — Problem Statement SIH26176 (ISRO / Department of Space)*