// ORCA Intelligent Simulated Multi-Agent Backend Engine
// Emulates Python FastAPI + LangGraph orchestration pipeline with step-by-step stream events
// Incorporates ISRO Oceansat-3, INSAT-3DR, and INCOIS Ocean State Forecast models.

import { checkGeofence, SCENARIO_COORDS, GEOFENCE_ZONES } from "./geofenceZones.js";

export const AGENT_PIPELINE_STEPS = [
  {
    id: "planner_agent",
    name: "🧠 Multi-Agent Planner & Router",
    role: "LangGraph Master Coordinator",
    details: "Decomposing query objectives, analyzing spatial-temporal intent, and routing to specialist agents...",
    contribution: "Decomposed query into telemetry extraction, atmospheric modeling, geofence compliance, and synthesis tasks.",
    duration: 500
  },
  {
    id: "marine_data_agent",
    name: "🌊 Marine Data Specialist",
    role: "Oceansat-3 & INCOIS PFZ Harvester",
    details: "Querying ISRO Oceansat-3 OCM-3 sensor data for Sea Surface Temperature (SST) & Chlorophyll-a fronts...",
    contribution: "Extracted OCM-3 Chlorophyll-a density gradients & INSAT-3DR thermal fronts.",
    duration: 750
  },
  {
    id: "weather_agent",
    name: "🌦️ Weather & Ocean State Agent",
    role: "INSAT-3DR & Atmospheric Forecaster",
    details: "Analyzing wind velocity vectors, wave heights, swell period, and doppler storm cell trajectory...",
    contribution: "Modeled 24h WAVEWATCH-III swell vectors, significant wave heights & squall velocities.",
    duration: 800
  },
  {
    id: "risk_agent",
    name: "🛡️ Risk Assessment & Geofencing Agent",
    role: "INCOIS Advisory & Maritime Boundary Checker",
    details: "Conducting point-in-polygon ray casting against EEZ limits, Marine Protected Areas (MPAs), and naval zones...",
    contribution: "Evaluated geospatial coordinates against India EEZ, Marine Protected Areas, and hazard corridors.",
    duration: 700
  },
  {
    id: "synthesis_agent",
    name: "📊 Multilingual Synthesis Agent",
    role: "Cross-Agent Evidence Synthesizer",
    details: "Combining geospatial features, generating evidence trace, and localizing advisory response...",
    contribution: "Synthesized multi-source evidence citations, generated GIS layers, and formatted localized advisory.",
    duration: 600
  }
];

