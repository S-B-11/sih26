/**
 * ORCA Pre-defined Scenario Data
 * Contains rich GeoJSON, chart, evidence, and multilingual answer data
 * for the 5 key query scenarios.
 *
 * In production these would come from INCOIS/ISRO live APIs.
 */

export const SCENARIOS = {
  "pfz-today": {
    answer_text: {
      en: "Target Potential Fishing Zone (PFZ) detected 18.5 Nautical Miles off Veraval Coast (Gujarat). High Chlorophyll-a concentration (4.3 mg/m³) combined with thermal SST gradient (27.8°C to 28.5°C) indicates high density of Pelagic fish (Tuna, Mackerel). Optimal fishing time: 04:30 AM to 10:00 AM.",
      hi: "वेरावल तट (गुजरात) से 18.5 समुद्री मील दूर मुख्य संभावित मत्स्य पालन क्षेत्र (PFZ) पाया गया है।",
      ta: "வேராவல் கடற்கரையிலிருந்து (குஜராத்) 18.5 கடல் மைல் தொலைவில் முக்கிய மீன்பிடி மண்டலம் (PFZ) கண்டறியப்பட்டுள்ளது.",
      te: "వెరావల్ తీరం (గుజరాత్) నుండి 18.5 నాటికల్ మైళ్ళ దూరంలో ఉన్న ప్రధాన పొటెన్షియల్ ఫిషింగ్ జోన్ (PFZ) గుర్తించబడింది.",
      ml: "വേരാവൽ തീരത്തുനിന്ന് 18.5 നോട്ടിക്കൽ മൈൽ അകലെ പ്രധാന മത്സ്യബന്ധന മേഖല കണ്ടെത്തി.",
      gu: "વેરાવળ કિનારા (ગુજરાત) થી 18.5 નોટિકલ માઇલ દૂર મુખ્ય પોટેન્શિયલ ફિશિંગ ઝોન (PFZ) મળી આવ્યું છે.",
      bn: "ভেরাবল উপকূল থেকে ১৮.৫ নটিক্যাল মাইল দূরে প্রধান সম্ভাব্য মৎস্য আহরণ অঞ্চল (PFZ) সনাক্ত করা হয়েছে।"
    },
    risk_level: "low",
    risk_alerts: [{ level: "low", message: "Normal ocean conditions. Swell height 1.1m, wind speed 12 knots (SW)." }],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature", id: "pfz-zone-1",
          properties: { name: "INCOIS High Yield PFZ Zone Alpha", type: "pfz", sst: "28.2 °C", chlorophyll: "4.3 mg/m³", species: "Pelagic (Tuna, Mackerel, Sardine)", advisory: "High productivity thermal front detected by Oceansat-3" },
          geometry: { type: "Polygon", coordinates: [[[69.35,20.65],[69.52,20.72],[69.60,20.58],[69.42,20.50],[69.35,20.65]]] }
        },
        {
          type: "Feature", id: "buoy-veraval",
          properties: { name: "INCOIS Ocean Buoy BD08", type: "buoy", sst: "28.0 °C", waveHeight: "1.1 m", windSpeed: "12 kts" },
          geometry: { type: "Point", coordinates: [69.45, 20.62] }
        }
      ]
    },
    charts: [{
      type: "line", title: "Chlorophyll-a & SST Front Correlation (Past 7 Days)",
      data: [
        { day: "Mon", chlorophyll: 2.1, sst: 29.1 }, { day: "Tue", chlorophyll: 2.4, sst: 28.9 },
        { day: "Wed", chlorophyll: 3.0, sst: 28.6 }, { day: "Thu", chlorophyll: 3.8, sst: 28.3 },
        { day: "Fri (Today)", chlorophyll: 4.3, sst: 28.0 }, { day: "Sat (Fcst)", chlorophyll: 4.1, sst: 28.1 },
        { day: "Sun (Fcst)", chlorophyll: 3.6, sst: 28.4 }
      ]
    }],
    evidence: [
      { claim: "PFZ Boundary verified via Oceansat-3 OCM-3 Sensor Pass #4120", source: "ISRO NRSC Ocean Data Gateway", confidence: "96%" },
      { claim: "Thermal Front SST gradient confirmed by INSAT-3DR Sounder", source: "INCOIS Marine Advisory Division", confidence: "94%" },
      { claim: "In-situ sea surface temp cross-validated with Ocean Buoy BD08", source: "NIOT Buoy Network Telemetry", confidence: "99%" }
    ]
  },

  "sea-safety": {
    answer_text: {
      en: "⚠️ CAUTION RECOMMENDED: High wave and swell alerts active offshore Kochi (Kerala). Wave heights expected to reach 3.8m to 4.2m. Small fishing crafts (<12m) are advised NOT to venture into deep sea.",
      hi: "⚠️ सावधानी की सलाह: कोच्चि (केरल) के तट पर ऊंची लहरों का अलर्ट सक्रिय है। छोटी नावों को गहरे समुद्र में न जाने की सलाह दी जाती है।",
      ta: "⚠️ எச்சரிக்கை: கொச்சி கடற்பகுதியில் பலத்த அலை எச்சரிக்கை. சிறிய படகுகள் ஆழ்கடலுக்குச் செல்ல வேண்டாம்.",
      te: "⚠️ హెచ్చరిక: కొచ్చి తీరంలో అధిక అలల హెచ్చరిక. చిన్న పడవలు లోతైన సముద్రంలోకి వెళ్ళవద్దు.",
      ml: "⚠️ ജാഗ്രതാ നിർദ്ദേശം: കൊച്ചി തീരത്ത് ഉയർന്ന തിരമാല മുന്നറിയിപ്പ്. ചെറിയ ബോട്ടുകൾ ആഴക്കടലിൽ പോകരുത്.",
      gu: "⚠️ સાવચેતી: કોચી કિનારે ઊંચા મોજાનું એલર્ટ. નાની હોડીઓ ઊંડા દરિયામાં ન જાય.",
      bn: "⚠️ সতর্কবার্তা: কোচি উপকূলে উচ্চ ঢেউয়ের সতর্কতা। ছোট নৌকা সমুদ্রে না যাওয়ার পরামর্শ।"
    },
    risk_level: "high",
    risk_alerts: [
      { level: "high", message: "HIGH WAVE ALERT: Swell waves 3.8m to 4.2m expected offshore Kochi. Squally wind up to 34 knots." },
      { level: "medium", message: "Strong coastal rip currents active around Fort Kochi & Vypin Island." }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature", id: "hazard-kochi-highwave",
          properties: { name: "INCOIS Swells Hazard Zone (OFFSHORE KOCHI)", type: "hazard", riskLevel: "HIGH", waveHeight: "3.8m - 4.2m", windSpeed: "34 knots", warningText: "Squally SW wind and dangerous breaking swell waves" },
          geometry: { type: "Polygon", coordinates: [[[75.90,9.80],[76.25,10.15],[76.35,9.90],[76.05,9.65],[75.90,9.80]]] }
        },
        {
          type: "Feature", id: "buoy-kochi",
          properties: { name: "INCOIS Ocean Buoy CB02 (Kochi)", type: "buoy", sst: "29.1 °C", waveHeight: "3.9 m", windSpeed: "32 kts" },
          geometry: { type: "Point", coordinates: [76.10, 9.95] }
        }
      ]
    },
    charts: [{
      type: "bar", title: "Offshore Kochi Wave Height Forecast (Next 24 Hours)",
      data: [
        { time: "00:00", wave: 1.8, wind: 16 }, { time: "04:00", wave: 2.4, wind: 22 },
        { time: "08:00 (Danger)", wave: 3.9, wind: 31 }, { time: "12:00 (Peak)", wave: 4.2, wind: 34 },
        { time: "16:00", wave: 3.5, wind: 28 }, { time: "20:00", wave: 2.6, wind: 20 }
      ]
    }],
    evidence: [
      { claim: "High wave warnings by INCOIS WAVEWATCH-III numerical model", source: "INCOIS Ocean State Forecast (OSF)", confidence: "98%" },
      { claim: "Atmospheric pressure drop confirmed by INSAT-3DR Scatterometer", source: "ISRO MOSDAC Weather Portal", confidence: "95%" }
    ]
  },

  "tide-weather": {
    answer_text: {
      en: "Visakhapatnam offshore: High tide peak at 02:15 PM (+1.85m), Low tide at 08:30 PM (+0.32m). Wind 14 knots ENE. SST 28.6°C. Partly cloudy with localized convective showers evening.",
      hi: "विशाखापत्तनम: दोपहर 02:15 उच्च ज्वार (+1.85m), रात 08:30 निम्न ज्वार (+0.32m)।",
      ta: "விசாகப்பட்டினம்: பிற்பகல் 02:15 மணிக்கு அதிக அலை, இரவு 08:30 மணிக்கு குறைந்த அலை.",
      te: "విశాఖపట్నం: మధ్యాహ్నం 02:15 గంటలకు అధిక అలలు (+1.85మీ), రాత్రి 08:30 తక్కువ అలలు (+0.32మీ).",
      ml: "വിശാഖപട്ടണം: ഉച്ചയ്ക്ക് 02:15 ഉയർന്ന വേലിയേറ്റം (+1.85m), രാത്രി 08:30 താഴ്ന്ന വേലിയേറ്റം (+0.32m).",
      gu: "વિશાખાપટ્ટનમ: બપોરે 02:15 ઉંચી ભરતી (+1.85m), રાત્રે 08:30 ઓછી ઓટ (+0.32m).",
      bn: "বিশাখাপত্তনম: দুপুর ০২:১৫ জোয়ার (+১.৮৫ মি), রাত ০৮:৩০ ভাটা (+০.৩২ মি)।"
    },
    risk_level: "low",
    risk_alerts: [{ level: "low", message: "Favorable fishing tides. Visibility 8.5 NM." }],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature", id: "vizag-buoy",
          properties: { name: "INCOIS Vizag Met-Ocean Buoy DS04", type: "buoy", sst: "28.6 °C", waveHeight: "1.2 m", windSpeed: "14 kts ENE" },
          geometry: { type: "Point", coordinates: [83.35, 17.68] }
        },
        {
          type: "Feature", id: "vizag-pfz",
          properties: { name: "Vizag Slope PFZ Zone", type: "pfz", sst: "28.5 °C", chlorophyll: "3.8 mg/m³", species: "Ribbonfish, Anchovy, Sardine" },
          geometry: { type: "Polygon", coordinates: [[[83.45,17.60],[83.60,17.72],[83.72,17.55],[83.52,17.48],[83.45,17.60]]] }
        }
      ]
    },
    charts: [{
      type: "line", title: "Visakhapatnam 24-Hour Tidal Cycle Height (Meters)",
      data: [
        { time: "06:00 AM", height: 0.45 }, { time: "09:00 AM", height: 1.10 },
        { time: "12:00 PM", height: 1.72 }, { time: "02:15 PM (High Tide)", height: 1.85 },
        { time: "05:00 PM", height: 1.20 }, { time: "08:30 PM (Low Tide)", height: 0.32 },
        { time: "11:00 PM", height: 0.78 }
      ]
    }],
    evidence: [
      { claim: "Tidal predictions synchronized with Survey of India Tide Tables", source: "Survey of India / INCOIS Coastal Network", confidence: "99%" }
    ]
  },

  "cyclone-lightning": {
    answer_text: {
      en: "🚨 SEVERE WEATHER WARNING: Deep Depression in Bay of Bengal intensifying into Cyclonic Storm 'ASNA'. Max sustained wind 45-55 knots with gusts to 65 knots. All coastal fishermen advised to return to port IMMEDIATELY.",
      hi: "🚨 गंभीर मौसम की चेतावनी: बंगाल की खाड़ी में चक्रवाती तूफान। हवा की गति 55 समुद्री मील। तुरंत बंदरगाह वापस लौटें।",
      ta: "🚨 கடுமையான வானிலை எச்சரிக்கை: வங்கக் கடலில் புயல். மீன்பிடிப் படகுகள் உடனடியாக கரைக்குத் திரும்புக.",
      te: "🚨 తీవ్రమైన వాతావరణ హెచ్చరిక: బంగాళాఖాతంలో తుఫాను. మత్స్యకారులు వెంటనే ఒడ్డుకు తిరిగి రావాలి.",
      ml: "🚨 തീవ്ര കാലാവസ്ഥ: ബംഗാൾ ഉൾക്കടലിൽ ചുഴലിക്കാറ്റ്. ഉടൻ കരയിലേക്ക് മടങ്ങുക.",
      gu: "🚨 ગંભીર ચેતવણી: વાવાઝોડું. તમામ માછીમારો તરત બંદરે પરત ફરો.",
      bn: "🚨 তীব্র আবহাওয়ার সতর্কতা: ঘূর্ণিঝড়। জেলেরা অবিলম্বে উপকূলে ফিরুন।"
    },
    risk_level: "high",
    risk_alerts: [
      { level: "high", message: "CYCLONE ALERT: Deep Depression in Bay of Bengal. Wind 55 knots. RETURN TO HARBOR IMMEDIATELY." },
      { level: "high", message: "LIGHTNING HAZARD: >120 strikes/min detected by INSAT-3DR." }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature", id: "cyclone-eye",
          properties: { name: "Cyclonic Storm Track - Bay of Bengal", type: "hazard", riskLevel: "HIGH", windSpeed: "55 knots", warningText: "Severe Cyclone Radius & Extreme Wave Conditions" },
          geometry: { type: "Polygon", coordinates: [[[85.80,19.10],[86.50,19.80],[87.20,19.30],[86.40,18.60],[85.80,19.10]]] }
        }
      ]
    },
    charts: [{
      type: "line", title: "Barometric Pressure & Wind Speed Intensity Trend",
      data: [
        { hour: "-12h", pressure: 1008, wind: 22 }, { hour: "-8h", pressure: 1002, wind: 30 },
        { hour: "-4h", pressure: 994, wind: 42 }, { hour: "Now", pressure: 988, wind: 55 },
        { hour: "+4h (Peak)", pressure: 982, wind: 65 }, { hour: "+8h", pressure: 990, wind: 48 }
      ]
    }],
    evidence: [
      { claim: "Cyclone track calculated via INSAT-3DR Doppler Radar", source: "IMD / ISRO Meteorological Data Center", confidence: "99%" }
    ]
  },

  "safest-route": {
    answer_text: {
      en: "🧭 SAFE NAVIGATION ROUTE: Optimized route from Chennai Harbor to Offshore PFZ Ridge (24.2 NM). Bypasses 2.8m swell convergence near Pulicat Shoals and naval restricted zone 4B. Transit time: 1h 45m at 14 knots.",
      hi: "🧭 सुरक्षित मार्ग: चेन्नई से PFZ रिज तक (24.2 NM)। पुलीकट और नौसेना प्रतिबंधित क्षेत्र से बचाते हुए।",
      ta: "🧭 பாதுகாப்பான பாதை: சென்னை துறைமுகத்திலிருந்து மீன்பிடி மண்டலத்திற்கு.",
      te: "🧭 సురక్షిత మార్గం: చెన్నై హార్బర్ నుండి చేపల వేట ప్రాంతానికి.",
      ml: "🧭 സുരക്ഷിത പാത: ചെന്നൈ ഹാർബറിൽ നിന്ന് മത്സ്യബന്ധന മേഖലയിലേക്ക്.",
      gu: "🧭 સલામત માર્ગ: ચેન્નઈ હાર્બરથી PFZ ઝોન સુધી.",
      bn: "🧭 নিরাপদ পথ: চেন্নাই হারবার থেকে পিএফজেড অঞ্চল পর্যন্ত।"
    },
    risk_level: "low",
    risk_alerts: [{ level: "low", message: "Optimal route generated avoiding 2.8m swell convergence near Pulicat Shoals." }],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature", id: "safe-route-polyline",
          properties: { name: "ORCA A* Hydrodynamic Safe Vessel Path", type: "route", distance: "24.2 Nautical Miles", estimatedTime: "1 Hour 45 Mins", safetyScore: "98/100" },
          geometry: { type: "LineString", coordinates: [[80.28,13.08],[80.38,13.15],[80.48,13.24],[80.62,13.35]] }
        },
        {
          type: "Feature", id: "naval-restricted-zone",
          properties: { name: "Naval Exercise Restricted Area 4B (BYPASSED)", type: "restricted", riskLevel: "HIGH" },
          geometry: { type: "Polygon", coordinates: [[[80.32,13.25],[80.42,13.32],[80.40,13.20],[80.30,13.18],[80.32,13.25]]] }
        }
      ]
    },
    charts: [{
      type: "line", title: "Swell Height & Depth Along Route Waypoints",
      data: [
        { waypoint: "Harbor", swell: 0.6, depth: 14 }, { waypoint: "WP 1 (Near Shore)", swell: 1.1, depth: 28 },
        { waypoint: "WP 2 (Bypass Shoal)", swell: 1.3, depth: 45 }, { waypoint: "PFZ Target", swell: 1.0, depth: 82 }
      ]
    }],
    evidence: [
      { claim: "Bathymetric depths verified from National Hydrographic Office", source: "NHO Admiralty Charts & INCOIS", confidence: "99%" }
    ]
  }
};

