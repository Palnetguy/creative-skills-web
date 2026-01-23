# Creative Skills Survey - React Vite Edition

A modern, responsive survey application built with React and Vite, with auto-save to Google Sheets and a separate facilitator dashboard.

## Features

✨ **Fast & Responsive** - Built with React and Vite for lightning-fast performance
📊 **Survey Questions** - 12+ questions covering device usage, internet access, video creation, digital skills, and AI knowledge
☁️ **Google Sheets Integration** - Auto-save responses directly to Google Sheets
📱 **Mobile First** - Beautiful neumorphic design, optimized for mobile and tablet
🔐 **Private & Anonymous** - Data stored locally and optionally synced to your Google Sheet
🎯 **Facilitator Dashboard** - Separate admin panel to view, download, and manage responses
📤 **Export Options** - Download as CSV or upload to Google Sheets

## Project Structure

```
src/
├── components/
│   ├── screens/          # Individual survey question components
│   │   ├── IntroScreen.jsx
│   │   ├── Q1Screen.jsx through Q12Screen.jsx
│   │   ├── DemographicsScreen.jsx
│   │   └── EndScreen.jsx
│   ├── ProgressBar.jsx
├── pages/
│   ├── SurveyApp.jsx     # Main survey flow
│   └── AdminDashboard.jsx # Facilitator dashboard
├── services/
│   └── googleSheets.js   # Google Sheets API integration
├── styles/
│   ├── survey.css        # Survey UI styles
│   └── admin.css         # Admin dashboard styles
├── App.jsx               # Main app router
├── main.jsx              # Entry point
└── index.css
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Sheets (Optional but Recommended)

#### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called "Creative Skills Survey"
3. Enable the **Google Sheets API**

#### Step 2: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Create **OAuth 2.0 Client ID** (Web application)
3. Authorized JavaScript origins:
   - `http://localhost:5173` (for local development)
   - Your production domain
4. Copy your **Client ID**

#### Step 3: Create API Key
1. In Credentials, create an **API Key**
2. Copy your **API Key**

#### Step 4: Create Your Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet: "Creative Skills Survey Responses"
3. Add headers in row 1:
   ```
   Timestamp | Name | Age | Gender | Country | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Q11 | Q12
   ```
4. Copy the **Sheet ID** from the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

#### Step 5: Update Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
VITE_GOOGLE_SHEET_ID=YOUR_SHEET_ID
VITE_GOOGLE_API_KEY=YOUR_API_KEY
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Accessing the Facilitator Dashboard

The admin dashboard is accessible via:
- URL parameter: `http://localhost:5173?admin=true`
- Or click the hidden trigger in the top-right corner of the intro screen

### Dashboard Features:
- 📋 View all collected responses
- 📥 Download data as CSV
- ☁️ Upload to Google Sheets
- 🗑️ Clear all data (with confirmation)
- ← Return to survey

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Architecture

### Survey Flow (SurveyApp.jsx)
- Manages survey state and progression
- Handles data collection for all 12 questions plus demographics
- Shows progress bar at the top
- Auto-saves to localStorage and optionally to Google Sheets

### Admin Dashboard (AdminDashboard.jsx)
- Completely separate from the survey UI
- Reads data from localStorage
- Provides export and management options
- Can trigger Google Sheets upload

### Google Sheets Integration (googleSheets.js)
- Uses Google Sheets API v4
- Handles OAuth authentication
- Converts survey data to spreadsheet rows
- Gracefully handles missing configuration

## Data Structure

Each survey response includes:
```javascript
{
  timestamp: "2026-01-23T...",
  name: "User Name",
  age: "25",
  gender: "Female",
  country: "Kenya",
  q1: "My Smartphone",        // Device type
  q2: "Fast/Reliable",         // Internet connection
  q3: [...],                   // Multi-select: why create videos
  q4: "Sometimes",             // Have videos changed your opinion
  q5: [...],                   // Multi-select: where learn skills
  q6: [...],                   // Multi-select: why want digital skills
  q7: "Short Videos",          // How engage with serious content
  q8: {...},                   // Ratings: interest in skills
  q9: {...},                   // Ratings: importance of topics
  q10: "Community text...",    // Open-ended: biggest challenge
  q11: [...],                  // Multi-select: AI usage
  q12: {...}                   // Ratings: AI skills interest
}
```

## Styling

The app uses a beautiful **neumorphic design** with:
- Soft shadows and gradients
- Smooth transitions and animations
- Mobile-first responsive design
- Accessible color contrast

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Google Sheets not syncing?
1. Check `.env` file has correct credentials
2. Make sure Google Sheets API is enabled in Cloud Console
3. Check browser console (F12) for error messages
4. Ensure OAuth origins include your domain

### Survey not loading?
1. Run `npm install` to ensure dependencies
2. Check that `src/main.jsx` exists
3. Clear browser cache and reload

### Admin dashboard not accessible?
- Try URL: `?admin=true`
- Data is stored in localStorage - clear if needed for testing

## Future Enhancements

- [ ] Database backend (Firebase, Supabase)
- [ ] Email notifications for new responses
- [ ] Data visualization and analytics
- [ ] Multi-language support
- [ ] Custom branding options

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
