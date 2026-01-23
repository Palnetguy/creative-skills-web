// Google Sheets Data Service - for reading data from the sheet
// Use relative URL - works on localhost:3001 and any Vercel domain

// Fetch all records from Google Sheets
export async function fetchFromGoogleSheets() {
  console.log("📖 Fetching survey data from Google Sheets...");

  try {
    const response = await fetch("/api/sheets/data");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log(
      `✅ Retrieved ${result.data?.length || 0} records from Google Sheets`,
    );
    return result.data || [];
  } catch (error) {
    const errorMessage = error?.message || String(error);
    console.error("❌ Error fetching from Google Sheets:", errorMessage);
    throw error;
  }
}

// Parse value from Google Sheets (handle arrays and objects)
function parseValue(value) {
  if (!value) return value;

  try {
    // Try to parse as JSON first (for objects/arrays)
    if (
      (value.startsWith("[") && value.endsWith("]")) ||
      (value.startsWith("{") && value.endsWith("}"))
    ) {
      return JSON.parse(value);
    }
  } catch (e) {
    // Not JSON, return as-is
  }

  return value;
}

// Convert raw Google Sheets row to survey data object
export function convertRowToData(row) {
  const data = {};

  Object.keys(row).forEach((key) => {
    const value = row[key];
    data[key] = parseValue(value);
  });

  return data;
}
