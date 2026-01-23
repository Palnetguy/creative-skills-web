import React from "react";

export default function Q12Screen({ data, updateData, nextScreen }) {
  const traits = ["Prompting", "AI Art", "AI Coding", "AI Ethics/Safety"];
  const ratings = data.q12 || {};

  const setRating = (trait, value) => {
    updateData("q12", { ...ratings, [trait]: value });
  };

  return (
    <div className="screen-container">
      <h1>Interest in learning AI skills:</h1>
      <div className="ratings-container">
        {traits.map((trait) => (
          <div key={trait} className="rating-card">
            <span className="rating-label">{trait}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className={`star ${ratings[trait] === num ? "selected" : ""}`}
                  onClick={() => setRating(trait, num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn-primary"
        onClick={() => nextScreen("demographics")}
      >
        Next
      </button>
    </div>
  );
}
