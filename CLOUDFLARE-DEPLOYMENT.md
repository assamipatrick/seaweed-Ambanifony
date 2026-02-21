# Cloudflare Pages - SEAFARM MONITOR Deployment

## 🚀 Quick Start

### 1. Create Cloudflare Account
- Go to: https://dash.cloudflare.com/sign-up
- Create a free account

### 2. Connect to GitHub
1. Go to: https://dash.cloudflare.com/
2. Click **"Pages"** in the left sidebar
3. Click **"Create a project"**
4. Click **"Connect to Git"**
5. Select **GitHub** and authorize Cloudflare
6. Select repository: `assamipatrick/seaweed-Ambanifony`
7. Branch: `genspark_ai_developer` (or `main`)

### 3. Build Configuration

Use these settings:

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

### 4. Environment Variables

Add these in Cloudflare Pages dashboard (Settings → Environment variables):

```
VITE_FIREBASE_API_KEY=AIzaSyB58GKPIQvikVbaEeiyGNZHrtzFPRgb1UE
VITE_FIREBASE_AUTH_DOMAIN=seafarm-mntr.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://seafarm-mntr-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=seafarm-mntr
VITE_FIREBASE_STORAGE_BUCKET=seafarm-mntr.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=860357255311
VITE_FIREBASE_APP_ID=1:860357255311:web:00d1f44c1940c3a64f50fa
VITE_FIREBASE_MEASUREMENT_ID=G-HGH1652SE0
VITE_GEMINI_API_KEY=AIzaSyDyOfVl_PUF3uw7ON4n2426NSpzb6ZnlxI
NODE_VERSION=20
```

### 5. Deploy

Click **"Save and Deploy"**

Your app will be available at:
- `https://seaweed-ambanifony.pages.dev` (or similar)

---

## 🔄 Cache Management

### Purge Cache (if needed)
1. Go to Cloudflare Pages dashboard
2. Click your project
3. Click **"Deployments"** tab
4. Click **"..."** menu → **"Rollback"** or **"Retry deployment"**

### Automatic Cache Invalidation
Cloudflare Pages automatically invalidates cache on each deployment.

---

## 📊 Comparison: Firebase vs Cloudflare

| Feature | Firebase Hosting | Cloudflare Pages |
|---------|------------------|------------------|
| Cache control | ⚠️ Difficult | ✅ Easy (1-click purge) |
| Build speed | ~2-3 min | ~1-2 min |
| CDN speed | Good | ⚡ Excellent |
| Free tier | 10GB/month | ♾️ Unlimited |
| Auto-deploy | Via GitHub Actions | ✅ Built-in |
| Logs | Limited | ✅ Detailed |
| Preview URLs | ❌ No | ✅ Yes (per commit) |

---

## 🎯 Benefits for Your Project

1. **No more cache issues**: Every deployment gets a fresh cache
2. **Faster builds**: Cloudflare builds in ~1-2 min vs Firebase's 2-3 min
3. **Preview deployments**: Test changes before merging to main
4. **Better debugging**: Detailed build logs and console output
5. **Free unlimited bandwidth**: No worries about traffic limits

---

## 🔧 Maintenance

### Rollback to Previous Version
1. Cloudflare Dashboard → Pages → Your Project
2. Click "Deployments" tab
3. Find the working deployment
4. Click "..." → "Rollback to this deployment"

### View Build Logs
1. Cloudflare Dashboard → Pages → Your Project
2. Click "Deployments" tab
3. Click on any deployment
4. View full build logs and console output

---

## 🆘 Troubleshooting

### Build fails?
- Check build logs in Cloudflare dashboard
- Verify environment variables are set correctly
- Ensure `npm run build` works locally

### App loads but Firebase doesn't work?
- Verify all `VITE_FIREBASE_*` environment variables are set
- Check Firebase console for CORS/rules issues

### Cache issues?
- Click "Retry deployment" to force fresh cache
- Or rollback and redeploy

---

## 📝 Notes

- Firebase Realtime Database stays the same (no migration needed)
- Only the **hosting** changes (from Firebase Hosting to Cloudflare Pages)
- Database rules and functions remain on Firebase
- URL changes from `.web.app` to `.pages.dev` (or custom domain)
