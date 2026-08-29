from typing import Dict, Optional, Union
from datetime import datetime
import requests


# =========================================================
# ORCA MARINE INTELLIGENCE AGENT
# REAL DATA VERSION
# =========================================================

MARINE_API_URL = "https://marine-api.open-meteo.com/v1/marine"


# =========================================================
# TIME CONTEXT
# =========================================================

def _normalize_time(
    time: Optional[Union[str, Dict]]
) -> Dict:

    if not time:
        return {
            "relative_day": "today",
            "period": "current"
        }

    if isinstance(time, dict):
        return {
            "relative_day": time.get(
                "relative_day",
                "today"
            ),
            "period": time.get(
                "period",
                "current"
            )
        }

    return {
        "relative_day": None,
        "period": str(time)
    }


# =========================================================
# SELECT FORECAST INDEX
# =========================================================

def _select_forecast_index(
    times,
    requested_time: Dict
) -> int:

    if not times:
        return 0

    relative_day = (
        requested_time.get("relative_day")
        or "today"
    ).lower()

    period = (
        requested_time.get("period")
        or "current"
    ).lower()

    # -----------------------------------------------------
    # Current
    # -----------------------------------------------------

    if relative_day in ["today", "current"]:

        target_date = datetime.now().date()

    # -----------------------------------------------------
    # Tomorrow
    # -----------------------------------------------------

    elif relative_day == "tomorrow":

        from datetime import timedelta

        target_date = (
            datetime.now().date()
            + timedelta(days=1)
        )

    else:

        target_date = datetime.now().date()

    # -----------------------------------------------------
    # Desired hour
    # -----------------------------------------------------

    period_hours = {

        "morning": 8,

        "afternoon": 14,

        "evening": 18,

        "night": 21,

        "current": datetime.now().hour,

        "today": datetime.now().hour,
    }

    target_hour = period_hours.get(
        period,
        datetime.now().hour
    )

    target_string = (
        f"{target_date.isoformat()}T"
        f"{target_hour:02d}:00"
    )

    # -----------------------------------------------------
    # Find closest available forecast
    # -----------------------------------------------------

    best_index = 0
    best_difference = float("inf")

    for index, value in enumerate(times):

        try:

            forecast_time = datetime.fromisoformat(
                value
            )

            requested_datetime = datetime.fromisoformat(
                target_string
            )

            difference = abs(
                (
                    forecast_time
                    - requested_datetime
                ).total_seconds()
            )

            if difference < best_difference:

                best_difference = difference
                best_index = index

        except Exception:

            continue

    return best_index


# =========================================================
# SAFE VALUE HELPER
# =========================================================

def _get_value(
    values,
    index,
    default=None
):

    if not values:
        return default

    if index >= len(values):
        return default

    return values[index]


# =========================================================
# MARINE STATUS
# =========================================================

def _wave_status(
    wave_height: Optional[float]
) -> str:

    if wave_height is None:
        return "UNKNOWN"

    if wave_height >= 3.0:
        return "HIGH"

    if wave_height >= 2.0:
        return "MODERATE-HIGH"

    if wave_height >= 1.0:
        return "MODERATE"

    return "LOW"


# =========================================================
# MARINE RISK
# =========================================================

def _calculate_marine_risk(
    wave_height: Optional[float],
    sea_level: Optional[float]
):

    score = 100
    reasons = []

    # -----------------------------------------------------
    # WAVE RISK
    # -----------------------------------------------------

    if wave_height is not None:

        if wave_height >= 3.0:

            score -= 40

            reasons.append(
                "High wave conditions detected."
            )

        elif wave_height >= 2.0:

            score -= 20

            reasons.append(
                "Moderately high wave conditions detected."
            )

        elif wave_height >= 1.0:

            score -= 5

            reasons.append(
                "Moderate wave conditions detected."
            )

    # -----------------------------------------------------
    # SEA LEVEL
    #
    # Sea level alone should NOT be treated as a
    # navigation hazard because it depends on the
    # reference datum and local coastal conditions.
    # -----------------------------------------------------

    if sea_level is not None:

        if abs(sea_level) >= 1.5:

            reasons.append(
                "Significant modeled sea-level variation detected."
            )

    # -----------------------------------------------------
    # LIMIT SCORE
    # -----------------------------------------------------

    score = max(
        0,
        min(100, score)
    )

    # -----------------------------------------------------
    # RISK LEVEL
    # -----------------------------------------------------

    if score >= 80:

        risk_level = "LOW"

    elif score >= 60:

        risk_level = "MODERATE"

    else:

        risk_level = "HIGH"

    # -----------------------------------------------------
    # DEFAULT REASON
    # -----------------------------------------------------

    if not reasons:

        reasons.append(
            "No major marine hazard detected "
            "in the available marine forecast."
        )

    return score, risk_level, reasons


