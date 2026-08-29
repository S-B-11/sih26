from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from s4_agents.marine.marine_agent import analyze_marine_conditions
from s4_agents.weather.weather_agent import weather_agent
from s3_planner.planner import plan_query
from s4_agents.geospatial.geo_agent import analyze_location, INDIAN_MPA_ZONES, INDIAN_RESTRICTED_ZONES
from s4_agents.risk.risk_agent import calculate_risk
from s5_synthesis.synthesis_agent import synthesize_response
from s4_agents.geospatial.location_agent import resolve_location
from s4_agents.marine.pfz_agent import find_potential_fishing_zone
from s4_agents.geospatial.route_agent import plan_safe_route
from s4_agents.weather.wind_grid_agent import fetch_wind_grid


# =========================================================
# ORCA FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="ORCA Marine Intelligence API",
    description="Marine Ecosystem Reasoning with Collaborative Agents",
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

# Loopback covers the single-machine setup. The regex additionally
# allows private LAN addresses (10.x, 192.168.x, 172.16-31.x) on any
# port, so a teammate on the same network can open the frontend from
# their own laptop without the browser blocking its API calls.
# Deliberately scoped to private ranges — this is not a public origin
# allow-list.

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_origin_regex=(
        r"http://("
        r"localhost"
        r"|127\.0\.0\.1"
        r"|10\.\d{1,3}\.\d{1,3}\.\d{1,3}"
        r"|192\.168\.\d{1,3}\.\d{1,3}"
        r"|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}"
        r"):\d+"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class QueryRequest(BaseModel):
    query: str
    language: str = "en"

    # Optional carry-forward context from the conversation so far, so a
    # follow-up like "what about tomorrow morning?" can reuse the location
    # from the previous turn instead of falling back to the default
    # location whenever the new query doesn't name one itself.
    context: Optional[Dict] = None


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "system": "ORCA",
        "description": (
            "Marine Ecosystem Reasoning "
            "with Collaborative Agents"
        )
    }


# =========================================================
# SYSTEM STATUS
# =========================================================

@app.get("/api/status")
def status():

    return {
        "system": "ORCA",
        "status": "online",
        "agents": {
            "planner": "ready",
            "location": "ready",
            "marine": "ready",
            "weather": "ready",
            "geospatial": "ready",
            "risk": "ready",
            "pfz": "ready",
            "route": "ready",
            "synthesis": "ready"
        }
    }


# =========================================================
# PLANNER ENDPOINT
# =========================================================

@app.post("/api/query")
def query_orca(request: QueryRequest):

    user_query = request.query.strip()

    if not user_query:
        return {
            "success": False,
            "message": "Please enter a query."
        }

    try:

        plan = plan_query(user_query)

        return {
            "success": True,
            "query": user_query,
            "plan": plan
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Planner error: {str(e)}"
        )


# =========================================================
# MARINE AGENT ENDPOINT
# =========================================================

@app.get("/api/marine")
def marine_data(
    latitude: float = 19.05,
    longitude: float = 72.80
):

    try:

        data = analyze_marine_conditions(
            latitude,
            longitude
        )

        return {
            "success": True,
            "agent": "marine_agent",
            "data": data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Marine agent error: {str(e)}"
        )


# =========================================================
# WEATHER AGENT ENDPOINT
# =========================================================

@app.get("/api/weather")
def weather_data(
    latitude: float = 19.05,
    longitude: float = 72.80
):

    try:

        data = weather_agent(
            latitude,
            longitude
        )

        return {
            "success": True,
            "agent": "weather_agent",
            "data": data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Weather agent error: {str(e)}"
        )


# =========================================================
# STATIC ZONE LIST (for map rendering — every known MPA /
# restricted zone, not just whichever one a query happens to
# be inside)
# =========================================================

@app.get("/api/zones")
def zones_data():

    return {
        "success": True,
        "marine_protected_areas": INDIAN_MPA_ZONES,
        "restricted_zones": INDIAN_RESTRICTED_ZONES
    }


# =========================================================
# WIND GRID ENDPOINT (animated flow-field map layer)
# =========================================================

