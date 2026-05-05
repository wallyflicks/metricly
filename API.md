# Metricly API Documentation

## Overview

Metricly provides both client-side hooks and server-side API routes for managing analytics data. This document covers all available APIs and how to use them.

## Authentication

All API calls require the user to be authenticated. Authentication is handled via Supabase Auth.

```typescript
// Check if user is authenticated
const { user, loading } = useAuth()

if (loading) return <div>Loading...</div>
if (!user) return <Redirect to="/login" />
```

## Client-Side Hooks

### useAuth()

Manage user authentication state and operations.

```typescript
const { user, loading, error, signUp, signIn, signOut } = useAuth()
```

**Properties:**
- `user: User | null` - Current authenticated user
- `loading: boolean` - Auth state loading
- `error: string | null` - Authentication error message

**Methods:**
- `signUp(email: string, password: string)` - Create new account
- `signIn(email: string, password: string)` - Login
- `signOut()` - Logout

**Example:**
```typescript
const { signIn } = useAuth()

const handleLogin = async (email: string, password: string) => {
  try {
    await signIn(email, password)
    // Redirect to dashboard
  } catch (error) {
    console.error(error)
  }
}
```

### useAnalytics(accountId?)

Fetch analytics data for a specific account.

```typescript
const { analytics, loading, error } = useAnalytics(accountId)
```

**Parameters:**
- `accountId?: string` - Social account ID (optional)

**Returns:**
- `analytics: Analytics[]` - Array of analytics records (sorted by date, newest first)
- `loading: boolean` - Data loading state
- `error: string | null` - Error message

**Example:**
```typescript
const { analytics } = useAnalytics(selectedAccount?.id)

// Get latest metrics
const latest = analytics[0]
console.log(latest.followers, latest.total_views)
```

### useSocialAccounts()

Fetch all social accounts for current user.

```typescript
const { accounts, loading, error } = useSocialAccounts()
```

**Returns:**
- `accounts: SocialAccount[]` - User's connected accounts
- `loading: boolean` - Data loading state
- `error: string | null` - Error message

**Example:**
```typescript
const { accounts } = useSocialAccounts()

accounts.forEach(account => {
  console.log(account.name, account.platform)
})
```

## Server-Side API Routes

### POST /api/analytics/update

Update analytics for Instagram or TikTok accounts.

**Authentication:** Required (via Supabase session)

**Request Body:**
```json
{
  "accountId": "550e8400-e29b-41d4-a716-446655440000",
  "followers": 10000,
  "views": 500000,
  "posts": 50,
  "engagementRate": 4.5
}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "uuid",
      "account_id": "uuid",
      "platform": "instagram",
      "followers": 10000,
      "total_views": 500000,
      "total_posts": 50,
      "engagement_rate": 4.5,
      "date": "2024-01-15",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Responses:**

401 Unauthorized:
```json
{
  "error": "Unauthorized"
}
```

403 Forbidden:
```json
{
  "error": "Forbidden"
}
```

500 Server Error:
```json
{
  "error": "Internal server error"
}
```

**Example Usage:**
```typescript
async function updateMetrics(accountId: string, metrics: any) {
  const response = await fetch('/api/analytics/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountId,
      followers: metrics.followers,
      views: metrics.views,
      posts: metrics.posts,
      engagementRate: metrics.engagementRate,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update metrics')
  }

  return response.json()
}
```

## Service Functions

### analytics.ts

Business logic for analytics calculations.

#### calculateRevenue()

Calculate estimated monthly revenue.

```typescript
const revenue = calculateRevenue('youtube', { views: 100000 })
// Returns: { monthly: 300, range: { min: 200, max: 500 } }
```

**Parameters:**
- `platform: 'youtube' | 'instagram' | 'tiktok'`
- `metrics: { views?: number, followers?: number }`

**Returns:**
```typescript
{
  monthly: number,
  range: { min: number, max: number }
}
```

#### generateAIInsights()

Generate AI insights based on analytics data.

```typescript
const insights = generateAIInsights(analytics, account)
// Returns array of insight strings
```

**Parameters:**
- `analytics: Analytics[]` - Historical analytics data
- `account: SocialAccount` - Account information

**Returns:**
- `string[]` - Array of insight messages

#### calculateEngagementRate()

Calculate engagement rate from likes and views.

```typescript
const rate = calculateEngagementRate(500, 10000)
// Returns: 5 (5% engagement)
```

#### getRevenueSummary()

Get monthly and yearly revenue projection.

```typescript
const { monthly, yearly } = getRevenueSummary(analytics, 'youtube')
```

### youtube.ts

YouTube Data API integration.

#### fetchYouTubeChannelData()

Fetch authenticated user's channel statistics.

```typescript
const channelData = await fetchYouTubeChannelData(apiKey)
```

**Parameters:**
- `apiKey: string` - YouTube Data API key

**Returns:**
```typescript
{
  channelId: string,
  title: string,
  description: string,
  thumbnail: string,
  subscribers: number,
  totalViews: number,
  totalVideos: number
}
```

**Errors:**
- Throws error if API key is invalid or unauthorized

#### fetchYouTubeVideoMetrics()

Fetch recent video metrics.

```typescript
const videos = await fetchYouTubeVideoMetrics(apiKey, 10)
```

**Parameters:**
- `apiKey: string` - YouTube Data API key
- `limit: number` - Number of videos (max 50, default 10)

**Returns:**
```typescript
[
  {
    videoId: string,
    title: string,
    views: number,
    likes: number,
    comments: number
  }
]
```

## Database Queries

### Fetch User's Accounts
```sql
SELECT * FROM social_accounts 
WHERE user_id = auth.uid()
```

### Fetch Analytics for Account
```sql
SELECT * FROM analytics 
WHERE account_id = $1 
ORDER BY date DESC 
LIMIT 30
```

### Get Latest Metrics
```sql
SELECT * FROM analytics 
WHERE account_id = $1 
ORDER BY date DESC 
LIMIT 1
```

### Calculate Growth Rate
```sql
SELECT 
  (a.followers - b.followers) / b.followers * 100 as growth_rate
