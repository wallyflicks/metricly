# Metricly - Quick Start Guide

Get Metricly running in 5 minutes!

## Step 1: Clone & Install (2 min)

```bash
git clone https://github.com/yourusername/metricly.git
cd metricly
npm install
```

## Step 2: Setup Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and paste the entire contents of `database/schema.sql`
4. Copy your credentials from **Settings > API**:
   - Project URL
   - Anon Public Key
   - Service Role Key

## Step 3: Create Environment File (30 sec)

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_NAME=Metricly
```

Replace with your actual Supabase keys.

## Step 4: Run Development Server (30 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Start Using! (30 sec)

1. **Sign up** with your email
2. Go to **Settings**
3. Click **Add Account**
4. Choose your platform:
   - **YouTube**: Paste your YouTube API key (get free from [Google Cloud](https://console.cloud.google.com))
   - **Instagram/TikTok**: Enter your username

That's it! You're ready to track your analytics.

## Optional: YouTube API Key

To fetch real YouTube data:

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **YouTube Data API v3** (search in APIs)
4. Create an **API Key** credential
5. Copy and paste into Metricly settings

No credit card required - the free tier is plenty!

## Features Available Now

- ✅ Multi-account tracking (YouTube, Instagram, TikTok)
- ✅ Real-time metrics dashboard
- ✅ 30-day growth charts
- ✅ Revenue calculator
- ✅ AI insights
- ✅ Manual data entry
- ✅ Email/password auth

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Deploy to [Vercel](https://vercel.com) with one click

## Troubleshooting

### "Unauthorized" error
- Check your Supabase URL and keys in `.env.local`
- Make sure you're using the **Anon Key**, not Service Role Key

### "No tables found"
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that RLS policies are enabled

### YouTube API not working
- Verify API key is valid in Google Cloud Console
- Check YouTube Data API v3 is enabled
- Try enabling OAuth Consent Screen

### Can't sign up
- Check your email is valid
- Wait a few seconds and retry
- Check browser console for errors

## Performance Tips

- Use Chrome DevTools to monitor network requests
- Deploy to Vercel for best performance
- Enable caching headers in Supabase
- Monitor API usage to avoid rate limits

## Support

- 📖 See [README.md](README.md) for full documentation
- 🚀 Deploy guide in [DEPLOYMENT.md](DEPLOYMENT.md)
- 💬 Create an issue on GitHub for bugs
- 🔧 Check browser console for error messages

---

**That's all!** You now have a fully functional creator analytics dashboard. 🎉