@app.get("/api/wind-grid")
def wind_grid_data(
    latitude: float = 19.05,
    longitude: float = 72.80,
    span_deg: float = 3.0
):

    try:

        data = fetch_wind_grid(
            latitude,
            longitude,
            span_deg
        )

        return data

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Wind grid agent error: {str(e)}"
        )


# =========================================================
# GEOSPATIAL AGENT ENDPOINT
# =========================================================

@app.get("/api/geo")
def geo_data(
    latitude: float = 19.05,
    longitude: float = 72.80
):

    try:

        data = analyze_location(
            latitude,
            longitude
        )

        return {
            "success": True,
            "agent": "geo_agent",
            "data": data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Geo agent error: {str(e)}"
        )


# =========================================================
# PFZ (POTENTIAL FISHING ZONE) AGENT ENDPOINT
# =========================================================

@app.get("/api/pfz")
def pfz_data(
    latitude: float = 19.05,
    longitude: float = 72.80
):

    try:

        data = find_potential_fishing_zone(
            latitude,
            longitude
        )

        return {
            "success": True,
            "agent": "pfz_agent",
            "data": data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"PFZ agent error: {str(e)}"
        )


# =========================================================
# ROUTE OPTIMIZATION AGENT ENDPOINT
# =========================================================

@app.get("/api/route")
def route_data(
    origin_latitude: float,
    origin_longitude: float,
    destination_latitude: float,
    destination_longitude: float,
    origin_name: str = "Origin",
    destination_name: str = "Destination"
):

    try:

        data = plan_safe_route(
            origin_latitude,
            origin_longitude,
            destination_latitude,
            destination_longitude,
            origin_name,
            destination_name
        )

        return {
            "success": True,
            "agent": "route_agent",
            "data": data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Route agent error: {str(e)}"
        )


# =========================================================
# RISK ASSESSMENT ENDPOINT
# =========================================================

@app.get("/api/risk")
def risk_data(
    latitude: float = 19.05,
    longitude: float = 72.80
):

    try:

        # -------------------------------------------------
        # MARINE
        # -------------------------------------------------

        marine = analyze_marine_conditions(
            latitude,
            longitude
        )

        # -------------------------------------------------
        # WEATHER
        # -------------------------------------------------

        weather = weather_agent(
            latitude,
            longitude
        )

        # -------------------------------------------------
        # GEO
        # -------------------------------------------------

        geo = analyze_location(
            latitude,
            longitude
        )

        # -------------------------------------------------
        # RISK
        # -------------------------------------------------

        risk = calculate_risk(
            marine,
            weather,
            geo
        )

        return {

            "success": True,

            "agent": "risk_agent",

            "location": {
                "latitude": latitude,
                "longitude": longitude
            },

            "inputs": {
                "marine": marine,
                "weather": weather,
                "geospatial": geo
            },

            "risk_assessment": risk
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Risk assessment error: {str(e)}"
        )


# =========================================================
# MAIN ORCA INTELLIGENCE ENDPOINT
# =========================================================

