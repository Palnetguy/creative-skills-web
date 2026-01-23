# 🔧 Complete Setup Guide - Google Sheets Authentication

## Issue: "error:1E08010C:DECODER routines::unsupported"

This error means the private key in `.env` is malformed or incomplete. Follow these steps to fix it.

---

## Step 1: Create a Google Service Account

### 1a. Go to Google Cloud Console

- Navigate to [Google Cloud Console](https://console.cloud.google.com)
- If you don't have a project, create one:
  - Click on the project dropdown (top left)
  - Click "New Project"
  - Enter name: "Creative Skills"
  - Click "Create"

### 1b. Enable Google Sheets API

- Search for "Google Sheets API"
- Click on it and press "Enable"

### 1c. Create a Service Account

1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. **Service account details:**
   - Name: `survey-app`
   - Description: `Survey data upload`
   - Click **Create and Continue**

4. **Grant roles:**
   - Click the service account you just created
   - Click **Keys** tab
   - Click **Add Key** → **Create new key**
   - Choose **JSON** format
   - Click **Create**
   - A JSON file will download automatically

### 1d. Share Your Google Sheet

- Open your Google Sheet
- Click **Share** (top right)
- Copy the service account email from your JSON file (it looks like: `survey-app@project-name.iam.gserviceaccount.com`)
- Paste it in the share dialog
- Select **Editor** permissions
- Uncheck "Notify people"
- Click **Share**

---

## Step 2: Add Credentials to `.env`

### Option A: Automatic Setup (Recommended)

Run this command in your terminal:

```bash
node setup-credentials.js
```

Follow the prompts:

1. Enter path to your JSON file (e.g., `C:\Users\YourName\Downloads\survey-app-key.json`)
2. Review the credentials shown
3. Press `y` to confirm

### Option B: Manual Setup

1. Open your downloaded JSON file in a text editor
2. Find these two values:
   - `"client_email"` - the service account email
   - `"private_key"` - the private key (starts with `-----BEGIN PRIVATE KEY-----`)

3. Open your `.env` file and replace:

```env
VITE_SERVICE_ACCOUNT_EMAIL=survey-app@tak-poultry-app.iam.gserviceaccount.com
VITE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n
```

**Important:** Make sure the private key has `\n` (backslash-n) NOT actual newlines

---

## Step 3: Verify Configuration

1. Kill the server (press Ctrl+C)
2. Restart it:

```bash
npm run dev:server
```

3. Check if you see:
   - ✅ `Service account credentials loaded successfully`

If you see an error, your private key format is wrong. Go back to Step 2.

---

## Step 4: Test It!

1. Make sure both servers are running:

   ```bash
   npm run dev:all
   ```

2. Go to http://localhost:5173
3. Fill out and submit a survey
4. Check your Google Sheet - data should appear! 🎉

---

## Troubleshooting

### Error: "VITE_SERVICE_ACCOUNT_EMAIL not configured"

- Open `.env`
- Make sure `VITE_SERVICE_ACCOUNT_EMAIL=` line exists and has the service account email

### Error: "VITE_PRIVATE_KEY appears to be incomplete or placeholder"

- The private key is empty or malformed
- Run `node setup-credentials.js` again
- Or manually paste the entire private key from the JSON file

### Error: "Permission denied"

- Make sure the Google Sheet is shared with the service account email
- The service account must have **Editor** access

### Error: "Invalid private key format"

- The private key must be on ONE line
- It should start with: `-----BEGIN PRIVATE KEY-----\n`
- It should end with: `\n-----END PRIVATE KEY-----\n`
- Use the automatic setup script: `node setup-credentials.js`

### Error on server: "Failed to authenticate"

- Restart the Node server after updating `.env`
- Use: `npm run dev:server`

---

## Environment Variables Reference

| Variable                     | From JSON      | Example                                          |
| ---------------------------- | -------------- | ------------------------------------------------ |
| `VITE_GOOGLE_SHEET_ID`       | Sheet URL      | `1y81XMhj11sm-ZtmcZu7GYtsxJSwZL8Adb4Jrrs48PD8`   |
| `VITE_SERVICE_ACCOUNT_EMAIL` | `client_email` | `survey-app@project-123.iam.gserviceaccount.com` |
| `VITE_PRIVATE_KEY`           | `private_key`  | `-----BEGIN PRIVATE KEY-----\n...`               |
| `VITE_BACKEND_URL`           | N/A            | `http://localhost:3001`                          |

---

## Architecture

```
Browser (React)
    ↓ sends survey data
Frontend (Vite)
    ↓ POST http://localhost:3001/api/sheets/append
Backend (Node.js/Express)
    ↓ authenticates with Service Account
Google Sheets API
    ↓ appends row
Your Google Sheet ✅
```

---

## Security Notes

⚠️ **Keep your private key safe!**

- Never commit `.env` to git (it's in `.gitignore`)
- Never share your private key
- The key can only access the Google Sheet it's authorized for
- For production, use proper secrets management

✅ **Best practices:**

- Store in environment variables on your server
- Use a secrets vault (AWS Secrets Manager, Google Secret Manager, etc.)
- Rotate keys periodically
