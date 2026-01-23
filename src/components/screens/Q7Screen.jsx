import React from "react";

export default function Q7Screen({ data, updateData, nextScreen }) {
  const handleSelect = (value) => {
    updateData("q7", value);
    nextScreen("q8");
  };

  const options = [
    "Mobile Games",
    "Short Videos",
    "Long Docs",
    "Reading Articles",
    "Not Interested",
  ];

  return (
    <div className="screen-container">
      <h1>How do you engage with serious content?</h1>
      <div className="options-container">
        {options.map((option) => (
          <button
            key={option}
            className={`pill-btn ${data.q7 === option ? "selected" : ""}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