@app.post("/api/orca")
def orca_query(request: QueryRequest):

    # =====================================================
    # STEP 1 - USER QUERY
    # =====================================================

    user_query = request.query.strip()

    if not user_query:

        return {
            "success": False,
            "message": "Please enter a query."
        }

    try:

        # =================================================
        # STEP 2 - PLANNER
        # =================================================

        plan = plan_query(
            user_query
        )


        # =================================================
        # STEP 3 - LOCATION RESOLUTION
        # =================================================

        plan_location = plan.get(
            "location"
        )

        plan_coordinates = plan.get(
            "coordinates"
        )


        # -------------------------------------------------
        # SAFETY CHECK FOR COORDINATES
        # -------------------------------------------------

        if isinstance(
            plan_coordinates,
            list
        ):

            if len(plan_coordinates) >= 2:

                plan_coordinates = {
                    "latitude": plan_coordinates[0],
                    "longitude": plan_coordinates[1]
                }

            else:

                plan_coordinates = None


        # -------------------------------------------------
        # CONVERSATION MEMORY FALLBACK
        #
        # If this turn's query didn't name a location or give
        # coordinates (e.g. "what about tomorrow morning?"),
        # reuse the location the frontend carried forward from
        # the previous turn instead of silently falling back
        # to the default location.
        # -------------------------------------------------

        context_location = (
            (request.context or {}).get("previous_location")
            if request.context else None
        )

        if (
            not plan_location
            and not plan_coordinates
            and isinstance(context_location, dict)
            and context_location.get("latitude") is not None
            and context_location.get("longitude") is not None
        ):

            location_data = {
                "resolved": True,
                "source": "carried_forward_from_previous_turn",
                "name": context_location.get("name", "Previous Location"),
                "latitude": float(context_location["latitude"]),
                "longitude": float(context_location["longitude"]),
            }

        else:

            location_data = resolve_location(

                location=plan_location,

                coordinates=plan_coordinates
            )


        # =================================================
        # STEP 4 - EXTRACT COORDINATES
        # =================================================

        latitude = float(
            location_data["latitude"]
        )

        longitude = float(
            location_data["longitude"]
        )


        # =================================================
        # STEP 5 - TIME CONTEXT
        # =================================================

        time_context = plan.get(
            "time"
        )


        # =================================================
        # STEP 6 - MARINE AGENT
        # =================================================
        #
        # IMPORTANT:
        # Marine agent supports:
        #
        # analyze_marine_conditions(
        #     latitude,
        #     longitude,
        #     time
        # )
        #
        # Therefore pass planner's time context.
        #

        marine = analyze_marine_conditions(

            latitude,

            longitude,

            time_context
        )


        # =================================================
        # STEP 7 - WEATHER AGENT
        # =================================================
        #
        # weather_agent signature:
        #
        # weather_agent(
        #     latitude,
        #     longitude,
        #     time_context  (optional)
        # )
        #
        # Pass time_context so wind data is fetched
        # for the requested time period.
        #

        weather = weather_agent(

            latitude,

            longitude,

            time_context
        )


        # =================================================
        # STEP 8 - GEO AGENT
        # =================================================

        geo = analyze_location(

            latitude,

            longitude
        )


        # =================================================
        # STEP 9 - RISK AGENT
        # =================================================

        risk = calculate_risk(

            marine,

            weather,

            geo
        )


        # =================================================
        # STEP 9B - PFZ AGENT (only when the planner flagged
        # a fishing / PFZ intent, since the grid search issues
        # several extra live data calls)
        # =================================================

        pfz = None

        if "pfz_agent" in plan.get("agents_required", []):

            pfz = find_potential_fishing_zone(

                latitude,

                longitude,

                time_context
            )


        # =================================================
        # STEP 9C - ROUTE AGENT (only when the planner detected
        # two named locations plus route intent, e.g. "safest
        # route from Mumbai to Goa")
        # =================================================

        route = None

        if "route_agent" in plan.get("agents_required", []):

            origin_data = resolve_location(location=plan.get("origin"))
            destination_data = resolve_location(location=plan.get("destination"))

            route = plan_safe_route(

                origin_data["latitude"],

                origin_data["longitude"],

                destination_data["latitude"],

                destination_data["longitude"],

                origin_data.get("name", "Origin"),

                destination_data.get("name", "Destination"),

                time_context
            )


        # =================================================
        # STEP 10 - SYNTHESIS AGENT
        # =================================================

        final_response = synthesize_response(

            user_query,

            marine,

            weather,

            geo,

            risk,
            request.language,
            pfz,
            route
        )


        # =================================================
        # STEP 11 - FINAL ORCA RESPONSE
        # =================================================

        return {

            "success": True,

            "system": "ORCA",

            "query": user_query,

            # -------------------------------------------------
            # Planner
            # -------------------------------------------------

            "plan": plan,

            # -------------------------------------------------
            # Location
            # -------------------------------------------------

            "location": location_data,

            # -------------------------------------------------
            # Time Context
            # -------------------------------------------------

            "time_context": time_context,

            # -------------------------------------------------
            # Agent Outputs
            # -------------------------------------------------

            "agents": {

                "marine": marine,

                "weather": weather,

                "geospatial": geo,

                "risk": risk,

                "pfz": pfz,

                "route": route
            },

            # -------------------------------------------------
            # Final Response
            # -------------------------------------------------

            "response": final_response
        }


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except ValueError as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)
        )


    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=f"ORCA processing error: {str(e)}"
        )


# =========================================================
# APPLICATION ENTRY POINT
# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )