# 8. Conversation & Knowledge Store

**Flowchart layer 8 — conversation history, user preferences, feedback
loop, marine knowledge graph.**

## Status: NOT implemented

There is no persistence: the backend is stateless and restarting it
loses everything. Multi-turn context works only because the browser
replays the previous location in each request's `context` field, and
telemetry history is kept in the viewer's `localStorage`.

The old Mongo schemas in the repo root `database/` folder were written
for the deleted Node backend and are not wired to anything.
