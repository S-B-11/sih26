// Base URL of the ORCA Python backend.
//
// These fetches run in the *viewer's* browser, so a hardcoded "localhost"
// points at whichever machine has the page open — fine on the dev machine,
// broken the moment a phone or a teammate's laptop opens the app.
//
// So by default derive it from however the page was reached: open the
// console on localhost and the API is localhost, open it on the host's
// LAN/hotspot address and the API is that same address. The backend
// listens on 0.0.0.0 (npm run dev:backend:lan) and its CORS rules already
// allow private-range origins, so this needs no per-network config and
// survives the IP changing when you switch Wi-Fi or hotspot.
//
// NEXT_PUBLIC_API_BASE still overrides, for the case where the API is not
// on the same host as the frontend. It is inlined at build time, so the
// dev server needs a restart after changing it.
const API_PORT = 8000;

function inferApiBase() {
  if (typeof window === "undefined") {
    // Server render: nothing fetches here, the client bundle re-evaluates
    // this in the browser and gets the real origin.
    return `http://localhost:${API_PORT}`;
  }

  return `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || inferApiBase();