FROM analytics a
JOIN analytics b ON a.account_id = b.account_id
WHERE a.date = CURRENT_DATE - INTERVAL '1 day'
AND b.date = CURRENT_DATE - INTERVAL '8 days'
```

## Rate Limiting

- YouTube API: 10,000 requests per day (free tier)
- Supabase: Rate limited per plan (pro plans have higher limits)
- API Routes: No explicit rate limiting (add if needed)

## Error Handling

### Common Errors

**401 Unauthorized**
```
User is not authenticated or session expired
Solution: Redirect to login
```

**403 Forbidden**
```
User doesn't own the resource
Solution: Verify account ownership
```

**404 Not Found**
```
Resource doesn't exist
Solution: Check resource ID
```

**422 Unprocessable Entity**
```
Invalid request data
Solution: Validate input before sending
```

**500 Server Error**
```
Unexpected server error
Solution: Check server logs
```

## Best Practices

1. **Always validate input** before sending to API
2. **Handle errors gracefully** with user-friendly messages
3. **Cache data** to reduce API calls
4. **Use TypeScript** for type safety
5. **Implement loading states** for better UX
6. **Store sensitive data** in environment variables
7. **Use HTTPS** in production
8. **Monitor API usage** to avoid hitting rate limits

## Examples

### Complete Flow: Adding YouTube Account

```typescript
// 1. Get API key from user
const apiKey = userInput

// 2. Validate by fetching channel data
const channelData = await fetchYouTubeChannelData(apiKey)

// 3. Store account in database
const { data: account } = await supabase
  .from('social_accounts')
  .insert({
    user_id: user.id,
    platform: 'youtube',
    platform_user_id: channelData.channelId,
    name: channelData.title,
    username: channelData.title,
    avatar_url: channelData.thumbnail,
    api_key: apiKey,
  })

// 4. Create initial analytics snapshot
await supabase.from('analytics').insert({
  account_id: account[0].id,
  platform: 'youtube',
  followers: channelData.subscribers,
  total_views: channelData.totalViews,
  total_posts: channelData.totalVideos,
  engagement_rate: 0,
  date: new Date().toISOString().split('T')[0],
})

// 5. Redirect to dashboard
router.push('/dashboard')
```

### Updating Instagram Metrics

```typescript
const { user } = useAuth()
const { accounts } = useSocialAccounts()

const instagramAccount = accounts.find(a => a.platform === 'instagram')

const handleUpdate = async (metrics: any) => {
  const response = await fetch('/api/analytics/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountId: instagramAccount.id,
      followers: metrics.followers,
      views: metrics.impressions,
      posts: metrics.posts,
      engagementRate: metrics.engagement,
    }),
  })

  if (response.ok) {
    // Refresh data
    window.location.reload()
  }
}
```

---

For more information, see [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