// Rich GeoJSON and Data responses per scenario
export const SCENARIOS = {
  "pfz-today": {
    location: "Veraval, Gujarat Coast",
    coords: [69.45, 20.62],
    answer_text: {
      en: "Target Potential Fishing Zone (PFZ) detected 18.5 Nautical Miles off Veraval Coast (Gujarat). High Chlorophyll-a concentration (4.3 mg/m³) combined with thermal SST gradient (27.8°C to 28.5°C) indicates high density of Pelagic fish (Tuna, Mackerel). Optimal fishing time: 04:30 AM to 10:00 AM.",
      hi: "वेरावल तट (गुजरात) से 18.5 समुद्री मील दूर मुख्य संभावित मत्स्य पालन क्षेत्र (PFZ) पाया गया है। उच्च क्लोरोफिल-ए एकाग्रता (4.3 मिलीग्राम/मीटर³) और तापीय एसएसटी ढाल का संयोजन टूना और मैकेरल मछलियों की उच्च सघनता को दर्शाता है। अनुकूलतम समय: प्रातः 04:30 से 10:00 बजे तक।",
      ta: "வேராவல் கடற்கரையிலிருந்து (குஜராத்) 18.5 கடல் மைல் தொலைவில் முக்கிய மீன்பிடி மண்டலம் (PFZ) கண்டறியப்பட்டுள்ளது. அதிக குளோரோபில் செறிவு மற்றும் வெப்பநிலை சாய்வு சூரை மீன்களின் அதிக அடர்த்தியைக் குறிக்கிறது. உகந்த நேரம்: காலை 04:30 முதல் 10:00 வரை.",
      te: "వెరావల్ తీరం (గుజరాత్) నుండి 18.5 నాటికల్ మైళ్ళ దూరంలో ఉన్న ప్రధాన పొటెన్షియల్ ఫిషింగ్ జోన్ (PFZ) గుర్తించబడింది. క్లోరోఫిల్-ఎ సాంద్రత ట్యూనా మరియు మేకరెల్ చేపల సమృద్ధిని సూచిస్తుంది.",
      ml: "വേരാവൽ തീരത്തുനിന്ന് 18.5 നോട്ടിക്കൽ മൈൽ അകലെ പ്രധാന മത്സ്യബന്ധന മേഖല കണ്ടെത്തി. ക്ലോറോഫിൽ-എ സാന്ദ്രത ട്യൂണ, അയല മത്സ്യങ്ങളുടെ സമൃദ്ധിയെ സൂചിപ്പിക്കുന്നു.",
      gu: "વેરાવળ કિનારા (ગુજરાત) થી 18.5 નોટિકલ માઇલ દૂર મુખ્ય પોટેન્શિયલ ફિશિંગ ઝોન (PFZ) મળી આવ્યું છે. ઊંચું ક્લોરોફિલ પ્રમાણ ટ્યુના અને મેકરેલ માછલીઓની વિપુલતા દર્શાવે છે.",
      bn: "ভেরাবল উপকূল থেকে ১৮.৫ নটিক্যাল মাইল দূরে প্রধান সম্ভাব্য মৎস্য আহরণ অঞ্চল (PFZ) সনাক্ত করা হয়েছে।"
    },
    risk_level: "low",
    risk_alerts: [
      { level: "low", type: "hazard", message: "Normal ocean conditions. Swell height 1.1m, wind speed 12 knots (SW)." },
      { level: "low", type: "geofence", zoneName: "India EEZ", message: "Operating safely within Indian Exclusive Economic Zone (200 NM limit). No boundary violations." }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "pfz-zone-1",
          properties: {
            name: "INCOIS High Yield PFZ Zone Alpha",
            type: "pfz",
            sst: "28.2 °C",
            chlorophyll: "4.3 mg/m³",
            confidence: "94%",
            species: "Pelagic (Tuna, Mackerel, Sardine)",
            depth: "42m",
            advisory: "High productivity thermal front detected by Oceansat-3"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [69.35, 20.65],
              [69.52, 20.72],
              [69.60, 20.58],
              [69.42, 20.50],
              [69.35, 20.65]
            ]]
          }
        },
        {
          type: "Feature",
          id: "buoy-veraval",
          properties: {
            name: "INCOIS Ocean Buoy BD08",
            type: "buoy",
            sst: "28.0 °C",
            waveHeight: "1.1 m",
            windSpeed: "12 kts",
            pressure: "1011 hPa"
          },
          geometry: {
            type: "Point",
            coordinates: [69.45, 20.62]
          }
        }
      ]
    },
    charts: [
      {
        type: "line",
        title: "Chlorophyll-a & SST Front Correlation (Past 7 Days)",
        data: [
          { day: "Mon", chlorophyll: 2.1, sst: 29.1 },
          { day: "Tue", chlorophyll: 2.4, sst: 28.9 },
          { day: "Wed", chlorophyll: 3.0, sst: 28.6 },
          { day: "Thu", chlorophyll: 3.8, sst: 28.3 },
          { day: "Fri (Today)", chlorophyll: 4.3, sst: 28.0 },
          { day: "Sat (Fcst)", chlorophyll: 4.1, sst: 28.1 },
          { day: "Sun (Fcst)", chlorophyll: 3.6, sst: 28.4 }
        ]
      }
    ],
    evidence: [
      { claim: "PFZ Boundary verified via Oceansat-3 OCM-3 Sensor Pass #4120", source: "ISRO NRSC Ocean Data Gateway", confidence: "96%" },
      { claim: "Thermal Front SST gradient confirmed by INSAT-3DR Sounder", source: "INCOIS Marine Advisory Division", confidence: "94%" },
      { claim: "In-situ sea surface temp cross-validated with Ocean Buoy BD08", source: "NIOT Buoy Network Telemetry", confidence: "99%" }
    ]
  },

  "sea-safety": {
    location: "Offshore Kochi, Kerala",
    coords: [76.10, 9.95],
    answer_text: {
      en: "⚠️ CAUTION RECOMMENDED: High wave and swell alerts active offshore Kochi (Kerala). Wave heights expected to reach 3.8m to 4.2m tomorrow between 08:00 AM and 04:00 PM due to squally SW winds (28-34 knots). Small fishing crafts (<12m) are advised NOT to venture into deep sea.",
      hi: "⚠️ सावधानी की सलाह: कोच्चि (केरल) के तट पर ऊंची लहरों और ज्वार का अलर्ट सक्रिय है। कल सुबह 08:00 से शाम 04:00 बजे के बीच तेज हवाओं के कारण लहरों की ऊंचाई 3.8 से 4.2 मीटर तक पहुंचने की उम्मीद है। छोटी नावों को गहरे समुद्र में न जाने की सलाह दी जाती है।",
      ta: "⚠️ எச்சரிக்கை: கொச்சி (கேரளா) கடற்பகுதியில் பலத்த அலை எச்சரிக்கை செயல்பாட்டில் உள்ளது. சிறிய படகுகள் ஆழ்கடலுக்குச் செல்ல வேண்டாம் என அறிவுறுத்தப்படுகிறார்கள்.",
      te: "⚠️ హెచ్చరిక: కొచ్చి (కేరళ) తీరంలో అధిక అలల హెచ్చరిక అమలులో ఉంది. చిన్న పడవలు లోతైన సముద్రంలోకి వెళ్ళవద్దని సలహా ఇవ్వబడింది.",
      ml: "⚠️ ജാഗ്രതാ നിർദ്ദേശം: കൊച്ചി തീരത്ത് ഉയർന്ന തിരമാല മുന്നറിയിപ്പ്. ചെറിയ ബോട്ടുകൾ ആഴക്കടലിൽ പോകരുത്.",
      gu: "⚠️ સાવચેતીની સલાહ: કોચી કિનારે ઊંચા મોજાનું એલર્ટ છે. નાની હોડીઓને દરિયામાં ન જવાની સલાહ છે.",
      bn: "⚠️ সতর্কবার্তা: কোচি উপকূলে উচ্চ ঢেউয়ের সতর্কতা জারি করা হয়েছে। ছোট নৌকাগুলিকে সমুদ্রে না যাওয়ার পরামর্শ দেওয়া হচ্ছে।"
    },
    risk_level: "high",
    risk_alerts: [
      { level: "high", type: "hazard", message: "HIGH WAVE ALERT: Swell waves 3.8m to 4.2m expected offshore Kochi. Squally wind up to 34 knots." },
      { level: "medium", type: "hazard", message: "Strong coastal rip currents active around Fort Kochi & Vypin Island." }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "hazard-kochi-highwave",
          properties: {
            name: "INCOIS Swells Hazard Zone (OFFSHORE KOCHI)",
            type: "hazard",
            riskLevel: "HIGH",
            waveHeight: "3.8m - 4.2m",
            windSpeed: "34 knots",
            warningText: "Squally SW wind and dangerous breaking swell waves"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [75.90, 9.80],
              [76.25, 10.15],
              [76.35, 9.90],
              [76.05, 9.65],
              [75.90, 9.80]
            ]]
          }
        },
        {
          type: "Feature",
          id: "buoy-kochi",
          properties: {
            name: "INCOIS Ocean Buoy CB02 (Kochi)",
            type: "buoy",
            sst: "29.1 °C",
            waveHeight: "3.9 m",
            windSpeed: "32 kts",
            pressure: "1004 hPa"
          },
          geometry: {
            type: "Point",
            coordinates: [76.10, 9.95]
          }
        }
      ]
    },
    charts: [
      {
        type: "bar",
        title: "Offshore Kochi Wave Height Forecast (Next 24 Hours)",
        data: [
          { time: "00:00", wave: 1.8, wind: 16 },
          { time: "04:00", wave: 2.4, wind: 22 },
          { time: "08:00 (Danger)", wave: 3.9, wind: 31 },
          { time: "12:00 (Peak)", wave: 4.2, wind: 34 },
          { time: "16:00", wave: 3.5, wind: 28 },
          { time: "20:00", wave: 2.6, wind: 20 }
        ]
      }
    ],
    evidence: [
      { claim: "High wave warnings computed by INCOIS WAVEWATCH-III numerical model", source: "INCOIS Ocean State Forecast (OSF)", confidence: "98%" },
      { claim: "Atmospheric pressure drop confirmed by INSAT-3DR Scatterometer", source: "ISRO MOSDAC Weather Portal", confidence: "95%" }
    ]
  },

  "tide-weather": {
    location: "Visakhapatnam, Andhra Pradesh",
    coords: [83.35, 17.68],
    answer_text: {
      en: "Visakhapatnam offshore: High tide peak at 02:15 PM (+1.85m), Low tide at 08:30 PM (+0.32m). Wind 14 knots ENE. SST 28.6°C. Favorable ocean state for artisanal fishing crafts up to 25 NM from coast.",
      hi: "विशाखापत्तनम तट: दोपहर 02:15 बजे उच्च ज्वार (+1.85m), रात 08:30 बजे निम्न ज्वार (+0.32m)। हवा 14 समुद्री मील ENE। मछली पकड़ने के लिए स्थिति अनुकूल है।",
      ta: "விசாகப்பட்டினம்: பிற்பகல் 02:15 மணிக்கு அதிக அலை (+1.85 மீ), இரவு 08:30 மணிக்கு குறைந்த அலை (+0.32 மீ). மீன்பிடிக்க சாதகமான சூழல்.",
      te: "విశాఖపట్నం తీరం: మధ్యాహ్నం 02:15 గంటలకు అధిక అలలు (+1.85మీ), రాత్రి 08:30 తక్కువ అలలు (+0.32మీ). సముద్ర పరిస్థితులు చేపల వేటకు అనుకూలంగా ఉన్నాయి.",
      ml: "വിശാഖപട്ടണം: ഉച്ചയ്ക്ക് 02:15 ഉയർന്ന വേലിയേറ്റം (+1.85m), രാത്രി 08:30 താഴ്ന്ന വേലിയേറ്റം (+0.32m). മത്സ്യബന്ധനത്തിന് അനുകൂല കാലാവസ്ഥ.",
      gu: "વિશાખાપટ્ટનમ: બપોરે 02:15 ઉંચી ભરતી (+1.85m), રાત્રે 08:30 ઓછી ઓટ (+0.32m). માછીમારી માટે અનુકૂળ સ્થિતિ.",
      bn: "বিশাখাপত্তনম: দুপুর ০২:১৫ জোয়ার (+১.৮৫ মি), রাত ০৮:৩০ ভাটা (+০.৩২ মি)। মাছ ধরার জন্য অনুকূল পরিবেশ।"
    },
    risk_level: "low",
    risk_alerts: [
      { level: "low", type: "hazard", message: "Favorable fishing tides. Visibility 8.5 NM. Normal wave action." }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "vizag-buoy",
          properties: {
            name: "INCOIS Vizag Met-Ocean Buoy DS04",
            type: "buoy",
            sst: "28.6 °C",
            waveHeight: "1.2 m",
            windSpeed: "14 kts ENE"
          },
          geometry: {
            type: "Point",
            coordinates: [83.35, 17.68]
          }
        },
        {
          type: "Feature",
          id: "vizag-pfz",
          properties: {
            name: "Vizag Slope PFZ Zone",
            type: "pfz",
            sst: "28.5 °C",
            chlorophyll: "3.8 mg/m³",
            species: "Ribbonfish, Anchovy, Sardine"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [83.45, 17.60],
              [83.60, 17.72],
              [83.72, 17.55],
              [83.52, 17.48],
              [83.45, 17.60]
            ]]
          }
        }
      ]
    },
    charts: [
      {
        type: "line",
        title: "Visakhapatnam 24-Hour Tidal Cycle Height (Meters)",
        data: [
          { time: "06:00 AM", height: 0.45 },
          { time: "09:00 AM", height: 1.10 },
          { time: "12:00 PM", height: 1.72 },
          { time: "02:15 PM (High Tide)", height: 1.85 },
          { time: "05:00 PM", height: 1.20 },
          { time: "08:30 PM (Low Tide)", height: 0.32 },
          { time: "11:00 PM", height: 0.78 }
        ]
      }
    ],
    evidence: [
      { claim: "Tidal predictions synchronized with Survey of India Tide Tables", source: "Survey of India / INCOIS Coastal Network", confidence: "99%" }
    ]
  },

  "cyclone-lightning": {
    location: "Bay of Bengal (Puri Coast)",
    coords: [86.40, 19.00],
    answer_text: {
      en: "🚨 SEVERE WEATHER WARNING: Deep Depression in Bay of Bengal intensifying into Cyclonic Storm 'ASNA' with landfall expected near Odisha-WB coast within 36 hours. Max sustained wind 45-55 knots with gusts to 65 knots. Extreme swell waves (5.5m). All fishermen advised to return to port IMMEDIATELY.",
      hi: "🚨 गंभीर मौसम की चेतावनी: बंगाल की खाड़ी में गहरा दबाव चक्रवाती तूफान में बदल रहा है। हवा की गति 55 समुद्री मील तक पहुंच रही है। सभी मछुआरे तुरंत तट पर लौट आएं।",
      ta: "🚨 கடுமையான வானிலை எச்சரிக்கை: வங்காள விரிகுடாவில் புயல் உருவாகியுள்ளது. அனைத்து மீனவர்களும் உடனடியாக கரை திரும்புமாறு கேட்டுக் கொள்ளப்படுகிறார்கள்.",
      te: "🚨 తీవ్రమైన వాతావరణ హెచ్చరిక: బంగాళాఖాతంలో తుఫాను తీవ్రరూపం దాల్చుతోంది. మత్స్యకారులు వెంటనే సురక్షిత తీరానికి చేరుకోవాలి.",
      ml: "🚨 തീവ്ര കാലാവസ്ഥാ മുന്നറിയിപ്പ്: ബംഗാൾ ഉൾക്കടലിൽ ചുഴലിക്കാറ്റ്. എല്ലാ മത്സ്യത്തൊഴിലാളികളും ഉടൻ കരയിലേക്ക് മടങ്ങുക.",
      gu: "🚨 ગંભીર હવામાન ચેતવણી: બંગાળની ખાડીમાં વાવાઝોડું સક્રિય થયું છે. માછીમારો તરત જ બંદરે પાછા ફરે.",
      bn: "🚨 তীব্র আবহাওয়া সতর্কতা: বঙ্গোপসাগরে ঘূর্ণিঝড় ঘনীভূত হচ্ছে। সমস্ত মৎস্যজীবীদের অবিলম্বে তীরে ফিরে আসার নির্দেশ দেওয়া হচ্ছে।"
    },
    risk_level: "high",
    risk_alerts: [
      { level: "high", type: "hazard", message: "CYCLONE ALERT: Severe Cyclonic Storm in Bay of Bengal. RETURN TO HARBOR IMMEDIATELY." },
      { level: "high", type: "hazard", message: "LIGHTNING HAZARD: Extreme convective lightning strikes (>120 strikes/min) detected by INSAT-3DR." }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "cyclone-eye",
          properties: {
            name: "Cyclonic Storm Track - Bay of Bengal",
            type: "hazard",
            riskLevel: "HIGH",
            windSpeed: "55 knots",
            warningText: "Severe Cyclone Radius & Extreme Wave Conditions"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [85.80, 19.10],
              [86.50, 19.80],
              [87.20, 19.30],
              [86.40, 18.60],
              [85.80, 19.10]
            ]]
          }
        }
      ]
    },
    charts: [
      {
        type: "line",
        title: "Barometric Pressure & Wind Speed Intensity Trend",
        data: [
          { hour: "-12h", pressure: 1008, wind: 22 },
          { hour: "-8h", pressure: 1002, wind: 30 },
          { hour: "-4h", pressure: 994, wind: 42 },
          { hour: "Now", pressure: 988, wind: 55 },
          { hour: "+4h (Peak)", pressure: 982, wind: 65 },
          { hour: "+8h", pressure: 990, wind: 48 }
        ]
      }
    ],
    evidence: [
      { claim: "Cyclone track calculated via INSAT-3DR Doppler Radar & Rapid Scan", source: "IMD / ISRO Meteorological Data Center", confidence: "99%" },
      { claim: "Wave height extremes predicted by WAVEWATCH-III numerical model", source: "INCOIS Marine Hazards Group", confidence: "98%" }
    ]
  },

  "safest-route": {
    location: "Chennai Harbor to Offshore Ridge",
    coords: [80.38, 13.15],
    answer_text: {
      en: "🧭 SAFE NAVIGATION ROUTE: Optimized route from Chennai Harbor to Offshore PFZ Ridge (24.2 NM). Route bypasses 2.8m swell convergence near Pulicat Shoals and steers clear of Naval Restricted Area 4B. Transit time: 1h 45m at 14 knots.",
      hi: "🧭 सुरक्षित नेविगेशन मार्ग: चेन्नई हार्बर से 24.2 समुद्री मील दूर PFZ रिज के लिए सुरक्षित मार्ग तैयार किया गया है। यह पुलिकट की तेज लहरों और नौसेना प्रतिबंधित क्षेत्र 4B से बचाता है।",
      ta: "🧭 பாதுகாப்பான வழித்தடம்: சென்னை துறைமுகத்திலிருந்து ஆழ்கடல் பகுதிக்கு உகந்த பாதை கணக்கிடப்பட்டுள்ளது. கடற்படை தடைசெய்யப்பட்ட பகுதிகளைத் தவிர்க்கிறது.",
      te: "🧭 సురక్షిత ప్రయాణ మార్గం: చెన్నై హార్బర్ నుండి చేపల వేట ప్రాంతానికి సురక్షిత మార్గం రూపొందించబడింది.",
      ml: "🧭 സുരക്ഷിത യാത്രാപാത: ചെന്നൈ ഹാർബറിൽ നിന്നുള്ള സുരക്ഷിത പാത തയ്യാറാക്കി.",
      gu: "🧭 સલામત નેવિગેશન માર્ગ: ચેન્નાઈ હાર્બરથી PFZ રિજ સુધીનો શ્રેષ્ઠ માર્ગ.",
      bn: "🧭 নিরাপদ নৌপথ: চেন্নাই বন্দর থেকে অফশোর পিএফজেড রিজ পর্যন্ত সুরক্ষিত পথ।"
    },
    risk_level: "low",
    risk_alerts: [
      { level: "low", type: "hazard", message: "Optimal route generated avoiding 2.8m swell convergence near Pulicat Shoals." },
      { level: "medium", type: "geofence", zoneName: "Naval Restricted Zone 4B", message: "Route planned around Naval Restricted Area 4B (1.4 NM safe clearance)." }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "safe-route-polyline",
          properties: {
            name: "ORCA A* Hydrodynamic Safe Vessel Path",
            type: "route",
            distance: "24.2 Nautical Miles",
            estimatedTime: "1 Hour 45 Mins",
            safetyScore: "98/100"
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [80.28, 13.08],
              [80.38, 13.15],
              [80.48, 13.24],
              [80.62, 13.35]
            ]
          }
        },
        {
          type: "Feature",
          id: "naval-restricted-zone",
          properties: {
            name: "Naval Exercise Restricted Area 4B (BYPASSED)",
            type: "restricted",
            riskLevel: "HIGH"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [80.32, 13.25],
              [80.42, 13.32],
              [80.40, 13.20],
              [80.30, 13.18],
              [80.32, 13.25]
            ]]
          }
        }
      ]
    },
    charts: [
      {
        type: "line",
        title: "Swell Height & Depth Along Route Waypoints",
        data: [
          { waypoint: "Harbor", swell: 0.6, depth: 14 },
          { waypoint: "WP 1 (Near Shore)", swell: 1.1, depth: 28 },
          { waypoint: "WP 2 (Bypass Shoal)", swell: 1.3, depth: 45 },
          { waypoint: "PFZ Target", swell: 1.0, depth: 82 }
        ]
      }
    ],
    evidence: [
      { claim: "Bathymetric depths verified from National Hydrographic Office", source: "NHO Admiralty Charts & INCOIS", confidence: "99%" },
      { claim: "Hydrodynamic routing solved via A* pathfinding on swell risk grids", source: "ORCA Autonomous Navigation Engine", confidence: "96%" }
    ]
  },

  // ── Diagnostic / Analytical query (PS Requirement 6) ─────────────────────
  "productivity-decline": {
    location: "Gulf of Mannar, Tamil Nadu Coast",
    coords: [78.50, 9.20],
    answer_text: {
      en: "Diagnostic Analysis for Gulf of Mannar Coast: Fish productivity decline (-42% vs 5-year baseline) is driven by a localized Marine Heatwave anomaly (+1.8°C SST rise above climatology). Oceansat-3 OCM-3 reveals persistent thermal stratification which has suppressed nutrient upwelling, causing phytoplankton chlorophyll-a levels to drop from 3.8 mg/m³ to 1.1 mg/m³. Pelagic schools (Sardinella & Rastrelliger) have migrated 22 NM offshore to deeper, cooler thermocline waters.",
      hi: "मन्नार की खाड़ी तट के लिए नैदानिक ​​विश्लेषण: मछली उत्पादन में गिरावट (-42%) स्थानीय समुद्री ग्रीष्म लहर (SST में +1.8°C वृद्धि) के कारण है। Oceansat-3 डेटा से पता चलता है कि पोषक तत्वों का प्रवाह रुकने से क्लोरोफिल-ए 3.8 से घटकर 1.1 mg/m³ हो गया है। मछलियां 22 समुद्री मील गहरे और ठंडे पानी में चली गई हैं।",
      ta: "மன்னார் வளைகுடா கடலோர பகுப்பாய்வு: மீன் பிடிப்பு சரிவு (-42%) கடல் வெப்ப அலை (+1.8°C SST உயர்வு) காரணமாக ஏற்பட்டுள்ளது. ஊட்டச்சத்துக்கள் குறைந்து குளோரோபில்-ஏ 3.8 லிருந்து 1.1 mg/m³ ஆக குறைந்துள்ளது. மீன்கள் 22 கடல் மைல் ஆழமான பகுதிக்கு இடம்பெயர்ந்துள்ளன.",
      te: "మన్నార్ సింధుశాఖ తీర విశ్లేషణ: సముద్ర ఉష్ణోగ్రత +1.8°C పెరగడం వల్ల క్లోరోఫిల్-ఎ తగ్గి చేపల లభ్యత 42% తగ్గింది. చేపలు 22 నాటికల్ మైళ్ళ లోతైన ప్రాంతాలకు వలస వెళ్ళాయి.",
      ml: "മന്നാർ ഉൾക്കടൽ തീരദേശ വിശകലനം: സമുദ്ര താപനില +1.8°C ഉയർന്നതിനെ തുടർന്ന് ക്ലോറോഫിൽ-എ കുറഞ്ഞു. മത്സ്യലഭ്യതയിൽ 42% ഇടിവ് രേഖപ്പെടുത്തി. മത്സ്യങ്ങൾ കൂടുതൽ ആഴത്തിലേക്ക് നീങ്ങി.",
      gu: "મન્નારના અખાત માટેનું વિશ્લેષણ: દરિયાઈ તાપમાનમાં +1.8°C વધારાને કારણે ક્લોરોફિલ ઘટી ગયું છે, જેથી માછલીઓ 22 નોટિકલ માઇલ ઊંડાણમાં સ્થળાંતરિત થઈ ગઈ છે.",
      bn: "মান্নার উপসাগরীয় অঞ্চলের বিশ্লেষণ: সামুদ্রিক তাপমাত্রা +১.৮°C বৃদ্ধি পাওয়ায় ক্লোরোফিল কমে মাছের উৎপাদন ৪২% হ্রাস পেয়েছে।"
    },
    risk_level: "medium",
    risk_alerts: [
      {
        level: "medium",
        type: "geofence",
        zoneName: "Gulf of Mannar Marine National Park",
        message: "⚠️ Marine Protected Area (MPA) Geofence: Query region encompasses Gulf of Mannar Marine National Park. Mechanized commercial bottom trawling is prohibited under Wildlife Protection Act 1972."
      },
      {
        level: "medium",
        type: "hazard",
        message: "Marine Heatwave Alert (Category II): Sea surface temperature is +1.8°C above 10-year climatological average."
      }
    ],
    map_layers: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "gulf-mannar-anomaly",
          properties: {
            name: "Gulf of Mannar Thermal Stratification Anomaly",
            type: "hazard",
            riskLevel: "MEDIUM",
            sst: "30.4 °C (+1.8°C anomaly)",
            chlorophyll: "1.1 mg/m³ (suppressed)",
            warningText: "Persistent thermal stratification suppressing upwelling blooms"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [78.30, 8.80],
              [79.20, 8.80],
              [79.20, 9.40],
              [78.30, 9.40],
              [78.30, 8.80]
            ]]
          }
        },
        {
          type: "Feature",
          id: "mpa-gulf-mannar-layer",
          properties: {
            name: "Gulf of Mannar Marine National Park (MPA Boundary)",
            type: "restricted",
            riskLevel: "HIGH"
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [78.0, 8.5],
              [79.5, 8.5],
              [79.5, 9.8],
              [78.0, 9.8],
              [78.0, 8.5]
            ]]
          }
        },
        {
          type: "Feature",
          id: "buoy-mandapam",
          properties: {
            name: "INCOIS Mandapam Ocean Buoy MB03",
            type: "buoy",
            sst: "30.3 °C",
            waveHeight: "0.9 m",
            windSpeed: "9 kts"
          },
          geometry: {
            type: "Point",
            coordinates: [78.85, 9.15]
          }
        }
      ]
    },
    charts: [
      {
        type: "line",
        title: "6-Month Chlorophyll-a vs 5-Year Baseline (mg/m³)",
        data: [
          { month: "Nov", actual: 3.9, baseline: 3.7 },
          { month: "Dec", actual: 3.6, baseline: 3.8 },
          { month: "Jan", actual: 2.8, baseline: 3.9 },
          { month: "Feb", actual: 1.9, baseline: 4.1 },
          { month: "Mar", actual: 1.3, baseline: 4.0 },
          { month: "Apr (Now)", actual: 1.1, baseline: 3.8 }
        ]
      }
    ],
    evidence: [
      { claim: "SST positive anomaly (+1.8°C) verified by INSAT-3DR Sounder & AVHRR", source: "ISRO MOSDAC Ocean Portal", confidence: "97%" },
      { claim: "Chlorophyll-a decline confirmed via Oceansat-3 OCM-3 8-day composite", source: "INCOIS Remote Sensing & Modeling Unit", confidence: "95%" },
      { claim: "MPA boundary cross-matched with MoEFCC National Protected Areas Registry", source: "Wildlife Institute of India / INCOIS GIS", confidence: "99%" }
    ]
  }
};

