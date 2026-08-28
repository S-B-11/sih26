from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.marine_agent import analyze_marine_conditions
from agents.weather_agent import weather_agent
from agents.planner import plan_query
from agents.geo_agent import analyze_location
from agents.risk_agent import calculate_risk
from agents.synthesis_agent import synthesize_response
from agents.location_agent import resolve_location


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
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
    latitude: float = 21.0,
    longitude: float = 82.0
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
    latitude: float = 21.0,
    longitude: float = 82.0
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
# GEOSPATIAL AGENT ENDPOINT
# =========================================================

@app.get("/api/geo")
def geo_data(
    latitude: float = 21.0,
    longitude: float = 82.0
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
# RISK ASSESSMENT ENDPOINT
# =========================================================

@app.get("/api/risk")
def risk_data(
    latitude: float = 21.0,
    longitude: float = 82.0
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
        # STEP 10 - SYNTHESIS AGENT
        # =================================================

        final_response = synthesize_response(

            user_query,

            marine,

            weather,

            geo,

            risk,
            request.language
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

                "risk": risk
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