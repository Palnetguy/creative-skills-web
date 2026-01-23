import React, { useState } from "react";
import { saveToGoogleSheets } from "../../services/googleSheets";

export default function DemographicsScreen({ data, updateData, nextScreen }) {
  const [name, setName] = useState(data.name || "");
  const [age, setAge] = useState(data.age || "");
  const [gender, setGender] = useState(data.gender || "");
  const [country, setCountry] = useState(data.country || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const completeData = {
      ...data,
      timestamp: new Date().toISOString(),
      name: name || "Anonymous",
      age: age || "N/A",
      gender: gender || "N/A",
      country: country || "N/A",
    };

    // Save to localStorage
    const history = JSON.parse(localStorage.getItem("survey_history") || "[]");
    history.push(completeData);
    localStorage.setItem("survey_history", JSON.stringify(history));
    console.log("✅ Survey saved to localStorage:", completeData);

    // Try to save to Google Sheets
    try {
      console.log("📤 Attempting to save to Google Sheets...");
      await saveToGoogleSheets(completeData);
      console.log("✅ Successfully saved to Google Sheets!");
    } catch (error) {
      console.error("❌ Google Sheets save error:", error);
      console.error("Error details:", error.message);
      // Data is still saved to localStorage, so we continue
    }

    setLoading(false);
    nextScreen("end");
  };

  return (
    <div className="screen-container">
      <h1>About You</h1>
      <p className="subtitle">
        Optional - helps us understand our audience better
      </p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (Optional)"
        className="input-field"
      />

      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
        className="input-field"
      />

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="input-field"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Non-Binary">Non-Binary</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>

      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Country"
        className="input-field"
      />

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Survey"}
      </button>
    </div>
  );
}
