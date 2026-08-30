from typing import Dict, List, Optional, Union
import math
import requests

import time

from data_sources.response_cache import (
    fetch_with_fallback,
    load as cache_load,
    store as cache_store,
)

from s4_agents.marine.marine_agent import (
    MARINE_API_URL,
    _normalize_time,
    _select_forecast_index,
    _get_value,
)
from s4_agents.geospatial.geo_agent import calculate_distance
from s4_agents.weather.weather_agent import direction_name


# =========================================================
# ORCA POTENTIAL FISHING ZONE (PFZ) AGENT
#
# Approximates the INCOIS PFZ methodology (thermal front +
# chlorophyll productivity signal) using:
#   - Live Sea Surface Temperature on a small grid around the
#     requested point (Open-Meteo Marine, batched in one call).
#   - Best-effort chlorophyll-a from NOAA CoastWatch ERDDAP
#     (MODIS Aqua). This call is optional: if it fails (no
#     network, dataset changed, timeout) the zone score falls
#     back to the SST thermal-front signal alone and is marked
#     accordingly, matching this codebase's existing pattern of
#     degrading gracefully instead of failing the whole request.
# =========================================================

CHLOROPHYLL_API_URL = (
    "https://coastwatch.pfeg.noaa.gov/erddap/griddap/erdMH1chlamday.json"
)

# Grid search parameters
GRID_STEPS = [-2, -1, 0, 1, 2]
GRID_SPACING_DEG = 0.25
MAX_SEARCH_RADIUS_KM = 60

# Thermal comfort band for pelagic species aggregation, consistent
# with the range already used by the synthesis agent's "why" reasoning.
SST_FAVOURABLE_MIN = 26.0
SST_FAVOURABLE_MAX = 30.5


def _fetch_chlorophyll(latitude: float, longitude: float) -> Optional[float]:
    """
    Best-effort chlorophyll-a (mg/m3) from NOAA ERDDAP (a monthly MODIS Aqua
    composite, not a live reading). Returns None when unavailable, and the
    PFZ estimate degrades to SST-only.

    This endpoint is slow and frequently returns nothing. Two consequences
    are handled here rather than paid on every request:

    * `timeout` in requests is per phase, not a total budget — a bare
      timeout=3 was measured at 6.8s wall clock. A tuple bounds each phase.
    * A failure is cached like a success. Without that, a sector where the
      endpoint is down pays the full timeout on every single query, which
      was ~90% of the PFZ agent's runtime. The short TTL means a recovered
      endpoint is picked up again rather than written off forever.
    """

    NEGATIVE_TTL_S = 6 * 3600
    POSITIVE_TTL_S = 7 * 24 * 3600

    cached = cache_load("chlorophyll", latitude, longitude, max_age_s=POSITIVE_TTL_S)

    if cached is not None:
        value = cached.get("payload")
        # A cached miss is only honoured for the shorter window.
        if value is not None:
            return value
        if (time.time() - float(cached.get("cached_at", 0))) <= NEGATIVE_TTL_S:
            return None

    value: Optional[float] = None

    try:
        query = (
            f"chlorophyll[(last)][({latitude}):({latitude})]"
            f"[({longitude}):({longitude})]"
        )

        response = requests.get(
            f"{CHLOROPHYLL_API_URL}?{query}",
            timeout=(1.5, 2.0),
        )
        response.raise_for_status()

        rows = response.json().get("table", {}).get("rows", [])

        if rows:
            # Row shape: [time, latitude, longitude, chlorophyll]
            raw = rows[0][-1]
            value = round(float(raw), 3) if raw is not None else None

    except Exception:
        value = None

    cache_store("chlorophyll", latitude, longitude, value)
    return value

