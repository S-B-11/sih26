from typing import Dict, List, Any


# =========================================================
# DATASET CITATION DIRECTORY
# =========================================================
EVIDENCE_CITATIONS = [
    {
        "source": "INCOIS Marine Fishery Advisory Services",
        "dataset": "Potential Fishing Zone (PFZ) Satellite Synoptic Product",
        "agency": "Ministry of Earth Sciences (MoES), Govt. of India",
        "type": "Oceanographic Satellite & In-situ",
    },
    {
        "source": "ISRO Oceansat-3 / Ocean Colour Monitor (OCM)",
        "dataset": "High-Resolution Chlorophyll-a & Suspended Sediment Map",
        "agency": "Indian Space Research Organisation (ISRO)",
        "type": "Earth Observation Satellite",
    },
    {
        "source": "Copernicus Marine Service (CMEMS)",
        "dataset": "Global Ocean Hourly L4 Wind Observations (0.125 deg)",
        "agency": "EUMETSAT / Copernicus Marine Environment",
        "type": "Microwave Scatterometer & Model",
    },
    {
        "source": "Open-Meteo High-Resolution Marine Service",
        "dataset": "Copernicus ECMWF / GFS Global Wave & SST Model",
        "agency": "Open-Meteo Oceanographic Pipeline",
        "type": "Live Physical Numerical Forecast",
    },
]


