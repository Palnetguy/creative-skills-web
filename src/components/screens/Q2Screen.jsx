import React from "react";

export default function Q2Screen({ data, updateData, nextScreen }) {
  const handleSelect = (value) => {
    updateData("q2", value);
    nextScreen("q3");
  };

  const options = [
    "Fast/Reliable",
    "Data is Expensive",
    "Slow/Unreliable",
    "Offline Only",
  ];

  return (
    <div className="screen-container">
      <h1>How is your internet connection?</h1>
      <div className="options-container">
        {options.map((option) => (
          <button
            key={option}
            className={`pill-btn ${data.q2 === option ? "selected" : ""}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