def _build_grid(latitude: float, longitude: float) -> List[Dict]:
    """
    Candidate points around the requested location, filtered to a
    realistic search radius so results stay in the same coastal sector.
    """

    candidates = []

    for lat_step in GRID_STEPS:
        for lon_step in GRID_STEPS:

            candidate_lat = latitude + (lat_step * GRID_SPACING_DEG)
            candidate_lon = longitude + (lon_step * GRID_SPACING_DEG)

            distance_km = calculate_distance(
                latitude, longitude, candidate_lat, candidate_lon
            )

            if distance_km > MAX_SEARCH_RADIUS_KM:
                continue

            candidates.append({
                "latitude": round(candidate_lat, 4),
                "longitude": round(candidate_lon, 4),
                "distance_km": distance_km,
                "is_center": lat_step == 0 and lon_step == 0,
            })

    return candidates


def _bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lon = math.radians(lon2 - lon1)

    x = math.sin(delta_lon) * math.cos(lat2_rad)
    y = (
        math.cos(lat1_rad) * math.sin(lat2_rad)
        - math.sin(lat1_rad) * math.cos(lat2_rad) * math.cos(delta_lon)
    )

    return (math.degrees(math.atan2(x, y)) + 360) % 360


def find_potential_fishing_zone(
    latitude: float = 19.05,
    longitude: float = 72.80,
    time: Optional[Union[str, Dict]] = None,
) -> Dict:
    """
    ORCA Potential Fishing Zone (PFZ) Agent.

    Searches a grid of points around the requested location for the
    strongest SST thermal-front + chlorophyll productivity signal, and
    returns the nearest favourable candidate with distance/bearing from
    the requested point.
    """

    latitude = float(latitude)
    longitude = float(longitude)
    requested_time = _normalize_time(time)

    grid = _build_grid(latitude, longitude)

    lat_list = ",".join(str(point["latitude"]) for point in grid)
    lon_list = ",".join(str(point["longitude"]) for point in grid)

    params = {
        "latitude": lat_list,
        "longitude": lon_list,
        "hourly": "sea_surface_temperature",
        "timezone": "auto",
        "forecast_days": 2,
        "cell_selection": "sea",
    }

    try:
        # The PFZ grid search is the slowest call in the pipeline (~10s
        # live). Cache it so a slow venue network serves the last good
        # grid instead of an empty fishing-zone panel.
        def _live():
            response = requests.get(MARINE_API_URL, params=params, timeout=8)
            response.raise_for_status()
            return response.json()

        api_data, _pfz_cached, _pfz_cached_at = fetch_with_fallback(
            "pfz_grid", latitude, longitude, _live
        )

    except (requests.RequestException, ValueError) as error:

        return {
            "success": False,
            "source": {"provider": "Open-Meteo Marine (batched grid)", "api": MARINE_API_URL},
            "search_center": {"latitude": latitude, "longitude": longitude},
            "requested_time": requested_time,
            "error": str(error),
            "nearest_zone": None,
            "data_notes": [
                "Marine grid data service could not be reached; "
                "PFZ estimate is unavailable for this request."
            ],
        }

    # Open-Meteo returns a list when multiple locations are requested,
    # or a single object for exactly one location.
    results = api_data if isinstance(api_data, list) else [api_data]

    chlorophyll_center = _fetch_chlorophyll(latitude, longitude)

    scored_candidates = []

    for point, result in zip(grid, results):

        hourly = result.get("hourly", {})
        times = hourly.get("time", [])
        index = _select_forecast_index(times, requested_time)

        sst = _get_value(hourly.get("sea_surface_temperature"), index)

        if sst is None:
            continue

        sst = round(float(sst), 2)

        score = 0.0

        if SST_FAVOURABLE_MIN <= sst <= SST_FAVOURABLE_MAX:
            score += 55.0
        else:
            # Distance outside the favourable band still contributes a
            # partial, decaying signal rather than a hard cutoff.
            deviation = min(
                abs(sst - SST_FAVOURABLE_MIN),
                abs(sst - SST_FAVOURABLE_MAX),
            )
            score += max(0.0, 30.0 - (deviation * 8))

        scored_candidates.append({
            **point,
            "sea_surface_temperature": sst,
            "score": score,
        })

    if not scored_candidates:

        return {
            "success": False,
            "source": {"provider": "Open-Meteo Marine (batched grid)", "api": MARINE_API_URL},
            "search_center": {"latitude": latitude, "longitude": longitude},
            "requested_time": requested_time,
            "nearest_zone": None,
            "data_notes": [
                "No usable sea surface temperature values were returned "
                "for the search grid; PFZ estimate is unavailable."
            ],
        }

    # -----------------------------------------------------
    # THERMAL FRONT SIGNAL
    #
    # A candidate sitting on a sharper local SST gradient (relative to
    # the grid average) is treated as a stronger frontal-aggregation
    # signal, per the thermal-front basis of the INCOIS PFZ method.
    # -----------------------------------------------------

    avg_sst = sum(c["sea_surface_temperature"] for c in scored_candidates) / len(scored_candidates)

    for candidate in scored_candidates:
        gradient = abs(candidate["sea_surface_temperature"] - avg_sst)
        candidate["score"] += min(25.0, gradient * 12)

    # Chlorophyll signal only applies to the search center (single
    # best-effort lookup); apply as a bonus for nearby candidates too,
    # since a single-point NOAA productivity reading is a coarse proxy
    # for the whole local sector at this grid spacing.
    chlorophyll_status = "unavailable"
    if chlorophyll_center is not None:
        chlorophyll_status = "available"
        chlorophyll_bonus = 20.0 if chlorophyll_center >= 0.2 else 5.0
        for candidate in scored_candidates:
            candidate["score"] += chlorophyll_bonus

    scored_candidates.sort(key=lambda c: c["score"], reverse=True)
    best = scored_candidates[0]

    bearing_deg = _bearing(latitude, longitude, best["latitude"], best["longitude"])
    bearing_compass = direction_name(bearing_deg)

    confidence = "MODERATE"
    if chlorophyll_status == "available" and len(scored_candidates) >= 10:
        confidence = "HIGH"
    elif len(scored_candidates) < 5:
        confidence = "LOW"

    return {
        "success": True,
        "source": {
            "provider": "Open-Meteo Marine (SST grid) + NOAA CoastWatch ERDDAP (chlorophyll, best-effort)",
            "method": "SST thermal-front + chlorophyll productivity heuristic, "
                       "modelled after the INCOIS PFZ advisory approach.",
            "api": MARINE_API_URL,
        },
        "search_center": {"latitude": latitude, "longitude": longitude},
        "requested_time": requested_time,
        "candidates_evaluated": len(scored_candidates),
        # Every grid point that was scored, not just the winner — lets the
        # map show the full favourability picture (e.g. as a heat layer)
        # instead of a single pin with no context for why it was picked.
        "candidates": [
            {
                "latitude": c["latitude"],
                "longitude": c["longitude"],
                "distance_km": c["distance_km"],
                "sea_surface_temperature": c["sea_surface_temperature"],
                "score": round(min(100.0, c["score"]), 1),
            }
            for c in scored_candidates
        ],
        "chlorophyll": {
            "value": chlorophyll_center,
            "unit": "mg/m³",
            "status": chlorophyll_status,
        },
        "nearest_zone": {
            "latitude": best["latitude"],
            "longitude": best["longitude"],
            "distance_km": best["distance_km"],
            "bearing_deg": round(bearing_deg, 1),
            "bearing_compass": bearing_compass,
            "sea_surface_temperature": best["sea_surface_temperature"],
            "score": round(best["score"], 1),
            "confidence": confidence,
        },
        "data_notes": [
            "PFZ estimate is derived from live SST thermal-front analysis "
            "over a local search grid, not the official INCOIS PFZ "
            "satellite advisory product.",
            "Chlorophyll, when available, is a single best-effort point "
            "reading from a public NOAA monthly composite (not a live "
            "measurement) and is skipped if it responds too slowly; "
            "treat as a supporting signal, not a precise measurement.",
            "Always cross-check with the official INCOIS PFZ advisory "
            "before planning a fishing trip.",
        ],
    }
