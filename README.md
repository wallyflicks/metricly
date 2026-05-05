# Metricly - Creator Analytics Dashboard

A modern, full-stack analytics dashboard for tracking YouTube, Instagram, and TikTok performance. Built with Next.js, Tailwind CSS, Supabase, and Recharts.

## Features

- **Multi-Platform Support**: Track YouTube, Instagram, and TikTok in one dashboard
- **Real-Time Analytics**: Monitor followers, views, posts, and engagement rates
- **Growth Charts**: Visualize 7-day and 30-day growth trends
- **Revenue Estimator**: Calculate estimated monthly earnings based on platform rates
- **AI Insights**: Get smart recommendations based on your performance data
- **YouTube API Integration**: Fetch real YouTube data with your API key
- **Manual Entry**: Add Instagram and TikTok data manually
- **Clean SaaS Design**: Modern, minimal UI inspired by Linear and Framer
- **Email/Password Auth**: Secure authentication via Supabase

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React
- **APIs**: YouTube Data API v3

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- YouTube Data API key (free from Google Cloud)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/metricly.git
cd metricly
npm install
```

### 2. Setup Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. In the SQL Editor, run the following SQL to set up your database schema:

```sql
-- Users table (auto-created by Supabase Auth)
-- social_accounts table
CREATE TABLE social_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok')),
  platform_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  api_key TEXT,
  connected_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform, username)
);

-- analytics table for storing daily metrics
CREATE TABLE analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok')),
  followers INTEGER,
  following INTEGER,
  total_posts INTEGER,
  total_views INTEGER,
  total_likes INTEGER,
  total_comments INTEGER,
  avg_likes DECIMAL,
  avg_views DECIMAL,
  engagement_rate DECIMAL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(account_id, date)
);

-- Enable RLS
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own accounts"
  ON social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON social_accounts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics"
  ON analytics FOR SELECT
  USING (account_id IN (SELECT id FROM social_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own analytics"
  ON analytics FOR INSERT
  WITH CHECK (account_id IN (SELECT id FROM social_accounts WHERE user_id = auth.uid()));
```

4. Copy your Supabase URL and anon key from Project Settings

### 3. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create an API Key credential
5. No billing setup needed - the free tier is sufficient

### 4. Environment Variables

Create `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_NAME=Metricly
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Sign Up
- Create an account with email and password
- You're automatically logged in and redirected to the dashboard

### 2. Add Social Accounts

**YouTube:**
- Go to Settings → Add Account
- Select YouTube
- Paste your YouTube Data API key
- The app automatically fetches your channel data

**Instagram & TikTok:**
- Go to Settings → Add Account
- Select platform and enter your display name and username
- Manually enter your metrics on the dashboard

### 3. View Analytics

- Select an account from the dashboard
- See real-time metrics: followers, views, posts, engagement rate
- View 30-day growth charts
- Check AI-generated insights about your growth

### 4. Revenue Calculator

The dashboard automatically calculates estimated monthly revenue based on:
- **YouTube**: $2-5 per 1,000 views
- **Instagram**: $5-20 per 1,000 followers
- **TikTok**: $0.02-0.04 per 1,000 views

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── settings/         # Settings page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # Reusable React components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configuration
├── services/            # Business logic and API services
├── public/              # Static assets
├── .env.local.example   # Environment variables template
└── package.json         # Dependencies
```

## Components

- **Sidebar**: Navigation sidebar
- **MetricCard**: Displays metrics with trends
- **GrowthChart**: Recharts visualization component
- **InsightsSection**: AI insights display
- **AccountCard**: Social account display

## Hooks

- **useAuth**: Authentication management
- **useAnalytics**: Fetch analytics and social accounts
- **useSocialAccounts**: Get connected accounts

## Services

- **analytics.ts**: Revenue calculation, insights generation
- **youtube.ts**: YouTube Data API integration

## Deployment on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy

## Revenue Estimation Formulas

- **YouTube**: (views ÷ 1000) × average_rpm
- **Instagram**: (followers ÷ 1000) × average_rate
- **TikTok**: (views ÷ 1000) × average_rate

## Manual Data Entry (Instagram & TikTok)

You can update metrics for Instagram and TikTok accounts by:
1. Going to Settings
2. Clicking on the account
3. Entering current follower count, views, posts, and engagement rate
4. The app stores daily snapshots for tracking growth

## Security

- All authentication handled by Supabase
- Row-level security (RLS) enabled on all tables
- Users can only access their own data
- YouTube API keys stored securely in database
- No sensitive data logged

## Troubleshooting

### YouTube API Error
- Ensure YouTube Data API v3 is enabled in Google Cloud Console
- Verify API key has permission to access user's own channel data
- Check that API usage limits haven't been exceeded

### Supabase Connection Issues
- Verify URL and anon key are correct
- Ensure database tables are created with RLS policies
- Check browser console for detailed error messages

### Missing Analytics Data
- Create an account and manually enter data for Instagram/TikTok
- For YouTube, the system fetches data on account creation
- Data is stored daily; ensure you've waited a day for snapshots

## API Endpoints

### Update Analytics (Manual Entry)
```
POST /api/analytics/update

Body:
{
  "accountId": "uuid",
  "followers": 1000,
  "views": 50000,
  "posts": 25,
  "engagementRate": 3.5
}
```

## Future Features

- [ ] TikTok API integration (when official API available)
- [ ] Instagram Graph API integration
- [ ] Scheduled daily data fetching
- [ ] Advanced analytics filters
- [ ] Collaboration and team features
- [ ] Export reports as PDF
- [ ] Competitive benchmarking

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please create an issue on GitHub or email support.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

Built with ❤️ by Metricly
