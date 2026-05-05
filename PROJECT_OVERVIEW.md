# Metricly - Full Stack Analytics Dashboard
## Complete Project Overview

Welcome to **Metricly**, a professional creator analytics dashboard built with modern web technologies. This document serves as your comprehensive guide to the entire system.

## 📋 Table of Contents
1. Project Overview
2. Technology Stack
3. Project Structure
4. Getting Started
5. Database Schema
6. API Reference
7. Development Guide
8. Deployment
9. Troubleshooting

---

## 🎯 Project Overview

**Metricly** is a full-featured analytics dashboard for content creators that aggregates data from YouTube, Instagram, and TikTok. It features:

- **Real-time metrics** dashboard
- **Growth charts** with 30-day history
- **Revenue projections** based on platform rates
- **AI-powered insights** for content strategy
- **Multi-account support** across platforms
- **Clean SaaS design** inspired by Linear and Framer

### Key Statistics
- **Frontend**: React 18 + Next.js 14
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Supabase Auth

---

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Recharts** - React charting library
- **Lucide React** - Icon library
- **clsx** - Conditional CSS classes

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database + Auth
- **Axios** - HTTP client for YouTube API

### DevTools
- **ESLint** - Code quality
- **PostCSS** - CSS processing
- **TypeScript Compiler** - Type checking

---

## 📁 Project Structure

```
metricly/
├── app/                              # Next.js App Router
│   ├── api/
│   │   └── analytics/
│   │       └── update/
│   │           └── route.ts          # Update metrics endpoint
│   ├── dashboard/
│   │   └── page.tsx                  # Main dashboard
│   ├── settings/
│   │   └── page.tsx                  # Account management
│   ├── login/
│   │   └── page.tsx                  # Login page
│   ├── signup/
│   │   └── page.tsx                  # Signup page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home redirect
│   └── globals.css                   # Global styles
│
├── components/                       # Reusable React components
│   ├── Sidebar.tsx                   # Navigation sidebar
│   ├── MetricCard.tsx                # Metric display card
│   ├── GrowthChart.tsx               # Area chart component
│   ├── InsightsSection.tsx           # AI insights display
│   ├── RevenueCard.tsx               # Revenue estimate card
│   ├── AccountCard.tsx               # Social account card
│   └── UpdateMetricsModal.tsx        # Manual data entry modal
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Authentication logic
│   └── useAnalytics.ts               # Analytics data fetching
│
├── lib/                              # Utilities & configuration
│   ├── supabase.ts                   # Supabase client
│   └── types.ts                      # TypeScript interfaces
│
├── services/                         # Business logic
│   ├── analytics.ts                  # Revenue calculation, insights
│   └── youtube.ts                    # YouTube API integration
│
├── database/
│   └── schema.sql                    # Database schema
│
├── public/                           # Static assets
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── tailwind.config.js                # Tailwind config
├── postcss.config.js                 # PostCSS config
├── .eslintrc.json                    # ESLint config
├── .gitignore                        # Git ignore rules
├── .npmrc                            # NPM config
│
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── FEATURES.md                       # Feature list
├── DEPLOYMENT.md                     # Deployment checklist
└── this-file                         # Project overview

```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free)
- Google Cloud account (for YouTube API)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/yourusername/metricly.git
cd metricly

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### 3. Setup Supabase
```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Go to SQL Editor
# 4. Copy contents of database/schema.sql and paste
# 5. Get credentials from Settings > API
# 6. Add to .env.local
```

### 4. Add YouTube API Key
```bash
# 1. Go to console.cloud.google.com
# 2. Create new project
# 3. Enable YouTube Data API v3
# 4. Create API Key credential
# 5. Save for later use in app
```

### 5. Run Development
```bash
npm run dev
# Open http://localhost:3000
```

---

## 💾 Database Schema

### Users Table (Managed by Supabase Auth)
```sql
auth.users
- id (UUID, PK)
- email (TEXT)
- encrypted_password (TEXT)
- created_at (TIMESTAMP)
```

### Social Accounts Table
```sql
social_accounts
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- platform (TEXT: 'youtube'|'instagram'|'tiktok')
- platform_user_id (TEXT)
- name (TEXT)
- username (TEXT)
- avatar_url (TEXT, nullable)
- api_key (TEXT, nullable)
- connected_at (TIMESTAMP)
```

