"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Rectangle, Circle, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-velocity/dist/leaflet-velocity.css";
import { API_BASE } from "../lib/api";

// leaflet-velocity (github.com/onaci/leaflet-velocity) is a plain script
// that attaches L.velocityLayer onto a *global* `L`, rather than an ES
// module that exports it — so it has to run after `window.L` exists, and
// only in the browser. This file is only ever loaded client-side (it's
// imported via next/dynamic with ssr:false in page.tsx), so it's safe to
// do that wiring here at module scope instead of inside an effect.
if (typeof window !== "undefined") {
  (window as unknown as { L: typeof L }).L = L;
  // leaflet-velocity is a plain script with no ESM export; it must run
  // synchronously after window.L is set, which a dynamic import() can't
  // guarantee before use.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("leaflet-velocity");
  // Same story: leaflet.heat attaches L.heatLayer onto the global L.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("leaflet.heat");
}

export type MapZone = {
  name: string;
  type: string;
  min_lat: number;
  max_lat: number;
  min_lon: number;
  max_lon: number;
};

export type MapWaypoint = {
  sequence: number;
  latitude: number;
  longitude: number;
  role: string;
  wave_height_m: number | null;
};

export type MarineMapProps = {
  center: { lat: number; lon: number; name: string };
  activeLayer: "pfz" | "thermal" | "wind" | "geofence" | "bathymetry";
  language?: string;
  marine?: { sst?: number | null; waveHeight?: number | null };
  weather?: { windSpeed?: number | null; windDeg?: number | null; windDir?: string | null };
  pfz?: {
    nearestZone: {
      latitude: number;
      longitude: number;
      distance_km: number;
      bearing_compass: string;
      confidence: string;
    };
    candidates: Array<{
      latitude: number;
      longitude: number;
      distance_km: number;
      sea_surface_temperature: number;
      score: number;
    }>;
  } | null;
  geo?: {
    restrictedZone?: MapZone | null;
    mpaZone?: MapZone | null;
    geofenceTriggered?: boolean;
    geofenceDistanceKm?: number | null;
  };
  route?: {
    waypoints: MapWaypoint[];
    hazardsAvoided: Array<{ name: string; type: string }>;
  } | null;
  // Called with the device's GPS fix when "My location" succeeds, so the
  // dashboard can retarget the whole console (sector name, agent data) to
  // where the user actually is rather than only panning the map.
  onLocateMe?: (position: { latitude: number; longitude: number; accuracyM: number }) => void;
};

