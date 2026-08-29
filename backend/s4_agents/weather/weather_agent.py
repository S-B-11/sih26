"""
ORCA - Real Weather Agent
--------------------------------
Reads real hourly wind data from Copernicus Marine NetCDF.

Supports:

    weather_agent(latitude, longitude)

and:

    weather_agent(
        latitude,
        longitude,
        time_context
    )

Example time_context:

{
    "relative_day": "tomorrow",
    "period": "morning"
}

IMPORTANT:
This agent does NOT treat an old observation as a future forecast.

If the requested time is outside the NetCDF dataset range,
forecast_available will be False.
"""

from __future__ import annotations

import math
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np
import xarray as xr


# ============================================================
# CONFIGURATION
# ============================================================

# backend/ — three levels up from s4_agents/weather/weather_agent.py.
BASE_DIR = Path(__file__).resolve().parents[2]

MARINE_DATA_DIR = BASE_DIR / "data_sources" / "marine_data"

COPERNICUS_DATASET_PREFIX = (
    "cmems_obs-wind_glo_phy_nrt_l4_0.125deg_PT1H"
)


# ============================================================
# FIND WIND FILE
# ============================================================

def find_wind_file() -> Optional[Path]:
    """
    Find the latest Copernicus wind NetCDF file.
    """

    if not MARINE_DATA_DIR.exists():
        return None

    files = list(
        MARINE_DATA_DIR.glob("*.nc")
    )

    if not files:
        return None

    wind_files = [
        file
        for file in files
        if COPERNICUS_DATASET_PREFIX in file.name
    ]

    if wind_files:
        return max(
            wind_files,
            key=lambda file: file.stat().st_mtime
        )

    return max(
        files,
        key=lambda file: file.stat().st_mtime
    )


# ============================================================
# SAFE SCALAR
# ============================================================

def safe_scalar(value: Any) -> float:
    """
    Safely convert xarray / NumPy value into float.

    Prevents:

    The truth value of an array with more than one
    element is ambiguous.
    """

    array = np.asarray(value)

    if array.size != 1:
        raise ValueError(
            "Expected a single numeric value, "
            f"but received array with shape {array.shape}"
        )

    result = float(
        array.reshape(-1)[0]
    )

    if not math.isfinite(result):
        raise ValueError(
            "Invalid or missing numeric value."
        )

    return result


# ============================================================
# SAFE TIMESTAMP
# ============================================================

def safe_timestamp(value: Any) -> str:
    """
    Convert NumPy/xarray datetime value into string.
    """

    array = np.asarray(value)

    if array.size != 1:
        raise ValueError(
            "Unable to resolve a single timestamp."
        )

    return str(
        array.reshape(-1)[0]
    )


# ============================================================
# WIND DIRECTION
# ============================================================

def calculate_wind_direction(
    eastward: float,
    northward: float
) -> float:
    """
    Calculate meteorological wind direction.

    0   = North
    90  = East
    180 = South
    270 = West
    """

    direction = (
        180.0
        + math.degrees(
            math.atan2(
                eastward,
                northward
            )
        )
    ) % 360.0

    return direction


# ============================================================
# COMPASS DIRECTION
# ============================================================

def direction_name(
    degrees: float
) -> str:

    directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW",
    ]

    index = int(
        (degrees + 22.5) / 45
    ) % 8

    return directions[index]


# ============================================================
# WIND RISK
# ============================================================

def calculate_wind_risk(
    wind_speed_kmh: float
) -> str:
    """
    Basic wind risk classification.

    This is NOT an official marine warning.
    """

    if wind_speed_kmh < 20:
        return "LOW"

    if wind_speed_kmh < 35:
        return "MODERATE"

    if wind_speed_kmh < 50:
        return "HIGH"

    return "SEVERE"


# ============================================================
# TIME RESOLUTION
# ============================================================

