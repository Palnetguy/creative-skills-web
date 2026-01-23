# 🚀 Quick Deployment Checklist to Vercel

## Pre-Deployment (Local)

- [ ] **Test locally**: `npm run dev:all`
  - Survey submission works
  - Data saves to Google Sheets
  - Admin dashboard loads data
  - Timestamps display correctly

- [ ] **Verify environment variables**:
  ```bash
  # Check these are set in .env
  cat .env
  ```
- [ ] **Git setup**:
  ```bash
  git add .
  git commit -m "Ready for Vercel deployment"
  git push origin main
  ```

---

## Backend Deployment (Node.js API)

### Step 1: Deploy to Vercel

```bash
npm install -g vercel
vercel login
```

Then from project root:

```bash
vercel --prod
```

Or connect GitHub:

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Other" as framework
5. Click Deploy

### Step 2: Set Environment Variables

On Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
Name: VITE_GOOGLE_SHEET_ID
Value: 1y81XMhj11sm-ZtmcZu7GYtsxJSwZL8Adb4Jrrs48PD8

Name: VITE_SERVICE_ACCOUNT_EMAIL
Value: survey-app@tak-poultry-app.iam.gserviceaccount.com

Name: VITE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### Step 3: Get Backend URL

After deployment, you'll see:

```
✓ Production URL: https://your-backend-project.vercel.app
```

**Copy this URL** - you'll need it for frontend deployment!

---

## Frontend Deployment (React/Vite)

### Step 1: Update Environment

Edit `.env.production`:

```
VITE_BACKEND_URL=https://your-backend-project.vercel.app
```

Replace `your-backend-project` with your actual backend project name from Vercel.

### Step 2: Deploy to Vercel

```bash
vercel --prod
```

Or via GitHub:

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your repository
4. Select **Vite** as framework
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click Deploy

---

## Post-Deployment Testing

### Test Survey Flow

1. Go to `https://your-frontend.vercel.app`
2. Submit a survey with:
   - Name: "Test User"
   - Age: 25
   - Country: Kenya
3. Wait for redirect to End Screen

### Check Admin Dashboard

1. Go to `https://your-frontend.vercel.app/admin`
2. Click "☁️ Google Sheets" button
3. Should see your test response with:
   - Name: "Test User"
   - Demographics: "Age: 25 • Kenya"
   - Completion percentage
   - Timestamp

### Verify Google Sheets

1. Open your Google Sheet
2. Should see new row with all data
3. Timestamp, Name, Age, Country, All Q1-Q9 answers

### Check Vercel Logs

```bash
vercel logs your-backend-project

# Should see:
# 📖 Fetching data from Google Sheets...
# ✅ Retrieved X records from Google Sheets
# 📝 Appending row to Google Sheets...
# ✅ Successfully appended to Google Sheets
```

---

## Domain Setup (Optional)

### Connect Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `survey.yourcompany.com`)
3. Follow instructions to update DNS

### Auto-Generated URL

- Frontend: `https://your-frontend-project.vercel.app`
- Backend: `https://your-backend-project.vercel.app`

---

## Rollback (If Something Breaks)

```bash
# See deployment history
vercel ls

# Rollback to previous deployment
vercel rollback

# Or redeploy current code
vercel --prod
```

---

## Environment Variable Setup

### Where to Set Variables

**Option A: Vercel Dashboard (Recommended)**

1. Go to Project → Settings → Environment Variables
2. Add each variable
3. Auto-deployed to all functions

**Option B: `.env` file (Local only)**

```
VITE_GOOGLE_SHEET_ID=...
VITE_SERVICE_ACCOUNT_EMAIL=...
VITE_PRIVATE_KEY=...
```

**⚠️ Never commit `.env` to Git!** (It's in `.gitignore`)

---

## Troubleshooting

### Backend not responding

```bash
curl https://your-backend.vercel.app/health
```

Should return:

```json
{
  "status": "ok",
  "configured": {
    "sheetId": true,
    "serviceAccountEmail": true,
    "privateKey": true,
    "authValid": true
  }
}
```

### Private key error

- Ensure `\n` characters are literal (not actual newlines)
- Copy from JSON file exactly as-is
- Don't add extra quotes

### CORS errors in browser

- Check backend CORS config allows frontend origin
- Verify `VITE_BACKEND_URL` is correct in `.env.production`
- Check browser console for actual error message

### Google Sheets sync not working

- Verify sheet is shared with service account email
- Check service account email in Vercel matches `.env`
- View Vercel logs: `vercel logs backend-project`

---

## Files Created for Deployment

✅ `vercel.json` - Backend Vercel configuration
✅ `.env.production` - Production environment variables
✅ `.env.local` - Local development variables
✅ `VERCEL_DEPLOYMENT.md` - Full deployment guide

---

## Final Checklist Before Going Live

- [ ] Local testing complete (npm run dev:all)
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] `.env.production` updated with backend URL
- [ ] Frontend deployed to Vercel
- [ ] Survey submission tested on production
- [ ] Admin dashboard loads data on production
- [ ] Data appears in Google Sheets
- [ ] Vercel logs show no errors

---

## Support

If you get stuck:

1. Check `vercel logs your-project-name`
2. Review VERCEL_DEPLOYMENT.md
3. Check browser console for client-side errors
4. Verify all environment variables are set

Good luck! 🚀
