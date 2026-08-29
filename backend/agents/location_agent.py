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

    # -------------------------------------------------
    # Hindi (Devanagari) aliases for the same cities,
    # so a Hindi-script query can name a location too.
    # -------------------------------------------------

    "मुंबई": {
        "name": "Mumbai",
        "latitude": 19.0760,
        "longitude": 72.8777,
    },

    "गोवा": {
        "name": "Goa",
        "latitude": 15.2993,
        "longitude": 74.1240,
    },

    "चेन्नई": {
        "name": "Chennai",
        "latitude": 13.0827,
        "longitude": 80.2707,
    },

    "विशाखापत्तनम": {
        "name": "Visakhapatnam",
        "latitude": 17.6868,
        "longitude": 83.2185,
    },

    "कोच्चि": {
        "name": "Kochi",
        "latitude": 9.9312,
        "longitude": 76.2673,
    },

    "पुरी": {
        "name": "Puri",
        "latitude": 19.8135,
        "longitude": 85.8312,
    },

    "कोलकाता": {
        "name": "Kolkata",
        "latitude": 22.5726,
        "longitude": 88.3639,
    },

    "जगदलपुर": {
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

    # NOTE: this MUST be a real offshore point. (21.0, 82.0) used to sit
    # here and is inland India (near Jagdalpur) — the live marine API
    # snaps "cell_selection: sea" to the nearest sea grid cell regardless
    # of how far away that is and returns HTTP 200 with every value null
    # instead of erroring, which made every unresolved-location query
    # silently render as the hardcoded fallback numbers in the response
    # instead of a real reading. Mumbai's coastal waters are confirmed
    # to return live data.
    return {
        "resolved": False,
        "source": "default",
        "name": "Default Location (Mumbai Coastal Waters)",
        "latitude": 19.05,
        "longitude": 72.80,
    }