# =========================================================
# MAIN MARINE AGENT
# =========================================================

def analyze_marine_conditions(
    latitude: float = 19.05,
    longitude: float = 72.80,
    time: Optional[Union[str, Dict]] = None
) -> Dict:
    """
    ORCA Marine Intelligence Agent.

    Uses real Open-Meteo Marine forecast data.

    Provides:
        - Sea Surface Temperature
        - Wave Height
        - Wave Direction
        - Wave Period
        - Sea Level / Tide-related model value
        - Ocean Current
        - Marine Risk
        - Safety Score

    Chlorophyll and PFZ are intentionally marked
    unavailable until a satellite/oceanographic
    source such as Copernicus Marine is connected.
    """

    # =====================================================
    # NORMALIZE LOCATION
    # =====================================================

    latitude = float(latitude)
    longitude = float(longitude)

    requested_time = _normalize_time(time)

    # =====================================================
    # API PARAMETERS
    # =====================================================

    params = {

        "latitude": latitude,

        "longitude": longitude,

        "hourly": ",".join([
            "wave_height",
            "wave_direction",
            "wave_period",
            "sea_surface_temperature",
            "sea_level_height_msl",
            "ocean_current_velocity",
            "ocean_current_direction"
        ]),

        "timezone": "auto",

        "forecast_days": 7,

        "cell_selection": "sea"
    }

    # =====================================================
    # API REQUEST
    # =====================================================

    try:

        response = requests.get(
            MARINE_API_URL,
            params=params,
            timeout=15
        )

        response.raise_for_status()

        api_data = response.json()

    except requests.RequestException as error:

        return {

            "success": False,

            "source": "open_meteo_marine",

            "error": str(error),

            "location": {
                "latitude": latitude,
                "longitude": longitude
            },

            "requested_time": requested_time,

            "assessment": {

                "risk_level": "UNKNOWN",

                "safety_score": None,

                "marine_condition": "DATA_UNAVAILABLE",

                "reasons": [
                    "Marine data service could not be reached."
                ],

                "recommendation": (
                    "Unable to retrieve live marine conditions. "
                    "Do not make a safety decision using stale data. "
                    "Check official marine advisories."
                )
            }
        }

    except ValueError as error:

        return {

            "success": False,

            "source": "open_meteo_marine",

            "error": f"Invalid API response: {error}",

            "location": {
                "latitude": latitude,
                "longitude": longitude
            },

            "requested_time": requested_time
        }

    # =====================================================
    # EXTRACT HOURLY DATA
    # =====================================================

    hourly = api_data.get(
        "hourly",
        {}
    )

    times = hourly.get(
        "time",
        []
    )

    # =====================================================
    # SELECT REQUESTED TIME
    # =====================================================

    index = _select_forecast_index(
        times,
        requested_time
    )

    selected_time = _get_value(
        times,
        index
    )

    # =====================================================
    # MARINE VALUES
    # =====================================================

    wave_height = _get_value(
        hourly.get("wave_height"),
        index
    )

    wave_direction = _get_value(
        hourly.get("wave_direction"),
        index
    )

    wave_period = _get_value(
        hourly.get("wave_period"),
        index
    )

    sea_surface_temperature = _get_value(
        hourly.get("sea_surface_temperature"),
        index
    )

    sea_level_height = _get_value(
        hourly.get("sea_level_height_msl"),
        index
    )

    current_velocity = _get_value(
        hourly.get("ocean_current_velocity"),
        index
    )

    current_direction = _get_value(
        hourly.get("ocean_current_direction"),
        index
    )

    # =====================================================
    # ROUND VALUES
    # =====================================================

    def rounded(value, digits=2):

        if value is None:
            return None

        try:
            return round(
                float(value),
                digits
            )
        except (TypeError, ValueError):
            return None

    wave_height = rounded(
        wave_height,
        2
    )

    wave_direction = rounded(
        wave_direction,
        1
    )

    wave_period = rounded(
        wave_period,
        1
    )

    sea_surface_temperature = rounded(
        sea_surface_temperature,
        2
    )

    sea_level_height = rounded(
        sea_level_height,
        2
    )

    current_velocity = rounded(
        current_velocity,
        2
    )

    current_direction = rounded(
        current_direction,
        1
    )

    # =====================================================
    # WAVE STATUS
    # =====================================================

    wave_status = _wave_status(
        wave_height
    )

    # =====================================================
    # RISK CALCULATION
    # =====================================================

    safety_score, risk_level, reasons = (
        _calculate_marine_risk(
            wave_height,
            sea_level_height
        )
    )

    # =====================================================
    # MARINE CONDITION
    # =====================================================

    if risk_level == "LOW":

        marine_condition = "FAVOURABLE"

    elif risk_level == "MODERATE":

        marine_condition = "MODERATE RISK"

    else:

        marine_condition = "HIGH RISK"

    # =====================================================
    # RECOMMENDATION
    # =====================================================

    if risk_level == "HIGH":

        recommendation = (
            "Marine conditions are currently "
            "unfavourable. Avoid unnecessary marine "
            "activity and follow official marine "
            "advisories."
        )

    elif risk_level == "MODERATE":

        recommendation = (
            "Marine conditions require caution. "
            "Review the latest weather, wave and "
            "official marine advisories before "
            "starting marine activity."
        )

    else:

        recommendation = (
            "Marine conditions appear relatively "
            "favourable according to the available "
            "live marine forecast. Continue monitoring "
            "official marine and weather advisories."
        )

    # =====================================================
    # FINAL DATA
    # =====================================================

    data = {

        "success": True,

        "source": {

            "provider": "Open-Meteo Marine",

            "type": "live_forecast",

            "api": MARINE_API_URL
        },

        "location": {

            "latitude": latitude,

            "longitude": longitude
        },

        "requested_time": requested_time,

        "forecast_time": selected_time,

        # -------------------------------------------------
        # SEA SURFACE TEMPERATURE
        # -------------------------------------------------

        "sea_surface_temperature": {

            "value": sea_surface_temperature,

            "unit": "°C",

            "status": "available"
        },

        # -------------------------------------------------
        # WAVE
        # -------------------------------------------------

        "wave_height": {

            "value": wave_height,

            "unit": "m",

            "status": wave_status
        },

        "wave": {

            "height": wave_height,

            "height_unit": "m",

            "direction": wave_direction,

            "direction_unit": "°",

            "period": wave_period,

            "period_unit": "s"
        },

        # -------------------------------------------------
        # SEA LEVEL
        # -------------------------------------------------

        "tide": {

            "sea_level_height": sea_level_height,

            "unit": "m",

            "status": "modeled"
        },

        # -------------------------------------------------
        # SEA STATE
        # -------------------------------------------------

        "sea_state": {

            "status": wave_status
        },

        # -------------------------------------------------
        # OCEAN CURRENT
        # -------------------------------------------------

        "ocean_current": {

            "velocity": current_velocity,

            "unit": "km/h",

            "direction": current_direction,

            "direction_unit": "°"
        },

        # -------------------------------------------------
        # CHLOROPHYLL
        # -------------------------------------------------

        "chlorophyll": {

            "value": None,

            "unit": "mg/m³",

            "status": "not_available",

            "source": None
        },

        # -------------------------------------------------
        # PFZ
        # -------------------------------------------------

        "potential_fishing_zone": {

            "available": None,

            "confidence": None,

            "status": "not_available",

            "source": None
        },

        # -------------------------------------------------
        # ASSESSMENT
        # -------------------------------------------------

        "assessment": {

            "marine_condition": marine_condition,

            "risk_level": risk_level,

            "safety_score": safety_score,

            "reasons": reasons,

            "recommendation": recommendation
        },

        # -------------------------------------------------
        # DATA LIMITATION
        # -------------------------------------------------

        "data_notes": [

            "Wave, sea surface temperature and ocean "
            "variables are obtained from the live "
            "marine forecast service.",

            "Chlorophyll is not supplied by this API.",

            "Potential Fishing Zone detection is not "
            "supplied by this API.",

            "Marine forecast data should not replace "
            "official navigation or safety advisories."
        ]
    }

    return data