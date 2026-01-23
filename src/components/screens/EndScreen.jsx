import React from "react";

export default function EndScreen({ nextScreen }) {
  const shareSurvey = (platform) => {
    const url = window.location.href;
    const text =
      "Hey! Help us build a creative digital skills program. Take this quick survey:";

    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        "_blank",
      );
    }
  };

  const retakeSurvey = () => {
    window.location.reload();
  };

  return (
    <div className="screen-container end-screen">
      <h1 style={{ marginTop: "60px", textAlign: "center" }}>Thank You!</h1>
      <p className="subtitle" style={{ textAlign: "center" }}>
        Your responses have been saved.
      </p>

      <div className="success-icon">✅</div>

      <div className="share-container">
        <button className="share-btn" onClick={() => shareSurvey("whatsapp")}>
          <span>🟢</span> Share to Friends
        </button>
      </div>

      <button className="btn-secondary" onClick={retakeSurvey}>
        Take Survey Again
      </button>
    </div>
  );
}
