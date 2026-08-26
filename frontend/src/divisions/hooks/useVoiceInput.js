import { useState, useEffect, useRef } from "react";

export function useVoiceInput({ onSpeechResult, language = "en" }) {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      const langMap = {
        en: "en-IN",
        hi: "hi-IN",
        ta: "ta-IN",
        te: "te-IN",
        ml: "ml-IN",
        gu: "gu-IN",
        bn: "bn-IN"
      };
      recognition.lang = langMap[language] || "en-IN";

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (event.results[0].isFinal && onSpeechResult) {
          onSpeechResult(currentTranscript);
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language, onSpeechResult]);

  // Simulate audio level visualizer animation when listening
  useEffect(() => {
    if (isListening) {
      const updateWave = () => {
        setAudioLevel(Math.floor(Math.random() * 80) + 20);
        animFrameRef.current = requestAnimationFrame(updateWave);
      };
      updateWave();
    } else {
      setAudioLevel(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isListening]);

  const startListening = () => {
    setTranscript("");
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // Fallback simulation if mic is blocked/unsupported
        setIsListening(true);
        simulateSpeechRecognition();
      }
    } else {
      // Fallback voice input simulation
      setIsListening(true);
      simulateSpeechRecognition();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
  };

  const simulateSpeechRecognition = () => {
    const samplePhrases = {
      en: "Where is the nearest Potential Fishing Zone today?",
      hi: "आज निकटतम संभावित मत्स्य पालन क्षेत्र कहाँ है?",
      ta: "இன்று அருகிலுள்ள மீன்பிடி மண்டலம் எங்கே உள்ளது?",
      te: "ఈరోజు సముద్రంలో సమీపంలోని మీన్‌పిడి జోన్ ఎక్కడ ఉంది?",
      ml: "ഇന്ന് ഏറ്റവും അടുത്തുള്ള മത്സ്യബന്ധന മേഖല എവിടെയാണ്?",
      gu: "આજે નજીકનું સંભવિત માછીમારી ક્ષેત્ર ક્યાં છે?",
      bn: "আজ নিকটতম সম্ভাব্য মৎস্য আহরণ অঞ্চল কোথায়?"
    };
    
    let text = samplePhrases[language] || samplePhrases.en;
    let index = 0;
    const interval = setInterval(() => {
      index += 5;
      const partial = text.slice(0, index);
      setTranscript(partial);
      if (index >= text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsListening(false);
          if (onSpeechResult) onSpeechResult(text);
        }, 500);
      }
    }, 150);
  };

  return {
    isListening,
    audioLevel,
    transcript,
    startListening,
    stopListening
  };
}
