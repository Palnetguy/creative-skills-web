#!/usr/bin/env node

import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("\n📋 Google Service Account Key Setup\n");
  console.log(
    "This script will help you add your service account credentials to .env\n",
  );

  const jsonPath = await question(
    "📁 Enter path to your service account JSON file: ",
  );

  if (!fs.existsSync(jsonPath)) {
    console.error("❌ File not found:", jsonPath);
    rl.close();
    return;
  }

  try {
    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    const serviceAccount = JSON.parse(fileContent);

    if (!serviceAccount.client_email || !serviceAccount.private_key) {
      console.error(
        "❌ Invalid service account file. Missing client_email or private_key",
      );
      rl.close();
      return;
    }

    // Read current .env
    const envPath = ".env";
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    // Update or add the credentials
    const newEnv = updateEnvContent(
      envContent,
      serviceAccount.client_email,
      serviceAccount.private_key,
    );

    // Show what will be updated
    console.log("\n✅ Found credentials:");
    console.log(`   Email: ${serviceAccount.client_email}`);
    console.log(
      `   Private Key: ${serviceAccount.private_key.substring(0, 50)}...`,
    );

    const confirm = await question("\n📝 Write these to .env? (y/N): ");
    if (confirm.toLowerCase() === "y") {
      fs.writeFileSync(envPath, newEnv);
      console.log("✅ .env updated successfully!\n");
      console.log("📌 Next steps:");
      console.log("   1. Make sure your Google Sheet is shared with:");
      console.log(`      ${serviceAccount.client_email}`);
      console.log("   2. Give it 'Editor' access");
      console.log("   3. Restart the server: npm run dev:server");
      console.log("   4. Submit a survey to test\n");
    } else {
      console.log("Cancelled.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }

  rl.close();
}

function updateEnvContent(envContent, email, privateKey) {
  // Escape the private key properly for .env
  const escapedKey = privateKey.replace(/\n/g, "\\n");

  // Remove old credentials if they exist
  let newContent = envContent
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("VITE_SERVICE_ACCOUNT_EMAIL=") &&
        !line.startsWith("VITE_PRIVATE_KEY="),
    )
    .join("\n");

  // Ensure proper newline
  if (!newContent.endsWith("\n")) {
    newContent += "\n";
  }

  // Add new credentials
  newContent += `\nVITE_SERVICE_ACCOUNT_EMAIL=${email}\n`;
  newContent += `VITE_PRIVATE_KEY=${escapedKey}\n`;

  return newContent;
}

main().catch(console.error);
