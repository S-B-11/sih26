"""
Plain-language answers for questions that are not data lookups.

"What is a PFZ?" used to route to the marine and PFZ agents and come back
as a telemetry dump, because every query was assumed to be a request for
readings. Definitions, capability questions and greetings are answered
from here instead: no agents run, nothing is fetched, and the reply is
written for a fisherman rather than an oceanographer.

Curated rather than generated on purpose. These definitions are shown to
people deciding whether to put to sea, so they should be reviewed text,
not something invented per request.
"""

from __future__ import annotations

import re
from typing import Dict, List, Optional


# Each entry: the plain answer, then optional extra context. Keep the first
# sentence answerable-out-loud — it is what gets read aloud by voice.
GLOSSARY: Dict[str, Dict[str, str]] = {
    "pfz": {
        "term": "Potential Fishing Zone (PFZ)",
        "plain": (
            "A Potential Fishing Zone is a patch of sea where fish are likely "
            "to gather. It is worked out from satellite readings, not from "
            "catch reports, so it is a good place to try rather than a promise."
        ),
        "detail": (
            "Fish gather where cool and warm water meet, because that mixing "
            "brings up nutrients and the small plants fish feed on. ORCA looks "
            "for those temperature boundaries and for high chlorophyll, which "
            "shows where the feed is. INCOIS issues PFZ advisories for India "
            "using the same idea."
        ),
    },
    "sst": {
        "term": "Sea Surface Temperature (SST)",
        "plain": (
            "Sea surface temperature is how warm the top layer of the sea is."
        ),
        "detail": (
            "It matters because most food fish prefer roughly 27-30 degrees. "
            "A sharp change in temperature over a short distance is called a "
            "front, and fish often gather along it."
        ),
    },
    "chlorophyll": {
        "term": "Chlorophyll",
        "plain": (
            "Chlorophyll shows how much tiny plant life is floating in the "
            "water. More of it usually means more fish feed."
        ),
        "detail": (
            "Satellites measure it from the colour of the sea. Green-tinted "
            "water carries more; clear blue water usually carries less."
        ),
    },
    "eez": {
        "term": "Exclusive Economic Zone (EEZ)",
        "plain": (
            "The EEZ is the sea area that belongs to India for fishing and "
            "resources - up to 200 nautical miles from the coast."
        ),
        "detail": (
            "Inside it you are in Indian waters. Crossing out of it, or into "
            "another country's EEZ, can mean your boat is detained."
        ),
    },
    "imbl": {
        "term": "International Maritime Boundary Line (IMBL)",
        "plain": (
            "The IMBL is the sea border between India and a neighbouring "
            "country. Crossing it is dangerous - boats get seized."
        ),
        "detail": (
            "The India-Sri Lanka line in the Palk Strait is the one most "
            "fishermen meet. ORCA warns you when a position is inside the "
            "buffer near it."
        ),
    },
    "mpa": {
        "term": "Marine Protected Area (MPA)",
        "plain": (
            "A Marine Protected Area is a stretch of sea where fishing is "
            "restricted by law to protect coral, turtles or mangroves."
        ),
        "detail": (
            "Some allow line fishing but ban trawling; some close in certain "
            "months, like Gahirmatha during turtle nesting. ORCA tells you "
            "which rule applies where you are."
        ),
    },
    "swell": {
        "term": "Swell",
        "plain": (
            "Swell is the long, rolling waves that arrive from a storm far "
            "away, even when the wind where you are is calm."
        ),
        "detail": (
            "Swell period is the gap in seconds between waves. A long period "
            "with high waves makes for a heavy, rolling sea."
        ),
    },
    "wave height": {
        "term": "Significant wave height",
        "plain": (
            "Significant wave height is the average height of the bigger "
            "waves. Some individual waves will be higher than this figure."
        ),
        "detail": (
            "Under 1 metre is calm. Around 2 metres is uncomfortable for a "
            "small boat. Over 3 metres is dangerous for most fishing craft."
        ),
    },
    "geofence": {
        "term": "Geofence",
        "plain": (
            "A geofence is an invisible boundary drawn on the map. ORCA "
            "checks whether your position falls inside a restricted one."
        ),
        "detail": (
            "It covers protected areas, naval and port zones, and "
            "international boundaries."
        ),
    },
    "safety score": {
        "term": "Operational safety score",
        "plain": (
            "The safety score is ORCA's judgement of how risky it is to go "
            "out, from 0 to 100. Higher is safer."
        ),
        "detail": (
            "It starts at 100 and subtracts points for high waves, strong "
            "wind, storms, cyclones and lightning. Every deduction is listed, "
            "so you can see exactly why the number is what it is."
        ),
    },
}

