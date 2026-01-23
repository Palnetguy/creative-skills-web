import express from "express";
import cors from "cors";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", /vercel\.app$/],
    credentials: true,
  }),
);
app.use(express.json());

// Google Sheets configuration
const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.VITE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.VITE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Initialize Google Sheets client
const sheets = google.sheets("v4");

// Validate and create JWT client
let auth = null;
let authError = null;

if (!SERVICE_ACCOUNT_EMAIL) {
  authError = "❌ VITE_SERVICE_ACCOUNT_EMAIL not configured in .env file";
} else if (!PRIVATE_KEY) {
  authError = "❌ VITE_PRIVATE_KEY not configured in .env file";
} else if (
  PRIVATE_KEY.includes("-----BEGIN PRIVATE KEY-----") &&
  PRIVATE_KEY.length < 100
) {
  authError = "❌ VITE_PRIVATE_KEY appears to be incomplete or placeholder";
} else {
  try {
    auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log("✅ Service account credentials loaded successfully");
  } catch (error) {
    authError = `❌ Invalid private key format: ${error.message}`;
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    configured: {
      sheetId: !!SHEET_ID,
      serviceAccountEmail: !!SERVICE_ACCOUNT_EMAIL,
      privateKey: !!PRIVATE_KEY,
      authValid: !!auth,
    },
    error: authError,
  });
});

// Append data to Google Sheets
app.post("/api/sheets/append", async (req, res) => {
  try {
    const { data } = req.body;

    // Validate request data
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Check configuration
    if (!SHEET_ID) {
      return res.status(500).json({ error: "SHEET_ID not configured" });
    }

    if (authError) {
      return res.status(500).json({ error: authError });
    }

    if (!auth) {
      return res.status(500).json({
        error: "Service account not initialized. Check .env credentials.",
      });
    }

    console.log("📝 Appending row to Google Sheets...");

    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:Z",
      valueInputOption: "RAW",
      resource: {
        values: [data],
      },
    });

    console.log("✅ Successfully appended to Google Sheets");
    res.json({ success: true, response });
  } catch (error) {
    console.error("❌ Error appending to Google Sheets:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      error: error.message || "Failed to append to Google Sheets",
      details: error.details,
    });
  }
});

// Fetch all data from Google Sheets
app.get("/api/sheets/data", async (req, res) => {
  try {
    // Check configuration
    if (!SHEET_ID) {
      return res.status(500).json({ error: "SHEET_ID not configured" });
    }

    if (authError) {
      return res.status(500).json({ error: authError });
    }

    if (!auth) {
      return res.status(500).json({
        error: "Service account not initialized. Check .env credentials.",
      });
    }

    console.log("📖 Fetching data from Google Sheets...");

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:Z",
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Assume first row is headers, convert to objects
    const headers = rows[0];
    const dataRows = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    console.log(`✅ Retrieved ${dataRows.length} records from Google Sheets`);
    console.log("📋 Sample record:", JSON.stringify(dataRows[0], null, 2));
    res.json({ success: true, data: dataRows });
  } catch (error) {
    console.error("❌ Error fetching from Google Sheets:", error.message);
    res.status(500).json({
      error: error.message || "Failed to fetch from Google Sheets",
    });
  }
});

// Import path for static file serving
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files (frontend build) in production
if (process.env.NODE_ENV === "production") {
  // Static middleware only for non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next(); // Skip static serving for API routes
    }
    express.static(path.join(__dirname, "dist"))(req, res, next);
  });

  // Serve index.html for all non-API routes (SPA support)
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    }
  });
}

// Export for Vercel serverless
export default app;

// Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("📊 Ready to save survey data to Google Sheets");
    console.log(
      `🔍 Check http://localhost:${PORT}/health for configuration status`,
    );
    if (authError) {
      console.error(authError);
    }
  });
}