// ── Follow-up multi-turn contextual generator ─────────────────────────────────
function generateContextualFollowUp(text, context, language) {
  const lastLocation = context?.lastLocation || "Veraval Coast";
  const lastScenario = context?.lastScenarioId;

  if (lastScenario === "sea-safety" || /kochi|kerala/i.test(lastLocation)) {
    return {
      answer_text: {
        en: `Contextual Follow-up for ${lastLocation} (Day After Tomorrow): Swell warnings will subside significantly by morning. Significant wave heights drop from 4.2m down to 1.7m, wind eases to 14 knots SW. Small artisanal crafts may safely resume operations after 07:30 AM.`,
        hi: `${lastLocation} के लिए अनुवर्ती पूर्वानुमान: परसों सुबह तक ऊंची लहरों का खतरा काफी कम हो जाएगा। लहरें घटकर 1.7 मीटर और हवा 14 समुद्री मील हो जाएगी। सुबह 07:30 बजे के बाद नावें सुरक्षित रूप से जा सकती हैं।`,
        ta: `${lastLocation} தொடர் தகவல்: நாளை மறுநாள் காலை அலைகளின் உயரம் 1.7 மீட்டராக குறையும். காலை 07:30 மணிக்கு மேல் படகுகள் கடலுக்கு செல்லலாம்.`
      },
      risk_level: "low",
      risk_alerts: [
        { level: "low", type: "hazard", message: "Weather stabilizing. Wave heights easing below 2m threshold after 07:00 AM." }
      ],
      map_layers: {
        type: "FeatureCollection",
        features: [{
          type: "Feature", id: "kochi-fcst",
          properties: { name: "Kochi Stabilized Ocean Corridor", type: "route", distance: "15 NM", safetyScore: "95/100" },
          geometry: { type: "LineString", coordinates: [[76.22, 9.97], [76.05, 9.92], [75.90, 9.88]] }
        }]
      },
      charts: [{
        type: "line", title: "48-Hour Wave Height Calming Trend (Meters)",
        data: [{ time: "Today 12:00", wave: 4.2 }, { time: "Today 18:00", wave: 3.5 }, { time: "Tmrw 06:00", wave: 2.6 }, { time: "Tmrw 18:00", wave: 2.1 }, { time: "+48h 06:00", wave: 1.7 }]
      }],
      evidence: [{ claim: "INCOIS WAVEWATCH-III numerical wave model 72h forecast run", source: "INCOIS Ocean State Forecast", confidence: "96%" }]
    };
  }

  // Default follow-up (e.g. for Veraval / PFZ)
  return {
    answer_text: {
      en: `Contextual Follow-up for ${lastLocation} (Tomorrow's Outlook): Potential fishing zone remains highly productive (19.2 NM offshore, SST 28.1°C). Sea conditions remain favorable with 1.2m wave heights until 12:00 PM, after which localized sea breezes will increase chop to 1.7m. Optimal fishing window: 05:00 AM – 10:30 AM.`,
      hi: `${lastLocation} के लिए कल का पूर्वानुमान: संभावित मत्स्य क्षेत्र 19.2 समुद्री मील दूर सक्रिय रहेगा। दोपहर 12 बजे तक 1.2 मीटर लहरों के साथ स्थिति अनुकूल रहेगी। सबसे अच्छा समय: प्रातः 05:00 से 10:30 बजे तक।`,
      ta: `${lastLocation} நாளைய நிலவரம்: மீன்பிடி மண்டலம் தொடர்ந்து சிறப்பாக இருக்கும். காலை 05:00 முதல் 10:30 மணி வரை உகந்த நேரம்.`
    },
    risk_level: "low",
    risk_alerts: [
      { level: "low", type: "hazard", message: "Favorable ocean conditions tomorrow morning. Normal wind vectors." },
      { level: "low", type: "geofence", zoneName: "India EEZ", message: "Operating safely within Indian EEZ." }
    ],
    map_layers: SCENARIOS["pfz-today"].map_layers,
    charts: [{
      type: "line", title: "Tomorrow's Hourly Wave & Wind Forecast",
      data: [{ time: "04:00", wave: 1.0, wind: 10 }, { time: "08:00", wave: 1.1, wind: 12 }, { time: "12:00", wave: 1.4, wind: 15 }, { time: "16:00", wave: 1.7, wind: 18 }]
    }],
    evidence: [{ claim: "Oceansat-3 24h SST persistence projection", source: "ISRO NRSC Ocean Gateway", confidence: "94%" }]
  };
}

