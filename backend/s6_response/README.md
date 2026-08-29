# 6. Response Layer

**Flowchart layer 6 — conversational answer, map layers, charts, and the
"why" explanation with sources.**

## Status: NOT implemented as a backend layer

`main.py` returns the raw agent dict and the **frontend** shapes it into
chat text, Leaflet layers and charts.

Note this differs from the `POST /api/query` contract in CLAUDE.md
(`answer_text`, `map_layers`, `charts`, `risk_alerts`, `evidence`,
`agent_trace`). A response-shaping module that emits exactly that
contract belongs here.
