from typing import Dict, List, Optional, Tuple, Union
import math
import requests

from agents.geo_agent import calculate_distance, analyze_location
from agents.marine_agent import (
    MARINE_API_URL,
    _normalize_time,
    _select_forecast_index,
    _get_value,
)


# =========================================================
# ORCA ROUTE OPTIMIZATION AGENT
#
# Plans a coastal-scale route between two points that:
#   - Detours around known Marine Protected Areas / restricted
#     (IMBL, naval) zones from geo_agent's real zone list, using a
#     single perpendicular bypass waypoint per zone hit.
#   - Samples live wave height along the final path (one batched
#     Open-Meteo call) to flag high sea-state legs.
#
# This is a heuristic, not a real path-planner: it does not search
# for the shortest safe path or verify the bypass point itself is
# clear of a *different* hazard. It is meant to catch the two most
# common coastal-route dangers (a straight line through a known
# protected/restricted zone, and a leg with rough sea state), not to
# replace an official navigation chart.
# =========================================================

STRAIGHT_LINE_SAMPLES = 10
BYPASS_BUFFER_DEG = 0.35
HIGH_WAVE_M = 3.0
MODERATE_WAVE_M = 2.0


def _interpolate(
    origin: Tuple[float, float],
    destination: Tuple[float, float],
    count: int,
) -> List[Tuple[float, float]]:

    points = []

    for step in range(count + 1):
        fraction = step / count
        lat = origin[0] + (destination[0] - origin[0]) * fraction
        lon = origin[1] + (destination[1] - origin[1]) * fraction
        points.append((round(lat, 4), round(lon, 4)))

    return points


def _bypass_point(
    zone: Dict,
    origin: Tuple[float, float],
    destination: Tuple[float, float],
) -> Tuple[float, float]:
    """
    Pushes the hazard zone's center outward, perpendicular to the
    origin->destination line, by a fixed safety buffer. Only tries one
    side of the line (not both), so it is a plausible detour rather
    than a guaranteed-shortest one.
    """

    center_lat = (zone["min_lat"] + zone["max_lat"]) / 2
    center_lon = (zone["min_lon"] + zone["max_lon"]) / 2

    delta_lat = destination[0] - origin[0]
    delta_lon = destination[1] - origin[1]
    length = math.hypot(delta_lat, delta_lon) or 1e-6

    perpendicular_lat = -delta_lon / length
    perpendicular_lon = delta_lat / length

    zone_span = max(
        zone["max_lat"] - zone["min_lat"],
        zone["max_lon"] - zone["min_lon"],
    )
    buffer = BYPASS_BUFFER_DEG + (zone_span / 2)

    return (
        round(center_lat + perpendicular_lat * buffer, 4),
        round(center_lon + perpendicular_lon * buffer, 4),
    )


def _detect_hazard_zones(
    waypoints: List[Tuple[float, float]],
) -> List[Dict]:
    """
    Checks each sampled point against geo_agent's real MPA / restricted
    zone list, returning each distinct hazard zone hit at most once, in
    the order first encountered along the path.
    """

    hazards = []
    seen_names = set()

    for lat, lon in waypoints:

        geo = analyze_location(lat, lon)

        restricted = geo.get("restricted_zone", {})
        mpa = geo.get("marine_protected_area", {})

        if restricted.get("detected") and restricted.get("details"):
            zone = restricted["details"]
            if zone["name"] not in seen_names:
                seen_names.add(zone["name"])
                hazards.append({**zone, "kind": "restricted"})

        elif mpa.get("detected") and mpa.get("details"):
            zone = mpa["details"]
            if zone["name"] not in seen_names:
                seen_names.add(zone["name"])
                hazards.append({**zone, "kind": "marine_protected_area"})

    return hazards


def _sample_wave_heights(
    waypoints: List[Tuple[float, float]],
    time: Optional[Union[str, Dict]],
) -> List[Optional[float]]:
    """
    Best-effort live wave-height sample at each final waypoint, via a
    single batched Open-Meteo call. Returns None per-point on failure
    so the caller can still report the route without sea-state data.
    """

    requested_time = _normalize_time(time)

    params = {
        "latitude": ",".join(str(p[0]) for p in waypoints),
        "longitude": ",".join(str(p[1]) for p in waypoints),
        "hourly": "wave_height",
        "timezone": "auto",
        "forecast_days": 2,
        "cell_selection": "sea",
    }

    try:
        response = requests.get(MARINE_API_URL, params=params, timeout=10)
        response.raise_for_status()
        api_data = response.json()

    except (requests.RequestException, ValueError):
        return [None] * len(waypoints)

    results = api_data if isinstance(api_data, list) else [api_data]
    heights: List[Optional[float]] = []

    for result in results:
        hourly = result.get("hourly", {})
        times = hourly.get("time", [])
        index = _select_forecast_index(times, requested_time)
        value = _get_value(hourly.get("wave_height"), index)
        heights.append(round(float(value), 2) if value is not None else None)

    while len(heights) < len(waypoints):
        heights.append(None)

    return heights