// Popup/label copy for the map's own layers (PFZ, thermal, geofence,
// route) — separate from page.tsx's UI chrome dictionaries since this
// component is used from two different places in that file but only
// needs this one small slice of strings.
const MAP_COPY: Record<string, Record<string, string>> = {
  en: {
    sstLabel: "Sea Surface Temperature: {sst}°C",
    pfzScore: "Productivity score: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "~{distance} km from your position",
    pfzNearestTitle: "Nearest Potential Fishing Zone",
    pfzOfPosition: "~{distance} km {bearing} of your position",
    pfzConfidence: "Confidence: {confidence}",
    geofenceBuffer: "Operational geofence proximity buffer",
    routeWave: "wave {wave}m",
    roleOrigin: "Origin",
    roleDestination: "Destination",
    roleBypass: "Bypass (avoiding hazard)",
    roleWaypoint: "Waypoint",
    windLabel: "Wind",
    directionLabel: "Direction",
    speedLabel: "Speed",
    noWindData: "No wind data",
    backToSector: "Back to sector",
    backToDevice: "My location",
    locating: "Locating...",
    geoUnsupported: "Location not supported by this browser.",
    geoBlocked: "Location is blocked for this site. Allow it in your browser's site settings (the icon at the left of the address bar), then try again.",
    geoInsecure: "Location needs an HTTPS address. Open the console on localhost, or use the coordinate box in Add location.",
    geoTimeout: "Timed out getting a GPS fix. Try again near a window or with Wi-Fi on.",
    geoUnavailable: "No position available from this device right now.",
    geoCoarse: "This fix is only accurate to ~{km} km, so it came from your network, not GPS — it usually points at your broadband address. Set the exact spot with Add location.",
    youAreHere: "Your location",
    accuracyLabel: "accurate to ~{m} m",
  },
  hi: {
    sstLabel: "समुद्र सतह तापमान: {sst}°C",
    pfzScore: "उत्पादकता स्कोर: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "आपकी स्थिति से ~{distance} किमी",
    pfzNearestTitle: "निकटतम संभावित मत्स्य क्षेत्र",
    pfzOfPosition: "आपकी स्थिति से ~{distance} किमी {bearing} दिशा में",
    pfzConfidence: "विश्वसनीयता: {confidence}",
    geofenceBuffer: "परिचालन जियोफेंस निकटता बफर",
    routeWave: "लहर {wave}मी",
    roleOrigin: "प्रारंभिक बिंदु",
    roleDestination: "गंतव्य",
    roleBypass: "बायपास (खतरे से बचाव)",
    roleWaypoint: "वेपॉइंट",
    windLabel: "हवा",
    directionLabel: "दिशा",
    speedLabel: "गति",
    noWindData: "हवा डेटा उपलब्ध नहीं",
    backToSector: "क्षेत्र पर लौटें",
    backToDevice: "मेरा स्थान",
    locating: "स्थान खोजा जा रहा है...",
    geoUnsupported: "यह ब्राउज़र स्थान समर्थित नहीं करता।",
    geoBlocked: "इस साइट के लिए स्थान अवरुद्ध है। ब्राउज़र की साइट सेटिंग्स में इसे अनुमति दें, फिर पुनः प्रयास करें।",
    geoInsecure: "स्थान के लिए HTTPS पता आवश्यक है। localhost पर खोलें या निर्देशांक दर्ज करें।",
    geoTimeout: "GPS स्थान प्राप्त करने में समय समाप्त। खिड़की के पास पुनः प्रयास करें।",
    geoUnavailable: "इस डिवाइस से अभी कोई स्थिति उपलब्ध नहीं है।",
    geoCoarse: "यह स्थान केवल ~{km} किमी तक सटीक है, यानी यह GPS से नहीं बल्कि आपके नेटवर्क से आया है — यह प्रायः आपके ब्रॉडबैंड पते को दर्शाता है। सटीक स्थान 'Add location' से चुनें।",
    youAreHere: "आपका स्थान",
    accuracyLabel: "~{m} मीटर तक सटीक",
  },
  ta: {
    sstLabel: "கடல் மேற்பரப்பு வெப்பநிலை: {sst}°C",
    pfzScore: "உற்பத்தித் திறன் மதிப்பெண்: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "உங்கள் இருப்பிடத்திலிருந்து ~{distance} கிமீ",
    pfzNearestTitle: "அருகிலுள்ள சாத்தியமான மீன்பிடி மண்டலம்",
    pfzOfPosition: "உங்கள் இருப்பிடத்திலிருந்து ~{distance} கிமீ {bearing} திசையில்",
    pfzConfidence: "நம்பகத்தன்மை: {confidence}",
    geofenceBuffer: "செயல்பாட்டு ஜியோஃபென்ஸ் அருகாமை இடையகம்",
    routeWave: "அலை {wave}மீ",
    roleOrigin: "தொடக்கம்",
    roleDestination: "இலக்கு",
    roleBypass: "தவிர்ப்பு (ஆபத்தை தவிர்த்தல்)",
    roleWaypoint: "வழிப்புள்ளி",
    windLabel: "காற்று",
    directionLabel: "திசை",
    speedLabel: "வேகம்",
    noWindData: "காற்று தரவு இல்லை",
    backToSector: "பகுதிக்குத் திரும்பு",
    backToDevice: "என் இருப்பிடம்",
    locating: "கண்டறியப்படுகிறது...",
    geoUnsupported: "இந்த உலாவி இருப்பிடத்தை ஆதரிக்கவில்லை.",
    geoBlocked: "இந்த தளத்திற்கு இருப்பிடம் தடுக்கப்பட்டுள்ளது. உலாவி அமைப்புகளில் அனுமதித்து மீண்டும் முயற்சிக்கவும்.",
    geoInsecure: "இருப்பிடத்திற்கு HTTPS முகவரி தேவை. localhost இல் திறக்கவும் அல்லது ஆயத்தொலைவுகளை உள்ளிடவும்.",
    geoTimeout: "GPS இருப்பிடம் பெற நேரம் முடிந்தது. மீண்டும் முயற்சிக்கவும்.",
    geoUnavailable: "இந்த சாதனத்திலிருந்து தற்போது இருப்பிடம் இல்லை.",
    geoCoarse: "இந்த இருப்பிடம் ~{km} கிமீ வரை மட்டுமே துல்லியமானது — இது GPS அல்ல, உங்கள் நெட்வொர்க்கிலிருந்து வந்தது, பொதுவாக உங்கள் பிராட்பேண்ட் முகவரியைக் காட்டும். சரியான இடத்தை 'Add location' மூலம் அமைக்கவும்.",
    youAreHere: "உங்கள் இருப்பிடம்",
    accuracyLabel: "~{m} மீ துல்லியம்",
  },
  te: {
    sstLabel: "సముద్ర ఉపరితల ఉష్ణోగ్రత: {sst}°C",
    pfzScore: "ఉత్పాదకత స్కోరు: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "మీ స్థానం నుండి ~{distance} కి.మీ",
    pfzNearestTitle: "సమీప సంభావ్య మత్స్య మండలం",
    pfzOfPosition: "మీ స్థానం నుండి ~{distance} కి.మీ {bearing} దిశలో",
    pfzConfidence: "విశ్వసనీయత: {confidence}",
    geofenceBuffer: "కార్యాచరణ జియోఫెన్స్ సామీప్య బఫర్",
    routeWave: "అల {wave}మీ",
    roleOrigin: "ప్రారంభం",
    roleDestination: "గమ్యం",
    roleBypass: "బైపాస్ (ప్రమాదాన్ని నివారించడం)",
    roleWaypoint: "మార్గ బిందువు",
    windLabel: "గాలి",
    directionLabel: "దిశ",
    speedLabel: "వేగం",
    noWindData: "గాలి డేటా లేదు",
    backToSector: "ప్రాంతానికి తిరిగి",
    backToDevice: "నా స్థానం",
    locating: "కనుగొంటోంది...",
    geoUnsupported: "ఈ బ్రౌజర్ స్థానాన్ని సపోర్ట్ చేయదు.",
    geoBlocked: "ఈ సైట్‌కు స్థానం నిరోధించబడింది. బ్రౌజర్ సెట్టింగ్‌లలో అనుమతించి మళ్లీ ప్రయత్నించండి.",
    geoInsecure: "స్థానానికి HTTPS చిరునామా అవసరం. localhost లో తెరవండి లేదా కోఆర్డినేట్‌లు నమోదు చేయండి.",
    geoTimeout: "GPS స్థానం పొందడంలో సమయం ముగిసింది. మళ్లీ ప్రయత్నించండి.",
    geoUnavailable: "ఈ పరికరం నుండి ప్రస్తుతం స్థానం అందుబాటులో లేదు.",
    geoCoarse: "ఈ స్థానం ~{km} కి.మీ వరకు మాత్రమే ఖచ్చితం — ఇది GPS కాదు, మీ నెట్‌వర్క్ నుండి వచ్చింది, సాధారణంగా మీ బ్రాడ్‌బ్యాండ్ చిరునామాను చూపుతుంది. ఖచ్చితమైన స్థానాన్ని 'Add location' ద్వారా ఎంచుకోండి.",
    youAreHere: "మీ స్థానం",
    accuracyLabel: "~{m} మీ ఖచ్చితత్వం",
  },
  ml: {
    sstLabel: "സമുദ്ര ഉപരിതല താപനില: {sst}°C",
    pfzScore: "ഉൽപാദനക്ഷമത സ്കോർ: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "നിങ്ങളുടെ സ്ഥാനത്ത് നിന്ന് ~{distance} കി.മീ",
    pfzNearestTitle: "അടുത്തുള്ള സാധ്യതയുള്ള മത്സ്യബന്ധന മേഖല",
    pfzOfPosition: "നിങ്ങളുടെ സ്ഥാനത്ത് നിന്ന് ~{distance} കി.മീ {bearing} ദിശയിൽ",
    pfzConfidence: "വിശ്വാസ്യത: {confidence}",
    geofenceBuffer: "പ്രവർത്തന ജിയോഫെൻസ് സാമീപ്യ ബഫർ",
    routeWave: "തിരമാല {wave}മീ",
    roleOrigin: "ആരംഭം",
    roleDestination: "ലക്ഷ്യസ്ഥാനം",
    roleBypass: "ബൈപാസ് (അപകടം ഒഴിവാക്കൽ)",
    roleWaypoint: "വേപോയിന്റ്",
    windLabel: "കാറ്റ്",
    directionLabel: "ദിശ",
    speedLabel: "വേഗത",
    noWindData: "കാറ്റ് ഡാറ്റ ലഭ്യമല്ല",
    backToSector: "മേഖലയിലേക്ക് മടങ്ങുക",
    backToDevice: "എന്റെ സ്ഥാനം",
    locating: "കണ്ടെത്തുന്നു...",
    geoUnsupported: "ഈ ബ്രൗസർ ലൊക്കേഷൻ പിന്തുണയ്ക്കുന്നില്ല.",
    geoBlocked: "ഈ സൈറ്റിന് ലൊക്കേഷൻ തടഞ്ഞിരിക്കുന്നു. ബ്രൗസർ ക്രമീകരണങ്ങളിൽ അനുവദിച്ച് വീണ്ടും ശ്രമിക്കുക.",
    geoInsecure: "ലൊക്കേഷന് HTTPS വിലാസം വേണം. localhost ൽ തുറക്കുക അല്ലെങ്കിൽ കോർഡിനേറ്റുകൾ നൽകുക.",
    geoTimeout: "GPS ലൊക്കേഷൻ ലഭിക്കാൻ സമയം കഴിഞ്ഞു. വീണ്ടും ശ്രമിക്കുക.",
    geoUnavailable: "ഈ ഉപകരണത്തിൽ നിന്ന് ഇപ്പോൾ സ്ഥാനം ലഭ്യമല്ല.",
    geoCoarse: "ഈ സ്ഥാനം ~{km} കി.മീ വരെ മാത്രം കൃത്യമാണ് — ഇത് GPS അല്ല, നിങ്ങളുടെ നെറ്റ്‌വർക്കിൽ നിന്നാണ്, സാധാരണയായി ബ്രോഡ്‌ബാൻഡ് വിലാസം കാണിക്കും. കൃത്യമായ സ്ഥാനം 'Add location' വഴി നൽകുക.",
    youAreHere: "നിങ്ങളുടെ സ്ഥാനം",
    accuracyLabel: "~{m} മീ കൃത്യത",
  },
  bn: {
    sstLabel: "সমুদ্রপৃষ্ঠের তাপমাত্রা: {sst}°C",
    pfzScore: "উৎপাদনশীলতা স্কোর: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "আপনার অবস্থান থেকে ~{distance} কিমি",
    pfzNearestTitle: "নিকটতম সম্ভাব্য মৎস্য অঞ্চল",
    pfzOfPosition: "আপনার অবস্থান থেকে ~{distance} কিমি {bearing} দিকে",
    pfzConfidence: "নির্ভরযোগ্যতা: {confidence}",
    geofenceBuffer: "পরিচালন জিওফেন্স নৈকট্য বাফার",
    routeWave: "ঢেউ {wave}মি",
    roleOrigin: "শুরু",
    roleDestination: "গন্তব্য",
    roleBypass: "বাইপাস (বিপদ এড়ানো)",
    roleWaypoint: "ওয়েপয়েন্ট",
    windLabel: "বাতাস",
    directionLabel: "দিক",
    speedLabel: "গতি",
    noWindData: "বাতাসের তথ্য নেই",
    backToSector: "সেক্টরে ফিরুন",
    backToDevice: "আমার অবস্থান",
    locating: "খোঁজা হচ্ছে...",
    geoUnsupported: "এই ব্রাউজার অবস্থান সমর্থন করে না।",
    geoBlocked: "এই সাইটের জন্য অবস্থান ব্লক করা আছে। ব্রাউজার সেটিংসে অনুমতি দিয়ে আবার চেষ্টা করুন।",
    geoInsecure: "অবস্থানের জন্য HTTPS ঠিকানা প্রয়োজন। localhost এ খুলুন বা স্থানাঙ্ক লিখুন।",
    geoTimeout: "GPS অবস্থান পেতে সময় শেষ। আবার চেষ্টা করুন।",
    geoUnavailable: "এই ডিভাইস থেকে এখন অবস্থান পাওয়া যাচ্ছে না।",
    geoCoarse: "এই অবস্থান কেবল ~{km} কিমি পর্যন্ত নির্ভুল — এটি GPS নয়, আপনার নেটওয়ার্ক থেকে এসেছে, সাধারণত আপনার ব্রডব্যান্ড ঠিকানা দেখায়। সঠিক জায়গা 'Add location' দিয়ে নির্বাচন করুন।",
    youAreHere: "আপনার অবস্থান",
    accuracyLabel: "~{m} মি নির্ভুল",
  },
  gu: {
    sstLabel: "સમુદ્ર સપાટીનું તાપમાન: {sst}°C",
    pfzScore: "ઉત્પાદકતા સ્કોર: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "તમારા સ્થાનથી ~{distance} કિમી",
    pfzNearestTitle: "નજીકનું સંભવિત મત્સ્ય ક્ષેત્ર",
    pfzOfPosition: "તમારા સ્થાનથી ~{distance} કિમી {bearing} દિશામાં",
    pfzConfidence: "વિશ્વસનીયતા: {confidence}",
    geofenceBuffer: "પરિચાલન જિયોફેન્સ સામીપ્ય બફર",
    routeWave: "મોજું {wave}મી",
    roleOrigin: "શરૂઆત",
    roleDestination: "ગંતવ્ય",
    roleBypass: "બાયપાસ (જોખમ ટાળવું)",
    roleWaypoint: "વેપોઇન્ટ",
    windLabel: "પવન",
    directionLabel: "દિશા",
    speedLabel: "ઝડપ",
    noWindData: "પવન ડેટા ઉપલબ્ધ નથી",
    backToSector: "વિસ્તાર પર પાછા",
    backToDevice: "મારું સ્થાન",
    locating: "શોધી રહ્યું છે...",
    geoUnsupported: "આ બ્રાઉઝર સ્થાનને સમર્થન આપતું નથી.",
    geoBlocked: "આ સાઇટ માટે સ્થાન અવરોધિત છે. બ્રાઉઝર સેટિંગ્સમાં પરવાનગી આપી ફરી પ્રયાસ કરો.",
    geoInsecure: "સ્થાન માટે HTTPS સરનામું જરૂરી છે. localhost પર ખોલો અથવા કોઓર્ડિનેટ્સ દાખલ કરો.",
    geoTimeout: "GPS સ્થાન મેળવવામાં સમય પૂરો. ફરી પ્રયાસ કરો.",
    geoUnavailable: "આ ડિવાઇસમાંથી હાલમાં સ્થાન ઉપલબ્ધ નથી.",
    geoCoarse: "આ સ્થાન માત્ર ~{km} કિમી સુધી ચોક્કસ છે — તે GPS નહીં, તમારા નેટવર્કમાંથી આવ્યું છે, સામાન્ય રીતે તમારું બ્રોડબેન્ડ સરનામું બતાવે છે. ચોક્કસ સ્થાન 'Add location' થી પસંદ કરો.",
    youAreHere: "તમારું સ્થાન",
    accuracyLabel: "~{m} મી ચોકસાઈ",
  },
  mr: {
    sstLabel: "समुद्र पृष्ठभागाचे तापमान: {sst}°C",
    pfzScore: "उत्पादकता गुण: {score}",
    pfzSst: "SST: {sst}°C",
    pfzFrom: "तुमच्या स्थानापासून ~{distance} किमी",
    pfzNearestTitle: "सर्वात जवळचे संभाव्य मासेमारी क्षेत्र",
    pfzOfPosition: "तुमच्या स्थानापासून ~{distance} किमी {bearing} दिशेला",
    pfzConfidence: "विश्वासार्हता: {confidence}",
    geofenceBuffer: "कार्यान्वयन जिओफेन्स समीपता बफर",
    routeWave: "लाट {wave}मी",
    roleOrigin: "सुरुवात",
    roleDestination: "गंतव्य",
    roleBypass: "बायपास (धोका टाळणे)",
    roleWaypoint: "वेपॉइंट",
    windLabel: "वारा",
    directionLabel: "दिशा",
    speedLabel: "वेग",
    noWindData: "वाऱ्याचा डेटा उपलब्ध नाही",
    backToSector: "क्षेत्राकडे परत",
    backToDevice: "माझे स्थान",
    locating: "शोधत आहे...",
    geoUnsupported: "हा ब्राउझर स्थानाला समर्थन देत नाही.",
    geoBlocked: "या साइटसाठी स्थान अवरोधित आहे. ब्राउझर सेटिंग्जमध्ये परवानगी देऊन पुन्हा प्रयत्न करा.",
    geoInsecure: "स्थानासाठी HTTPS पत्ता आवश्यक आहे. localhost वर उघडा किंवा निर्देशांक प्रविष्ट करा.",
    geoTimeout: "GPS स्थान मिळवण्यात वेळ संपली. पुन्हा प्रयत्न करा.",
    geoUnavailable: "या डिव्हाइसवरून सध्या स्थान उपलब्ध नाही.",
    geoCoarse: "हे स्थान फक्त ~{km} किमी पर्यंत अचूक आहे — ते GPS नव्हे तर तुमच्या नेटवर्कमधून आले आहे, सहसा तुमचा ब्रॉडबँड पत्ता दाखवते. अचूक जागा 'Add location' मधून निवडा.",
    youAreHere: "तुमचे स्थान",
    accuracyLabel: "~{m} मी अचूकता",
  },
};

