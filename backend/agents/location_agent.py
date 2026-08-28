from typing import Dict, Optional


# =========================================================
# DEMONSTRATION LOCATION DATABASE
# =========================================================

LOCATIONS = {
    "mumbai": {
        "name": "Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777,
    },

    "goa": {
        "name": "Goa",
        "latitude": 15.2993,
        "longitude": 74.1240,
    },

    "chennai": {
        "name": "Chennai",
        "latitude": 13.0827,
        "longitude": 80.2707,
    },

    "visakhapatnam": {
        "name": "Visakhapatnam",
        "latitude": 17.6868,
        "longitude": 83.2185,
    },

    "vizag": {
        "name": "Visakhapatnam",
        "latitude": 17.6868,
        "longitude": 83.2185,
    },

    "kochi": {
        "name": "Kochi",
        "latitude": 9.9312,
        "longitude": 76.2673,
    },

    "puri": {
        "name": "Puri",
        "latitude": 19.8135,
        "longitude": 85.8312,
    },

    "kolkata": {
        "name": "Kolkata",
        "latitude": 22.5726,
        "longitude": 88.3639,
    },

    "jagdalpur": {
        "name": "Jagdalpur",
        "latitude": 19.0748,
        "longitude": 82.0080,
    },
}


def resolve_location(
    location: Optional[str] = None,
    coordinates: Optional[Dict] = None
) -> Dict:
    """
    ORCA Location Resolver.

    Resolves:
        - Coordinates directly
        - Known location names

    Current version uses a demonstration
    location database.
    """

    # =====================================================
    # 1. DIRECT COORDINATES
    # =====================================================

    if coordinates:

        latitude = coordinates.get("latitude")
        longitude = coordinates.get("longitude")

        if latitude is not None and longitude is not None:

            return {
                "resolved": True,
                "source": "user_coordinates",
                "name": "Custom Location",
                "latitude": float(latitude),
                "longitude": float(longitude),
            }

    # =====================================================
    # 2. LOCATION NAME
    # =====================================================

    if location:

        key = location.lower().strip()

        if key in LOCATIONS:

            data = LOCATIONS[key]

            return {
                "resolved": True,
                "source": "demo_location_database",
                **data,
            }

    # =====================================================
    # 3. DEFAULT LOCATION
    # =====================================================

    return {
        "resolved": False,
        "source": "default",
        "name": "Default Location",
        "latitude": 21.0,
        "longitude": 82.0,
    }