def plan_safe_route(
    origin_latitude: float,
    origin_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
    origin_name: str = "Origin",
    destination_name: str = "Destination",
    time: Optional[Union[str, Dict]] = None,
) -> Dict:
    """
    ORCA Route Optimization Agent.

    Builds a waypoint path from origin to destination, detouring
    around any known Marine Protected Area / restricted zone the
    straight line would otherwise cross, and flags legs with
    hazardous live wave height.
    """

    origin = (float(origin_latitude), float(origin_longitude))
    destination = (float(destination_latitude), float(destination_longitude))

    straight_line = _interpolate(origin, destination, STRAIGHT_LINE_SAMPLES)
    hazard_zones = _detect_hazard_zones(straight_line)

    if hazard_zones:

        # Order hazards by how far along the origin->destination line
        # their center sits, so bypass waypoints are inserted in the
        # right sequence rather than the order zones happen to be
        # defined in geo_agent's list.
        def _progress_along_route(zone: Dict) -> float:
            center_lat = (zone["min_lat"] + zone["max_lat"]) / 2
            center_lon = (zone["min_lon"] + zone["max_lon"]) / 2
            delta_lat = destination[0] - origin[0]
            delta_lon = destination[1] - origin[1]
            length_sq = delta_lat ** 2 + delta_lon ** 2 or 1e-6
            return (
                (center_lat - origin[0]) * delta_lat
                + (center_lon - origin[1]) * delta_lon
            ) / length_sq

        hazard_zones.sort(key=_progress_along_route)

        route_points = [origin]
        for zone in hazard_zones:
            route_points.append(_bypass_point(zone, origin, destination))
        route_points.append(destination)

    else:
        route_points = straight_line

    wave_heights = _sample_wave_heights(route_points, time)

    total_distance_km = 0.0
    waypoints = []

    for index, (lat, lon) in enumerate(route_points):

        if index > 0:
            prev_lat, prev_lon = route_points[index - 1]
            total_distance_km += calculate_distance(prev_lat, prev_lon, lat, lon)

        waypoints.append({
            "sequence": index,
            "latitude": lat,
            "longitude": lon,
            "wave_height_m": wave_heights[index],
            "role": (
                "origin" if index == 0
                else "destination" if index == len(route_points) - 1
                else "bypass" if hazard_zones else "waypoint"
            ),
        })

    known_wave_heights = [h for h in wave_heights if h is not None]
    max_wave = max(known_wave_heights) if known_wave_heights else None

    reasons = []

    if hazard_zones:
        reasons.append(
            "Route deviated around: "
            + ", ".join(f"{z['name']} ({z['kind'].replace('_', ' ')})" for z in hazard_zones)
            + "."
        )

    if max_wave is not None:
        if max_wave >= HIGH_WAVE_M:
            reasons.append(f"High wave height ({max_wave} m) detected along the route.")
        elif max_wave >= MODERATE_WAVE_M:
            reasons.append(f"Moderate wave height ({max_wave} m) detected along the route.")
    else:
        reasons.append("Live wave height could not be sampled for this route.")

    if max_wave is not None and max_wave >= HIGH_WAVE_M:
        risk_level = "HIGH"
    elif (max_wave is not None and max_wave >= MODERATE_WAVE_M) or hazard_zones:
        risk_level = "MODERATE"
    elif max_wave is None:
        risk_level = "UNKNOWN"
    else:
        risk_level = "LOW"

    if not reasons:
        reasons.append("No known protected/restricted zones or hazardous wave conditions detected along this route.")

    if risk_level == "HIGH":
        recommendation = (
            "This route currently carries elevated risk (hazardous wave "
            "conditions). Delay departure or select an alternative route "
            "until conditions improve, and confirm with official marine "
            "advisories before sailing."
        )
    elif risk_level == "MODERATE":
        recommendation = (
            "This route is passable with caution — it avoids known "
            "protected/restricted zones and/or crosses moderate sea "
            "conditions. Monitor conditions closely and confirm official "
            "navigation charts before departure."
        )
    elif risk_level == "UNKNOWN":
        recommendation = (
            "Route computed, but live wave data could not be confirmed. "
            "Verify sea-state with official marine advisories before "
            "departure."
        )
    else:
        recommendation = (
            "Route appears clear of known protected/restricted zones and "
            "hazardous wave conditions. Continue to monitor official "
            "marine and weather advisories."
        )

    return {
        "success": True,
        "origin": {"name": origin_name, "latitude": origin[0], "longitude": origin[1]},
        "destination": {"name": destination_name, "latitude": destination[0], "longitude": destination[1]},
        "distance_km": round(total_distance_km, 1),
        "waypoints": waypoints,
        "hazards_avoided": [
            {"name": z["name"], "type": z["type"], "kind": z["kind"]} for z in hazard_zones
        ],
        "max_wave_height_m": max_wave,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendation": recommendation,
        "data_notes": [
            "This is a heuristic coastal route planner: it inserts a single "
            "detour waypoint around each known protected/restricted zone "
            "and flags rough-sea legs — it does not compute a true "
            "shortest safe path, and a bypass waypoint is not itself "
            "re-checked for other hazards.",
            "Always cross-check the final route against official "
            "navigation charts and INCOIS/Coast Guard advisories before "
            "departure.",
        ],
    }
