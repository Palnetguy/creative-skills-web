# Creative Skills Survey - Quick Start Guide

## What's New in the React Vite Version

✅ **Complete Rewrite** - Converted from plain HTML to modern React with Vite
✅ **Component Architecture** - 12 separate screen components + admin dashboard
✅ **Better State Management** - React hooks for efficient data handling
✅ **Separate Admin Interface** - Completely independent facilitator dashboard
✅ **Google Sheets Ready** - Built-in Google Sheets API integration
✅ **Environment Variables** - Secure configuration with `.env` files
✅ **Production Build** - Optimized bundle (191KB gzipped)

## Quick Start

### 1. Local Development

```bash
cd creative-skills-web-repo

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit: `http://localhost:5173`
Admin: `http://localhost:5173?admin=true`

### 2. Production Build

```bash
npm run build
```

Output: `dist/` folder (ready to deploy)

## Project Structure

```
creative-skills-web-repo/
├── src/
│   ├── components/screens/    # 12 survey screens + end screen
│   ├── pages/
│   │   ├── SurveyApp.jsx      # Main survey
│   │   └── AdminDashboard.jsx # Separate admin panel
│   ├── services/
│   │   └── googleSheets.js    # Google Sheets API
│   ├── styles/
│   │   ├── survey.css         # Survey styling
│   │   └── admin.css          # Admin styling
│   └── App.jsx                # Route handler
├── .env                        # Configuration (local)
├── .env.example                # Configuration template
├── package.json
├── vite.config.ts
└── index.html
```

## Google Sheets Setup (Optional)

The app stores data in browser's localStorage. To auto-save to Google Sheets:

### 1. Get Credentials
- Google Cloud Console: https://console.cloud.google.com
- Create OAuth 2.0 Client ID (Web Application)
- Enable Google Sheets API
- Create API Key

### 2. Create Google Sheet
- Go to https://sheets.google.com
- Create new sheet named "Creative Skills Survey Responses"
- Add headers in row 1

### 3. Update .env
```env
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_GOOGLE_SHEET_ID=your_sheet_id
VITE_GOOGLE_API_KEY=your_api_key
```

### 4. Start Using
- Submit a survey response
- First time: authorize Google access
- Future submissions: auto-save silently

## Admin Dashboard Features

Access via: `?admin=true` parameter

- 📋 View all responses
- 📥 Download as CSV
- ☁️ Batch upload to Google Sheets
- 🗑️ Clear all data
- ← Back to survey

## Data Flow

```
Survey Form → localStorage → (Optional) Google Sheets
    ↓
Admin Dashboard → Read from localStorage
    ↓
Export (CSV) or Upload (Google Sheets)
```

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Traditional Server
```bash
npm run build
# Upload dist/ folder to your server
# Configure server to serve index.html for all routes
```

## Environment Variables for Production

```env
VITE_GOOGLE_CLIENT_ID=production_client_id
VITE_GOOGLE_SHEET_ID=production_sheet_id
VITE_GOOGLE_API_KEY=production_api_key
```

⚠️ **Security Note**: Never commit `.env` file with real credentials. Use:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- GitHub: Settings → Secrets → Actions

## Testing

```bash
# Development with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Key Differences from HTML Version

| Feature | HTML | React Vite |
|---------|------|-----------|
| Build Tool | None | Vite |
| Framework | Vanilla JS | React |
| Components | Single file | 14+ files |
| State | Object | React Hooks |
| Admin | Hidden | Separate page |
| Dev Server | Manual | Live reload |
| Build Size | 3KB | 191KB (gzipped) |
| Performance | Fast | Faster |

## Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 3000
```

### Google Sheets not connecting?
1. Check `.env` values
2. Verify Google APIs are enabled
3. Check browser console (F12)
4. Try incognito/private mode

### Admin dashboard blank?
- Make sure localStorage has data
- Check `?admin=true` parameter
- Open developer console for errors

### Build errors?
```bash
# Clear and reinstall
rm -r node_modules package-lock.json
npm install
npm run build
```

## Repository

- **Repo**: https://github.com/Palnetguy/creative-skills-web.git
- **Branch**: `react-vite-refactor`
- **Main Branch**: `main` (coming soon)

## Next Steps

1. ✅ React + Vite setup complete
2. 📝 Test locally with `npm run dev`
3. 🔑 Set up Google Sheets (optional)
4. 🚀 Deploy to Vercel/Netlify
5. 📊 Start collecting responses!

## Support

For issues:
1. Check browser console (F12)
2. Review .env configuration
3. Check GitHub issues

Happy surveying! 🎉
