// Google Sheets Configuration
const GOOGLE_CONFIG = {
  CLIENT_ID:
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE",
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || "YOUR_GOOGLE_SHEET_ID_HERE",
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_API_KEY_HERE",
};

let googleAuthToken = null;

// Initialize Google Sheets API
export async function initializeGoogleSheets() {
  if (GOOGLE_CONFIG.SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
    console.log("⚠️ Google Sheets not configured yet - SHEET_ID is missing");
    return;
  }

  return new Promise((resolve) => {
    if (typeof gapi === "undefined") {
      console.error("❌ Google API (gapi) not available");
      resolve();
      return;
    }

    gapi.load("client:auth2", () => {
      gapi.auth2
        .init({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          scope: "https://www.googleapis.com/auth/spreadsheets",
        })
        .then(() => {
          console.log("✅ Google Sheets API initialized successfully");
          resolve();
        })
        .catch((error) => {
          console.error("❌ Failed to initialize Google Sheets:", error);
          resolve();
        });
    });
  });
}

// Keep the old function for backwards compatibility
export function initGoogleSheets() {
  if (GOOGLE_CONFIG.SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
    console.log("Google Sheets not configured yet");
    return;
  }

  return new Promise((resolve) => {
    gapi.load("client:auth2", () => {
      gapi.auth2
        .init({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          scope: "https://www.googleapis.com/auth/spreadsheets",
        })
        .then(() => {
          console.log("Google Sheets API initialized");
          resolve();
        });
    });
  });
}

// Save data to Google Sheets
export async function saveToGoogleSheets(data) {
  console.log("🔍 Google Sheets Config Check:", {
    hasClientId:
      !!GOOGLE_CONFIG.CLIENT_ID &&
      GOOGLE_CONFIG.CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE",
    hasSheetId:
      !!GOOGLE_CONFIG.SHEET_ID &&
      GOOGLE_CONFIG.SHEET_ID !== "YOUR_GOOGLE_SHEET_ID_HERE",
    hasApiKey:
      !!GOOGLE_CONFIG.API_KEY && GOOGLE_CONFIG.API_KEY !== "YOUR_API_KEY_HERE",
  });

  if (GOOGLE_CONFIG.SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
    console.warn("⚠️ Google Sheets not configured - SHEET_ID is missing");
    return;
  }

  if (GOOGLE_CONFIG.CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE") {
    console.warn("⚠️ Google Sheets not configured - CLIENT_ID is missing");
    return;
  }

  try {
    console.log("📡 Checking if gapi is available...");
    if (typeof gapi === "undefined") {
      throw new Error(
        "Google API (gapi) not loaded. Make sure Google API script is in index.html",
      );
    }

    console.log("🔐 Getting auth instance...");
    const auth = gapi.auth2.getAuthInstance();

    if (!auth) {
      console.log("🔑 Auth not initialized, initializing now...");
      await initGoogleSheets();
      return saveToGoogleSheets(data); // Retry after init
    }

    console.log("✔️ Auth instance found");
    console.log("📋 Sign-in status:", auth.isSignedIn.get());

    if (!auth.isSignedIn.get()) {
      console.log("🔐 User not signed in, requesting sign-in...");
      await auth.signIn();
      console.log("✅ User signed in");
    }

    console.log("📝 Converting data to sheet row...");
    const row = convertDataToRow(data);
    const resource = { values: [row] };

    console.log("📤 Sending to Google Sheets API...");
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_CONFIG.SHEET_ID,
      range: "Sheet1!A:Z",
      valueInputOption: "RAW",
      resource: resource,
    });

    console.log("✅ Successfully saved to Google Sheets:", response);
    return response;
  } catch (error) {
    console.error("❌ Error saving to Google Sheets:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.result && error.result.error) {
      console.error("API Error:", error.result.error);
    }
    throw error;
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