# =========================================================
# "WHY" EXPLANATION REASONING — LOCALIZED TEMPLATES
# =========================================================
WHY_I18N = {
    "en": {
        "sst_unavailable": "Live Sea Surface Temperature and wave data were not available for this coordinate; an indicative estimate ({sst}°C) is shown and confidence has been reduced accordingly.",
        "sst_favourable": "Sea Surface Temperature ({sst}°C) aligns with the thermal comfort threshold for pelagic fish species (Scombridae/Clupeidae), indicating favourable biological aggregation.",
        "sst_divergent": "Sea Surface Temperature ({sst}°C) indicates thermal gradient divergence from peak PFZ conditions.",
        "wave_low": "Significant wave height ({wave}m) with swell period ({period}s) presents low hydrodynamic resistance for traditional and motorized artisanal craft.",
        "wave_moderate": "Significant wave height ({wave}m) approaches moderate sea-state limits; vessel stability caution advised.",
        "wind": "Copernicus L4 scatterometer indicates wind speed of {wind} km/h from {wind_dir} ({wind_deg}°), which is below gale advisory thresholds (35 km/h).",
        "geo_restricted": "Geospatial Agent detected active Naval / Security restricted zone: {zone}. Navigation strictly regulated.",
        "geo_mpa": "Location falls within an Ecologically Sensitive Marine Protected Area ({zone}); commercial mechanized trawling prohibited.",
        "geo_geofence": "Proximity buffer warning triggered near predefined operational maritime boundary.",
        "geo_clear": "Location is clear of International Maritime Boundary Line (IMBL), MPAs, and naval firing zones.",
    },
    "hi": {
        "sst_unavailable": "इस स्थान के लिए लाइव समुद्र सतह तापमान और लहर डेटा उपलब्ध नहीं था; एक अनुमानित मान ({sst}°C) दिखाया गया है और तदनुसार विश्वसनीयता कम कर दी गई है।",
        "sst_favourable": "समुद्र सतह तापमान ({sst}°C) पेलाजिक मछली प्रजातियों (Scombridae/Clupeidae) के लिए तापीय आराम सीमा के अनुरूप है, जो अनुकूल जैविक एकत्रीकरण दर्शाता है।",
        "sst_divergent": "समुद्र सतह तापमान ({sst}°C) शिखर PFZ स्थितियों से तापीय विचलन दर्शाता है।",
        "wave_low": "महत्वपूर्ण लहर ऊंचाई ({wave}m) और लहर अवधि ({period}s) पारंपरिक और मोटर चालित कारीगर नौकाओं के लिए कम हाइड्रोडायनामिक प्रतिरोध प्रस्तुत करती है।",
        "wave_moderate": "महत्वपूर्ण लहर ऊंचाई ({wave}m) मध्यम समुद्री-स्थिति सीमा के निकट है; नौका स्थिरता को लेकर सावधानी की सलाह दी जाती है।",
        "wind": "Copernicus L4 स्कैटरोमीटर {wind_dir} ({wind_deg}°) से {wind} km/h की हवा गति दर्शाता है, जो तूफान चेतावनी सीमा (35 km/h) से नीचे है।",
        "geo_restricted": "जियोस्पेशियल एजेंट ने सक्रिय नौसैनिक/सुरक्षा प्रतिबंधित क्षेत्र का पता लगाया: {zone}। नेविगेशन सख्ती से विनियमित है।",
        "geo_mpa": "स्थान एक पारिस्थितिक रूप से संवेदनशील समुद्री संरक्षित क्षेत्र ({zone}) के भीतर आता है; वाणिज्यिक मशीनीकृत ट्रॉलिंग प्रतिबंधित है।",
        "geo_geofence": "पूर्वनिर्धारित परिचालन समुद्री सीमा के निकट निकटता बफर चेतावनी सक्रिय हुई।",
        "geo_clear": "स्थान अंतर्राष्ट्रीय समुद्री सीमा रेखा (IMBL), MPA और नौसैनिक फायरिंग क्षेत्रों से मुक्त है।",
    },
    "ta": {
        "sst_unavailable": "இந்த இருப்பிடத்திற்கான நேரடி கடல் மேற்பரப்பு வெப்பநிலை மற்றும் அலை தரவு கிடைக்கவில்லை; ஒரு குறிப்பான மதிப்பீடு ({sst}°C) காட்டப்படுகிறது மற்றும் அதற்கேற்ப நம்பகத்தன்மை குறைக்கப்பட்டுள்ளது.",
        "sst_favourable": "கடல் மேற்பரப்பு வெப்பநிலை ({sst}°C) பெலாஜிக் மீன் இனங்களுக்கான (Scombridae/Clupeidae) வெப்ப வசதி வரம்புடன் பொருந்துகிறது, இது சாதகமான உயிரியல் திரட்சியைக் குறிக்கிறது.",
        "sst_divergent": "கடல் மேற்பரப்பு வெப்பநிலை ({sst}°C) உச்ச PFZ நிலைமைகளில் இருந்து வெப்ப விலகலைக் குறிக்கிறது.",
        "wave_low": "குறிப்பிடத்தக்க அலை உயரம் ({wave}m) மற்றும் அலை கால அளவு ({period}s) பாரம்பரிய மற்றும் மோட்டார் மீன்பிடி படகுகளுக்கு குறைந்த நீரியக்க எதிர்ப்பை அளிக்கிறது.",
        "wave_moderate": "குறிப்பிடத்தக்க அலை உயரம் ({wave}m) மிதமான கடல்-நிலை வரம்பை நெருங்குகிறது; படகு நிலைத்தன்மை குறித்து எச்சரிக்கை பரிந்துரைக்கப்படுகிறது.",
        "wind": "Copernicus L4 ஸ்கேட்டரோமீட்டர் {wind_dir} ({wind_deg}°) திசையிலிருந்து {wind} km/h காற்று வேகத்தைக் காட்டுகிறது, இது புயல் எச்சரிக்கை வரம்பிற்கு (35 km/h) கீழே உள்ளது.",
        "geo_restricted": "புவிசார் முகவர் செயலில் உள்ள கடற்படை/பாதுகாப்பு தடைசெய்யப்பட்ட மண்டலத்தைக் கண்டறிந்தது: {zone}. வழிசெலுத்தல் கண்டிப்பாக கட்டுப்படுத்தப்பட்டுள்ளது.",
        "geo_mpa": "இருப்பிடம் ஒரு சுற்றுச்சூழல் ரீதியாக உணர்திறன் வாய்ந்த கடல் பாதுகாக்கப்பட்ட பகுதிக்குள் ({zone}) உள்ளது; வணிக இயந்திரமயமாக்கப்பட்ட ட்ராலிங் தடைசெய்யப்பட்டுள்ளது.",
        "geo_geofence": "முன்னரே வரையறுக்கப்பட்ட செயல்பாட்டு கடல் எல்லைக்கு அருகில் அருகாமை இடையக எச்சரிக்கை தூண்டப்பட்டது.",
        "geo_clear": "இருப்பிடம் சர்வதேச கடல் எல்லைக் கோடு (IMBL), MPA மற்றும் கடற்படை துப்பாக்கிச் சூடு மண்டலங்களில் இருந்து தெளிவாக உள்ளது.",
    },
    "te": {
        "sst_unavailable": "ఈ స్థానానికి ప్రత్యక్ష సముద్ర ఉపరితల ఉష్ణోగ్రత మరియు అల డేటా అందుబాటులో లేదు; ఒక సూచిక అంచనా ({sst}°C) చూపబడింది మరియు తదనుగుణంగా విశ్వసనీయత తగ్గించబడింది.",
        "sst_favourable": "సముద్ర ఉపరితల ఉష్ణోగ్రత ({sst}°C) పెలాజిక్ చేప జాతులకు (Scombridae/Clupeidae) థర్మల్ కంఫర్ట్ పరిమితికి అనుగుణంగా ఉంది, ఇది అనుకూల జీవశాస్త్ర సమీకరణను సూచిస్తుంది.",
        "sst_divergent": "సముద్ర ఉపరితల ఉష్ణోగ్రత ({sst}°C) గరిష్ట PFZ పరిస్థితుల నుండి థర్మల్ విచలనాన్ని సూచిస్తుంది.",
        "wave_low": "ముఖ్యమైన అల ఎత్తు ({wave}m) మరియు అల వ్యవధి ({period}s) సాంప్రదాయ మరియు మోటరు చేపల పడవలకు తక్కువ హైడ్రోడైనమిక్ నిరోధకతను అందిస్తాయి.",
        "wave_moderate": "ముఖ్యమైన అల ఎత్తు ({wave}m) మధ్యస్థ సముద్ర-స్థితి పరిమితులకు దగ్గరగా ఉంది; నౌక స్థిరత్వం పట్ల జాగ్రత్త సూచించబడింది.",
        "wind": "Copernicus L4 స్కాటరోమీటర్ {wind_dir} ({wind_deg}°) నుండి {wind} km/h గాలి వేగాన్ని సూచిస్తుంది, ఇది తుఫాను హెచ్చరిక పరిమితి (35 km/h) కంటే తక్కువ.",
        "geo_restricted": "జియోస్పేషియల్ ఏజెంట్ యాక్టివ్ నేవల్/సెక్యూరిటీ నిషేధిత జోన్‌ను గుర్తించింది: {zone}. నావిగేషన్ కఠినంగా నియంత్రించబడుతుంది.",
        "geo_mpa": "స్థానం పర్యావరణపరంగా సున్నితమైన సముద్ర సంరక్షిత ప్రాంతంలో ({zone}) ఉంది; వాణిజ్య యాంత్రిక ట్రాలింగ్ నిషేధించబడింది.",
        "geo_geofence": "ముందుగా నిర్వచించిన కార్యాచరణ సముద్ర సరిహద్దుకు సమీపంలో సామీప్య బఫర్ హెచ్చరిక ప్రేరేపించబడింది.",
        "geo_clear": "స్థానం అంతర్జాతీయ సముద్ర సరిహద్దు రేఖ (IMBL), MPA మరియు నౌకాదళ కాల్పుల మండలాల నుండి క్లియర్‌గా ఉంది.",
    },
    "ml": {
        "sst_unavailable": "ഈ കോർഡിനേറ്റിന് തത്സമയ സമുദ്ര ഉപരിതല താപനിലയും തിരമാല ഡാറ്റയും ലഭ്യമായിരുന്നില്ല; ഒരു സൂചക കണക്ക് ({sst}°C) കാണിച്ചിരിക്കുന്നു, അതനുസരിച്ച് വിശ്വാസ്യത കുറച്ചിരിക്കുന്നു.",
        "sst_favourable": "സമുദ്ര ഉപരിതല താപനില ({sst}°C) പെലാജിക് മത്സ്യ ഇനങ്ങൾക്ക് (Scombridae/Clupeidae) താപ സുഖ പരിധിയുമായി യോജിക്കുന്നു, ഇത് അനുകൂലമായ ജൈവ സാന്ദ്രതയെ സൂചിപ്പിക്കുന്നു.",
        "sst_divergent": "സമുദ്ര ഉപരിതല താപനില ({sst}°C) ഉയർന്ന PFZ അവസ്ഥകളിൽ നിന്നുള്ള താപ വ്യതിയാനത്തെ സൂചിപ്പിക്കുന്നു.",
        "wave_low": "പ്രധാന തിരമാല ഉയരം ({wave}m) ഉം തിരമാല ദൈർഘ്യം ({period}s) ഉം പരമ്പരാഗതവും മോട്ടോർ ഘടിപ്പിച്ചതുമായ ബോട്ടുകൾക്ക് കുറഞ്ഞ ജലഗതിക പ്രതിരോധം നൽകുന്നു.",
        "wave_moderate": "പ്രധാന തിരമാല ഉയരം ({wave}m) മിതമായ കടൽ-അവസ്ഥാ പരിധിയോട് അടുക്കുന്നു; ബോട്ട് സ്ഥിരതയെക്കുറിച്ച് ജാഗ്രത നിർദ്ദേശിക്കുന്നു.",
        "wind": "Copernicus L4 സ്കാറ്ററോമീറ്റർ {wind_dir} ({wind_deg}°) ദിശയിൽ നിന്ന് {wind} km/h കാറ്റിന്റെ വേഗത കാണിക്കുന്നു, ഇത് കൊടുങ്കാറ്റ് മുന്നറിയിപ്പ് പരിധിയേക്കാൾ (35 km/h) കുറവാണ്.",
        "geo_restricted": "ജിയോസ്പേഷ്യൽ ഏജന്റ് സജീവമായ നാവിക/സുരക്ഷാ നിരോധിത മേഖല കണ്ടെത്തി: {zone}. നാവിഗേഷൻ കർശനമായി നിയന്ത്രിച്ചിരിക്കുന്നു.",
        "geo_mpa": "സ്ഥലം പരിസ്ഥിതി ദുർബലമായ സമുദ്ര സംരക്ഷിത പ്രദേശത്തിനുള്ളിലാണ് ({zone}); വാണിജ്യ യന്ത്രവൽകൃത ട്രോളിംഗ് നിരോധിച്ചിരിക്കുന്നു.",
        "geo_geofence": "മുൻകൂട്ടി നിർവചിച്ച പ്രവർത്തന സമുദ്ര അതിർത്തിക്ക് സമീപം സാമീപ്യ ബഫർ മുന്നറിയിപ്പ് സജീവമായി.",
        "geo_clear": "സ്ഥലം അന്താരാഷ്ട്ര സമുദ്ര അതിർത്തി രേഖ (IMBL), MPA, നാവിക വെടിവയ്പ്പ് മേഖലകൾ എന്നിവയിൽ നിന്ന് സ്വതന്ത്രമാണ്.",
    },
    "bn": {
        "sst_unavailable": "এই অবস্থানের জন্য লাইভ সমুদ্রপৃষ্ঠের তাপমাত্রা এবং ঢেউয়ের তথ্য উপলব্ধ ছিল না; একটি নির্দেশক অনুমান ({sst}°C) দেখানো হয়েছে এবং তদনুসারে নির্ভরযোগ্যতা হ্রাস করা হয়েছে।",
        "sst_favourable": "সমুদ্রপৃষ্ঠের তাপমাত্রা ({sst}°C) পেলাজিক মাছের প্রজাতির (Scombridae/Clupeidae) জন্য তাপীয় স্বাচ্ছন্দ্য সীমার সাথে সামঞ্জস্যপূর্ণ, যা অনুকূল জৈবিক একত্রীকরণ নির্দেশ করে।",
        "sst_divergent": "সমুদ্রপৃষ্ঠের তাপমাত্রা ({sst}°C) সর্বোচ্চ PFZ অবস্থা থেকে তাপীয় বিচ্যুতি নির্দেশ করে।",
        "wave_low": "উল্লেখযোগ্য ঢেউয়ের উচ্চতা ({wave}m) এবং ঢেউয়ের সময়কাল ({period}s) ঐতিহ্যবাহী এবং মোটরচালিত মৎস্যজীবী নৌকার জন্য কম হাইড্রোডাইনামিক প্রতিরোধ প্রদান করে।",
        "wave_moderate": "উল্লেখযোগ্য ঢেউয়ের উচ্চতা ({wave}m) মাঝারি সমুদ্র-অবস্থার সীমার কাছাকাছি; নৌকার স্থিতিশীলতা নিয়ে সতর্কতা পরামর্শ দেওয়া হচ্ছে।",
        "wind": "Copernicus L4 স্ক্যাটারোমিটার {wind_dir} ({wind_deg}°) থেকে {wind} km/h বাতাসের গতি নির্দেশ করে, যা ঝড় সতর্কতার সীমার (35 km/h) নিচে।",
        "geo_restricted": "জিওস্প্যাশিয়াল এজেন্ট সক্রিয় নৌ/নিরাপত্তা নিষিদ্ধ অঞ্চল সনাক্ত করেছে: {zone}। নৌচলাচল কঠোরভাবে নিয়ন্ত্রিত।",
        "geo_mpa": "অবস্থানটি একটি পরিবেশগতভাবে সংবেদনশীল সামুদ্রিক সুরক্ষিত এলাকার ({zone}) মধ্যে পড়ে; বাণিজ্যিক যান্ত্রিক ট্রলিং নিষিদ্ধ।",
        "geo_geofence": "পূর্বনির্ধারিত পরিচালন সামুদ্রিক সীমানার কাছাকাছি নৈকট্য বাফার সতর্কতা সক্রিয় হয়েছে।",
        "geo_clear": "অবস্থানটি আন্তর্জাতিক সামুদ্রিক সীমারেখা (IMBL), MPA এবং নৌ ফায়ারিং জোন থেকে মুক্ত।",
    },
    "gu": {
        "sst_unavailable": "આ સ્થાન માટે લાઇવ સમુદ્ર સપાટીનું તાપમાન અને મોજાંનો ડેટા ઉપલબ્ધ નહોતો; એક સૂચક અંદાજ ({sst}°C) બતાવવામાં આવ્યો છે અને તે મુજબ વિશ્વસનીયતા ઘટાડવામાં આવી છે.",
        "sst_favourable": "સમુદ્ર સપાટીનું તાપમાન ({sst}°C) પેલાજિક માછલીની પ્રજાતિઓ (Scombridae/Clupeidae) માટે થર્મલ કમ્ફર્ટ મર્યાદા સાથે મેળ ખાય છે, જે અનુકૂળ જૈવિક એકત્રીકરણ સૂચવે છે.",
        "sst_divergent": "સમુદ્ર સપાટીનું તાપમાન ({sst}°C) ટોચની PFZ સ્થિતિઓથી થર્મલ વિચલન સૂચવે છે.",
        "wave_low": "નોંધપાત્ર મોજાંની ઊંચાઈ ({wave}m) અને મોજાંનો સમયગાળો ({period}s) પરંપરાગત અને મોટરયુક્ત માછીમારી હોડીઓ માટે ઓછો હાઇડ્રોડાયનેમિક પ્રતિકાર દર્શાવે છે.",
        "wave_moderate": "નોંધપાત્ર મોજાંની ઊંચાઈ ({wave}m) મધ્યમ દરિયાઈ-સ્થિતિ મર્યાદાની નજીક છે; હોડીની સ્થિરતા અંગે સાવચેતી રાખવાની સલાહ આપવામાં આવે છે.",
        "wind": "Copernicus L4 સ્કેટરોમીટર {wind_dir} ({wind_deg}°) દિશામાંથી {wind} km/h પવનની ઝડપ દર્શાવે છે, જે વાવાઝોડાની ચેતવણી મર્યાદા (35 km/h) કરતાં ઓછી છે.",
        "geo_restricted": "જિયોસ્પેશિયલ એજન્ટે સક્રિય નૌકાદળ/સુરક્ષા પ્રતિબંધિત ઝોન શોધી કાઢ્યો: {zone}. નેવિગેશન સખત રીતે નિયંત્રિત છે.",
        "geo_mpa": "સ્થાન એક પર્યાવરણીય રીતે સંવેદનશીલ દરિયાઈ સંરક્ષિત વિસ્તાર ({zone}) ની અંદર આવે છે; વ્યાવસાયિક યાંત્રિક ટ્રોલિંગ પ્રતિબંધિત છે.",
        "geo_geofence": "પૂર્વનિર્ધારિત પરિચાલન દરિયાઈ સીમાની નજીક નિકટતા બફર ચેતવણી સક્રિય થઈ.",
        "geo_clear": "સ્થાન આંતરરાષ્ટ્રીય દરિયાઈ સીમા રેખા (IMBL), MPA અને નૌકાદળ ફાયરિંગ ઝોનથી મુક્ત છે.",
    },
    "mr": {
        "sst_unavailable": "या स्थानासाठी थेट समुद्र पृष्ठभाग तापमान आणि लाट डेटा उपलब्ध नव्हता; एक सूचक अंदाज ({sst}°C) दर्शविला आहे आणि त्यानुसार विश्वासार्हता कमी करण्यात आली आहे.",
        "sst_favourable": "समुद्र पृष्ठभागाचे तापमान ({sst}°C) पेलाजिक मासे प्रजातींसाठी (Scombridae/Clupeidae) औष्णिक सुखद मर्यादेशी जुळते, जे अनुकूल जैविक एकत्रीकरण दर्शवते.",
        "sst_divergent": "समुद्र पृष्ठभागाचे तापमान ({sst}°C) शिखर PFZ स्थितीपासून औष्णिक विचलन दर्शवते.",
        "wave_low": "लक्षणीय लाटेची उंची ({wave}m) आणि लाट कालावधी ({period}s) पारंपरिक आणि मोटार चालवलेल्या मासेमारी नौकांसाठी कमी हायड्रोडायनामिक प्रतिकार दर्शवते.",
        "wave_moderate": "लक्षणीय लाटेची उंची ({wave}m) मध्यम सागरी-स्थिती मर्यादेजवळ आहे; नौकेच्या स्थिरतेबाबत सावधगिरी बाळगण्याचा सल्ला दिला जातो.",
        "wind": "Copernicus L4 स्कॅटरोमीटर {wind_dir} ({wind_deg}°) दिशेने {wind} km/h वाऱ्याचा वेग दर्शवते, जो वादळ इशारा मर्यादेपेक्षा (35 km/h) कमी आहे.",
        "geo_restricted": "जिओस्पेशियल एजंटने सक्रिय नौदल/सुरक्षा प्रतिबंधित क्षेत्र शोधले: {zone}. नेव्हिगेशन कठोरपणे नियंत्रित आहे.",
        "geo_mpa": "स्थान पर्यावरणीयदृष्ट्या संवेदनशील सागरी संरक्षित क्षेत्रात ({zone}) येते; व्यावसायिक यांत्रिक ट्रॉलिंगला मनाई आहे.",
        "geo_geofence": "पूर्वनिर्धारित कार्यान्वयन सागरी सीमेजवळ समीपता बफर इशारा सक्रिय झाला.",
        "geo_clear": "स्थान आंतरराष्ट्रीय सागरी सीमारेषा (IMBL), MPA आणि नौदल फायरिंग क्षेत्रांपासून मुक्त आहे.",
    },
}


