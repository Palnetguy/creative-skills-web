#!/usr/bin/env node

import fs from "fs";
import dotenv from "dotenv";

console.log("\n🔍 Checking Configuration...\n");

// Load .env
const envPath = ".env";
if (!fs.existsSync(envPath)) {
  console.error("❌ .env file not found!");
  process.exit(1);
}

const config = dotenv.parse(fs.readFileSync(envPath));

// Check SHEET_ID
if (!config.VITE_GOOGLE_SHEET_ID) {
  console.error("❌ VITE_GOOGLE_SHEET_ID is missing");
} else if (config.VITE_GOOGLE_SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
  console.error(
    "❌ VITE_GOOGLE_SHEET_ID is a placeholder. Add your actual Sheet ID.",
  );
} else {
  console.log("✅ VITE_GOOGLE_SHEET_ID configured");
}

// Check EMAIL
if (!config.VITE_SERVICE_ACCOUNT_EMAIL) {
  console.error("❌ VITE_SERVICE_ACCOUNT_EMAIL is missing");
} else if (!config.VITE_SERVICE_ACCOUNT_EMAIL.includes("@")) {
  console.error("❌ VITE_SERVICE_ACCOUNT_EMAIL doesn't look like an email");
} else {
  console.log(
    "✅ VITE_SERVICE_ACCOUNT_EMAIL: " + config.VITE_SERVICE_ACCOUNT_EMAIL,
  );
}

// Check PRIVATE_KEY
if (!config.VITE_PRIVATE_KEY) {
  console.error("❌ VITE_PRIVATE_KEY is missing");
  console.log("\n💡 Run: node setup-credentials.js");
} else if (config.VITE_PRIVATE_KEY.length < 100) {
  console.error("❌ VITE_PRIVATE_KEY looks incomplete (too short)");
  console.log("\n💡 Run: node setup-credentials.js");
} else if (!config.VITE_PRIVATE_KEY.includes("-----BEGIN PRIVATE KEY-----")) {
  console.error("❌ VITE_PRIVATE_KEY doesn't have the correct format");
} else {
  console.log(
    "✅ VITE_PRIVATE_KEY configured (" +
      config.VITE_PRIVATE_KEY.length +
      " characters)",
  );
}

// Check BACKEND_URL
if (!config.VITE_BACKEND_URL) {
  console.log(
    "⚠️  VITE_BACKEND_URL not set, using default: http://localhost:3001",
  );
} else {
  console.log("✅ VITE_BACKEND_URL: " + config.VITE_BACKEND_URL);
}

console.log(
  "\n📝 Next step: Share your Google Sheet with the service account email\n",
);
