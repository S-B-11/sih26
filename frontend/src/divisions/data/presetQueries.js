export const PRESET_QUERIES = [
  {
    id: "pfz-today",
    category: "Fishing Zone",
    icon: "🐟",
    text: {
      en: "Where is the nearest Potential Fishing Zone today?",
      hi: "आज निकटतम संभावित मत्स्य पालन क्षेत्र (PFZ) कहाँ है?",
      ta: "இன்று அருகிலுள்ள சாத்தியமான மீன்பிடி மண்டலம் எங்கே உள்ளது?",
      te: "ఈరోజు సముద్రంలో సమీపంలోని సంభావ్య వేట రంగాలు ఎక్కడ ఉన్నాయి?",
      ml: "ഇന്ന് ഏറ്റവും അടുത്തുള്ള സാധ്യതയുള്ള മത്സ്യബന്ധന മേഖല എവിടെയാണ്?",
      gu: "આજે નજીકનું સંભવિત માછીમારી ક્ષેત્ર ક્યાં છે?",
      bn: "আজ নিকটতম সম্ভাব্য মৎস্য আহরণ অঞ্চল কোথায়?"
    },
    location: "Veraval, Gujarat Coast",
    description: "SST fronts & Chlorophyll density analysis"
  },
  {
    id: "sea-safety",
    category: "Maritime Safety",
    icon: "⚠️",
    text: {
      en: "Is it safe to venture into the sea tomorrow morning?",
      hi: "क्या कल सुबह समुद्र में जाना सुरक्षित है?",
      ta: "நாளை காலை கடலுக்குச் செல்வது பாதுகாப்பானதா?",
      te: "రేపు ఉదయం సముద్రంలోకి వెళ్లడం సురక్షితమేనా?",
      ml: "നാളെ രാവിലെ കടലിൽ പോകുന്നത് സുരക്ഷിതമാണോ?",
      gu: "શું આવતીકાલે સવારે દરિયામાં જવું સલામત છે?",
      bn: "আগামীকাল সকালে কি সমুদ্রে যাওয়া নিরাপদ?"
    },
    location: "Offshore Kochi, Kerala",
    description: "Wave height, swell alerts & wind vector safety check"
  },
  {
    id: "productivity-decline",
    category: "Ocean Diagnostics",
    icon: "📉",
    text: {
      en: "Why has fish productivity declined in the Gulf of Mannar region?",
      hi: "मन्नार की खाड़ी क्षेत्र में मछली उत्पादन में गिरावट क्यों आई है?",
      ta: "மன்னார் வளைகுடா பகுதியில் மீன் உற்பத்தி ஏன் குறைந்துள்ளது?",
      te: "మన్నార్ సింధుశాఖ ప్రాంతంలో చేపల ఉత్పాదకత ఎందుకు తగ్గింది?",
      ml: "മന്നാർ ഉൾക്കടൽ മേഖലയിൽ മത്സ്യലഭ്യത കുറയാൻ കാരണമെന്താണ്?",
      gu: "મન્નારના અખાત વિસ્તારમાં માછલીઓની ઉત્પાદકતા કેમ ઘટી ગઈ છે?",
      bn: "মান্নার উপসাগর অঞ্চলে মাছের উৎপাদন কেন কমে গেছে?"
    },
    location: "Gulf of Mannar, Tamil Nadu Coast",
    description: "6-Month historical Chlorophyll-a vs SST anomaly diagnostics & MPA check"
  },
  {
    id: "tide-weather",
    category: "Ocean Conditions",
    icon: "🌊",
    text: {
      en: "What are the tide, weather, and sea conditions near my fishing location?",
      hi: "मेरी मछली पकड़ने की जगह के पास ज्वार, मौसम और समुद्र की स्थिति क्या है?",
      ta: "எனது மீன்பிடி இடத்தின் அருகே அலை, வானிலை மற்றும் கடல் நிலைமைகள் என்ன?",
      te: "నా చేపల వేట ప్రదేశం వద్ద అలలు, వాతావరణం మరియు సముద్ర పరిస్థితులు ఎలా ఉన్నాయి?",
      ml: "എന്റെ മത്സ്യബന്ധന സ്ഥലത്തിനടുത്ത് വേലിയേറ്റവും കാലാവസ്ഥയും എങ്ങനെയാണ്?",
      gu: "મારા માછીમારી સ્થળ નજીક ભરતી, હવામાન અને દરિયાની સ્થિતિ શું છે?",
      bn: "আমার মৎস্য শিকার এলাকার নিকটতম জোয়ার-ভাটা এবং আবহাওয়া কেমন?"
    },
    location: "Visakhapatnam, Andhra Pradesh",
    description: "INCOIS buoy telemetries, SST & wind speed details"
  },
  {
    id: "cyclone-lightning",
    category: "Severe Weather",
    icon: "⚡",
    text: {
      en: "Are there any lightning or cyclone alerts in my area?",
      hi: "क्या मेरे क्षेत्र में बिजली गिरने या चक्रवात का कोई अलर्ट है?",
      ta: "எனது பகுதியில் மின்னல் அல்லது சூறாவளி எச்சரிக்கைகள் ஏதும் உள்ளதா?",
      te: "నా ప్రాంతంలో ఏవైనా పిడుగులు లేదా తుఫాను హెచ్చరికలు ఉన్నాయా?",
      ml: "എന്റെ പ്രദേശത്ത് മിന്നലോ ചുഴലിക്കാറ്റോ മുന്നറിയിപ്പുണ്ടോ?",
      gu: "શું મારા વિસ્તારમાં વીજળી કે વાવાઝોડાનું કોઈ એલર્ટ છે?",
      bn: "আমার এলাকায় কি কোনো বজ্রপাত বা ঘূর্ণিঝড়ের সতর্কতা রয়েছে?"
    },
    location: "Bay of Bengal (Puri Coast)",
    description: "INSAT-3DR Doppler radar scan & storm cell tracking"
  },
  {
    id: "safest-route",
    category: "Navigation Route",
    icon: "🚤",
    text: {
      en: "What's the safest route for my boat considering current weather?",
      hi: "वर्तमान मौसम को देखते हुए मेरी नाव के लिए सबसे सुरक्षित मार्ग कौन सा है?",
      ta: "தற்போதைய வானிலையைக் கருத்தில் கொண்டு எனது படகிற்கு மிகவும் பாதுகாப்பான பாதை எது?",
      te: "ప్రస్తుత వాతావరణాన్ని బట్టి నా పడవకు అత్యంత సురక్షితమైన మార్గం ఏది?",
      ml: "നിലവിലെ കാലാവസ്ഥ കണക്കിലെടുത്ത് എന്റെ ബോട്ടിന് ഏറ്റവും സുരക്ഷിതമായ പാത ഏതാണ്?",
      gu: "વર્તમાન હવામાનને ધ્યાનમાં રાખીને મારી હોડી માટે સૌથી સુરક્ષિત માર્ગ કયો છે?",
      bn: "বর্তমান আবহাওয়া বিবেচনা করে আমার নৌকার জন্য সবচেয়ে নিরাপদ পথ কোনটি?"
    },
    location: "Chennai Harbor to Offshore Ridge",
    description: "Multi-agent bathymetry & swell-optimized vessel routing"
  }
];

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳" }
];