function mt(language: string | undefined, key: string, vars: Record<string, string | number> = {}) {
  const template = MAP_COPY[language ?? "en"]?.[key] ?? MAP_COPY.en[key] ?? key;
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, String(value)),
    template
  );
}

// Leaflet's default marker icon references image files by relative URL,
// which breaks under Next.js's bundler — divIcon with inline markup
// sidesteps that entirely and matches the app's existing emoji-style
// marker look (⚓ for the vessel, 🐟 for PFZ, etc.) instead of Leaflet's
// generic pin. A colour-matched glow ring (box-shadow, not filter — cheaper
// to composite for a canvas-heavy map) reads as more deliberate than a flat
// dot, and an optional CSS pulse (reusing the app's existing
// .animate-ping-subtle keyframe) calls out the vessel/zone markers the way
// the old decorative radar mock-up did, but now on a real map.
function markerIcon(emoji: string, background: string, size = 30, pulse = false) {
  const ring = pulse
    ? `<span class="animate-ping-subtle" style="position:absolute;inset:-6px;border-radius:9999px;background:${background};opacity:0.35;"></span>`
    : "";
  // The animation goes on this inner div, not the outer wrapper Leaflet
  // returns as the icon element — Leaflet positions markers with its own
  // `transform: translate3d(...)` inline style on that outer element, and
  // a CSS animation touching `transform` there would fight it and the
  // marker would render in the wrong place.
  return L.divIcon({
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        ${ring}
        <div class="orca-map-marker-in" style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:9999px;background:${background};border:2.5px solid white;box-shadow:0 0 0 4px ${background}26, 0 4px 10px rgba(0,0,0,0.45);font-size:${Math.round(size * 0.5)}px;">${emoji}</div>
      </div>
    `,
    className: "orca-map-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// Above this reported accuracy a fix cannot have come from GPS — it is a
// Wi-Fi or IP-address lookup, which points at where the connection is
// registered rather than where the device is.
const COARSE_FIX_M = 5000;

const vesselIcon = markerIcon("⚓", "#0ea5e9", 32, true);
// Distinct from the vessel/sector marker: this is where the device says the
// user physically is, not the sector being analysed.
const deviceIcon = markerIcon("📍", "#22d3ee", 30, true);
const pfzIcon = markerIcon("🐟", "#059669", 30, true);
const geofenceIcon = markerIcon("🛡️", "#d97706");
const waypointIcon = markerIcon("•", "#64748b", 18);

// SST comfort band consistent with the risk/synthesis agents' thresholds:
// cool water below it, favourable pelagic range in the middle, warm above.
function sstColor(sst: number) {
  if (sst < 24) return "#0ea5e9";
  if (sst <= 30.5) return "#22c55e";
  return "#f97316";
}

function confidenceRadiusM(confidence: string) {
  if (confidence === "HIGH") return 6000;
  if (confidence === "LOW") return 16000;
  return 10000;
}

// Score is roughly 0-100 (SST band + thermal-front gradient + chlorophyll
// bonus from pfz_agent) — green reads as a strong productivity signal,
// amber moderate, slate weak, so the whole grid reads like a heat layer
// instead of one isolated pin with no context for why it won.
function pfzScoreColor(score: number) {
  if (score >= 65) return "#16a34a";
  if (score >= 45) return "#eab308";
  return "#64748b";
}

// Tracks the app's theme-light toggle (a class on <html>, flipped in
// page.tsx) so the basemap can switch between a CartoDB dark and light
// style instead of the app staying dark-themed but the map staying a
// jarring plain-white OSM sheet, or vice versa.
function useIsLightTheme() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsLight(root.classList.contains("theme-light"));
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}

// A distance scale bar reads as basic cartographic due-diligence on any
// professional map — Leaflet ships one, but only as an imperative control,
// not a react-leaflet component.
//
// Sits bottom-right: the dashboard's telemetry HUD occupies the bottom-left
// corner and was covering the bar entirely.
function ScaleControl() {
  const map = useMap();

  useEffect(() => {
    const control = L.control.scale({
      metric: true,
      // Google shows one bar, not a stacked metric/imperial pair.
      imperial: false,
      position: "bottomright",
      maxWidth: 120,
    });
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}

type Basemap = "standard" | "satellite" | "terrain" | "ocean";

const BASEMAP_OPTIONS: Array<{ id: Basemap; label: string }> = [
  { id: "standard", label: "Standard" },
  { id: "satellite", label: "Satellite" },
  { id: "terrain", label: "Terrain" },
  { id: "ocean", label: "Ocean depth" },
];

// Base-map switcher, in the bottom-left corner the way general-purpose maps
// place theirs. Distinct from the toolbar above the map, which toggles the
// data *overlays* (PFZ, SST, wind, geofence) rather than the map underneath.
function BasemapControl({
  basemap,
  setBasemap,
  disabled,
}: {
  basemap: Basemap;
  setBasemap: (b: Basemap) => void;
  disabled: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    L.DomEvent.disableClickPropagation(wrapRef.current);
    L.DomEvent.disableScrollPropagation(wrapRef.current);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="orca-basemap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="orca-basemap-toggle"
        title="Map layers"
      >
        <span aria-hidden="true">▤</span>
        <span className="orca-basemap-toggle-label">Layers</span>
      </button>

      {open && (
        <div className="orca-basemap-menu">
          {BASEMAP_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setBasemap(opt.id);
                setOpen(false);
              }}
              className={`orca-basemap-item ${basemap === opt.id && !disabled ? "is-active" : ""}`}
            >
              {opt.label}
            </button>
          ))}

          {disabled && (
            <p className="orca-basemap-note">
              The bathymetry overlay is using the ocean basemap. Switch that overlay off
              to change the map underneath.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// "Recentre" controls. Rendered as ordinary DOM inside the map container
// rather than as Leaflet controls so they can be styled with the same
// Tailwind vocabulary as the rest of the console; click/scroll propagation
// has to be stopped by hand or the buttons would also pan and zoom the map
// underneath them.
function MapRecenterControls({
  center,
  language,
  onLocated,
  onLocateMe,
}: {
  center: { lat: number; lon: number; name: string };
  language?: string;
  onLocated: (fix: { latitude: number; longitude: number; accuracyM: number } | null) => void;
  onLocateMe?: MarineMapProps["onLocateMe"];
}) {
  const map = useMap();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    L.DomEvent.disableClickPropagation(wrapRef.current);
    L.DomEvent.disableScrollPropagation(wrapRef.current);
  }, []);

  const backToSector = () => {
    map.flyTo([center.lat, center.lon], 9, { duration: 0.6 });
  };

  const backToDevice = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError(mt(language, "geoUnsupported"));
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);

        const fix = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
        };

        // A fix this coarse did not come from GPS. On a desktop with no GPS
        // radio the browser falls back to Wi-Fi lookup and then to the IP
        // address, and an IP fix resolves to wherever the connection is
        // registered — typically the user's broadband address or their
        // ISP's city centre, not where they are standing. Say so rather
        // than presenting it as a real position.
        if (pos.coords.accuracy > COARSE_FIX_M) {
          setGeoError(mt(language, "geoCoarse", { km: Math.round(pos.coords.accuracy / 1000) }));
        }

        // Mark the exact fix (plus its accuracy radius) and zoom to a level
        // that matches how precise it actually is — a 30 m urban fix earns
        // street zoom, a 5 km cell-tower fix does not.
        onLocated(fix);

        const zoom = pos.coords.accuracy <= 100 ? 15 : pos.coords.accuracy <= 1000 ? 13 : 11;
        map.flyTo([fix.latitude, fix.longitude], zoom, { duration: 0.8 });

        onLocateMe?.(fix);
      },
      (err) => {
        setLocating(false);
        onLocated(null);

        // Distinguish the three failures, because the fix differs for each:
        // a denied permission has to be re-granted in the browser's own site
        // settings (re-asking never re-prompts once denied), while an
        // unavailable/timed-out fix is worth simply retrying.
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError(
            window.isSecureContext
              ? mt(language, "geoBlocked")
              : mt(language, "geoInsecure"),
          );
        } else if (err.code === err.TIMEOUT) {
          setGeoError(mt(language, "geoTimeout"));
        } else {
          setGeoError(mt(language, "geoUnavailable"));
        }
      },
      // maximumAge:0 is deliberate. With any cache window the browser is
      // free to hand back a stored position without re-measuring, which is
      // how "my location" ends up reporting somewhere the user was earlier
      // (typically home) rather than where they are now. Forcing a fresh
      // fix costs a few seconds, hence the longer timeout: a short one
      // makes the browser give up on GPS/Wi-Fi and settle for a coarse
      // IP-derived estimate.
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  };

  return (
    <div ref={wrapRef} className="orca-map-controls">
      <button type="button" onClick={backToSector} className="orca-map-btn" title={mt(language, "backToSector")}>
        <span className="orca-map-btn-icon" aria-hidden="true">◎</span>
        <span className="orca-map-btn-label">{mt(language, "backToSector")}</span>
      </button>

      <button
        type="button"
        onClick={backToDevice}
        disabled={locating}
        className="orca-map-btn"
        title={mt(language, "backToDevice")}
      >
        <span className={`orca-map-btn-icon ${locating ? "orca-map-btn-spin" : ""}`} aria-hidden="true">➤</span>
        <span className="orca-map-btn-label">
          {locating ? mt(language, "locating") : mt(language, "backToDevice")}
        </span>
      </button>

      {geoError && <p className="orca-map-geo-error">{geoError}</p>}
    </div>
  );
}

// react-leaflet only reads `center`/`zoom` on first mount — re-panning
// when the resolved location changes (new query, carried-forward
// location, etc.) needs an explicit `setView` via the map instance.
function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);

  return null;
}

// The full static MPA/restricted-zone list (not just whichever one the
// current query happens to sit inside) so the geofence layer gives real
// situational awareness — "what's nearby" — instead of only lighting up
// when you're already inside a zone.
function useAllZones() {
  const [zones, setZones] = useState<{ mpa: MapZone[]; restricted: MapZone[] }>({ mpa: [], restricted: [] });

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/zones`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.success) return;
        setZones({
          mpa: data.marine_protected_areas ?? [],
          restricted: data.restricted_zones ?? [],
        });
      })
      .catch(() => {
        // Geofence layer just shows the currently-detected zone (if any)
        // instead of the full list — not worth surfacing a fetch error for.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return zones;
}

type WindGridLayer = {
  header: Record<string, number | string>;
  data: number[];
};

// Live u/v wind-component grid around the current map center, fetched
// only while the wind layer is actually selected (it's a ~64-point
// batched request — no point paying for it on other layers).
function useWindGrid(active: boolean, lat: number, lon: number) {
  const [grid, setGrid] = useState<WindGridLayer[] | null>(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    fetch(`${API_BASE}/api/wind-grid?latitude=${lat}&longitude=${lon}&span_deg=3.0`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.success) return;
        setGrid(data.grid);
      })
      .catch(() => {
        // Falls back to no animated field — the layer still renders the
        // base map, it just won't show flow lines until this succeeds.
      });

    return () => {
      cancelled = true;
    };
  }, [active, lat, lon]);

  return grid;
}

