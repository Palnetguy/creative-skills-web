// Google Sheets Configuration
const GOOGLE_CONFIG = {
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || "YOUR_GOOGLE_SHEET_ID_HERE",
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_API_KEY_HERE",
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
};

// Initialize Google Sheets API (for backward compatibility)
export async function initializeGoogleSheets() {
  if (GOOGLE_CONFIG.SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
    console.log("⚠️ Google Sheets not configured yet - SHEET_ID is missing");
    return;
  }
  console.log("✅ Google Sheets API ready");
  return;
}

// Keep the old function for backwards compatibility
export function initGoogleSheets() {
  if (GOOGLE_CONFIG.SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
    console.log("Google Sheets not configured yet");
    return;
  }
  console.log("✅ Google Sheets API ready");
  return;
}

// Save data to Google Sheets via backend server
export async function saveToGoogleSheets(data) {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  console.log("🔍 Google Sheets Config Check:", {
    backendUrl: BACKEND_URL,
  });

  try {
    console.log("📝 Converting data to sheet row...");
    const row = convertDataToRow(data);

    console.log("📤 Sending to backend server...");

    const response = await fetch(`${BACKEND_URL}/api/sheets/append`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: row,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Successfully saved to Google Sheets:", result);
    return result;
  } catch (error) {
    // Handle errors safely without relying on .stack which may be undefined
    const errorObj = error || new Error("Unknown error");
    const errorMessage = errorObj.message || String(errorObj);
    const errorName = errorObj.name || "Error";

    console.error("❌ Error saving to Google Sheets:", errorMessage);
    console.error("Error name:", errorName);

    // Re-throw with safe error object
    const safeError = new Error(errorMessage);
    safeError.name = errorName;
    throw safeError;
  }
}

// Convert survey data to spreadsheet row
function convertDataToRow(data) {
  return [
    data.timestamp || new Date().toISOString(),
    data.name || "Anonymous",
    data.age || "N/A",
    data.gender || "N/A",
    data.country || "N/A",
    data.q1 || "",
    data.q2 || "",
    Array.isArray(data.q3) ? data.q3.join("; ") : data.q3 || "",
    data.q4 || "",
    Array.isArray(data.q5) ? data.q5.join("; ") : data.q5 || "",
    Array.isArray(data.q6) ? data.q6.join("; ") : data.q6 || "",
    data.q7 || "",
    JSON.stringify(data.q8 || {}),
    JSON.stringify(data.q9 || {}),
    data.q10 || "",
    Array.isArray(data.q11) ? data.q11.join("; ") : data.q11 || "",
    JSON.stringify(data.q12 || {}),
  ];
}
