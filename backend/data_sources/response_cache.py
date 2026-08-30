"""
Last-known-good cache for the live upstream calls.

The weather agent reads a cached NetCDF and only falls back to the network;
the marine, PFZ and wind-grid agents had no such safety net, so a slow or
unreachable Open-Meteo meant blank sea-surface temperature, wave height and
PFZ readings — the whole dashboard — with no way to tell a network failure
from a genuinely non-marine position.

This stores each successful upstream payload on disk, keyed by the call and
a rounded position, and hands the stored copy back when the network fails.
A demo on bad venue wifi then shows the last good reading (labelled as
cached) instead of nothing.

Deliberately plain JSON files, no dependency, no server: the point is that
it cannot itself become a thing that breaks during a demo.
"""

from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Callable, Dict, Optional


CACHE_DIR = Path(__file__).resolve().parent / "cache"


def _key_path(name: str, latitude: float, longitude: float, extra: str = "") -> Path:
    # ~11 km resolution. Finer than this and a demo that pans the map
    # slightly would miss every cached entry it just populated.
    lat = round(float(latitude), 1)
    lon = round(float(longitude), 1)
    suffix = f"_{extra}" if extra else ""
    return CACHE_DIR / f"{name}_{lat}_{lon}{suffix}.json"


def store(name: str, latitude: float, longitude: float, payload: Any, extra: str = "") -> None:
    """Record a successful upstream response."""

    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        path = _key_path(name, latitude, longitude, extra)
        path.write_text(
            json.dumps({"cached_at": time.time(), "payload": payload}),
            encoding="utf-8",
        )
    except Exception:
        # Caching is a convenience; never let it break the live path.
        pass


def load(
    name: str,
    latitude: float,
    longitude: float,
    extra: str = "",
    max_age_s: Optional[float] = None,
) -> Optional[Dict]:
    """
    Return {'cached_at', 'payload'} for a previous call, or None.

    `max_age_s` treats an older entry as absent. Used for negative caching,
    where remembering a failure forever would mean never noticing that the
    upstream recovered.
    """

    try:
        path = _key_path(name, latitude, longitude, extra)
        if not path.exists():
            return None

        entry = json.loads(path.read_text(encoding="utf-8"))

        if max_age_s is not None:
            age = time.time() - float(entry.get("cached_at", 0))
            if age > max_age_s:
                return None

        return entry
    except Exception:
        return None


def fetch_with_fallback(
    name: str,
    latitude: float,
    longitude: float,
    fetch: Callable[[], Any],
    extra: str = "",
) -> tuple[Any, bool, Optional[float]]:
    """
    Run `fetch`; on success cache and return its result. On any failure fall
    back to the stored copy.

    Returns (payload, from_cache, cached_at). Callers should surface
    `from_cache` so a stale reading is never presented as live.
    """

    try:
        payload = fetch()
        store(name, latitude, longitude, payload, extra)
        return payload, False, None

    except Exception:
        cached = load(name, latitude, longitude, extra)
        if cached is None:
            raise
        return cached["payload"], True, cached.get("cached_at")