### Analytics Table
```sql
analytics
- id (UUID, PK)
- account_id (UUID, FK → social_accounts)
- platform (TEXT)
- followers (INTEGER, nullable)
- following (INTEGER, nullable)
- total_posts (INTEGER, nullable)
- total_views (INTEGER, nullable)
- total_likes (INTEGER, nullable)
- total_comments (INTEGER, nullable)
- avg_likes (DECIMAL, nullable)
- avg_views (DECIMAL, nullable)
- engagement_rate (DECIMAL, nullable)
- date (DATE)
- created_at (TIMESTAMP)
```

### Indexes
- `idx_social_accounts_user_id` - Fast user lookups
- `idx_analytics_account_id` - Fast account analytics
- `idx_analytics_date` - Fast date range queries

### Row Level Security
- Users can only see their own accounts
- Users can only see analytics for their accounts
- All operations checked at database level

---

## 🔌 API Reference

### POST `/api/analytics/update`
Update analytics for Instagram/TikTok accounts

**Request:**
```json
{
  "accountId": "uuid",
  "followers": 1000,
  "views": 50000,
  "posts": 25,
  "engagementRate": 3.5
}
```

**Response:**
```json
{
  "data": [{ /* analytics record */ }]
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden (account doesn't belong to user)
- 500: Server error

---

## 📖 Development Guide

### Component Development

**Example: Creating a new component**
```typescript
// components/MyComponent.tsx
import { ReactNode } from 'react'

interface MyComponentProps {
  title: string
  children?: ReactNode
}

export const MyComponent = ({ title, children }: MyComponentProps) => {
  return (
    <div className="card-lg">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### Hook Development

**Example: Custom hook**
```typescript
// hooks/useCustom.ts
'use client'

import { useEffect, useState } from 'react'

export const useCustom = (id?: string) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch logic
  }, [id])

  return { data, loading }
}
```

### Styling

**Using Tailwind CSS:**
```tsx
// Default utilities
<div className="p-4 bg-white rounded-lg shadow-md">

// Custom component classes (in globals.css)
<div className="card-lg">

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### Type Safety

**Define interfaces in lib/types.ts:**
```typescript
export interface MyType {
  id: string
  name: string
  value: number
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

**1. Push to GitHub:**
```bash
git push origin main
```

**2. Import to Vercel:**
- Go to vercel.com
- Click "Import Project"
- Select your GitHub repo
- Configure environment variables

**3. Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_NAME=Metricly
```

**4. Deploy:**
- Vercel automatically deploys on push
- Check deployment status in Vercel dashboard

### Custom Server

**Build & Run:**
```bash
npm run build
npm run start
```

**Environment:**
- Node.js 18+
- Required environment variables set
- Database accessible

---

## 🔧 Troubleshooting

### Authentication Issues
**Problem**: "Unauthorized" error when updating metrics
- ✓ Check Supabase keys in .env.local
- ✓ Verify user is logged in
- ✓ Check browser console for errors
- ✓ Verify account belongs to user

### YouTube API Issues
**Problem**: YouTube account doesn't fetch data
- ✓ API key is valid
- ✓ YouTube Data API v3 is enabled
- ✓ Channel exists and is public
- ✓ API quota not exceeded

### Database Issues
**Problem**: "Relations don't exist"
- ✓ Run schema.sql in Supabase SQL Editor
- ✓ Verify tables appear in Supabase console
- ✓ Check RLS policies are enabled

### Chart Issues
**Problem**: Charts don't display
- ✓ Check analytics data exists
- ✓ Verify date field is formatted correctly
- ✓ Check browser console for errors
- ✓ Ensure ResponsiveContainer has parent width

---

## 📊 Performance Tips

1. **Database**: Use indexes for frequently queried columns
2. **API**: Cache YouTube data to avoid rate limits
3. **Frontend**: Lazy-load charts and insights
4. **Images**: Use Next.js Image component
5. **Bundling**: Tree-shake unused code

---

## 🔐 Security Checklist

- ✅ API keys never in client code
- ✅ Row-level security on all tables
- ✅ HTTPS in production
- ✅ Environment variables for secrets
- ✅ Input validation on forms
- ✅ SQL injection prevention (Supabase handles)
- ✅ CORS configured
- ✅ Rate limiting ready

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)
- [YouTube Data API](https://developers.google.com/youtube/v3)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎉 Success!

You now have a complete, production-ready creator analytics dashboard. Monitor your growth, optimize your content, and scale your creator business with Metricly.

**Questions?** Check the [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md)

**Ready to deploy?** Follow [DEPLOYMENT.md](DEPLOYMENT.md)

**Want details on features?** See [FEATURES.md](FEATURES.md)

---

Built with ❤️ for content creators everywhere.
