# 🔄 Real-Time Sync Architecture

## What Changed

The admin dashboard now has **real-time sync** with Google Sheets as the single source of truth.

## Data Flow

```
User Submits Survey
    ↓
1. Save to localStorage (backup)
2. Auto-sync to Google Sheets via backend
    ↓
Admin Dashboard
    ↓
Option A: Fetch from Google Sheets (live data)
Option B: Read from localStorage (cached data)
    ↓
Display to facilitator
```

## Features

### 1. Real-Time Survey Sync ✅

- Every survey submission automatically sends to Google Sheets
- Falls back to localStorage if backend fails
- Data never lost (always saved locally first)

### 2. Admin Dashboard - Dual Mode

- **☁️ Google Sheets Mode** (default)
  - Fetches live data from your sheet
  - Always up-to-date across devices
  - Shows "Last synced" time
- **💾 Local Storage Mode**
  - Reads from browser cache
  - Works offline
  - Falls back automatically if Google Sheets unavailable

### 3. Refresh & Sync Controls

- **Refresh Data** button - reload from current source
- **Source Toggle** - switch between Google Sheets and Local Storage
- Data source shown in header

## Backend API

### POST `/api/sheets/append`

Append a single survey row to Google Sheets

**Request:**

```javascript
POST http://localhost:3001/api/sheets/append
{
  "data": [timestamp, name, age, gender, ...]
}
```

**Response:**

```javascript
{ "success": true, "response": {...} }
```

### GET `/api/sheets/data`

Fetch all survey responses from Google Sheets

**Request:**

```
GET http://localhost:3001/api/sheets/data
```

**Response:**

```javascript
{
  "success": true,
  "data": [
    { timestamp: "...", name: "...", age: "...", ... },
    { timestamp: "...", name: "...", age: "...", ... }
  ]
}
```

## Architecture Benefits

✅ **Single Source of Truth** - Google Sheets is canonical data store  
✅ **Always Available** - localStorage fallback if backend down  
✅ **Multi-Device** - Access from any device via Google Sheets  
✅ **Real-Time** - Auto-sync on every submission  
✅ **Offline Support** - Works without internet (saves to localStorage)  
✅ **Auditable** - All data visible in Google Sheets  
✅ **Secure** - Uses service account (no user sign-in needed)

## Usage

### For Survey Users

- Nothing changed - submit as normal
- Data saved automatically (to localStorage + Google Sheets)

### For Admin

1. Go to Admin Dashboard
2. Click "☁️ Google Sheets" or "💾 Local Storage"
3. Data loads automatically
4. Click "🔄 Refresh Data" to get latest
5. Export as CSV or upload manually if needed

## Troubleshooting

### Admin Dashboard shows "Google Sheets Mode" but data not loading

1. Check backend is running: `npm run dev:server`
2. Check `/health` endpoint: `http://localhost:3001/health`
3. Check `.env` has service account credentials
4. Check Google Sheet is shared with service account email

### Falls back to Local Storage automatically

- Backend/Google Sheets temporarily unavailable
- Admin can still access cached data
- Real-time sync resumes when backend available

### Data in Google Sheets but not showing in admin

1. Click "🔄 Refresh Data" button
2. Check network tab in browser DevTools
3. Verify backend is responding: `curl http://localhost:3001/health`

## Running Both Servers

**Combined:**

```bash
npm run dev:all
```

**Separate terminals:**

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev
```

## Environment Variables

Make sure `.env` has:

```
VITE_GOOGLE_SHEET_ID=...
VITE_SERVICE_ACCOUNT_EMAIL=...
VITE_PRIVATE_KEY=...
VITE_BACKEND_URL=http://localhost:3001
```

## Data Retention

- **localStorage**: Persists until user clears browser data
- **Google Sheets**: Persists indefinitely in your Google account
- **Recommended**: Use Google Sheets as backup for permanent records
