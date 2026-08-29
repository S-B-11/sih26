# 2. Language Detection & Translation Layer

**Flowchart layer 2 — detect query language, translate to English for
processing, translate the answer back.**

## Status: NOT implemented in the backend

Today language is handled two ways, neither of them a translation layer:

- The **frontend** guesses the language from the script the user typed
  (`detectQueryLanguage` in `frontend/src/app/page.tsx`) and sends it as
  the `language` field.
- The **planner** matches a small set of Devanagari place-name aliases
  (`s3_planner/planner.py`), and the UI ships hand-written copy for eight
  languages.

So a Hindi query is answered from hand-written Hindi strings — it is not
translated. Bhashini / IndicTrans2 integration belongs here.
