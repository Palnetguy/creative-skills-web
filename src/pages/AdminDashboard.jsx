import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import { saveToGoogleSheets } from "../services/googleSheets";
import { fetchFromGoogleSheets } from "../services/sheetsRead";
import {
  formatTimestamp,
  getSurveyAnswerPreview,
  getDemographicsText,
  getCompletionStatus,
  getEmoji,
} from "../utils/formatSurvey";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("sheets"); // "sheets" or "local"
  const [lastSynced, setLastSynced] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecords();
  }, [dataSource]);

  const loadRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      if (dataSource === "sheets") {
        // Try to load from Google Sheets
        const sheetsData = await fetchFromGoogleSheets();
        setRecords(sheetsData.reverse());
        setLastSynced(new Date().toLocaleTimeString());
        console.log("✅ Loaded from Google Sheets");
      } else {
        // Load from localStorage
        const history = JSON.parse(
          localStorage.getItem("survey_history") || "[]",
        );
        setRecords(history.reverse());
        console.log("✅ Loaded from localStorage");
      }
    } catch (err) {
      console.error("Error loading records:", err);
      setError(err.message || "Failed to load data");

      // Fallback to localStorage if Google Sheets fails
      if (dataSource === "sheets") {
        console.log("⚠️ Falling back to localStorage...");
        const history = JSON.parse(
          localStorage.getItem("survey_history") || "[]",
        );
        setRecords(history.reverse());
        setDataSource("local");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadAllCSV = () => {
    if (records.length === 0) {
      alert("No data to download.");
      return;
    }

    const history = records.reverse();
    const rows = [];

    const allKeys = new Set();
    history.forEach((r) => Object.keys(r).forEach((k) => allKeys.add(k)));
    const headers = Array.from(allKeys);
    rows.push(headers.join(","));

    history.forEach((record) => {
      const row = headers.map((header) => {
        let val = record[header] || "";
        if (typeof val === "object")
          val = JSON.stringify(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      rows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "survey_responses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadToGoogleSheets = async () => {
    if (records.length === 0) {
      alert("No data to upload.");
      return;
    }

    console.log(
      `📤 Starting batch upload of ${records.length} records to Google Sheets...`,
    );
    let successCount = 0;
    let failCount = 0;

    try {
      const reversed = records.reverse();
      for (let i = 0; i < reversed.length; i++) {
        const record = reversed[i];
        try {
          console.log(`[${i + 1}/${reversed.length}] Uploading record...`);
          await saveToGoogleSheets(record);
          successCount++;
          console.log(`✅ Record ${i + 1} uploaded successfully`);
        } catch (error) {
          failCount++;
          console.error(`❌ Record ${i + 1} failed:`, error.message);
        }
      }
      console.log(
        `\n📊 Upload Summary: ${successCount} succeeded, ${failCount} failed`,
      );
      alert(
        `Upload complete! ${successCount} succeeded, ${failCount} failed. Check console for details.`,
      );
    } catch (error) {
      console.error("❌ Batch upload error:", error);
      alert("Error uploading to Google Sheets: " + error.message);
    }
  };

  const clearData = () => {
    if (
      confirm(
        "Are you sure? This will delete ALL records and cannot be undone.",
      )
    ) {
      localStorage.removeItem("survey_history");
      setRecords([]);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 Facilitator Dashboard</h1>
        <p className="subtitle">
          {records.length} response{records.length !== 1 ? "s" : ""} collected
        </p>

        <div className="data-source-info">
          <div className="source-toggle">
            <button
              className={`source-btn ${dataSource === "sheets" ? "active" : ""}`}
              onClick={() => setDataSource("sheets")}
            >
              ☁️ Google Sheets
            </button>
            <button
              className={`source-btn ${dataSource === "local" ? "active" : ""}`}
              onClick={() => setDataSource("local")}
            >
              💾 Local Storage
            </button>
          </div>
          {lastSynced && dataSource === "sheets" && (
            <p className="sync-time">Last synced: {lastSynced}</p>
          )}
          {error && <p className="error-message">⚠️ {error}</p>}
        </div>
      </div>

      <div className="records-container">
        {loading ? (
          <p>Loading records...</p>
        ) : records.length === 0 ? (
          <p className="no-records">No survey responses collected yet.</p>
        ) : (
          <div className="records-grid">
            {records.map((record, i) => {
              const status = getCompletionStatus(record);
              const emoji = getEmoji(status.percentage);
              const demographics = getDemographicsText(record);
              const answerPreview = getSurveyAnswerPreview(record);

              // Case-insensitive lookups
              const timestampKey = Object.keys(record).find(
                (k) => k.toLowerCase() === "timestamp",
              );
              const nameKey = Object.keys(record).find(
                (k) => k.toLowerCase() === "name",
              );

              const timestamp = formatTimestamp(
                timestampKey ? record[timestampKey] : record.timestamp,
              );
              const name = nameKey
                ? record[nameKey]
                : record.name || "Anonymous";

              return (
                <div key={i} className="record-card">
                  <div className="card-header">
                    <span className="card-number">#{records.length - i}</span>
                    <span className="completion-badge">
                      {emoji} {status.percentage}%
                    </span>
                  </div>

                  <div className="card-content">
                    <h3 className="respondent-name">
                      {name && name !== "Anonymous" ? name : "Anonymous"}
                    </h3>

                    {demographics !== "No demographics" && (
                      <p className="respondent-demographics">{demographics}</p>
                    )}

                    {answerPreview && (
                      <p className="answer-preview">
                        <span className="preview-label">Insights:</span>
                        {answerPreview}
                      </p>
                    )}

                    <p className="response-time">
                      <span className="time-icon">⏱️</span>
                      {timestamp}
                    </p>
                  </div>

                  <div className="card-footer">
                    <span className="question-count">
                      {status.answered}/{status.total} questions
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-actions">
        <button
          className="btn btn-primary"
          onClick={loadRecords}
          disabled={loading}
        >
          🔄 Refresh Data
        </button>
        <button className="btn btn-primary" onClick={downloadAllCSV}>
          📥 Download as CSV
        </button>
        <button className="btn btn-success" onClick={downloadToGoogleSheets}>
          ☁️ Upload to Google Sheets
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/")}
        >
          ← Back to Survey
        </button>
        <button className="btn btn-danger" onClick={clearData}>
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
}
