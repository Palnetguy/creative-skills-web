import React, { useState, useEffect } from "react";
import IntroScreen from "../components/screens/IntroScreen";
import Q1Screen from "../components/screens/Q1Screen";
import Q2Screen from "../components/screens/Q2Screen";
import Q3Screen from "../components/screens/Q3Screen";
import Q4Screen from "../components/screens/Q4Screen";
import Q5Screen from "../components/screens/Q5Screen";
import Q6Screen from "../components/screens/Q6Screen";
import Q7Screen from "../components/screens/Q7Screen";
import Q8Screen from "../components/screens/Q8Screen";
import Q9Screen from "../components/screens/Q9Screen";
import Q10Screen from "../components/screens/Q10Screen";
import Q11Screen from "../components/screens/Q11Screen";
import Q12Screen from "../components/screens/Q12Screen";
import DemographicsScreen from "../components/screens/DemographicsScreen";
import EndScreen from "../components/screens/EndScreen";
import ProgressBar from "../components/ProgressBar";
import "../styles/survey.css";

const screens = [
  "intro",
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
  "demographics",
  "end",
];

const screenComponents = {
  intro: IntroScreen,
  q1: Q1Screen,
  q2: Q2Screen,
  q3: Q3Screen,
  q4: Q4Screen,
  q5: Q5Screen,
  q6: Q6Screen,
  q7: Q7Screen,
  q8: Q8Screen,
  q9: Q9Screen,
  q10: Q10Screen,
  q11: Q11Screen,
  q12: Q12Screen,
  demographics: DemographicsScreen,
  end: EndScreen,
};

export default function SurveyApp() {
  const [currentScreenIdx, setCurrentScreenIdx] = useState(0);
  const [surveyData, setSurveyData] = useState({});

  // Initialize Google Sheets on app load
  useEffect(() => {
    const initializeGoogleSheets = async () => {
      try {
        console.log("🔧 Initializing Google Sheets API...");
        const module = await import("../services/googleSheets");
        const { initializeGoogleSheets: init } = module;
        if (init) {
          await init();
          console.log("✅ Google Sheets API initialized successfully");
        }
      } catch (error) {
        console.error(
          "❌ Failed to initialize Google Sheets API:",
          error.message,
        );
      }
    };
    initializeGoogleSheets();
  }, []);

  const currentScreenId = screens[currentScreenIdx];
  const CurrentScreen = screenComponents[currentScreenId];

  const nextScreen = (screenId) => {
    const idx = screens.indexOf(screenId);
    if (idx !== -1) {
      setCurrentScreenIdx(idx);
      window.scrollTo(0, 0);
    }
  };

  const updateSurveyData = (key, value) => {
    setSurveyData((prev) => ({ ...prev, [key]: value }));
  };

  const progress = (currentScreenIdx / (screens.length - 1)) * 100;

  return (
    <div className="survey-app">
      <ProgressBar progress={progress} />
      <CurrentScreen
        data={surveyData}
        updateData={updateSurveyData}
        nextScreen={nextScreen}
      />
    </div>
  );
}