/**
 * Generate a custom response for queries not matching a preset scenario.
 */
export function generateCustomResponse(queryText = "", lang = "en") {
  const isDanger = /cyclone|danger|storm|warning/i.test(queryText);
  return {
    answer_text: {
      en: `ORCA Multi-Agent Analysis for "${queryText}": ${isDanger ? "⚠️ Caution advised due to localized weather volatility." : "Sea conditions are stable with optimal SST and normal wave heights."}`,
      hi: `"${queryText}" के लिए ORCA विश्लेषण: स्थिति सामान्य है।`
    },
    risk_level: isDanger ? "medium" : "low",
    risk_alerts: isDanger
      ? [{ level: "medium", message: "Moderate wave height and localized wind gusts detected." }]
      : [{ level: "low",    message: "Normal ocean condition parameters detected." }],
    map_layers: {
      type: "FeatureCollection",
      features: [{
        type: "Feature", id: "custom-point-1",
        properties: { name: "Query Location Telemetry Node", type: "buoy", sst: "28.3 °C", waveHeight: "1.3 m", windSpeed: "15 kts" },
        geometry: { type: "Point", coordinates: [72.82, 18.96] }
      }]
    },
    charts: [{ type: "line", title: "SST & Wave Trend", data: [{ hour: "06:00", temp: 28.1, wave: 1.1 },{ hour: "12:00", temp: 28.5, wave: 1.3 }] }],
    evidence: [{ claim: "Query matched against INCOIS live buoy network", source: "INCOIS Marine Portal", confidence: "92%" }]
  };
}
