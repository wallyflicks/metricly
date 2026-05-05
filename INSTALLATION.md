# Metricly - Installation Guide

Complete step-by-step guide to get Metricly running on your machine.

## Prerequisites

Before you start, make sure you have:
- Node.js 18 or higher
- npm or yarn
- A Supabase account (free at supabase.com)
- A Google Cloud account (free at console.cloud.google.com)

## Step 1: Project Setup

### 1.1 Navigate to Project
```bash
cd /Users/wallace/Desktop/Projects/Metricly
```

### 1.2 Install Dependencies
```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- Recharts
- And more...

**Time estimate:** 3-5 minutes

## Step 2: Supabase Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: "Metricly" (or your choice)
   - Password: Create a strong password
   - Region: Choose closest to you
5. Click "Create new project"
6. Wait for database to be ready (2-3 minutes)

### 2.2 Setup Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open file: `database/schema.sql`
4. Copy entire contents
5. Paste into SQL Editor
6. Click **Run**
7. Wait for completion (should see no errors)

This creates:
- `social_accounts` table
- `analytics` table
- Indexes for performance
- Row-level security policies

### 2.3 Get Your Credentials

1. Go to **Project Settings** (gear icon)
2. Click **API** tab
3. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon (public)** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role (secret)** → `SUPABASE_SERVICE_ROLE_KEY`

**Time estimate:** 10-15 minutes

## Step 3: YouTube API Setup

### 3.1 Create Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click project dropdown (top left)
4. Click **New Project**
5. Name: "Metricly-YouTube"
6. Click **Create**
7. Wait for creation (1-2 minutes)

### 3.2 Enable YouTube API

1. In Google Cloud Console, search "YouTube Data API v3"
2. Click the result
3. Click **Enable**
4. Wait for API to be enabled

### 3.3 Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials**
3. Select **API Key**
4. Copy the API key (you'll use it in the app)
5. Click **OK**

### 3.4 Verify Access

1. Go to **APIs & Services** > **Enabled APIs & services**
2. Verify "YouTube Data API v3" is listed
3. No credit card needed - free tier is sufficient

**Time estimate:** 10 minutes

## Step 4: Environment Configuration

### 4.1 Create Environment File

```bash
cp .env.local.example .env.local
```

### 4.2 Edit Environment File

Open `.env.local` in your editor and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_NAME=Metricly
```

Replace with your actual Supabase credentials from Step 2.3

### 4.3 Important Notes

- ⚠️ Never commit `.env.local` to git (it's in .gitignore)
- ⚠️ Keep your service role key secret
- ⚠️ The YouTube API key is added by users in the app, not here

**Time estimate:** 2 minutes

## Step 5: Verify Installation

### 5.1 Run Verification Script
```bash
bash verify-setup.sh
```

This checks:
- Node.js is installed
- Dependencies are installed
- Environment file exists
- Database schema exists
- Project structure is correct

### 5.2 Expected Output
```
🔍 Metricly Setup Verification
================================

✓ Checking Node.js...
  ✓ Node.js v18.x.x installed

✓ Checking npm...
  ✓ npm 9.x.x installed

[... more checks ...]

================================
✅ Setup verification complete!
```

**Time estimate:** 1 minute

## Step 6: Start Development Server

### 6.1 Run Development Server
```bash
npm run dev
```

Expected output:
```
> metricly@0.1.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### 6.2 Access Application
Open your browser and go to:
```
http://localhost:3000
```

You should see the Metricly login page.

**Time estimate:** 2 minutes

## Step 7: Test the Application

### 7.1 Create Account

1. Click "Sign up"
2. Enter your email
3. Create a password (min 6 characters)
4. Click "Sign Up"
5. You should be redirected to the dashboard

### 7.2 Connect First Account

**YouTube (Automatic):**
1. Go to Settings
2. Click "Add Account"
3. Select "YouTube"
4. Paste your YouTube API key from Step 3.3
5. Click "Add Account"
6. Your channel data should load automatically

**Instagram (Manual):**
1. Go to Settings
2. Click "Add Account"
3. Select "Instagram"
4. Enter your display name and username
5. Click "Add Account"
6. Go to Dashboard
7. Click "Update Metrics for Instagram"
8. Enter your followers, views, posts, and avg likes
9. Click "Save Metrics"

### 7.3 Verify Dashboard

1. Go to Dashboard
2. You should see your account metrics
3. Try switching between accounts
4. Check the growth charts
5. View AI insights

**Time estimate:** 5 minutes

## Step 8: Next Steps

### Option A: Development
Continue developing locally:
```bash
npm run dev
```

### Option B: Build for Production
```bash
npm run build
npm run start
```

### Option C: Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Click Deploy

See `DEPLOYMENT.md` for detailed steps.

## Troubleshooting

### Issue: "Cannot find module 'next'"
**Solution:** Run `npm install` again

### Issue: "Supabase connection failed"
**Solution:** Check your `.env.local` credentials

### Issue: "YouTube API Error"
**Solution:** Verify API key is correct and has access to your channel

### Issue: Port 3000 already in use
**Solution:** Use different port: `npm run dev -- -p 3001`

### Issue: TypeScript errors
**Solution:** Run `npm run build` to see detailed errors

## Verification Checklist

Before moving forward, verify:
- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Database schema imported
- [ ] `.env.local` configured with credentials
- [ ] Development server runs
- [ ] Can access http://localhost:3000
- [ ] Can sign up/login
- [ ] Can add social accounts
- [ ] Can see dashboard

## Performance Tips

1. **Clear npm cache if installation is slow:**
   ```bash
   npm cache clean --force
   ```

2. **Use npm ci for production:**
   ```bash
   npm ci
   ```

3. **Enable Turbopack for faster builds:**
   - Add `--turbopack` to dev script in package.json

4. **Use pnpm for better dependency resolution:**
   ```bash
   pnpm install
   pnpm run dev
   ```

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | 18.0 | 18.17+ |
| npm | 8.0 | 9.0+ |
| RAM | 2GB | 4GB+ |
| Disk | 500MB | 1GB+ |
| Connection | Required | Stable |

## Time Summary

| Step | Time |
|------|------|
| Project Setup | 5 min |
| Supabase Setup | 15 min |
| YouTube API | 10 min |
| Environment Config | 2 min |
| Verification | 1 min |
| Development Server | 2 min |
| Testing | 5 min |
| **TOTAL** | **~40 minutes** |

## What You Now Have

✅ Full-stack web application
✅ Authentication system
✅ Multi-platform analytics
✅ Real-time dashboard
✅ Growth charts
✅ Revenue calculator
✅ AI insights
✅ Production-ready code

## Next: Getting Started

Read [QUICKSTART.md](QUICKSTART.md) for first-time usage.

---

**Questions?** Check [README.md](README.md) or [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

**Having issues?** See the Troubleshooting section above.

Good luck! 🚀
