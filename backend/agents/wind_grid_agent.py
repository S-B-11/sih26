from typing import Dict, List, Tuple
import math
from datetime import datetime
import requests


# =========================================================
# ORCA WIND GRID AGENT
#
# Fetches live wind speed/direction on a regular grid around a point
# and converts it to the u/v-component "leaflet-velocity" format, so
# the frontend can render an animated wind flow field (like Windy.com)
# instead of a single arrow at one point.
#
# Uses Open-Meteo's standard (global, no-key) forecast API rather than
# the local Copernicus NetCDF file the main weather agent reads from,
# since that file only covers a small fixed box near Mumbai and a flow
# field needs live coverage of whatever area the map is currently
# centered on.
# =========================================================

WIND_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

GRID_STEP_DEG = 0.4


def _build_grid(
    center_lat: float,
    center_lon: float,
    span_deg: float
) -> Tuple[List[float], List[float]]:
    """
    Regular grid ordered north -> south, west -> east, matching the
    row-major scan order leaflet-velocity expects (grid origin at the
    north-west corner).
    """

    steps = max(2, int(span_deg / GRID_STEP_DEG))

    north = center_lat + span_deg / 2
    west = center_lon - span_deg / 2

    lats = [round(north - (i * GRID_STEP_DEG), 4) for i in range(steps + 1)]
    lons = [round(west + (j * GRID_STEP_DEG), 4) for j in range(steps + 1)]

    return lats, lons


def fetch_wind_grid(
    latitude: float = 19.05,
    longitude: float = 72.80,
    span_deg: float = 3.0
) -> Dict:
    """
    Returns a leaflet-velocity-ready payload:

    {
      "success": True,
      "grid": [ {header, data}, {header, data} ]  # u then v component
    }
    """

    lats, lons = _build_grid(latitude, longitude, span_deg)
    nx = len(lons)
    ny = len(lats)

    grid_lat: List[float] = []
    grid_lon: List[float] = []

    for lat in lats:
        for lon in lons:
            grid_lat.append(lat)
            grid_lon.append(lon)

    params = {
        "latitude": ",".join(str(v) for v in grid_lat),
        "longitude": ",".join(str(v) for v in grid_lon),
        "hourly": "wind_speed_10m,wind_direction_10m",
        "wind_speed_unit": "ms",
        "timezone": "auto",
        "forecast_days": 1,
    }

    try:
        response = requests.get(WIND_FORECAST_URL, params=params, timeout=12)
        response.raise_for_status()
        api_data = response.json()

    except (requests.RequestException, ValueError) as error:

        return {
            "success": False,
            "error": str(error),
        }

    results = api_data if isinstance(api_data, list) else [api_data]

    now_hour = datetime.now().hour

    u_values: List[float] = []
    v_values: List[float] = []

    for result in results:

        hourly = result.get("hourly", {})
        times = hourly.get("time", [])
        speeds = hourly.get("wind_speed_10m", [])
        directions = hourly.get("wind_direction_10m", [])

        index = min(now_hour, len(times) - 1) if times else 0

        speed = speeds[index] if 0 <= index < len(speeds) else None
        direction = directions[index] if 0 <= index < len(directions) else None

        if speed is None or direction is None:
            u_values.append(0.0)
            v_values.append(0.0)
            continue

        # Meteorological convention: direction is where the wind blows
        # FROM. u is the eastward component, v the northward component
        # of where it blows TO.
        theta = math.radians(direction)
        u_values.append(round(-speed * math.sin(theta), 2))
        v_values.append(round(-speed * math.cos(theta), 2))

    # Pad in case fewer results came back than grid points requested
    # (a partial API failure shouldn't crash the whole grid).
    while len(u_values) < nx * ny:
        u_values.append(0.0)
        v_values.append(0.0)

    header_common = {
        "parameterUnit": "m.s-1",
        "nx": nx,
        "ny": ny,
        "lo1": lons[0],
        "la1": lats[0],
        "lo2": lons[-1],
        "la2": lats[-1],
        "dx": GRID_STEP_DEG,
        "dy": GRID_STEP_DEG,
        "refTime": datetime.now().isoformat(),
        "forecastTime": 0,
    }

    return {
        "success": True,
        "grid": [
            {
                "header": {
                    **header_common,
                    "parameterCategory": 2,
                    "parameterNumber": 2,
                    "parameterNumberName": "eastward_wind",
                },
                "data": u_values,
            },
            {
                "header": {
                    **header_common,
                    "parameterCategory": 2,
                    "parameterNumber": 3,
                    "parameterNumberName": "northward_wind",
                },
                "data": v_values,
            },
        ],
    }
