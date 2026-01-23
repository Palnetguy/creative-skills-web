# 📊 Admin Dashboard - New Real-Time Sync Features

## What's New

Your Admin Dashboard now has **two data sources**:

### ☁️ Google Sheets (Recommended)

- Fetches live data from your Google Sheet
- Always up-to-date
- Works across devices
- Best for: Collaborative/multi-user access

### 💾 Local Storage (Offline Backup)

- Uses browser cached data
- Works without internet
- Falls back automatically if Google Sheets unavailable
- Best for: Offline scenarios or troubleshooting

## How to Use

### 1. Access Admin Dashboard

Go to: http://localhost:5173/admin

### 2. Choose Data Source

- Click **☁️ Google Sheets** (default) for live data
- Click **💾 Local Storage** for offline data

### 3. View Survey Responses

- All responses display in cards
- Shows: Name, Age, Country, Timestamp
- Count at the top

### 4. Refresh Data

Click **🔄 Refresh Data** to reload from current source

### 5. Export or Upload

- **📥 Download as CSV** - Export to CSV file
- **☁️ Upload to Google Sheets** - Batch upload local data
- **← Back to Survey** - Return to survey
- **🗑️ Clear All Data** - Delete all local responses

## Auto-Sync Explained

Every time someone submits a survey:

1. ✅ Data saved to browser localStorage (backup)
2. 📤 Data automatically synced to Google Sheets (real-time)
3. 🔄 Admin can view live data immediately

## Troubleshooting

**Data not showing in Google Sheets mode?**

- Refresh page
- Check backend is running: `npm run dev:server`
- Verify Google Sheet is shared with service account

**Stuck on Local Storage?**

- Backend temporarily down
- All data still available locally
- Will auto-sync when backend comes back online

**Want to go back to local-only?**

- Click **💾 Local Storage** button
- Admin will read from browser cache instead

## What Changed Behind the Scenes

### New Backend Endpoints

**GET /api/sheets/data**

- Fetches all rows from Google Sheet
- Used by Admin Dashboard

**POST /api/sheets/append**

- Already existed - still used for survey submissions

### New Service File

`src/services/sheetsRead.js`

- Handles fetching data from backend
- Parses Google Sheet format back to survey objects

### Updated Files

- `AdminDashboard.jsx` - Dual data source + UI controls
- `admin.css` - New styles for source toggle
- `server.js` - New GET /api/sheets/data endpoint
- `DemographicsScreen.jsx` - Better error messages

## For Production

To deploy:

1. Ensure service account credentials are in environment variables
2. Update `VITE_BACKEND_URL` to your production backend
3. Deploy both frontend and backend
4. Admin can access from anywhere with internet

## Questions?

See: REALTIME_SYNC.md for full technical details
