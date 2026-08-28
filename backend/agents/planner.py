from typing import Dict, List, Optional
import re


# =========================================================
# ORCA PLANNER / ORCHESTRATOR AGENT
# =========================================================

def plan_query(user_query: str) -> Dict:
    """
    ORCA Planner / Orchestrator Agent.

    Detects:
    - Required agents
    - Tasks
    - Location
    - Coordinates
    - Relative day
    - Time period
    """

    query = user_query.lower().strip()

    tasks: List[str] = []
    agents: List[str] = []

    location: Optional[str] = None
    coordinates = None

    # =====================================================
    # TIME DETECTION
    # =====================================================

    relative_day = None
    period = None

    # -----------------------------------------------------
    # Relative day
    # -----------------------------------------------------

    if "tomorrow" in query:
        relative_day = "tomorrow"

    elif "today" in query:
        relative_day = "today"

    # -----------------------------------------------------
    # Time period
    # -----------------------------------------------------

    if "morning" in query:
        period = "morning"

    elif "afternoon" in query:
        period = "afternoon"

    elif "evening" in query:
        period = "evening"

    elif "night" in query:
        period = "night"

    # -----------------------------------------------------
    # Requested time object
    # -----------------------------------------------------

    if relative_day or period:

        requested_time = {
            "relative_day": relative_day,
            "period": period
        }

    else:

        requested_time = None

    # =====================================================
    # WEATHER KEYWORDS
    # =====================================================

    weather_keywords = [
        "weather",
        "rain",
        "rainfall",
        "wind",
        "temperature",
        "storm",
        "cyclone",
        "lightning",
        "forecast",

        # Hindi
        "मौसम",
        "बारिश",
        "हवा",
        "तापमान",
        "तूफान",
        "चक्रवात",

        # Tamil
        "வானிலை",
        "மழை",
        "காற்று",
        "வெப்பநிலை",
        "புயல்",
        "சூறாவளி",

        # Telugu
        "వాతావరణం",
        "వర్షం",
        "గాలి",
        "ఉష్ణోగ్రత",
        "తుఫాను",

        # Malayalam
        "കാലാവസ്ഥ",
        "മഴ",
        "കാറ്റ്",
        "താപനില",
        "ചുഴലിക്കാറ്റ്",

        # Bengali
        "আবহাওয়া",
        "বৃষ্টি",
        "বাতাস",
        "তাপমাত্রা",
        "ঝড়",
        "ঘূর্ণিঝড়",

        # Gujarati
        "હવામાન",
        "વરસાદ",
        "પવન",
        "તાપમાન",
        "વાવાઝોડું",

        # Marathi
        "हवामान",
        "पाऊस",
        "वारा",
        "वादळ",
        "चक्रीवादळ",
    ]

    # =====================================================
    # MARINE KEYWORDS
    # =====================================================

    marine_keywords = [
        "sst",
        "sea surface temperature",
        "chlorophyll",
        "wave",
        "waves",
        "wave height",
        "tide",
        "ocean",
        "sea",
        "sea condition",
        "marine",
        "sea state",

        # Hindi
        "समुद्र",
        "लहर",
        "ज्वार",
        "समुद्री",

        # Tamil
        "கடல்",
        "அலை",
        "ஓதம்",

        # Telugu
        "సముద్రం",
        "అల",
        "ఆటుపోట్లు",

        # Malayalam
        "കടൽ",
        "തിരമാല",
        "വേലിയേറ്റം",

        # Bengali
        "সমুদ্র",
        "ঢেউ",
        "জোয়ার",

        # Gujarati
        "સમુદ્ર",
        "મોજું",
        "ભરતી",

        # Marathi
        "समुद्र",
        "लाट",
        "भरती",
        "सागरी",
    ]

    # =====================================================
    # FISHING KEYWORDS
    # =====================================================

    fishing_keywords = [
        "fishing",
        "fish",
        "fisherman",
        "fishermen",
        "pfz",
        "potential fishing zone",
        "fishing zone",
        "fishing area",
        "catch fish",

        # Hindi
        "मछली",
        "मछली पकड़",
        "मछली पकड़ना",
        "मछली पकड़ने",
        "मछुआरा",

        # Tamil
        "மீன்",
        "மீன்பிடி",
        "மீனவர்",

        # Telugu
        "చేప",
        "చేపలు",
        "మత్స్యకారుడు",

        # Malayalam
        "മീൻ",
        "മത്സ്യബന്ധനം",
        "മത്സ്യത്തൊഴിലാളി",

        # Bengali
        "মাছ",
        "মৎস্য",
        "জেলে",

        # Gujarati
        "માછલી",
        "માછીમારી",
        "માછીમાર",

        # Marathi
        "मासा",
        "मासेमारी",
        "मच्छीमार",
    ]

    # =====================================================
    # GEO KEYWORDS
    # =====================================================

    geo_keywords = [
        "location",
        "nearest",
        "near me",
        "nearby",
        "route",
        "boundary",
        "geofence",
        "protected area",
        "marine protected area",
        "restricted",
        "restricted zone",
        "map",
        "coordinates",
        "latitude",
        "longitude",

        # Hindi
        "स्थान",
        "नजदीक",
        "पास",
        "सीमा",
        "मानचित्र",

        # Tamil
        "இடம்",
        "அருகில்",
        "எல்லை",
        "வரைபடம்",

        # Telugu
        "స్థానం",
        "సమీపంలో",
        "సరిహద్దు",
        "పటం",

        # Malayalam
        "സ്ഥലം",
        "സമീപം",
        "അതിർത്തി",
        "ഭൂപടം",

        # Bengali
        "অবস্থান",
        "কাছাকাছি",
        "সীমানা",
        "মানচিত্র",

        # Gujarati
        "સ્થાન",
        "નજીક",
        "સીમા",
        "નકશો",

        # Marathi
        "स्थान",
        "जवळ",
        "सीमा",
        "नकाशा",
    ]

    # =====================================================
    # RISK / SAFETY KEYWORDS
    # =====================================================

    risk_keywords = [
        "safe",
        "safety",
        "danger",
        "dangerous",
        "hazard",
        "risk",
        "avoid",
        "unsafe",
        "secure",
        "should i go",
        "can i go",
        "is it safe",

        # Fishing safety questions
        "go fishing",
        "safe to go fishing",
        "fishing tomorrow",
        "fishing today",

        # Hindi
        "सुरक्षित",
        "खतरा",
        "जोखिम",
        "बचें",
        "खतरनाक",

        # Tamil
        "பாதுகாப்பான",
        "ஆபத்து",
        "பாதுகாப்பு",
        "தவிர்",

        # Telugu
        "సురక్షిత",
        "ప్రమాద",
        "భద్రత",
        "నివారించు",

        # Malayalam
        "സുരക്ഷിത",
        "അപകടം",
        "സുരക്ഷ",
        "ഒഴിവാക്കുക",

        # Bengali
        "নিরাপদ",
        "বিপদ",
        "নিরাপত্তা",
        "এড়িয়ে",

        # Gujarati
        "સલામત",
        "ભય",
        "સલામતી",
        "ટાળો",

        # Marathi
        "सुरक्षित",
        "धोका",
        "सुरक्षा",
        "टाळा",
    ]

    # =====================================================
    # KNOWN LOCATIONS
    # =====================================================

    known_locations = [
        "mumbai",
        "goa",
        "chennai",
        "visakhapatnam",
        "vizag",
        "kochi",
        "puri",
        "kolkata",
        "jagdalpur",
    ]

    # -----------------------------------------------------
    # Detect location
    # -----------------------------------------------------

    for place in known_locations:

        if place in query:

            location = place
            break

    # =====================================================
    # COORDINATE DETECTION
    # =====================================================

    coordinate_pattern = (
        r"(-?\d+(?:\.\d+)?)"
        r"\s*[, ]\s*"
        r"(-?\d+(?:\.\d+)?)"
    )

    coordinate_match = re.search(
        coordinate_pattern,
        query
    )

    if coordinate_match:

        try:

            latitude = float(
                coordinate_match.group(1)
            )

            longitude = float(
                coordinate_match.group(2)
            )

            # -------------------------------------------------
            # Basic coordinate validation
            # -------------------------------------------------

            if (
                -90 <= latitude <= 90
                and -180 <= longitude <= 180
            ):

                coordinates = {
                    "latitude": latitude,
                    "longitude": longitude
                }

        except ValueError:

            coordinates = None

    # =====================================================
    # WEATHER AGENT
    # =====================================================

    if any(
        word in query
        for word in weather_keywords
    ):

        if "weather_agent" not in agents:

            agents.append(
                "weather_agent"
            )

        tasks.append(
            "Retrieve current and forecast weather conditions."
        )

    # =====================================================
    # MARINE AGENT
    # =====================================================

    if any(
        word in query
        for word in marine_keywords
    ):

        if "marine_agent" not in agents:

            agents.append(
                "marine_agent"
            )

        tasks.append(
            "Retrieve relevant oceanographic and marine conditions."
        )

    # =====================================================
    # FISHING / PFZ
    # =====================================================

    if any(
        word in query
        for word in fishing_keywords
    ):

        if "marine_agent" not in agents:

            agents.append(
                "marine_agent"
            )

        tasks.append(
            "Find relevant fishing zones and marine productivity indicators."
        )

    # =====================================================
    # GEOSPATIAL AGENT
    # =====================================================

    if any(
        word in query
        for word in geo_keywords
    ):

        if "geo_agent" not in agents:

            agents.append(
                "geo_agent"
            )

        tasks.append(
            "Perform location, distance, boundary and geospatial analysis."
        )

    # =====================================================
    # RISK / SAFETY AGENT
    # =====================================================

    if any(
        word in query
        for word in risk_keywords
    ):

        # -------------------------------------------------
        # Risk agent
        # -------------------------------------------------

        if "risk_agent" not in agents:

            agents.append(
                "risk_agent"
            )

        tasks.append(
            "Evaluate marine hazards and calculate a safety assessment."
        )

        # -------------------------------------------------
        # Weather required for safety
        # -------------------------------------------------

        if "weather_agent" not in agents:

            agents.append(
                "weather_agent"
            )

        tasks.append(
            "Check weather, wind, storm and forecast conditions."
        )

        # -------------------------------------------------
        # Marine required for safety
        # -------------------------------------------------

        if "marine_agent" not in agents:

            agents.append(
                "marine_agent"
            )

        tasks.append(
            "Check waves, sea state, tides and ocean conditions."
        )

        # -------------------------------------------------
        # Geospatial required for safety
        # -------------------------------------------------

        if "geo_agent" not in agents:

            agents.append(
                "geo_agent"
            )

        tasks.append(
            "Check location-specific marine boundaries and hazards."
        )

    # =====================================================
    # TIME CONTEXT
    # =====================================================

    if requested_time:

        tasks.append(
            "Evaluate conditions for the requested time period."
        )

    # =====================================================
    # LOCATION CONTEXT
    # =====================================================

    if location:

        tasks.append(
            f"Analyze marine conditions for {location.title()}."
        )

    elif coordinates:

        tasks.append(
            "Analyze marine conditions for the provided coordinates."
        )

    # =====================================================
    # DEFAULT AGENT
    # =====================================================

    if not agents:

        agents.append(
            "marine_agent"
        )

        tasks.append(
            "Analyze the query using general marine intelligence."
        )

    # =====================================================
    # REMOVE DUPLICATES
    # =====================================================

    agents = list(
        dict.fromkeys(agents)
    )

    tasks = list(
        dict.fromkeys(tasks)
    )

    # =====================================================
    # FINAL PLAN
    # =====================================================

    return {

        "original_query": user_query,

        "agents_required": agents,

        "tasks": tasks,

        "location": location,

        "coordinates": coordinates,

        "time": requested_time,

        "status": "planned",
    }