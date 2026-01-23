import React from "react";

export default function Q3Screen({ data, updateData, nextScreen }) {
  const options = [
    "Expressing Opinions",
    "Social Issues",
    "Debating",
    "Sharing Personal Experience",
    "Just for Fun/Creativity",
    "Peer Pressure",
  ];

  const selected = data.q3 || [];

  const toggleOption = (option) => {
    const max = 3;
    if (selected.includes(option)) {
      updateData(
        "q3",
        selected.filter((o) => o !== option),
      );
    } else {
      if (selected.length < max) {
        updateData("q3", [...selected, option]);
      } else {
        alert(`Maximum ${max} options allowed.`);
      }
    }
  };

  return (
    <div className="screen-container">
      <h1>Why do you create videos?</h1>
      <p className="multi-hint">Select up to 3 options</p>
      <div className="options-container">
        {options.map((option) => (
          <button
            key={option}
            className={`pill-btn ${selected.includes(option) ? "selected" : ""}`}
            onClick={() => toggleOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={() => nextScreen("q4")}>
        Next
      </button>
    </div>
  );
}
