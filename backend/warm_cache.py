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

from s4_agents.marine.marine_agent import analyze_marine_conditions
from s4_agents.marine.pfz_agent import find_potential_fishing_zone
from s4_agents.weather.weather_agent import weather_agent

# The sectors the dashboard ships with, plus anywhere the demo script goes.
# Add a coordinate here and it is covered too.
SECTORS = [
    ("Mumbai Harbour", 19.0760, 72.8777),
    ("Goa Fishery Zone", 15.2993, 74.1240),
    ("Gulf of Mannar", 9.1500, 79.1200),
    ("Kochi Marine Sector", 9.9312, 76.2673),
    ("Chennai Port & Bay", 13.0827, 80.2707),
    ("Gahirmatha / Paradip", 20.4500, 86.8500),
]


def main() -> int:
    failures = 0

    for name, lat, lon in SECTORS:
        print(f"\n{name}  ({lat}, {lon})")

        for label, call in (
            ("marine ", lambda: analyze_marine_conditions(lat, lon)),
            ("weather", lambda: weather_agent(lat, lon)),
            ("pfz    ", lambda: find_potential_fishing_zone(lat, lon)),
        ):
            try:
                result = call()
                ok = bool(result) and result.get("success", True)
                print(f"  {label}  {'cached' if ok else 'NO DATA'}")
                if not ok:
                    failures += 1
            except Exception as error:
                print(f"  {label}  FAILED — {error}")
                failures += 1

    print(
        "\nDone."
        if not failures
        else f"\nDone, with {failures} call(s) that did not cache — "
        "re-run on a better connection before the demo."
    )
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
