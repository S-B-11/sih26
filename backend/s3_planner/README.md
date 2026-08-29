# 3. Planner / Orchestrator Agent

**Flowchart layer 3 — understands intent, decomposes the query into
sub-tasks, chooses which specialist agents to run.**

## Contents

- `planner.py` — intent parsing, location extraction (typo-tolerant, with
  Devanagari aliases), time-context detection, and the agent list for a
  given query.

## Note

The flowchart labels this "LLM-based". The current implementation is
rule/keyword based, not an LLM call.
