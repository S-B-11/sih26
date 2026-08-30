"""
Prime the upstream cache before a demo.

Run this once on good wifi, before presenting:

    cd backend && python warm_cache.py

Every sector it touches then keeps working if the venue network is slow or
dead — the agents fall back to the copy stored here. Run it again on the
day, so the cached readings are current rather than last week's sea state.
"""

from __future__ import annotations

import sys
import time

from s4_agents.marine.marine_agent import analyze_marine_conditions
from s4_agents.marine.pfz_agent import find_potential_fishing_zone
from s4_agents.marine.sst_grid_agent import fetch_sst_grid
from s4_agents.weather.weather_agent import weather_agent
from s4_agents.weather.wind_grid_agent import fetch_wind_grid

# The sectors the dashboard ships with, plus anywhere the demo script goes.
# Add a coordinate here and it is covered too.
SECTORS = [
    # The backend's own fallback position, used whenever a query names
    # no location — the single most likely coordinate in a demo.
    ("Default (Mumbai coastal waters)", 19.05, 72.80),
    ("Mumbai Harbour", 19.0760, 72.8777),
    ("Goa Fishery Zone", 15.2993, 74.1240),
    ("Gulf of Mannar", 9.1500, 79.1200),
    ("Kochi Marine Sector", 9.9312, 76.2673),
    ("Chennai Port & Bay", 13.0827, 80.2707),
    ("Gahirmatha / Paradip", 20.4500, 86.8500),
]


# Open-Meteo rate-limits bursts. Warming seven sectors x five calls
# back-to-back returned 429s, so pace the requests and retry a rejection
# once after a longer wait — this script runs before a demo, not during
# one, so a slower, complete warm is the right trade.
PACE_S = 1.2
# Grid calls request ~324 coordinates at once, which counts far more
# against the rate limit than a single-point lookup, so they get their own
# longer pause and a wait long enough to clear a per-minute window.
GRID_PACE_S = 4.0
RETRY_AFTER_S = 35


def _attempt(call, label: str) -> bool:
    for attempt in (1, 2):
        try:
            result = call()
            if result and result.get("success", True):
                print(f"  {label}  cached")
                return True
            print(f"  {label}  NO DATA")
            return False

        except Exception as error:
            message = str(error)
            rate_limited = "429" in message or "Too Many Requests" in message

            if rate_limited and attempt == 1:
                print(f"  {label}  rate-limited, waiting {RETRY_AFTER_S}s...")
                time.sleep(RETRY_AFTER_S)
                continue

            # Upstream errors embed the whole request URL, which for a grid
            # call is thousands of characters of coordinates.
            print(f"  {label}  FAILED - {message.split(' for url')[0][:110]}")
            return False

    return False


def main() -> int:
    failures = 0

    for name, lat, lon in SECTORS:
        print(f"\n{name}  ({lat}, {lon})")

        # Map layers are cached too: the thermal and wind fields each issue
        # their own upstream grid call, so without these a demo on bad wifi
        # answers questions fine but draws an empty map.
        for label, call in (
            ("marine   ", lambda: analyze_marine_conditions(lat, lon)),
            ("weather  ", lambda: weather_agent(lat, lon)),
            ("pfz      ", lambda: find_potential_fishing_zone(lat, lon)),
            ("sst grid ", lambda: fetch_sst_grid(lat, lon)),
            ("wind grid", lambda: fetch_wind_grid(lat, lon)),
        ):
            if not _attempt(call, label):
                failures += 1
            time.sleep(GRID_PACE_S if "grid" in label else PACE_S)

    print(
        "\nDone."
        if not failures
        else f"\nDone, with {failures} call(s) that did not cache — "
        "re-run on a better connection before the demo."
    )
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
