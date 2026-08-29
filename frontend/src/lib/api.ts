// Base URL of the ORCA Python backend.
//
// These fetches run in the *viewer's* browser, so a hardcoded
// "localhost" points at whichever machine has the page open — fine on
// the dev machine, broken as soon as a teammate opens the app from
// their own laptop. Set NEXT_PUBLIC_API_BASE (see frontend/.env.local)
// to the host machine's LAN address when sharing the running app.
//
// NEXT_PUBLIC_ values are inlined at build time, so the dev server
// needs a restart after changing it.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