# Words that point at a glossary entry without naming it exactly.
ALIASES: Dict[str, str] = {
    "potential fishing zone": "pfz",
    "fishing zone": "pfz",
    "sea surface temperature": "sst",
    "temperature": "sst",
    "exclusive economic zone": "eez",
    "maritime boundary": "imbl",
    "boundary line": "imbl",
    "protected area": "mpa",
    "marine protected area": "mpa",
    "sanctuary": "mpa",
    "waves": "wave height",
    "wave": "wave height",
    "significant wave height": "wave height",
    "safety": "safety score",
    "risk score": "safety score",
}

_DEFINITION_PATTERNS = [
    r"\bwhat\s+(is|are|does)\b",
    r"\bdefine\b",
    r"\bdefinition\b",
    r"\bexplain\b",
    r"\bmeaning\s+of\b",
    r"\bwhat\s+do(es)?\s+.*\bmean\b",
    r"\btell me about\b",
    r"\bkya\s+ha[iy]\b",          # Hindi: "kya hai"
    r"\bमतलब\b|\bक्या\s+है\b",     # Hindi: "matlab", "kya hai"
]

_GREETING_PATTERNS = [
    r"^\s*(hi|hello|hey|namaste|namaskar|vanakkam)\b",
    r"^\s*(good\s+(morning|evening|afternoon))\b",
]

_CAPABILITY_PATTERNS = [
    r"\bwhat can you do\b",
    r"\bwho are you\b",
    r"\bhow do you work\b",
    r"\bhelp\b\s*$",
    r"\bwhat do you do\b",
]


def _find_term(query: str) -> Optional[str]:
    text = query.lower()

    # Longest alias first, so "sea surface temperature" is not matched by
    # the shorter "temperature".
    for phrase in sorted(ALIASES, key=len, reverse=True):
        if phrase in text:
            return ALIASES[phrase]

    for key in sorted(GLOSSARY, key=len, reverse=True):
        if re.search(rf"\b{re.escape(key)}\b", text):
            return key

    return None


def classify(query: str) -> Optional[str]:
    """
    Return "definition", "greeting" or "capability" when the query is asking
    something other than for live readings, otherwise None so the normal
    data pipeline runs.
    """

    text = (query or "").strip().lower()
    if not text:
        return None

    for pattern in _GREETING_PATTERNS:
        if re.search(pattern, text):
            return "greeting"

    for pattern in _CAPABILITY_PATTERNS:
        if re.search(pattern, text):
            return "capability"

    for pattern in _DEFINITION_PATTERNS:
        if re.search(pattern, text):
            # Only a definition if it actually names something we know;
            # "what is the weather tomorrow" is a data question.
            if _find_term(text):
                return "definition"
            return None

    # A bare term on its own ("pfz", "imbl") is a definition request.
    if len(text.split()) <= 2 and _find_term(text):
        return "definition"

    return None


def answer(query: str, intent: str) -> Dict[str, object]:
    """Compose a plain-language reply for a non-data question."""

    if intent == "greeting":
        return {
            "response": (
                "Namaste. I can tell you about fishing zones, sea conditions "
                "and whether it is safe to go out today.\n\n"
                "Try asking: \"Is it safe to venture out tomorrow morning?\" "
                "or \"Where is the nearest fishing zone?\""
            ),
            "citations": [],
            "why_explanation": [],
        }

    if intent == "capability":
        return {
            "response": (
                "I am ORCA. I check the sea for you before you go out.\n\n"
                "I can tell you:\n"
                "- Whether it is safe to venture out, and why\n"
                "- Where the nearest likely fishing zone is\n"
                "- Wave height, wind and sea surface temperature\n"
                "- Whether a spot is inside a protected or restricted area\n"
                "- A safer route between two places\n\n"
                "Ask in plain words, in English or an Indian language. I will "
                "always show which checks the answer came from."
            ),
            "citations": [],
            "why_explanation": [],
        }

    key = _find_term(query)
    entry = GLOSSARY.get(key or "", None)

    if entry is None:
        return {
            "response": (
                "I do not have a definition for that yet. I can explain PFZ, "
                "sea surface temperature, chlorophyll, EEZ, IMBL, protected "
                "areas, swell, wave height, geofencing and the safety score."
            ),
            "citations": [],
            "why_explanation": [],
        }

    return {
        "response": f"{entry['term']}\n\n{entry['plain']}\n\n{entry['detail']}",
        "citations": [
            {
                "claim": entry["term"],
                "source": "ORCA marine glossary (reviewed text, not live data)",
            }
        ],
        "why_explanation": [
            "This is a definition, so no live readings were needed and no "
            "data agents were run."
        ],
    }


def known_terms() -> List[str]:
    return sorted(GLOSSARY)