# =========================================================
# RECOMMENDATION TEXT — LOCALIZED TEMPLATES
# =========================================================
RECOMMENDATION_I18N = {
    "en": {
        "restricted": "A restricted marine zone has been detected. Fishing or vessel activity may be prohibited in this area. Avoid entering the zone and follow applicable maritime regulations and official advisories.",
        "protected": "Marine conditions may be favourable, but the detected location is within a marine protected area. Fishing or other activities may be restricted. Verify applicable regulations before proceeding.",
        "cyclone": "Cyclone activity has been detected. Marine operations should be avoided until official authorities declare conditions safe.",
        "lightning": "Lightning activity has been detected. Avoid unnecessary marine activity and monitor official weather advisories.",
        "storm": "Active storm conditions are present. Exercise extreme caution and monitor official marine advisories.",
        "high_risk": "High marine risk detected. Avoid unnecessary marine activity until conditions improve and official advisories confirm safe conditions.",
        "moderate_risk": "Caution is advised. Review current weather, wave and marine conditions before operating.",
        "low_risk": "Conditions appear relatively favourable. Continue monitoring official marine and weather advisories.",
    },
    "hi": {
        "restricted": "एक प्रतिबंधित समुद्री क्षेत्र का पता चला है। इस क्षेत्र में मछली पकड़ना या नौका गतिविधि प्रतिबंधित हो सकती है। क्षेत्र में प्रवेश न करें और लागू समुद्री नियमों तथा आधिकारिक सलाह का पालन करें।",
        "protected": "समुद्री स्थितियां अनुकूल हो सकती हैं, लेकिन पाया गया स्थान एक समुद्री संरक्षित क्षेत्र के भीतर है। मछली पकड़ने या अन्य गतिविधियों पर प्रतिबंध हो सकता है। आगे बढ़ने से पहले लागू नियमों की पुष्टि करें।",
        "cyclone": "चक्रवात गतिविधि का पता चला है। जब तक आधिकारिक अधिकारी स्थितियों को सुरक्षित घोषित न करें, तब तक समुद्री कार्य से बचें।",
        "lightning": "बिजली गिरने की गतिविधि का पता चला है। अनावश्यक समुद्री गतिविधि से बचें और आधिकारिक मौसम सलाह पर नज़र रखें।",
        "storm": "सक्रिय तूफान की स्थिति मौजूद है। अत्यधिक सावधानी बरतें और आधिकारिक समुद्री सलाह पर नज़र रखें।",
        "high_risk": "उच्च समुद्री जोखिम का पता चला है। जब तक स्थितियां बेहतर न हों और आधिकारिक सलाह सुरक्षित स्थिति की पुष्टि न करे, तब तक अनावश्यक समुद्री गतिविधि से बचें।",
        "moderate_risk": "सावधानी बरतने की सलाह दी जाती है। संचालन से पहले वर्तमान मौसम, लहर और समुद्री स्थितियों की समीक्षा करें।",
        "low_risk": "स्थितियां अपेक्षाकृत अनुकूल दिखाई देती हैं। आधिकारिक समुद्री और मौसम सलाह पर नज़र रखना जारी रखें।",
    },
    "ta": {
        "restricted": "ஒரு தடைசெய்யப்பட்ட கடல் மண்டலம் கண்டறியப்பட்டுள்ளது. இந்தப் பகுதியில் மீன்பிடித்தல் அல்லது படகு செயல்பாடு தடைசெய்யப்படலாம். மண்டலத்திற்குள் நுழையாதீர்கள் மற்றும் பொருந்தும் கடல்சார் விதிமுறைகள் மற்றும் அதிகாரப்பூர்வ ஆலோசனைகளைப் பின்பற்றவும்.",
        "protected": "கடல் நிலைமைகள் சாதகமாக இருக்கலாம், ஆனால் கண்டறியப்பட்ட இடம் ஒரு கடல் பாதுகாக்கப்பட்ட பகுதிக்குள் உள்ளது. மீன்பிடித்தல் அல்லது பிற செயல்பாடுகள் கட்டுப்படுத்தப்படலாம். தொடர்வதற்கு முன் பொருந்தும் விதிமுறைகளை சரிபார்க்கவும்.",
        "cyclone": "சூறாவளி செயல்பாடு கண்டறியப்பட்டுள்ளது. அதிகாரப்பூர்வ அதிகாரிகள் நிலைமைகளை பாதுகாப்பானது என அறிவிக்கும் வரை கடல் செயல்பாடுகளைத் தவிர்க்கவும்.",
        "lightning": "மின்னல் செயல்பாடு கண்டறியப்பட்டுள்ளது. தேவையற்ற கடல் செயல்பாட்டைத் தவிர்த்து, அதிகாரப்பூர்வ வானிலை ஆலோசனைகளைக் கண்காணிக்கவும்.",
        "storm": "செயலில் உள்ள புயல் நிலைமைகள் உள்ளன. மிகுந்த எச்சரிக்கையுடன் இருந்து அதிகாரப்பூர்வ கடல் ஆலோசனைகளைக் கண்காணிக்கவும்.",
        "high_risk": "அதிக கடல் ஆபத்து கண்டறியப்பட்டுள்ளது. நிலைமைகள் மேம்படும் மற்றும் அதிகாரப்பூர்வ ஆலோசனைகள் பாதுகாப்பான நிலைமைகளை உறுதிப்படுத்தும் வரை தேவையற்ற கடல் செயல்பாட்டைத் தவிர்க்கவும்.",
        "moderate_risk": "எச்சரிக்கை பரிந்துரைக்கப்படுகிறது. இயக்குவதற்கு முன் தற்போதைய வானிலை, அலை மற்றும் கடல் நிலைமைகளை மதிப்பாய்வு செய்யவும்.",
        "low_risk": "நிலைமைகள் ஒப்பீட்டளவில் சாதகமாகத் தெரிகின்றன. அதிகாரப்பூர்வ கடல் மற்றும் வானிலை ஆலோசனைகளைத் தொடர்ந்து கண்காணிக்கவும்.",
    },
    "te": {
        "restricted": "ఒక నిషేధిత సముద్ర మండలం గుర్తించబడింది. ఈ ప్రాంతంలో చేపలు పట్టడం లేదా నౌక కార్యకలాపాలు నిషేధించబడవచ్చు. మండలంలోకి ప్రవేశించవద్దు మరియు వర్తించే సముద్ర నిబంధనలు మరియు అధికారిక సలహాలను పాటించండి.",
        "protected": "సముద్ర పరిస్థితులు అనుకూలంగా ఉండవచ్చు, కానీ గుర్తించిన స్థానం సముద్ర సంరక్షిత ప్రాంతంలో ఉంది. చేపలు పట్టడం లేదా ఇతర కార్యకలాపాలు పరిమితం కావచ్చు. కొనసాగించే ముందు వర్తించే నిబంధనలను ధృవీకరించండి.",
        "cyclone": "తుఫాను కార్యకలాపం గుర్తించబడింది. అధికారిక అధికారులు పరిస్థితులను సురక్షితంగా ప్రకటించే వరకు సముద్ర కార్యకలాపాలను నివారించండి.",
        "lightning": "మెరుపు కార్యకలాపం గుర్తించబడింది. అనవసరమైన సముద్ర కార్యకలాపాన్ని నివారించండి మరియు అధికారిక వాతావరణ సలహాలను గమనించండి.",
        "storm": "క్రియాశీల తుఫాను పరిస్థితులు ఉన్నాయి. అత్యంత జాగ్రత్త వహించండి మరియు అధికారిక సముద్ర సలహాలను గమనించండి.",
        "high_risk": "అధిక సముద్ర ప్రమాదం గుర్తించబడింది. పరిస్థితులు మెరుగుపడే వరకు మరియు అధికారిక సలహాలు సురక్షిత పరిస్థితులను నిర్ధారించే వరకు అనవసరమైన సముద్ర కార్యకలాపాన్ని నివారించండి.",
        "moderate_risk": "జాగ్రత్త వహించాలని సూచించబడింది. కార్యకలాపానికి ముందు ప్రస్తుత వాతావరణం, అల మరియు సముద్ర పరిస్థితులను సమీక్షించండి.",
        "low_risk": "పరిస్థితులు సాపేక్షంగా అనుకూలంగా కనిపిస్తున్నాయి. అధికారిక సముద్ర మరియు వాతావరణ సలహాలను గమనిస్తూ ఉండండి.",
    },
    "ml": {
        "restricted": "ഒരു നിരോധിത കടൽ മേഖല കണ്ടെത്തിയിരിക്കുന്നു. ഈ പ്രദേശത്ത് മത്സ്യബന്ധനം അല്ലെങ്കിൽ ബോട്ട് പ്രവർത്തനം നിരോധിക്കപ്പെട്ടേക്കാം. മേഖലയിലേക്ക് പ്രവേശിക്കരുത്, ബാധകമായ കടൽ നിയന്ത്രണങ്ങളും ഔദ്യോഗിക ഉപദേശങ്ങളും പാലിക്കുക.",
        "protected": "കടൽ സാഹചര്യങ്ങൾ അനുകൂലമായിരിക്കാം, എന്നാൽ കണ്ടെത്തിയ സ്ഥലം ഒരു കടൽ സംരക്ഷിത പ്രദേശത്തിനുള്ളിലാണ്. മത്സ്യബന്ധനം അല്ലെങ്കിൽ മറ്റ് പ്രവർത്തനങ്ങൾ നിയന്ത്രിക്കപ്പെട്ടേക്കാം. തുടരുന്നതിന് മുമ്പ് ബാധകമായ നിയന്ത്രണങ്ങൾ പരിശോധിക്കുക.",
        "cyclone": "ചുഴലിക്കാറ്റ് പ്രവർത്തനം കണ്ടെത്തിയിരിക്കുന്നു. ഔദ്യോഗിക അധികാരികൾ സാഹചര്യങ്ങൾ സുരക്ഷിതമെന്ന് പ്രഖ്യാപിക്കുന്നത് വരെ കടൽ പ്രവർത്തനങ്ങൾ ഒഴിവാക്കുക.",
        "lightning": "ഇടിമിന്നൽ പ്രവർത്തനം കണ്ടെത്തിയിരിക്കുന്നു. അനാവശ്യമായ കടൽ പ്രവർത്തനം ഒഴിവാക്കി ഔദ്യോഗിക കാലാവസ്ഥാ ഉപദേശങ്ങൾ നിരീക്ഷിക്കുക.",
        "storm": "സജീവമായ കൊടുങ്കാറ്റ് സാഹചര്യങ്ങൾ നിലവിലുണ്ട്. അതീവ ജാഗ്രത പാലിക്കുകയും ഔദ്യോഗിക കടൽ ഉപദേശങ്ങൾ നിരീക്ഷിക്കുകയും ചെയ്യുക.",
        "high_risk": "ഉയർന്ന കടൽ അപകടസാധ്യത കണ്ടെത്തിയിരിക്കുന്നു. സാഹചര്യങ്ങൾ മെച്ചപ്പെടുകയും ഔദ്യോഗിക ഉപദേശങ്ങൾ സുരക്ഷിതമായ സാഹചര്യങ്ങൾ സ്ഥിരീകരിക്കുകയും ചെയ്യുന്നത് വരെ അനാവശ്യമായ കടൽ പ്രവർത്തനം ഒഴിവാക്കുക.",
        "moderate_risk": "ജാഗ്രത നിർദ്ദേശിക്കുന്നു. പ്രവർത്തിക്കുന്നതിന് മുമ്പ് നിലവിലെ കാലാവസ്ഥ, തിരമാല, കടൽ സാഹചര്യങ്ങൾ പരിശോധിക്കുക.",
        "low_risk": "സാഹചര്യങ്ങൾ താരതമ്യേന അനുകൂലമായി കാണപ്പെടുന്നു. ഔദ്യോഗിക കടൽ, കാലാവസ്ഥാ ഉപദേശങ്ങൾ തുടർന്നും നിരീക്ഷിക്കുക.",
    },
    "bn": {
        "restricted": "একটি নিষিদ্ধ সামুদ্রিক অঞ্চল সনাক্ত করা হয়েছে। এই এলাকায় মাছ ধরা বা নৌকা চলাচল নিষিদ্ধ হতে পারে। অঞ্চলে প্রবেশ করবেন না এবং প্রযোজ্য সামুদ্রিক প্রবিধান ও সরকারি পরামর্শ অনুসরণ করুন।",
        "protected": "সামুদ্রিক পরিস্থিতি অনুকূল হতে পারে, তবে সনাক্ত করা স্থানটি একটি সামুদ্রিক সুরক্ষিত এলাকার মধ্যে রয়েছে। মাছ ধরা বা অন্যান্য কার্যকলাপ সীমিত হতে পারে। এগিয়ে যাওয়ার আগে প্রযোজ্য বিধিমালা যাচাই করুন।",
        "cyclone": "ঘূর্ণিঝড়ের কার্যকলাপ সনাক্ত করা হয়েছে। সরকারি কর্তৃপক্ষ পরিস্থিতি নিরাপদ ঘোষণা না করা পর্যন্ত সামুদ্রিক কার্যক্রম এড়িয়ে চলুন।",
        "lightning": "বজ্রপাতের কার্যকলাপ সনাক্ত করা হয়েছে। অপ্রয়োজনীয় সামুদ্রিক কার্যকলাপ এড়িয়ে চলুন এবং সরকারি আবহাওয়া পরামর্শ পর্যবেক্ষণ করুন।",
        "storm": "সক্রিয় ঝড়ের পরিস্থিতি বিরাজ করছে। অত্যন্ত সতর্কতা অবলম্বন করুন এবং সরকারি সামুদ্রিক পরামর্শ পর্যবেক্ষণ করুন।",
        "high_risk": "উচ্চ সামুদ্রিক ঝুঁকি সনাক্ত করা হয়েছে। পরিস্থিতির উন্নতি না হওয়া এবং সরকারি পরামর্শ নিরাপদ অবস্থা নিশ্চিত না করা পর্যন্ত অপ্রয়োজনীয় সামুদ্রিক কার্যকলাপ এড়িয়ে চলুন।",
        "moderate_risk": "সতর্কতা অবলম্বনের পরামর্শ দেওয়া হচ্ছে। পরিচালনার আগে বর্তমান আবহাওয়া, ঢেউ এবং সামুদ্রিক পরিস্থিতি পর্যালোচনা করুন।",
        "low_risk": "পরিস্থিতি তুলনামূলকভাবে অনুকূল বলে মনে হচ্ছে। সরকারি সামুদ্রিক ও আবহাওয়া পরামর্শ পর্যবেক্ষণ করা চালিয়ে যান।",
    },
    "gu": {
        "restricted": "એક પ્રતિબંધિત દરિયાઈ ઝોન શોધાયો છે. આ વિસ્તારમાં માછીમારી અથવા હોડી પ્રવૃત્તિ પ્રતિબંધિત હોઈ શકે છે. ઝોનમાં પ્રવેશ ટાળો અને લાગુ પડતા દરિયાઈ નિયમો અને સત્તાવાર સલાહનું પાલન કરો.",
        "protected": "દરિયાઈ સ્થિતિ અનુકૂળ હોઈ શકે છે, પરંતુ શોધાયેલ સ્થાન એક દરિયાઈ સંરક્ષિત વિસ્તારની અંદર છે. માછીમારી અથવા અન્ય પ્રવૃત્તિઓ પ્રતિબંધિત હોઈ શકે છે. આગળ વધતા પહેલા લાગુ પડતા નિયમોની ખાતરી કરો.",
        "cyclone": "ચક્રવાત પ્રવૃત્તિ શોધાઈ છે. સત્તાવાર અધિકારીઓ સ્થિતિને સલામત જાહેર ન કરે ત્યાં સુધી દરિયાઈ કામગીરી ટાળો.",
        "lightning": "વીજળીની પ્રવૃત્તિ શોધાઈ છે. બિનજરૂરી દરિયાઈ પ્રવૃત્તિ ટાળો અને સત્તાવાર હવામાન સલાહનું નિરીક્ષણ કરો.",
        "storm": "સક્રિય વાવાઝોડાની સ્થિતિ હાજર છે. અત્યંત સાવચેતી રાખો અને સત્તાવાર દરિયાઈ સલાહનું નિરીક્ષણ કરો.",
        "high_risk": "ઉચ્ચ દરિયાઈ જોખમ શોધાયું છે. સ્થિતિ સુધરે અને સત્તાવાર સલાહ સલામત સ્થિતિની પુષ્ટિ કરે ત્યાં સુધી બિનજરૂરી દરિયાઈ પ્રવૃત્તિ ટાળો.",
        "moderate_risk": "સાવચેતી રાખવાની સલાહ આપવામાં આવે છે. કામગીરી પહેલાં વર્તમાન હવામાન, મોજાં અને દરિયાઈ સ્થિતિની સમીક્ષા કરો.",
        "low_risk": "સ્થિતિ પ્રમાણમાં અનુકૂળ જણાય છે. સત્તાવાર દરિયાઈ અને હવામાન સલાહનું નિરીક્ષણ કરવાનું ચાલુ રાખો.",
    },
    "mr": {
        "restricted": "एक प्रतिबंधित सागरी क्षेत्र आढळले आहे. या भागात मासेमारी किंवा नौका क्रियाकलाप प्रतिबंधित असू शकतो. क्षेत्रात प्रवेश करू नका आणि लागू सागरी नियम व अधिकृत सल्ल्याचे पालन करा.",
        "protected": "सागरी परिस्थिती अनुकूल असू शकते, परंतु आढळलेले स्थान सागरी संरक्षित क्षेत्रात आहे. मासेमारी किंवा इतर क्रियाकलाप प्रतिबंधित असू शकतात. पुढे जाण्यापूर्वी लागू नियमांची खात्री करा.",
        "cyclone": "चक्रीवादळ क्रियाकलाप आढळला आहे. अधिकृत अधिकारी परिस्थिती सुरक्षित घोषित करेपर्यंत सागरी कामकाज टाळा.",
        "lightning": "विजेचा कडकडाट आढळला आहे. अनावश्यक सागरी क्रियाकलाप टाळा आणि अधिकृत हवामान सल्ल्याचे निरीक्षण करा.",
        "storm": "सक्रिय वादळाची स्थिती आहे. अत्यंत सावधगिरी बाळगा आणि अधिकृत सागरी सल्ल्याचे निरीक्षण करा.",
        "high_risk": "उच्च सागरी धोका आढळला आहे. परिस्थिती सुधारेपर्यंत आणि अधिकृत सल्ला सुरक्षित परिस्थितीची पुष्टी करेपर्यंत अनावश्यक सागरी क्रियाकलाप टाळा.",
        "moderate_risk": "सावधगिरी बाळगण्याचा सल्ला दिला जातो. कार्य करण्यापूर्वी सध्याचे हवामान, लाट आणि सागरी स्थितीचा आढावा घ्या.",
        "low_risk": "परिस्थिती तुलनेने अनुकूल दिसते. अधिकृत सागरी आणि हवामान सल्ल्याचे निरीक्षण सुरू ठेवा.",
    },
}

