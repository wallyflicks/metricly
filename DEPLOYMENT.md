# Metricly - Setup & Deployment Checklist

## Pre-Deployment Checklist

### Local Development
- [ ] Node.js 18+ installed
- [ ] Project cloned and dependencies installed (`npm install`)
- [ ] `.env.local` file created with all required variables
- [ ] Supabase database schema created and RLS policies applied
- [ ] Development server runs without errors (`npm run dev`)
- [ ] Can sign up and log in
- [ ] Can add social accounts
- [ ] Dashboard displays metrics correctly
- [ ] Charts render properly
- [ ] AI insights generate

### Supabase Setup
- [ ] Supabase project created
- [ ] Database tables created:
  - [ ] `social_accounts`
  - [ ] `analytics`
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies created for data access control
- [ ] Auth enabled with email/password provider
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] Service role key saved securely

### YouTube API Setup
- [ ] Google Cloud project created
- [ ] YouTube Data API v3 enabled
- [ ] API Key created
- [ ] API key tested with your channel

### Vercel Deployment
- [ ] GitHub repository created and code pushed
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables added to Vercel:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_APP_NAME`
- [ ] Build completes successfully
- [ ] Production URL works
- [ ] Auth flow tested on production
- [ ] Dashboard functional on production
- [ ] Custom domain configured (optional)

## Testing Checklist

### Authentication
- [ ] Sign up with new email
- [ ] Email verification works (if enabled)
- [ ] Login with credentials
- [ ] Password validation works
- [ ] Sign out clears session
- [ ] Protected routes redirect to login

### YouTube Integration
- [ ] YouTube account adds successfully with valid API key
- [ ] YouTube channel data fetches correctly
- [ ] Growth charts display YouTube metrics
- [ ] Invalid API key shows error message

### Instagram/TikTok Manual Entry
- [ ] Can add Instagram account
- [ ] Can add TikTok account
- [ ] Can update metrics via modal
- [ ] Metrics save correctly
- [ ] Growth charts update with new data

### Analytics & Insights
- [ ] Dashboard loads account metrics
- [ ] Multiple accounts show separate data
- [ ] Switching accounts updates dashboard
- [ ] AI insights generate for each account
- [ ] Charts render without errors
- [ ] Engagement rate calculates correctly

### UI/UX
- [ ] Sidebar navigation works
- [ ] Responsive design on mobile
- [ ] Cards and layouts display correctly
- [ ] Buttons and interactions are smooth
- [ ] Error messages display clearly
- [ ] Loading states show when needed

## Performance Checklist
- [ ] First Contentful Paint < 2s
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] Images optimized
- [ ] API responses < 1s

## Security Checklist
- [ ] No API keys in client-side code
- [ ] RLS policies prevent unauthorized access
- [ ] Rate limiting configured (if available)
- [ ] CORS properly configured
- [ ] HTTPS enforced in production
- [ ] Environment variables not committed to git

## Post-Deployment
- [ ] Monitor error logs in Vercel
- [ ] Set up Supabase alerts for quota usage
- [ ] Create documentation for users
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Create backup strategy
- [ ] Plan for scaling

## Maintenance & Updates
- [ ] Regular dependency updates
- [ ] Security patches applied promptly
- [ ] Database backups scheduled
- [ ] Performance monitoring set up
- [ ] User feedback system in place
- [ ] Roadmap for new features

---

Once all items are checked, your Metricly instance is ready for production use!
