from typing import Dict


def calculate_risk(
    marine_data: Dict,
    weather_data: Dict,
    geo_data: Dict
) -> Dict:
    """
    ORCA Risk Assessment Agent

    Combines:
        1. Marine conditions
        2. Weather conditions
        3. Storm / cyclone / lightning
        4. Geospatial restrictions
        5. Protected marine areas

    Produces:
        - Safety score
        - Risk level
        - Risk reasons
        - Recommendation

    Current version:
        Rule-based risk assessment.
    """

    # =========================================================
    # INITIAL SCORE
    # =========================================================

    score = 100
    reasons = []

    # Flags used later for final recommendation
    geofence_triggered = False
    restricted_detected = False
    protected_detected = False

    # =========================================================
    # 1. MARINE CONDITIONS
    # =========================================================

    wave_height = marine_data.get(
        "wave_height", {}
    ).get("value", 0)

    try:
        wave_height = float(wave_height)
    except (TypeError, ValueError):
        wave_height = 0

    if wave_height >= 3.0:

        score -= 30

        reasons.append(
            "High wave height detected."
        )

    elif wave_height >= 2.0:

        score -= 15

        reasons.append(
            "Moderately high waves detected."
        )

    elif wave_height >= 1.5:

        score -= 5

        reasons.append(
            "Moderate wave conditions detected."
        )

    # =========================================================
    # 2. WIND CONDITIONS
    # =========================================================

    wind_speed = weather_data.get(
        "wind", {}
    ).get("speed_kmh", 0)

    try:
        wind_speed = float(wind_speed)
    except (TypeError, ValueError):
        wind_speed = 0

    if wind_speed >= 40:

        score -= 30

        reasons.append(
            "Very strong wind conditions detected."
        )

    elif wind_speed >= 25:

        score -= 15

        reasons.append(
            "Strong wind conditions detected."
        )

    elif wind_speed >= 15:

        score -= 5

        reasons.append(
            "Moderate wind conditions detected."
        )

    # =========================================================
    # 3. STORM
    # =========================================================

    storm_active = weather_data.get(
        "storm", {}
    ).get("active", False)

    if storm_active:

        score -= 30

        reasons.append(
            "Active storm detected."
        )

    # =========================================================
    # 4. CYCLONE
    # =========================================================

    cyclone_active = weather_data.get(
        "cyclone", {}
    ).get("active", False)

    if cyclone_active:

        score -= 50

        reasons.append(
            "Cyclone activity detected."
        )

    # =========================================================
    # 5. LIGHTNING
    # =========================================================

    lightning_active = weather_data.get(
        "lightning", {}
    ).get("active", False)

    if lightning_active:

        score -= 25

        reasons.append(
            "Lightning activity detected."
        )

    # =========================================================
    # 6. GEOFENCE
    # =========================================================

    geofence_triggered = geo_data.get(
        "geofence", {}
    ).get("triggered", False)

    if geofence_triggered:

        score -= 15

        reasons.append(
            "Geofence boundary warning."
        )

    # =========================================================
    # 7. RESTRICTED ZONE
    # =========================================================

    restricted_detected = geo_data.get(
        "restricted_zone", {}
    ).get("detected", False)

    if restricted_detected:

        # Restricted zones are more serious than
        # normal geofence warnings.

        score -= 40

        reasons.append(
            "Restricted marine zone detected."
        )

    # =========================================================
    # 8. MARINE PROTECTED AREA
    # =========================================================

    protected_detected = geo_data.get(
        "marine_protected_area", {}
    ).get("detected", False)

    if protected_detected:

        score -= 20

        reasons.append(
            "Marine protected area detected."
        )

    # =========================================================
    # 9. PROTECTED / RESTRICTED AREA SAFETY CAP
    # =========================================================
    #
    # Even if weather is good, entering a protected
    # or restricted area should not be classified as
    # completely safe for fishing activity.
    #
    # Therefore:
    #
    # Restricted area  -> maximum score 40
    # Protected area   -> maximum score 50
    #
    # =========================================================

    if restricted_detected:

        score = min(score, 40)

    elif protected_detected:

        score = min(score, 50)

    # =========================================================
    # 10. GEOFENCE WARNING
    # =========================================================

    if geofence_triggered:

        score = min(score, 70)

    # =========================================================
    # 11. KEEP SCORE BETWEEN 0 AND 100
    # =========================================================

    score = max(
        0,
        min(100, score)
    )

    # =========================================================
    # 12. RISK LEVEL
    # =========================================================

    if score >= 80:

        risk_level = "LOW"

    elif score >= 60:

        risk_level = "MODERATE"

    elif score >= 30:

        risk_level = "HIGH"

    else:

        risk_level = "VERY HIGH"

    # =========================================================
    # 13. FINAL RECOMMENDATION
    # =========================================================

    # ---------------------------------------------------------
    # RESTRICTED AREA HAS HIGHEST PRIORITY
    # ---------------------------------------------------------

    if restricted_detected:

        recommendation_key = "restricted"

        recommendation = (
            "A restricted marine zone has been detected. "
            "Fishing or vessel activity may be prohibited "
            "in this area. Avoid entering the zone and "
            "follow applicable maritime regulations and "
            "official advisories."
        )

    # ---------------------------------------------------------
    # PROTECTED AREA
    # ---------------------------------------------------------

    elif protected_detected:

        recommendation_key = "protected"

        recommendation = (
            "Marine conditions may be favourable, but "
            "the detected location is within a marine "
            "protected area. Fishing or other activities "
            "may be restricted. Verify applicable "
            "regulations before proceeding."
        )

    # ---------------------------------------------------------
    # CYCLONE
    # ---------------------------------------------------------

    elif cyclone_active:

        recommendation_key = "cyclone"

        recommendation = (
            "Cyclone activity has been detected. "
            "Marine operations should be avoided until "
            "official authorities declare conditions safe."
        )

    # ---------------------------------------------------------
    # LIGHTNING
    # ---------------------------------------------------------

    elif lightning_active:

        recommendation_key = "lightning"

        recommendation = (
            "Lightning activity has been detected. "
            "Avoid unnecessary marine activity and "
            "monitor official weather advisories."
        )

    # ---------------------------------------------------------
    # STORM
    # ---------------------------------------------------------

    elif storm_active:

        recommendation_key = "storm"

        recommendation = (
            "Active storm conditions are present. "
            "Exercise extreme caution and monitor "
            "official marine advisories."
        )

    # ---------------------------------------------------------
    # HIGH RISK
    # ---------------------------------------------------------

    elif risk_level == "HIGH":

        recommendation_key = "high_risk"

        recommendation = (
            "High marine risk detected. Avoid unnecessary "
            "marine activity until conditions improve and "
            "official advisories confirm safe conditions."
        )

    # ---------------------------------------------------------
    # MODERATE RISK
    # ---------------------------------------------------------

    elif risk_level == "MODERATE":

        recommendation_key = "moderate_risk"

        recommendation = (
            "Caution is advised. Review current weather, "
            "wave and marine conditions before operating."
        )

    # ---------------------------------------------------------
    # LOW RISK
    # ---------------------------------------------------------

    else:

        recommendation_key = "low_risk"

        recommendation = (
            "Conditions appear relatively favourable. "
            "Continue monitoring official marine and "
            "weather advisories."
        )

    # =========================================================
    # 14. DEFAULT REASON
    # =========================================================

    if not reasons:

        reasons.append(
            "No major hazards detected in the available data."
        )

    # =========================================================
    # 15. FINAL RESULT
    # =========================================================

    return {
        "safety_score": score,
        "risk_level": risk_level,
        "reasons": reasons,
        "recommendation": recommendation,
        "recommendation_key": recommendation_key
    }