def resolve_target_time(
    time_context: Optional[Dict[str, Any]]
) -> Optional[datetime]:
    """
    Convert ORCA time context into local target datetime.

    Examples:

        tomorrow + morning
        -> tomorrow 08:00

        today + afternoon
        -> today 14:00
    """

    if not time_context:
        return None

    relative_day = str(
        time_context.get(
            "relative_day",
            "today"
        )
    ).lower().strip()

    period = str(
        time_context.get(
            "period",
            "current"
        )
    ).lower().strip()

    now = datetime.now()

    # --------------------------------------------------------
    # Resolve date
    # --------------------------------------------------------

    if relative_day == "tomorrow":

        target_date = (
            now.date()
            + timedelta(days=1)
        )

    elif relative_day == "day_after_tomorrow":

        target_date = (
            now.date()
            + timedelta(days=2)
        )

    elif relative_day == "today":

        target_date = now.date()

    else:

        target_date = now.date()

    # --------------------------------------------------------
    # Resolve period
    # --------------------------------------------------------

    period_hours = {

        "morning": 8,

        "afternoon": 14,

        "evening": 18,

        "night": 21,

        "current": now.hour,
    }

    hour = period_hours.get(
        period,
        now.hour
    )

    return datetime(
        target_date.year,
        target_date.month,
        target_date.day,
        hour,
        0,
        0
    )


# ============================================================
# OPEN DATASET
# ============================================================

def open_wind_dataset() -> xr.Dataset:
    """
    Open Copernicus NetCDF dataset.
    """

    file_path = find_wind_file()

    if file_path is None:

        raise FileNotFoundError(
            "No Copernicus wind NetCDF file found in "
            f"{MARINE_DATA_DIR}"
        )

    return xr.open_dataset(
        file_path
    )


# ============================================================
# GET DATASET TIME RANGE
# ============================================================

def get_dataset_time_range(
    ds: xr.Dataset
):
    """
    Return first and last available timestamps.
    """

    if "time" not in ds.coords:

        raise ValueError(
            "Dataset does not contain a time coordinate."
        )

    time_values = np.asarray(
        ds["time"].values
    )

    if time_values.size == 0:

        raise ValueError(
            "Dataset contains no time values."
        )

    first_time = time_values[0]
    last_time = time_values[-1]

    return first_time, last_time


# ============================================================
# FIND NEAREST TIME
# ============================================================

def select_time(
    point: xr.Dataset,
    target_time: Optional[datetime]
):
    """
    Select requested time.

    Returns:

        selected point
        time metadata
    """

    dataset_start, dataset_end = (
        get_dataset_time_range(point)
    )

    dataset_start_np = np.datetime64(
        dataset_start
    )

    dataset_end_np = np.datetime64(
        dataset_end
    )

    # --------------------------------------------------------
    # No requested time
    # --------------------------------------------------------

    if target_time is None:

        selected = point.isel(
            time=-1
        )

        return selected, {
            "status": "latest_available",
            "forecast_available": True,
            "requested_time_available": True,
            "dataset_start": safe_timestamp(
                dataset_start
            ),
            "dataset_end": safe_timestamp(
                dataset_end
            ),
        }

    # --------------------------------------------------------
    # Requested target
    # --------------------------------------------------------

    target_np = np.datetime64(
        target_time
    )

    # --------------------------------------------------------
    # Target is outside dataset
    # --------------------------------------------------------

    if (
        target_np < dataset_start_np
        or target_np > dataset_end_np
    ):

        # Select nearest value only for informational use.
        # NEVER call it a forecast.

        selected = point.sel(
            time=target_np,
            method="nearest"
        )

        return selected, {
            "status": "nearest_available_but_outside_range",
            "forecast_available": False,
            "requested_time_available": False,
            "dataset_start": safe_timestamp(
                dataset_start
            ),
            "dataset_end": safe_timestamp(
                dataset_end
            ),
        }

    # --------------------------------------------------------
    # Target is inside dataset
    # --------------------------------------------------------

    selected = point.sel(
        time=target_np,
        method="nearest"
    )

    selected_time = np.asarray(
        selected["time"].values
    )

    # --------------------------------------------------------
    # Verify selected timestamp
    # --------------------------------------------------------

    if selected_time.size != 1:

        raise ValueError(
            "Unable to resolve selected timestamp."
        )

    selected_time_np = selected_time.reshape(-1)[0]

    return selected, {
        "status": "forecast_or_available_time",
        "forecast_available": True,
        "requested_time_available": True,
        "dataset_start": safe_timestamp(
            dataset_start
        ),
        "dataset_end": safe_timestamp(
            dataset_end
        ),
        "selected_time": safe_timestamp(
            selected_time_np
        ),
    }


# ============================================================
# GET REAL WIND
# ============================================================

