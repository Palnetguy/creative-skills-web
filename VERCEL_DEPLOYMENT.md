# 🚀 Vercel Deployment Guide - Node + React

## Overview

You have two separate applications:

- **Frontend**: React/Vite (5173)
- **Backend**: Node.js/Express (3001)

Vercel can deploy both, but they need **separate deployment configurations**.

---

## Option 1: RECOMMENDED - Separate Deployments

### Best for: Production scalability & flexibility

Deploy as **2 Vercel Projects**:

1. Frontend on Vercel (React/Vite)
2. Backend on Vercel (Node.js serverless functions)

---

## Step 1: Prepare Backend for Vercel

Create `vercel.json` in root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "VITE_GOOGLE_SHEET_ID": "@google_sheet_id",
    "VITE_SERVICE_ACCOUNT_EMAIL": "@service_account_email",
    "VITE_PRIVATE_KEY": "@private_key"
  }
}
```

Update `server.js` to export as serverless function:

```javascript
// Add this at the end instead of app.listen()
export default app;

// Keep for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
```

---

## Step 2: Deploy Backend to Vercel

### Via Vercel CLI:

```bash
npm install -g vercel
vercel login

# In project root
vercel --prod
```

### Via GitHub:

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Select "Other" for framework
6. Configure environment variables (see below)
7. Deploy

### Set Environment Variables on Vercel:

Go to **Project Settings** → **Environment Variables**:

```
VITE_GOOGLE_SHEET_ID = your_sheet_id
VITE_SERVICE_ACCOUNT_EMAIL = your_email@project.iam.gserviceaccount.com
VITE_PRIVATE_KEY = sample
```

**After deployment**, you'll get a URL like: `https://your-project.vercel.app`

---

## Step 3: Deploy Frontend to Vercel

Create `.env.production` in frontend:

```
VITE_BACKEND_URL=https://your-backend.vercel.app
```

### Via Vercel CLI:

```bash
cd your-project
vercel --prod
```

### Via GitHub:

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repo
4. Select **Vite** as framework
5. Build command: `npm run build`
6. Output directory: `dist`
7. Add environment variables
8. Deploy

---

## Step 4: Update CORS on Backend

In `server.js`, update CORS for production:

```javascript
import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-frontend.vercel.app", // Your production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
```

---

## Full Deployment Checklist

### Backend Setup

- [ ] Create `vercel.json` in root
- [ ] Update `server.js` to export default app
- [ ] Update CORS configuration
- [ ] Test locally: `npm run dev:server`
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Copy Vercel URL (e.g., `https://api-backend.vercel.app`)

### Frontend Setup

- [ ] Create `.env.production` with backend URL
- [ ] Update `.env.development` for localhost
- [ ] Test locally: `npm run dev`
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Verify backend URL is correct
- [ ] Test survey submission

### Post-Deployment

- [ ] Test survey submission
- [ ] Check admin dashboard loads data
- [ ] Verify data appears in Google Sheets
- [ ] Test refresh/sync
- [ ] Monitor Vercel logs for errors

---

## Environment Files

### `.env.development` (local)

```
VITE_BACKEND_URL=http://localhost:3001
VITE_GOOGLE_SHEET_ID=your_id
VITE_SERVICE_ACCOUNT_EMAIL=your_email
VITE_PRIVATE_KEY=your_key
```

### `.env.production` (Vercel)

```
VITE_BACKEND_URL=https://your-api.vercel.app
```

On Vercel dashboard, set the same variables in **Environment Variables**.

---

## How Vercel Runs Everything

### Frontend (React/Vite)

```
Vercel CDN
    ↓
Static files (HTML, CSS, JS)
    ↓
Browser requests /admin
    ↓
Serves from edge (fast!)
    ↓
Browser calls backend API
```

### Backend (Node.js)

```
Vercel Serverless Functions
    ↓
server.js runs on AWS Lambda
    ↓
POST /api/sheets/append
GET /api/sheets/data
    ↓
Returns JSON
    ↓
Frontend consumes data
```

---

## Deployment Flow

```
Local Development
    ↓
npm run dev:all (both servers)
    ↓
Test everything works
    ↓
Git commit & push
    ↓
GitHub repo updated
    ↓
Vercel detects changes
    ↓
Automatic build & deploy
    ↓
Frontend on vercel.app
Backend on vercel.app/api/*
    ↓
Users access https://your-project.vercel.app
```

---

## Important Notes

### 1. Cold Start

- First request to serverless function is slower (1-2s)
- Subsequent requests are fast
- Use `vercel logs` to monitor

### 2. Private Key Storage

- Never commit `.env` to git (it's in `.gitignore`)
- Store in Vercel Dashboard only
- Vercel encrypts all environment variables

### 3. Database/State

- Serverless functions are stateless
- Each request is fresh instance
- Google Sheets is your "database"
- localStorage only on client side

### 4. Cost

- Free tier: 100GB/month bandwidth
- $20/month Pro: Unlimited
- Most hobby projects: Free

---

## Troubleshooting

### "Backend URL not working"

- Check `.env.production` has correct URL
- Verify Vercel backend deployed successfully
- Check CORS configuration in server.js

### "Google Sheets sync failing"

- Verify service account credentials in Vercel Dashboard
- Check private key has proper newlines (`\n`)
- Verify Sheet is shared with service account email
- Check Vercel logs: `vercel logs`

### "Admin dashboard shows Anonymous"

- Verify backend is returning data
- Check browser console for errors
- Test `/api/sheets/data` directly in browser

### "Cold start too slow"

- This is normal, unavoidable on free tier
- Pro: Pre-built functions, faster response
- Alternative: Keep backend on separate service (Railway, Render, etc.)

---

## Alternative: Keep Backend Local/Separate

If you want to keep backend on a **different service**:

1. Deploy backend to: **Railway.app**, **Render.com**, **Heroku**
2. Deploy frontend to: **Vercel**
3. Frontend calls external backend URL
4. Simpler, more flexible, better for development

---

## Commands Cheat Sheet

```bash
# Local development
npm run dev:all

# Build for production
npm run build

# Deploy backend
vercel deploy --prod

# Deploy frontend
cd frontend && vercel deploy --prod

# Check logs
vercel logs [project-name]

# Rollback
vercel rollback

# View dashboard
vercel ls
```

---

## Next Steps

1. **Choose deployment option** (Vercel for both vs separate services)
2. **Create vercel.json** for backend
3. **Test locally** to ensure everything works
4. **Push to GitHub**
5. **Deploy backend first**
6. **Get backend URL**
7. **Deploy frontend with backend URL**
8. **Test production**

Need help with any specific step? Let me know!
