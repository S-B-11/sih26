"""
Sea surface temperature sampled over a grid, for the thermal map layer.

The marine agent returns SST at one point, which is all a text answer
needs. Drawing a thermal layer from that meant a single coloured disc over
the vessel — it showed the reading, not the structure, and the structure is
the useful part: fish gather along fronts, the boundaries where warm and
cool water meet. Those are only visible across an area.

Batched into one upstream call the way the wind grid is, and cached, so
adding the layer does not add a per-point request.
"""

from __future__ import annotations

from typing import Dict, List, Tuple

import requests

from data_sources.response_cache import fetch_with_fallback


MARINE_API_URL = "https://marine-api.open-meteo.com/v1/marine"

# ~22 km. Finer than this and the upstream model returns the same value
# repeatedly — it is not sharper than its own cell size — while the request
# grows quadratically.
GRID_STEP_DEG = 0.2


def _build_grid(
    center_lat: float,
    center_lon: float,
    span_deg: float,
) -> Tuple[List[float], List[float]]:

    steps = max(2, int(span_deg / GRID_STEP_DEG))

    north = center_lat + span_deg / 2
    west = center_lon - span_deg / 2

    lats = [round(north - (i * GRID_STEP_DEG), 4) for i in range(steps + 1)]
    lons = [round(west + (j * GRID_STEP_DEG), 4) for j in range(steps + 1)]

    return lats, lons


def fetch_sst_grid(
    latitude: float = 19.05,
    longitude: float = 72.80,
    span_deg: float = 3.4,
) -> Dict:
    """
    Returns {"success", "points": [{latitude, longitude, sst}], "min", "max"}.

    Land points come back null from the marine model and are dropped, so
    the field renders over water only rather than bleeding across the coast.
    """

    lats, lons = _build_grid(latitude, longitude, span_deg)

    grid_lat: List[float] = []
    grid_lon: List[float] = []

    for lat in lats:
        for lon in lons:
            grid_lat.append(lat)
            grid_lon.append(lon)

    params = {
        "latitude": ",".join(str(v) for v in grid_lat),
        "longitude": ",".join(str(v) for v in grid_lon),
        "hourly": "sea_surface_temperature",
        "forecast_days": 1,
        "cell_selection": "sea",
    }

    def _live():
        response = requests.get(MARINE_API_URL, params=params, timeout=8)
        response.raise_for_status()
        return response.json()

    payload, from_cache, cached_at = fetch_with_fallback(
        "sst_grid", latitude, longitude, _live, extra=str(span_deg)
    )

    # A multi-point request returns a list of per-location objects; a
    # single-point one returns a bare object.
    entries = payload if isinstance(payload, list) else [payload]

    points: List[Dict] = []

    for index, entry in enumerate(entries):

        if index >= len(grid_lat):
            break

        try:
            series = (entry.get("hourly") or {}).get("sea_surface_temperature") or []
        except AttributeError:
            continue

        value = next((v for v in series if v is not None), None)

        if value is None:
            # Land, or outside the model domain.
            continue

        points.append({
            "latitude": grid_lat[index],
            "longitude": grid_lon[index],
            "sst": round(float(value), 2),
        })

    temps = [p["sst"] for p in points]

    return {
        "success": bool(points),
        "source": {
            "provider": "Open-Meteo Marine",
            "served_from_cache": from_cache,
            "cached_at": cached_at,
        },
        "points": points,
        "min": min(temps) if temps else None,
        "max": max(temps) if temps else None,
    }