def get_real_wind(
    latitude: float,
    longitude: float,
    time_context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:

    ds = open_wind_dataset()

    try:

        # ----------------------------------------------------
        # Coordinates
        # ----------------------------------------------------

        latitude = float(latitude)
        longitude = float(longitude)

        # ----------------------------------------------------
        # Required variables
        # ----------------------------------------------------

        required_variables = [
            "eastward_wind",
            "northward_wind",
        ]

        missing_variables = [
            variable
            for variable in required_variables
            if variable not in ds
        ]

        if missing_variables:

            raise ValueError(
                "Missing wind variables: "
                + ", ".join(
                    missing_variables
                )
            )

        # ----------------------------------------------------
        # Select nearest geographic location
        # ----------------------------------------------------

        point = ds[
            required_variables
        ].sel(
            latitude=latitude,
            longitude=longitude,
            method="nearest",
        )

        # ----------------------------------------------------
        # Resolve requested time
        # ----------------------------------------------------

        target_time = resolve_target_time(
            time_context
        )

        # ----------------------------------------------------
        # Select time
        # ----------------------------------------------------

        point, time_selection = select_time(
            point,
            target_time
        )

        # ----------------------------------------------------
        # Extract wind components
        # ----------------------------------------------------

        eastward = safe_scalar(
            point[
                "eastward_wind"
            ].values
        )

        northward = safe_scalar(
            point[
                "northward_wind"
            ].values
        )

        # ----------------------------------------------------
        # Timestamp
        # ----------------------------------------------------

        timestamp = safe_timestamp(
            point["time"].values
        )

        # ----------------------------------------------------
        # Wind speed
        # ----------------------------------------------------

        wind_speed_ms = math.sqrt(
            eastward ** 2
            + northward ** 2
        )

        wind_speed_kmh = (
            wind_speed_ms * 3.6
        )

        # ----------------------------------------------------
        # Wind direction
        # ----------------------------------------------------

        wind_direction = (
            calculate_wind_direction(
                eastward,
                northward
            )
        )

        compass = direction_name(
            wind_direction
        )

        # ----------------------------------------------------
        # Risk
        # ----------------------------------------------------

        risk = calculate_wind_risk(
            wind_speed_kmh
        )

        # ----------------------------------------------------
        # Selected coordinates
        # ----------------------------------------------------

        selected_latitude = safe_scalar(
            point["latitude"].values
        )

        selected_longitude = safe_scalar(
            point["longitude"].values
        )

        # ----------------------------------------------------
        # Return
        # ----------------------------------------------------

        return {

            "success": True,

            "source": "Copernicus Marine",

            "dataset": (
                "cmems_obs-wind_glo_phy_nrt_l4_"
                "0.125deg_PT1H"
            ),

            "requested_location": {

                "latitude": latitude,

                "longitude": longitude,
            },

            "data_location": {

                "latitude": selected_latitude,

                "longitude": selected_longitude,
            },

            "timestamp": timestamp,

            "time_selection": time_selection,

            "wind": {

                "eastward_wind_ms": round(
                    eastward,
                    3
                ),

                "northward_wind_ms": round(
                    northward,
                    3
                ),

                "speed_ms": round(
                    wind_speed_ms,
                    3
                ),

                "speed_kmh": round(
                    wind_speed_kmh,
                    2
                ),

                "direction_degrees": round(
                    wind_direction,
                    1
                ),

                "direction": compass,
            },

            "risk_level": risk,
        }

    finally:

        ds.close()


# ============================================================
# WEATHER AGENT
# ============================================================

def weather_agent(
    latitude: float,
    longitude: float,
    time_context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Main ORCA Weather Agent.

    Compatible with:

        weather_agent(lat, lon)

    and:

        weather_agent(
            lat,
            lon,
            time_context
        )
    """

    try:

        # ----------------------------------------------------
        # Get real wind data
        # ----------------------------------------------------

        wind_data = get_real_wind(
            latitude=latitude,
            longitude=longitude,
            time_context=time_context,
        )

        wind = wind_data[
            "wind"
        ]

        wind_speed = wind[
            "speed_kmh"
        ]

        risk = wind_data[
            "risk_level"
        ]

        time_selection = wind_data[
            "time_selection"
        ]

        forecast_available = bool(
            time_selection.get(
                "forecast_available",
                False
            )
        )

        # ----------------------------------------------------
        # Requested time
        # ----------------------------------------------------

        if time_context:

            requested_time = time_context

        else:

            requested_time = {
                "relative_day": "today",
                "period": "current"
            }

        # ====================================================
        # CASE 1
        # Requested time is NOT available
        # ====================================================

        if not forecast_available:

            condition = (
                "Data unavailable for requested time"
            )

            recommendation = (
                "The requested time is outside the "
                "available Copernicus wind dataset. "
                "The available wind observation must "
                "not be treated as a forecast. "
                "Check an official weather and marine "
                "forecast before operation."
            )

            reasons = [

                (
                    "Requested time is outside the "
                    "available Copernicus dataset range."
                ),

                (
                    f"Available observation wind speed: "
                    f"{wind_speed:.2f} km/h."
                ),

                (
                    f"Available observation wind direction: "
                    f"{wind['direction']} "
                    f"({wind['direction_degrees']:.1f}°)."
                ),

            ]

        # ====================================================
        # CASE 2
        # Requested time IS available
        # ====================================================

        else:

            if risk == "LOW":

                condition = "Favourable"

                recommendation = (
                    "Wind conditions appear favourable "
                    "for marine activity. Continue "
                    "monitoring official marine and "
                    "weather advisories."
                )

            elif risk == "MODERATE":

                condition = "Moderate"

                recommendation = (
                    "Moderate wind conditions detected. "
                    "Use caution and check official "
                    "marine weather advisories before "
                    "operation."
                )

            elif risk == "HIGH":

                condition = "Unfavourable"

                recommendation = (
                    "Strong winds detected. Marine "
                    "activity may be hazardous. "
                    "Check official warnings before "
                    "operation."
                )

            else:

                condition = "Dangerous"

                recommendation = (
                    "Very strong winds detected. "
                    "Avoid marine activity and follow "
                    "official safety warnings."
                )

            reasons = [

                (
                    "Real Copernicus hourly wind data "
                    "used for the requested time."
                ),

                (
                    f"Wind speed: "
                    f"{wind_speed:.2f} km/h."
                ),

                (
                    f"Wind direction: "
                    f"{wind['direction']} "
                    f"({wind['direction_degrees']:.1f}°)."
                ),

            ]

        # ====================================================
        # FINAL RESPONSE
        # ====================================================

        return {

            "success": True,

            "agent": "weather_agent",

            "source": "Copernicus Marine",

            "location": {

                "latitude": float(
                    latitude
                ),

                "longitude": float(
                    longitude
                ),
            },

            "requested_time": requested_time,

            "target_time": (
                resolve_target_time(
                    time_context
                ).isoformat()
                if resolve_target_time(
                    time_context
                )
                else None
            ),

            "timestamp": wind_data[
                "timestamp"
            ],

            "time_selection": time_selection,

            "wind": wind,

            "risk_level": risk,

            "condition": condition,

            "forecast_available": (
                forecast_available
            ),

            "storm": {

                "active": False,

                "source": (
                    "Not provided by wind dataset"
                ),
            },

            "cyclone": {

                "active": False,

                "source": (
                    "Not provided by wind dataset"
                ),
            },

            "lightning": {

                "active": False,

                "source": (
                    "Not provided by wind dataset"
                ),
            },

            "assessment": {

                "risk_level": risk,

                "condition": condition,

                "forecast_available": (
                    forecast_available
                ),

                "reasons": reasons,

                "recommendation": recommendation,
            },

        }

    except Exception as error:

        return {

            "success": False,

            "agent": "weather_agent",

            "source": "Copernicus Marine",

            "error": str(error),

            "requested_time": (
                time_context
                if time_context
                else {
                    "relative_day": "today",
                    "period": "current"
                }
            ),

            "risk_level": "UNKNOWN",

            "condition": "Data unavailable",

            "forecast_available": False,

            "assessment": {

                "risk_level": "UNKNOWN",

                "condition": "Data unavailable",

                "forecast_available": False,

                "recommendation": (
                    "Unable to retrieve real Copernicus "
                    "wind data. Do not rely on this result "
                    "for marine safety decisions."
                ),
            },

        }


# ============================================================
# ALIAS
# ============================================================

get_weather = weather_agent


# ============================================================
# LOCAL TEST
# ============================================================

if __name__ == "__main__":

    import json

    print("=" * 60)

    print(
        "ORCA REAL WEATHER AGENT"
    )

    print("=" * 60)

    latitude = 19.0760

    longitude = 72.8777

    time_context = {

        "relative_day": "tomorrow",

        "period": "morning",
    }

    result = weather_agent(

        latitude=latitude,

        longitude=longitude,

        time_context=time_context,
    )

    print(
        json.dumps(
            result,
            indent=2,
            ensure_ascii=False,
            default=str
        )
    )

    print("=" * 60)