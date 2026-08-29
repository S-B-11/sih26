from typing import Dict, List, Any
import math


# =========================================================
# REAL INDIAN COASTAL GEOFENCES & MARINE PROTECTED AREAS
# =========================================================
INDIAN_MPA_ZONES = [
    {
        "name": "Gulf of Mannar Marine Biosphere",
        "state": "Tamil Nadu",
        "min_lat": 8.75,
        "max_lat": 9.35,
        "min_lon": 78.10,
        "max_lon": 79.30,
        "type": "Marine Biosphere Reserve",
        "restriction": "Commercial mechanized trawling prohibited. Artisanal line fishing allowed.",
    },
    {
        "name": "Malvan Marine Wildlife Sanctuary",
        "state": "Maharashtra",
        "min_lat": 15.95,
        "max_lat": 16.12,
        "min_lon": 73.40,
        "max_lon": 73.55,
        "type": "Marine Sanctuary (Coral Habitats)",
        "restriction": "Strictly protected coral ecosystem. Fishing vessels must maintain 2nm buffer.",
    },
    {
        "name": "Gahirmatha Marine Sanctuary",
        "state": "Odisha",
        "min_lat": 20.25,
        "max_lat": 20.80,
        "min_lon": 86.70,
        "max_lon": 87.25,
        "type": "Olive Ridley Sea Turtle Sanctuary",
        "restriction": "Seasonal fishing prohibition active November to May for turtle nesting.",
    },
    {
        "name": "Sundarbans National Park Coastal Buffer",
        "state": "West Bengal",
        "min_lat": 21.50,
        "max_lat": 22.00,
        "min_lon": 88.50,
        "max_lon": 89.20,
        "type": "Ecologically Sensitive Mangrove Estuary",
        "restriction": "Core tiger & estuarine crocodile zone. No unlicensed vessel entry.",
    },
    {
        "name": "Gulf of Kutch Marine National Park",
        "state": "Gujarat",
        "min_lat": 22.30,
        "max_lat": 22.75,
        "min_lon": 69.20,
        "max_lon": 70.30,
        "type": "Marine National Park",
        "restriction": "Mangrove and coral reef protected zone. Deep sea transit routes only.",
    },
]

INDIAN_RESTRICTED_ZONES = [
    {
        "name": "India-Sri Lanka IMBL Buffer Zone",
        "region": "Palk Strait / Gulf of Mannar",
        "min_lat": 9.00,
        "max_lat": 10.10,
        "min_lon": 79.40,
        "max_lon": 80.00,
        "type": "International Maritime Boundary Line (IMBL)",
        "restriction": "High Alert: Extreme risk of border crossing. Indian Coast Guard patrol active.",
    },
    {
        "name": "Sir Creek International Border Buffer",
        "region": "Gujarat Coast",
        "min_lat": 23.50,
        "max_lat": 24.10,
        "min_lon": 68.00,
        "max_lon": 68.60,
        "type": "International Boundary Buffer",
        "restriction": "Restricted border waters. BSF & Coast Guard monitoring active.",
    },
    {
        "name": "BARC / Mumbai Port Restricted Coastal Zone",
        "region": "Mumbai Coastal Waters",
        "min_lat": 18.90,
        "max_lat": 19.05,
        "min_lon": 72.85,
        "max_lon": 72.95,
        "type": "Naval & High Security Zone",
        "restriction": "Anchorage & fishing strictly prohibited by Mumbai Port Trust and Indian Navy.",
    },
]


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Haversine distance in kilometres.
    """
    earth_radius = 6371.0
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(earth_radius * c, 2)


def analyze_location(latitude: float = 19.076, longitude: float = 72.8777) -> Dict[str, Any]:
    """
    ORCA Geospatial Intelligence Agent (Layer 4)
    
    Checks:
    - Real Indian Marine Protected Areas (MPAs)
    - International Maritime Boundary Line (IMBL) proximity
    - Naval & Coastal Security Exclusion Zones
    """
    if not -90 <= latitude <= 90:
        raise ValueError("Latitude must be between -90 and 90.")
    if not -180 <= longitude <= 180:
        raise ValueError("Longitude must be between -180 and 180.")

    matched_mpa = None
    matched_restricted = None
    geofence_triggered = False
    zone_name = "Indian EEZ (Open Maritime Waters)"

    # Check MPAs
    for mpa in INDIAN_MPA_ZONES:
        if mpa["min_lat"] <= latitude <= mpa["max_lat"] and mpa["min_lon"] <= longitude <= mpa["max_lon"]:
            matched_mpa = mpa
            zone_name = mpa["name"]
            break

    # Check Restricted / IMBL Zones
    for rz in INDIAN_RESTRICTED_ZONES:
        if rz["min_lat"] <= latitude <= rz["max_lat"] and rz["min_lon"] <= longitude <= rz["max_lon"]:
            matched_restricted = rz
            zone_name = rz["name"]
            break

    # Proximity Check to nearest Coast Guard base (Demo: Mumbai High at 19.4°N, 71.3°E)
    ref_lat, ref_lon = 19.4, 71.3
    distance_to_ref = calculate_distance(latitude, longitude, ref_lat, ref_lon)
    if distance_to_ref <= 25.0:
        geofence_triggered = True

    # Determine Severity & Status
    if matched_restricted:
        status = "CRITICAL BOUNDARY ALERT"
        zone_type = matched_restricted["type"]
        severity = "HIGH"
        recommendation = f"ALERT: Vessel is operating within {matched_restricted['name']}. {matched_restricted['restriction']}"
    elif matched_mpa:
        status = "PROTECTED MARINE RESERVE"
        zone_type = matched_mpa["type"]
        severity = "MODERATE"
        recommendation = f"NOTICE: Operating inside {matched_mpa['name']} ({matched_mpa['state']}). {matched_mpa['restriction']}"
    elif geofence_triggered:
        status = "GEOFENCE PROXIMITY BUFFER"
        zone_type = "Operational Geofence"
        severity = "LOW"
        recommendation = "Approaching active offshore installation / security corridor. Maintain minimum 1 nautical mile separation."
    else:
        status = "CLEAR EEZ WATERWAY"
        zone_type = "Unrestricted Indian EEZ"
        severity = "NONE"
        recommendation = "Location is clear of restricted waters, IMBL buffer zones, and marine sanctuaries. Safe for navigation."

    return {
        "location": {"latitude": latitude, "longitude": longitude},
        "status": status,
        "zone": {
            "name": zone_name,
            "type": zone_type,
            "severity": severity,
        },
        "restricted_zone": {
            "detected": bool(matched_restricted),
            "details": matched_restricted,
        },
        "marine_protected_area": {
            "detected": bool(matched_mpa),
            "details": matched_mpa,
        },
        "geofence": {
            "triggered": geofence_triggered,
            "distance_to_reference_km": distance_to_ref,
        },
        "assessment": {"recommendation": recommendation},
    }