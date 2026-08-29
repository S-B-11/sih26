# 1. User Query

**Flowchart layer 1 — User Query**

Text / voice input in any language, arriving at `POST /api/orca`.

## Status: partly implemented, lives elsewhere

The request and response schemas are currently declared inline in
`backend/main.py` (`QueryRequest`), and voice capture is done in the
browser (Web Speech API, `frontend/src/app/page.tsx`).

Move the Pydantic request/response models here when they outgrow
`main.py`.
