// Utility functions for formatting survey data

export function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "No date";
  }

  try {
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Format as: "Jan 23, 2025 • 2:45 PM"
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " • " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  } catch (e) {
    return "Invalid date";
  }
}

export function getSurveyAnswerPreview(record) {
  // Get a preview of survey answers - check for various possible keys
  const answers = [];

  // Try different possible column names (case-insensitive)
  const keys = Object.keys(record);
  const q1Key = keys.find(
    (k) =>
      k.toLowerCase() === "q1" ||
      k.toLowerCase().includes("q1") ||
      k.toLowerCase().includes("device"),
  );
  const q2Key = keys.find(
    (k) =>
      k.toLowerCase() === "q2" ||
      k.toLowerCase().includes("q2") ||
      k.toLowerCase().includes("internet"),
  );
  const q4Key = keys.find(
    (k) =>
      k.toLowerCase() === "q4" ||
      k.toLowerCase().includes("q4") ||
      k.toLowerCase().includes("videochannel"),
  );

  if (q1Key && record[q1Key]) {
    answers.push(String(record[q1Key]).substring(0, 25));
  }
  if (q2Key && record[q2Key]) {
    answers.push(String(record[q2Key]).substring(0, 25));
  }
  if (q4Key && record[q4Key]) {
    answers.push(String(record[q4Key]).substring(0, 25));
  }

  return answers.slice(0, 2).join(" • ");
}

export function getDemographicsText(record) {
  const parts = [];
  const keys = Object.keys(record);

  // Handle various possible column name formats (case-insensitive)
  const ageKey = keys.find((k) => k.toLowerCase() === "age");
  const genderKey = keys.find((k) => k.toLowerCase() === "gender");
  const countryKey = keys.find((k) => k.toLowerCase() === "country");

  const age = ageKey ? record[ageKey] : "";
  const gender = genderKey ? record[genderKey] : "";
  const country = countryKey ? record[countryKey] : "";

  if (age && age !== "N/A" && age !== "") {
    parts.push(`Age: ${age}`);
  }

  if (gender && gender !== "N/A" && gender !== "") {
    parts.push(gender);
  }

  if (country && country !== "N/A" && country !== "") {
    parts.push(`📍 ${country}`);
  }

  return parts.join(" • ") || "No demographics";
}

export function getCompletionStatus(record) {
  // Check how many questions were answered
  // Look for fields that start with Q (case-insensitive)
  const keys = Object.keys(record);
  const questionFields = keys.filter((k) => {
    const lower = k.toLowerCase();
    return (
      lower.startsWith("q") &&
      !lower.includes("timestamp") &&
      !lower.includes("name") &&
      !lower.includes("age") &&
      !lower.includes("gender") &&
      !lower.includes("country")
    );
  });

  const answeredCount = questionFields.filter((k) => record[k]).length;
  const totalCount = Math.max(questionFields.length, 1); // Avoid division by zero

  return {
    answered: answeredCount,
    total: totalCount,
    percentage:
      totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0,
  };
}

export function getEmoji(percentage) {
  if (percentage === 100) return "✅";
  if (percentage >= 80) return "⚡";
  if (percentage >= 60) return "⚙️";
  if (percentage >= 40) return "⏳";
  return "📝";
}