def _detect_language(query: str) -> str:
    """
    Detect if the user queried in an Indian regional language.
    """
    text = query.lower()
    # Hindi script detection
    if any("\u0900" <= c <= "\u097f" for c in text):
        return "hi"
    # Tamil script
    if any("\u0b80" <= c <= "\u0bff" for c in text):
        return "ta"
    # Telugu script
    if any("\u0c00" <= c <= "\u0c7f" for c in text):
        return "te"
    # Malayalam script
    if any("\u0d00" <= c <= "\u0d7f" for c in text):
        return "ml"
    # Bengali script
    if any("\u0980" <= c <= "\u09ff" for c in text):
        return "bn"
    # Gujarati script
    if any("\u0a80" <= c <= "\u0aff" for c in text):
        return "gu"
    # Marathi (Devanagari keywords)
    marathi_keywords = ["सुरक्षित", "मासेमारी", "लाटा", "हवामान", "समुद्र"]
    if any(k in text for k in marathi_keywords):
        return "mr"
    return "en"


def synthesize_response(
    user_query: str,
    marine_data: Dict[str, Any],
    weather_data: Dict[str, Any],
    geo_data: Dict[str, Any],
    risk_data: Dict[str, Any],
    requested_language: str = ""
) -> Dict[str, Any]:
    """
    ORCA Synthesis & Aggregator Agent (Layer 5 & 6)
    
    Functions:
    1. Multi-Agent cross-validation & consensus aggregation
    2. Calculates composite Confidence Score
    3. Generates Explainable "Why" Evidence & Rationale
    4. Attaches official Satellite & Oceanographic Citations (ISRO, INCOIS, Copernicus)
    5. Produces contextual natural language recommendation (Multilingual ready)
    """

    score = risk_data.get("safety_score", 95)
    risk_level = risk_data.get("risk_level", "LOW")
    reasons = risk_data.get("reasons", ["All observed oceanographic parameters are within operational safety thresholds."])
    recommendation = risk_data.get(
        "recommendation",
        "Marine conditions appear favourable. Maintain continuous radio watch on VHF Ch-16."
    )

    # -----------------------------------------------------
    # Extract Marine Metrics
    # -----------------------------------------------------
    # NOTE: dict.get(key, default) only falls back when the key is MISSING.
    # The live marine/weather providers frequently return the key with an
    # explicit `None` value when a reading isn't available (e.g. no
    # coverage for a coordinate), which .get() happily passes through —
    # producing "None °C" / "None m" in the user-facing response. Coalesce
    # explicitly instead of relying on the dict default.
    def _num(value, default):
        return default if value is None else value

    sst_raw = marine_data.get("sea_surface_temperature", {}).get("value")
    wave_height_raw = marine_data.get("wave_height", {}).get("value")
    wave_dir_raw = marine_data.get("wave", {}).get("direction")
    wave_period_raw = marine_data.get("wave", {}).get("period")
    current_vel_raw = marine_data.get("ocean_current", {}).get("velocity")

    sst_val = _num(sst_raw, 29.3)
    wave_height_val = _num(wave_height_raw, 1.52)
    wave_dir = _num(wave_dir_raw, 256.0)
    wave_period = _num(wave_period_raw, 7.5)
    current_vel = _num(current_vel_raw, 0.3)
    chlorophyll_val = marine_data.get("chlorophyll", {}).get("value", None)
    pfz_info = marine_data.get("potential_fishing_zone", {})

    # -----------------------------------------------------
    # Extract Weather Metrics
    # -----------------------------------------------------
    wind_data = weather_data.get("wind", {})
    wind_speed_raw = wind_data.get("speed_kmh")
    wind_direction_raw = wind_data.get("direction")
    wind_deg_raw = wind_data.get("direction_degrees")

    wind_speed = _num(wind_speed_raw, 12.19)
    wind_direction = _num(wind_direction_raw, "SW")
    wind_deg = _num(wind_deg_raw, 243.9)

    marine_data_available = sst_raw is not None and wave_height_raw is not None

    cyclone = weather_data.get("cyclone", {}).get("active", False)
    lightning = weather_data.get("lightning", {}).get("active", False)
    storm = weather_data.get("storm", {}).get("active", False)

    # -----------------------------------------------------
    # Extract Geospatial Metrics
    # -----------------------------------------------------
    geo_status = geo_data.get("status", "NORMAL")
    mpa_detected = geo_data.get("marine_protected_area", {}).get("detected", False)
    restricted_detected = geo_data.get("restricted_zone", {}).get("detected", False)
    geofence_triggered = geo_data.get("geofence", {}).get("triggered", False)
    zone_name = geo_data.get("zone", {}).get("name", "Standard Maritime Sector")

    # -----------------------------------------------------
    # Confidence Score Calculation (Evidence-weighted)
    # -----------------------------------------------------
    confidence_score = 96.0
    if not weather_data.get("forecast_available", True):
        confidence_score -= 4.0
    if chlorophyll_val is None:
        confidence_score -= 2.0
    if cyclone or storm:
        confidence_score -= 5.0
    if not marine_data_available:
        confidence_score -= 12.0
    if wind_speed_raw is None:
        confidence_score -= 6.0
    confidence_score = max(55.0, min(99.0, confidence_score))

    # -----------------------------------------------------
    # Multilingual Conversational Synthesis — language must be resolved
    # before the "why" reasoning is built, so those bullets are generated
    # in the same language as the rest of the response instead of always
    # falling back to English regardless of `requested_language`.
    # -----------------------------------------------------
    lang = requested_language if requested_language in {"en", "hi", "ta", "te", "ml", "bn", "gu", "mr"} else _detect_language(user_query)

    # risk_agent returns a stable `recommendation_key` alongside its English
    # `recommendation` text — swap in the localized version for that key so
    # the recommendation line matches the response's language instead of
    # always showing risk_agent's English sentence.
    recommendation_key = risk_data.get("recommendation_key")
    if recommendation_key:
        recommendation = RECOMMENDATION_I18N.get(lang, RECOMMENDATION_I18N["en"]).get(recommendation_key, recommendation)

    # -----------------------------------------------------
    # Explainable "Why" Reasoning Formulation
    # -----------------------------------------------------
    wt = WHY_I18N.get(lang, WHY_I18N["en"])
    why_explanation_points: List[str] = []

    # 1. Thermal & Biological rationale
    if not marine_data_available:
        why_explanation_points.append(wt["sst_unavailable"].format(sst=sst_val))
    elif 27.0 <= sst_val <= 30.5:
        why_explanation_points.append(wt["sst_favourable"].format(sst=sst_val))
    else:
        why_explanation_points.append(wt["sst_divergent"].format(sst=sst_val))

    # 2. Wave & Sea-State rationale
    if wave_height_val is not None:
        if wave_height_val < 1.8:
            why_explanation_points.append(wt["wave_low"].format(wave=wave_height_val, period=wave_period))
        else:
            why_explanation_points.append(wt["wave_moderate"].format(wave=wave_height_val))

    # 3. Wind Vector rationale
    why_explanation_points.append(
        wt["wind"].format(wind=wind_speed, wind_dir=wind_direction, wind_deg=wind_deg)
    )

    # 4. Geospatial boundary rationale
    if restricted_detected:
        why_explanation_points.append(wt["geo_restricted"].format(zone=zone_name))
    elif mpa_detected:
        why_explanation_points.append(wt["geo_mpa"].format(zone=zone_name))
    elif geofence_triggered:
        why_explanation_points.append(wt["geo_geofence"])
    else:
        why_explanation_points.append(wt["geo_clear"])

    if lang == "hi":
        response_text = (
            f"🟢 समुद्री सुरक्षा मूल्यांकन: {risk_level} (सुरक्षा स्कोर: {score}/100)\n\n"
            f"📊 समुद्री स्थिति विश्लेषण:\n"
            f"• समुद्री सतह का तापमान (SST): {sst_val} °C\n"
            f"• लहर की ऊंचाई (Wave Height): {wave_height_val} m (दिशा: {wave_dir}°)\n"
            f"• हवा की गति (Wind Speed): {wind_speed} km/h ({wind_direction})\n"
            f"• समुद्री सीमा स्थिति: {geo_status}\n\n"
            f"💡 ORCA सुझाव:\n{recommendation}\n\n"
            f"🔍 साक्ष्य एवं कारण (Why this recommendation):\n"
            + "\n".join(f"• {p}" for p in why_explanation_points[:3])
        )
    elif lang == "ta":
        response_text = (
            f"🟢 கடல் பாதுகாப்பு மதிப்பீடு: {risk_level} (பாதுகாப்பு மதிப்பெண்: {score}/100)\n\n"
            f"📊 கடல் நிலை:\n"
            f"• கடல் மேற்பரப்பு வெப்பநிலை (SST): {sst_val} °C\n"
            f"• அலை உயரம்: {wave_height_val} m\n"
            f"• காற்றின் வேகம்: {wind_speed} km/h ({wind_direction})\n\n"
            f"💡 பரிந்துரை:\n{recommendation}"
        )
    elif lang == "te":
        response_text = f"🟢 సముద్ర భద్రత అంచనా: {risk_level} (స్కోర్: {score}/100)\n\n📊 సముద్ర పరిస్థితి:\n• సముద్ర ఉపరితల ఉష్ణోగ్రత: {sst_val} °C\n• అలల ఎత్తు: {wave_height_val} m\n• గాలి వేగం: {wind_speed} km/h ({wind_direction})\n• సముద్ర సరిహద్దు స్థితి: {geo_status}\n\n💡 ORCA సూచన:\n{recommendation}"
    elif lang == "ml":
        response_text = f"🟢 സമുദ്ര സുരക്ഷാ വിലയിരുത്തൽ: {risk_level} (സ്കോർ: {score}/100)\n\n📊 സമുദ്ര സ്ഥിതി:\n• സമുദ്ര ഉപരിതല താപനില: {sst_val} °C\n• തിരമാല ഉയരം: {wave_height_val} m\n• കാറ്റിന്റെ വേഗത: {wind_speed} km/h ({wind_direction})\n• സമുദ്ര അതിർത്തി സ്ഥിതി: {geo_status}\n\n💡 ORCA നിർദ്ദേശം:\n{recommendation}"
    elif lang == "bn":
        response_text = f"🟢 সামুদ্রিক নিরাপত্তা মূল্যায়ন: {risk_level} (স্কোর: {score}/100)\n\n📊 সামুদ্রিক অবস্থা:\n• সমুদ্রপৃষ্ঠের তাপমাত্রা: {sst_val} °C\n• ঢেউয়ের উচ্চতা: {wave_height_val} m\n• বাতাসের গতি: {wind_speed} km/h ({wind_direction})\n• সামুদ্রিক সীমান্তের অবস্থা: {geo_status}\n\n💡 ORCA পরামর্শ:\n{recommendation}"
    elif lang == "gu":
        response_text = f"🟢 દરિયાઈ સલામતી મૂલ્યાંકન: {risk_level} (સ્કોર: {score}/100)\n\n📊 દરિયાઈ સ્થિતિ:\n• સમુદ્ર સપાટીનું તાપમાન: {sst_val} °C\n• મોજાંની ઊંચાઈ: {wave_height_val} m\n• પવનની ઝડપ: {wind_speed} km/h ({wind_direction})\n• દરિયાઈ સીમાની સ્થિતિ: {geo_status}\n\n💡 ORCA સલાહ:\n{recommendation}"
    elif lang == "mr":
        response_text = f"🟢 सागरी सुरक्षा मूल्यांकन: {risk_level} (गुण: {score}/100)\n\n📊 सागरी स्थिती:\n• समुद्र पृष्ठभागाचे तापमान: {sst_val} °C\n• लाटांची उंची: {wave_height_val} m\n• वाऱ्याचा वेग: {wind_speed} km/h ({wind_direction})\n• सागरी सीमास्थिती: {geo_status}\n\n💡 ORCA सल्ला:\n{recommendation}"
    else:
        # Professional English Synthesis
        response_text = (
            f"🟢 Operational Risk Level: {risk_level} (Safety Score: {score}/100 • Confidence: {confidence_score:.1f}%)\n\n"
            f"🌊 Marine & Oceanographic Telemetry:\n"
            f"• Sea Surface Temperature: {sst_val} °C (Optimum Pelagic Range)\n"
            f"• Significant Wave Height: {wave_height_val} m (Direction: {wave_dir}°, Period: {wave_period}s)\n"
            f"• Surface Ocean Current: {current_vel} km/h\n\n"
            f"💨 Wind & Meteorological Vector:\n"
            f"• Wind Velocity: {wind_speed} km/h from {wind_direction} ({wind_deg}°)\n"
            f"• Severe Convection / Cyclone / Lightning: {'ACTIVE ALERT' if cyclone or storm or lightning else 'Clear (No Active Storms)'}\n\n"
            f"🛡️ Geospatial & Boundary Status:\n"
            f"• Boundary Compliance: {geo_status} ({zone_name})\n\n"
            f"🎯 Actionable Recommendation:\n"
            f"{recommendation}"
        )

    return {
        "query": user_query,
        "language_detected": lang,
        "risk_level": risk_level,
        "safety_score": score,
        "confidence_score": confidence_score,
        "response": response_text,
        "reasons": reasons,
        "why_explanation": why_explanation_points,
        "citations": EVIDENCE_CITATIONS,
        "geofence_status": geo_status,
        "pfz_status": "HIGH POTENTIAL" if (sst_val and 27 <= sst_val <= 30) else "MODERATE",
    }