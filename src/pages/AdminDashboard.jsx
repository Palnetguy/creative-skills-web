import React, { useState, useEffect } from "react";
import "../styles/admin.css";
import { saveToGoogleSheets } from "../services/googleSheets";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const history = JSON.parse(localStorage.getItem("survey_history") || "[]");
    setRecords(history.reverse());
    setLoading(false);
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

  const goToSurvey = () => {
    window.location.href = "/";
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 Facilitator Dashboard</h1>
        <p className="subtitle">
          {records.length} response{records.length !== 1 ? "s" : ""} collected
        </p>
      </div>

      <div className="records-container">
        {loading ? (
          <p>Loading records...</p>
        ) : records.length === 0 ? (
          <p className="no-records">No survey responses collected yet.</p>
        ) : (
          <div className="records-grid">
            {records.map((record, i) => (
              <div key={i} className="record-card">
                <strong>#{records.length - i}</strong>
                <p className="record-name">{record.name || "Anonymous"}</p>
                <p className="record-meta">
                  {record.age ? `Age: ${record.age}` : ""}
                  {record.country ? ` • ${record.country}` : ""}
                </p>
                <p className="record-time">
                  {new Date(record.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-actions">
        <button className="btn btn-primary" onClick={downloadAllCSV}>
          📥 Download as CSV
        </button>
        <button className="btn btn-success" onClick={downloadToGoogleSheets}>
          ☁️ Upload to Google Sheets
        </button>
        <button className="btn btn-secondary" onClick={goToSurvey}>
          ← Back to Survey
        </button>
        <button className="btn btn-danger" onClick={clearData}>
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
}
