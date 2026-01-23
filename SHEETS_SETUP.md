# Google Sheets Backend Setup Guide

## Problem Fixed

The API Key authentication failed because Google Sheets API requires OAuth2. This backend server solves it by using a **Service Account** which has permanent credentials.

## How It Works

1. **Frontend** (React) sends survey data to backend
2. **Backend** (Node.js) authenticates using Service Account credentials
3. **Backend** appends data directly to Google Sheets

## Setup Steps

### Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create a new one)
3. Enable **Google Sheets API**:
   - Search for "Google Sheets API"
   - Click "Enable"
4. Go to **IAM & Admin** > **Service Accounts**
5. Click **Create Service Account**
6. Enter name: `survey-app` (or your preference)
7. Click **Create and Continue**
8. Grant role: **Editor** (or use Basic Editor)
9. Click **Continue** and **Create Key**
10. Choose **JSON** format and download

### Step 2: Update `.env` File

Open your `.env` file and add:

```env
VITE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
VITE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

**Where to find these values in your downloaded JSON:**

- `client_email` → `VITE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `VITE_PRIVATE_KEY` (copy exactly, including `\n`)

### Step 3: Share Sheet with Service Account

1. Open your Google Sheet
2. Click **Share**
3. Add the service account email (from `.env`)
4. Give it **Editor** access
5. Uncheck "Notify people" if you want
6. Click **Share**

### Step 4: Start Both Servers

**Terminal 1 - Backend:**

```bash
npm run dev:server
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

**Or both at once:**

```bash
npm run dev:all
```

## Testing

1. Go to http://localhost:5173
2. Fill out and submit a survey
3. Check your Google Sheet - data should appear!

## Environment Variables Summary

| Variable                     | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `VITE_GOOGLE_SHEET_ID`       | Your Google Sheet ID (from URL)                       |
| `VITE_SERVICE_ACCOUNT_EMAIL` | Service account email (from JSON key)                 |
| `VITE_PRIVATE_KEY`           | Private key (from JSON key, with `\n` preserved)      |
| `VITE_BACKEND_URL`           | Backend server URL (default: `http://localhost:3001`) |

## Troubleshooting

**Error: "Service account credentials not configured"**

- Check that `VITE_SERVICE_ACCOUNT_EMAIL` and `VITE_PRIVATE_KEY` are in `.env`

**Error: "Permission denied"**

- Make sure the service account email has Editor access to your Sheet

**Error: "SHEET_ID not configured"**

- Check that `VITE_GOOGLE_SHEET_ID` is correct in `.env`

**Backend not connecting?**

- Make sure backend is running on port 3001
- Check `VITE_BACKEND_URL` in `.env`

## Production Deployment

For production, ensure:

1. Store credentials securely (environment variables, not in code)
2. Use HTTPS for backend
3. Set `VITE_BACKEND_URL` to your production backend URL
4. Add CORS restrictions to backend (whitelist your frontend domain)