export function generateCustomResponse(queryText = "", lang = "en") {
  const isDanger = /cyclone|danger|storm|warning|tsunami|wave/i.test(queryText);
  return {
    answer_text: {
      en: `ORCA Multi-Agent Analysis for "${queryText}": ${isDanger ? "⚠️ Caution advised due to localized weather volatility." : "Sea conditions are stable with optimal SST and normal wave heights."}`,
      hi: `"${queryText}" के लिए ORCA विश्लेषण: ${isDanger ? "⚠️ सावधानी की सलाह दी जाती है।" : "समुद्र की स्थिति सामान्य है।"}`
    },
    risk_level: isDanger ? "medium" : "low",
    risk_alerts: isDanger
      ? [{ level: "medium", type: "hazard", message: "Moderate wave height and localized wind gusts detected." }]
      : [{ level: "low", type: "hazard", message: "Normal ocean condition parameters detected." }],
    map_layers: {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        id: "custom-point-1",
        properties: {
          name: "Query Location Telemetry Node",
          type: "buoy",
          sst: "28.3 °C",
          waveHeight: "1.3 m",
          windSpeed: "15 kts"
        },
        geometry: {
          type: "Point",
          coordinates: [72.82, 18.96] // Mumbai Coast fallback
        }
      }]
    },
    charts: [
      {
        type: "line",
        title: "Sea Surface Temperature & Wave Trend",
        data: [
          { hour: "06:00", temp: 28.1, wave: 1.1 },
          { hour: "12:00", temp: 28.5, wave: 1.3 },
          { hour: "18:00", temp: 28.2, wave: 1.2 }
        ]
      }
    ],
    evidence: [
      { claim: "Geospatial query matched against INCOIS live buoy network", source: "INCOIS Marine Portal", confidence: "92%" }
    ]
  };
}

