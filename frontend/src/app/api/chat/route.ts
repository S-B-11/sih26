import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Simple ORCA query understanding
    const query = message.toLowerCase();

    let response = "";

    if (
      query.includes("pfz") ||
      query.includes("fishing zone") ||
      query.includes("fishing")
    ) {
      response =
        "ORCA is analysing Potential Fishing Zones using marine conditions, sea surface temperature, chlorophyll concentration and available fishing advisories.";
    } else if (
      query.includes("weather") ||
      query.includes("weather condition")
    ) {
      response =
        "ORCA is analysing current and forecast marine weather conditions including wind, waves and weather hazards.";
    } else if (
      query.includes("safe") ||
      query.includes("danger") ||
      query.includes("risk")
    ) {
      response =
        "ORCA is assessing marine risk using weather, wind, wave conditions, cyclone activity and other available hazard information.";
    } else if (
      query.includes("chlorophyll") ||
      query.includes("sst") ||
      query.includes("sea surface")
    ) {
      response =
        "ORCA can analyse Sea Surface Temperature and chlorophyll concentration to identify potentially favourable marine regions.";
    } else {
      response =
        "I am ORCA, a Marine Intelligence Assistant. I can help with fishing zones, weather, marine risk, sea conditions, chlorophyll, SST and navigation-related queries.";
    }

    return NextResponse.json({
      success: true,
      response,
      source: "ORCA Marine Intelligence Engine",
    });
  } catch (error) {
    console.error("ORCA API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process the query",
      },
      { status: 500 }
    );
  }
}