// Renders the animated wind flow field via the leaflet-velocity plugin,
// which isn't a react-leaflet component — it attaches an imperative
// canvas layer directly to the underlying Leaflet map instance.
function WindVelocityLayer({ grid, language }: { grid: WindGridLayer[] | null; language?: string }) {
  const map = useMap();

  useEffect(() => {
    if (!grid) return;

    // @ts-expect-error - leaflet-velocity has no type declarations; it
    // extends the global L namespace at runtime (see the top-of-file
    // require()).
    const layer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: mt(language, "windLabel"),
        // Bottom-right, stacked above the scale bar: the top-right corner
        // belongs to the recentre buttons, and this readout would sit
        // underneath them.
        position: "bottomright",
        emptyString: mt(language, "noWindData"),
        directionString: mt(language, "directionLabel"),
        speedString: mt(language, "speedLabel"),
        angleConvention: "bearingCW",
        speedUnit: "k/h",
      },
      data: grid,
      // Coastal Indian winds sit mostly in the 0-20 m/s band; keeping the
      // ramp there uses the whole colour range instead of leaving every
      // reading stuck at the cold end.
      minVelocity: 0,
      maxVelocity: 20,
      // Particle tuning. The defaults draw a sparse, fast, hair-thin
      // scatter that reads as noise at dashboard size; a denser, slower,
      // slightly thicker field reads as an actual flow field.
      velocityScale: 0.008,
      particleMultiplier: 1 / 220,
      particleAge: 70,
      lineWidth: 1.6,
      frameRate: 18,
      // Perceptually ordered cool -> warm ramp, so "faster" is legible
      // from the colour alone rather than only from particle motion.
      colorScale: [
        "#67e8f9",
        "#38bdf8",
        "#4ade80",
        "#a3e635",
        "#facc15",
        "#fb923c",
        "#f87171",
        "#ef4444",
      ],
    });

    layer.addTo(map);

    return () => {
      // Next.js dev-mode Fast Refresh can remount this component while
      // the plugin's own internal animation frame / timers are still
      // in flight; the plugin's teardown then reaches into a Leaflet
      // map instance that's already been torn down and throws. Since
      // this only happens mid hot-reload (not in a built app) and the
      // layer is being discarded either way, swallow it rather than
      // let it crash the console.
      try {
        // @ts-expect-error - Leaflet's internal "is this map still live"
        // flag isn't part of its public types.
        if (map._loaded) {
          map.removeLayer(layer);
        }
      } catch {
        // Layer/map already torn down — nothing left to clean up.
      }
    };
  }, [grid, map, language]);

  return null;
}