export async function executeOrcaQuery({ text = "", presetId, language = "en", conversationContext = null, onAgentStep }) {
  const lowerText = text.toLowerCase();

  // Multi-turn follow-up detection (e.g. "what about tomorrow?", "and tomorrow?", "is it safe tomorrow?")
  const isFollowUp = /tomorrow|next day|what about|how about|and then|can we go/i.test(lowerText) && conversationContext?.lastScenarioId;

  let scenarioKey = presetId;
  let scenario = null;

  if (isFollowUp) {
    scenario = generateContextualFollowUp(text, conversationContext, language);
    scenarioKey = conversationContext.lastScenarioId;
  } else if (scenarioKey && SCENARIOS[scenarioKey]) {
    scenario = SCENARIOS[scenarioKey];
  } else {
    if (lowerText.includes("decline") || lowerText.includes("fish catch") || lowerText.includes("productivity") || lowerText.includes("drop") || lowerText.includes("mannar")) {
      scenarioKey = "productivity-decline";
    } else if (lowerText.includes("pfz") || lowerText.includes("fishing") || lowerText.includes("fish") || lowerText.includes("veraval")) {
      scenarioKey = "pfz-today";
    } else if (lowerText.includes("safe") || lowerText.includes("high wave") || lowerText.includes("kochi") || lowerText.includes("swell")) {
      scenarioKey = "sea-safety";
    } else if (lowerText.includes("tide") || lowerText.includes("weather") || lowerText.includes("vizag")) {
      scenarioKey = "tide-weather";
    } else if (lowerText.includes("cyclone") || lowerText.includes("lightning") || lowerText.includes("storm") || lowerText.includes("puri")) {
      scenarioKey = "cyclone-lightning";
    } else if (lowerText.includes("route") || lowerText.includes("boat") || lowerText.includes("chennai")) {
      scenarioKey = "safest-route";
    }

    scenario = scenarioKey ? SCENARIOS[scenarioKey] : generateCustomResponse(text, language);
  }

  // Determine queried location coords for geofencing check
  const coords = scenario.coords || (scenarioKey && SCENARIO_COORDS[scenarioKey]) || SCENARIO_COORDS["default"];
  const geofenceViolations = checkGeofence(coords[0], coords[1]);

  // Merge geofence violations into scenario risk_alerts if not already present
  const allAlerts = [...(scenario.risk_alerts || [])];
  geofenceViolations.forEach((v) => {
    if (!allAlerts.some(a => a.zoneName === v.name || a.message?.includes(v.name))) {
      allAlerts.push({
        level: v.severity === "critical" ? "high" : v.severity === "restricted" ? "medium" : "low",
        type: "geofence",
        zoneName: v.name,
        message: v.message
      });
    }
  });

  // Simulate live agent execution progression with customized per-scenario contributions
  const trace = [];

  for (let i = 0; i < AGENT_PIPELINE_STEPS.length; i++) {
    const agent = AGENT_PIPELINE_STEPS[i];

    // Customized contribution note based on query
    let specificContribution = agent.contribution;
    if (agent.id === "risk_agent" && geofenceViolations.length > 0) {
      specificContribution = `Ray-casting geofence check: Detected location intersects [${geofenceViolations[0].name}]. Enforced advisory alert.`;
    } else if (agent.id === "marine_data_agent" && scenarioKey === "productivity-decline") {
      specificContribution = "Analyzed 6-month Oceansat-3 OCM-3 Chlorophyll-a time-series vs 5-year climatological baseline.";
    }

    const runningTrace = [
      ...trace,
      {
        agent_name: agent.name,
        role: agent.role,
        status: "running",
        details: agent.details,
        contribution: specificContribution,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ];

    if (onAgentStep) {
      onAgentStep(runningTrace);
    }

    // Wait for step duration
    await new Promise((res) => setTimeout(res, agent.duration));

    trace.push({
      agent_name: agent.name,
      role: agent.role,
      status: "done",
      details: agent.details,
      contribution: specificContribution,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  }

  const selectedAnswer = typeof scenario.answer_text === "object"
    ? (scenario.answer_text[language] || scenario.answer_text.en)
    : scenario.answer_text;

  return {
    answer_text: selectedAnswer,
    language: language,
    risk_level: scenario.risk_level,
    map_layers: scenario.map_layers,
    charts: scenario.charts || [],
    risk_alerts: allAlerts,
    evidence: scenario.evidence || [],
    agent_trace: trace,
    scenarioId: scenarioKey,
    location: scenario.location || "Indian EEZ"
  };
}
