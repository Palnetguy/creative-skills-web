import React from "react";

export default function ProgressBar({ progress }) {
  return <div className="progress-bar" style={{ width: `${progress}%` }} />;
}