// PFZ used to arrive only as a by-product of asking about fishing in the
// chat, so selecting the PFZ layer on a fresh page showed an empty sea.
// The layer now fetches for itself, and defers to whatever the
// conversation already produced rather than duplicating the call.
function usePfzLayer(
  active: boolean,
  lat: number,
  lon: number,
  fromChat: MarineMapProps["pfz"],
) {
  const [fetched, setFetched] = useState<MarineMapProps["pfz"]>(null);

  useEffect(() => {
    if (!active || fromChat) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    fetch(`${API_BASE}/api/pfz?latitude=${lat}&longitude=${lon}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((body) => {
        if (cancelled || !body?.success) return;
        const data = body.data ?? {};
        const zone = data.nearest_zone ?? data.nearestZone;
        const candidates = data.candidates ?? [];
        if (!zone) return;

        setFetched({
          nearestZone: {
            latitude: zone.latitude,
            longitude: zone.longitude,
            distance_km: zone.distance_km,
            bearing_compass: zone.bearing_compass ?? "",
            confidence: zone.confidence ?? "MODERATE",
          },
          candidates,
        });
      })
      .catch(() => {
        // Layer just stays empty; the chat can still populate it.
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [active, lat, lon, fromChat]);

  return fromChat ?? fetched;
}

// Productivity rendered as a continuous heat field rather than one circle
// per sampled grid point. The dots showed exactly where the model happened
// to sample, which reads as false precision — a fisherman is not being told
// "fish are in this 4.5km disc", they are being told this stretch of water
// looks better than that one. A blended field says that honestly.
function PfzHeatLayer({
  candidates,
}: {
  candidates: Array<{ latitude: number; longitude: number; score: number }>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!candidates || candidates.length === 0) return;

    const scores = candidates.map((c) => c.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const span = max - min || 1;

    // Normalise to 0-1 across the actual spread, so a field where every
    // point scores 55-65 still shows its structure instead of rendering
    // uniformly warm.
    const points = candidates.map((c) => [
      c.latitude,
      c.longitude,
      0.25 + 0.75 * ((c.score - min) / span),
    ]);

    // @ts-expect-error - leaflet.heat has no type declarations; it extends
    // the global L namespace at runtime (see the require() at top of file).
    const layer = L.heatLayer(points, {
      // Tuned against the dark basemap: the default radius/opacity render
      // as a barely-visible smudge on it.
      radius: 55,
      blur: 40,
      maxZoom: 11,
      minOpacity: 0.45,
      gradient: {
        0.0: "#0e7490",
        0.3: "#0891b2",
        0.5: "#22c55e",
        0.7: "#eab308",
        0.85: "#f97316",
        1.0: "#ef4444",
      },
    });

    layer.addTo(map);

    return () => {
      try {
        // @ts-expect-error - Leaflet's internal "still alive" flag is not
        // part of its public types.
        if (map._loaded) map.removeLayer(layer);
      } catch {
        // Map already torn down.
      }
    };
  }, [candidates, map]);

  return null;
}

export default function MarineMap({ center, activeLayer, marine, pfz, geo, route, language, onLocateMe }: MarineMapProps) {
  const restrictedZone = geo?.restrictedZone;
  const mpaZone = geo?.mpaZone;
  const allZones = useAllZones();
  const isLight = useIsLightTheme();

  // The device's own GPS fix, kept separate from `center` (the sector under
  // analysis) so the map can show both at once — where you are, and where
  // the agents are reporting on.
  const [deviceFix, setDeviceFix] = useState<{
    latitude: number;
    longitude: number;
    accuracyM: number;
  } | null>(null);

  // User's chosen base map, independent of the data overlays.
  const [basemap, setBasemap] = useState<Basemap>("standard");


  const windGrid = useWindGrid(activeLayer === "wind", center.lat, center.lon);
  const pfzLayer = usePfzLayer(activeLayer === "pfz", center.lat, center.lon, pfz);

  const isBathymetry = activeLayer === "bathymetry";

  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={9}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
      // Web Mercator tiles repeat horizontally forever by default, so
      // panning east/west used to reveal copy after copy of India. `noWrap`
      // on the tile layers is what actually stops that — the map only ever
      // requests tiles from a single world.
      //
      // A `maxBounds` of the whole world was tried here as well and had to
      // come out: with it set, Leaflet refused to zoom out past ~z6 (the
      // zoom-out button stayed enabled but the view snapped straight back),
      // which is a worse bug than the one it was guarding against.
      worldCopyJump={false}
      minZoom={3}
      maxZoom={17}
    >
      {/* Base map. `basemap` is the user's own choice from the layers
          control; the bathymetry *overlay* layer still forces the ocean
          basemap, since depth shading is the whole point of that view. */}
      {(() => {
        const effective = isBathymetry ? "ocean" : basemap;

        if (effective === "satellite") {
          return (
            <TileLayer
              key="satellite"
              attribution="Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              noWrap
            />
          );
        }

        if (effective === "terrain") {
          return (
            <TileLayer
              key="terrain"
              attribution="Tiles &copy; Esri — Esri, DeLorme, NAVTEQ, USGS, NOAA"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              noWrap
            />
          );
        }

        if (effective === "ocean") {
          // Esri's public Ocean basemap — real depth-shaded bathymetric
          // tiles, no API key required. Standard basemaps carry no
          // ocean-depth shading at all.
          return (
            <TileLayer
              key="ocean"
              attribution="Sources: Esri, GEBCO, NOAA, National Geographic, DeLorme, HERE, Geonames.org, and other contributors"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
              noWrap
            />
          );
        }

        // CARTO's free basemaps (light_all/dark_all) started watermarking
        // "API KEY REQUIRED" for real browser traffic even though direct
        // fetches still returned clean tiles — the anonymous tier is no
        // longer reliable without a CARTO account. Standard OpenStreetMap
        // tiles are the one raster source with a genuinely durable no-auth
        // free policy, so use those for both themes, and fake a dark
        // basemap with a CSS invert filter (a well-worn technique) instead
        // of depending on a second tile provider for dark mode.
        return (
          <TileLayer
            key="standard"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className={isLight ? undefined : "orca-tile-dark"}
            noWrap
          />
        );
      })()}

      <ScaleControl />
      <BasemapControl basemap={basemap} setBasemap={setBasemap} disabled={isBathymetry} />
      <MapRecenterControls
        center={center}
        language={language}
        onLocated={setDeviceFix}
        onLocateMe={onLocateMe}
      />
      <Recenter lat={center.lat} lon={center.lon} />

      {/* Exact device position: a precise point plus the accuracy radius the
          GPS actually reported, so the fix is never shown as more certain
          than it is. */}
      {deviceFix && (
        <>
          <Circle
            center={[deviceFix.latitude, deviceFix.longitude]}
            radius={Math.max(deviceFix.accuracyM, 25)}
            pathOptions={{ color: "#38bdf8", weight: 1, fillColor: "#38bdf8", fillOpacity: 0.12 }}
          />
          <Marker position={[deviceFix.latitude, deviceFix.longitude]} icon={deviceIcon}>
            <Popup>
              <strong>{mt(language, "youAreHere")}</strong>
              <br />
              {deviceFix.latitude.toFixed(5)}°, {deviceFix.longitude.toFixed(5)}°
              <br />
              {mt(language, "accuracyLabel", { m: Math.round(deviceFix.accuracyM) })}
            </Popup>
          </Marker>
        </>
      )}

      <Marker position={[center.lat, center.lon]} icon={vesselIcon}>
        <Popup>{center.name}</Popup>
      </Marker>

      {activeLayer === "thermal" && marine?.sst != null && (
        <>
          {/* Three fading rings instead of one flat circle, so the layer
              reads as a thermal gradient radiating from the reading point
              rather than a single hard-edged disc. */}
          {[1, 0.66, 0.35].map((scale, index) => (
            <Circle
              key={index}
              center={[center.lat, center.lon]}
              radius={20000 * scale}
              pathOptions={{
                color: sstColor(marine.sst as number),
                weight: index === 0 ? 1 : 0,
                fillColor: sstColor(marine.sst as number),
                fillOpacity: 0.22 - index * 0.06,
              }}
            >
              {index === 0 && <Popup>{mt(language, "sstLabel", { sst: marine.sst as number })}</Popup>}
            </Circle>
          ))}
        </>
      )}

      {activeLayer === "wind" && <WindVelocityLayer grid={windGrid} language={language} />}

      {activeLayer === "pfz" && pfzLayer && (
        <>
          {/* Continuous field rather than a dot per sampled point: the grid
              is where the model happened to sample, not where the fish are,
              and drawing discs implied a precision the estimate does not
              have. */}
          <PfzHeatLayer candidates={pfzLayer.candidates} />

          <Circle
            center={[pfzLayer.nearestZone.latitude, pfzLayer.nearestZone.longitude]}
            radius={confidenceRadiusM(pfzLayer.nearestZone.confidence)}
            pathOptions={{ color: "#059669", fillColor: "#059669", fillOpacity: 0.1, dashArray: "4 5" }}
          />
          <Marker position={[pfzLayer.nearestZone.latitude, pfzLayer.nearestZone.longitude]} icon={pfzIcon}>
            <Popup>
              {mt(language, "pfzNearestTitle")}
              <br />
              {mt(language, "pfzOfPosition", {
                distance: pfzLayer.nearestZone.distance_km,
                bearing: pfzLayer.nearestZone.bearing_compass,
              })}
              <br />
              {mt(language, "pfzConfidence", { confidence: pfzLayer.nearestZone.confidence })}
            </Popup>
          </Marker>
        </>
      )}

      {activeLayer === "geofence" && (
        <>
          {allZones.mpa.map((zone) => {
            const isActive = zone.name === mpaZone?.name;
            return (
              <Rectangle
                key={zone.name}
                bounds={[
                  [zone.min_lat, zone.min_lon],
                  [zone.max_lat, zone.max_lon],
                ]}
                pathOptions={{
                  color: "#d97706",
                  fillColor: "#d97706",
                  fillOpacity: isActive ? 0.28 : 0.08,
                  weight: isActive ? 2 : 1,
                }}
              >
                <Popup>
                  {zone.name}
                  <br />
                  {zone.type}
                </Popup>
              </Rectangle>
            );
          })}

          {allZones.restricted.map((zone) => {
            const isActive = zone.name === restrictedZone?.name;
            return (
              <Rectangle
                key={zone.name}
                bounds={[
                  [zone.min_lat, zone.min_lon],
                  [zone.max_lat, zone.max_lon],
                ]}
                pathOptions={{
                  color: "#f43f5e",
                  fillColor: "#f43f5e",
                  fillOpacity: isActive ? 0.28 : 0.08,
                  weight: isActive ? 2 : 1,
                }}
              >
                <Popup>
                  {zone.name}
                  <br />
                  {zone.type}
                </Popup>
              </Rectangle>
            );
          })}

          {geo?.geofenceTriggered && (
            <Circle
              center={[center.lat, center.lon]}
              radius={(geo.geofenceDistanceKm ?? 25) * 1000}
              pathOptions={{ color: "#d97706", dashArray: "6 6", fillOpacity: 0 }}
            >
              <Marker position={[center.lat, center.lon]} icon={geofenceIcon}>
                <Popup>{mt(language, "geofenceBuffer")}</Popup>
              </Marker>
            </Circle>
          )}
        </>
      )}

      {route && route.waypoints.length > 1 && (
        <>
          <Polyline
            positions={route.waypoints.map((point) => [point.latitude, point.longitude])}
            pathOptions={{
              color: "#38bdf8",
              weight: 3,
              // The hazard-route dashArray ("8 6") and the draw-in reveal
              // both work by animating stroke-dasharray/-dashoffset, so
              // they can't be combined without one undoing the other —
              // only animate the reveal for a plain (non-hazard) route,
              // where CSS setting stroke-dasharray itself is safe.
              dashArray: route.hazardsAvoided.length ? "8 6" : undefined,
              className: route.hazardsAvoided.length ? undefined : "orca-route-line",
            }}
          />
          {route.waypoints.map((point) => (
            <Marker
              key={point.sequence}
              position={[point.latitude, point.longitude]}
              icon={point.role === "bypass" ? geofenceIcon : point.role === "origin" || point.role === "destination" ? vesselIcon : waypointIcon}
            >
              <Popup>
                {mt(language, `role${point.role.charAt(0).toUpperCase()}${point.role.slice(1)}`)}
                {point.wave_height_m != null ? ` — ${mt(language, "routeWave", { wave: point.wave_height_m })}` : ""}
              </Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  );
}
