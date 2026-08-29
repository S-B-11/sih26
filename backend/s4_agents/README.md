# 4. Collaborative Specialized Agents

**Flowchart layer 4 — the specialists, run per query based on the
planner's decomposition.**

| Folder | Flowchart box |
|---|---|
| `marine/` | 4.1 Marine Data Agent |
| `weather/` | 4.2 Weather Agent |
| `geospatial/` | 4.3 Geospatial Reasoning Agent |
| `risk/` | 4.4 Risk Assessment Agent |

## Note on execution

The flowchart says "Parallel Execution". They currently run
**sequentially** in `main.py` — each agent's result feeds the next.
Making them genuinely concurrent (asyncio / LangGraph) is outstanding
work.
