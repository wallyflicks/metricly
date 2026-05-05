import { Analytics, SocialAccount } from '@/lib/types'

// Revenue rates (conservative estimates)
const REVENUE_RATES = {
  youtube: { min: 2, max: 5, currency: 'USD' }, // $ per 1k views
  instagram: { min: 5, max: 20, currency: 'USD' }, // $ per 1k followers
  tiktok: { min: 0.02, max: 0.04, currency: 'USD' }, // $ per 1k views
}

export const calculateRevenue = (
  platform: 'youtube' | 'instagram' | 'tiktok',
  metrics: {
    views?: number
    followers?: number
  }
): { monthly: number; range: { min: number; max: number } } => {
  const rate = REVENUE_RATES[platform]
  
  if (platform === 'youtube' && metrics.views) {
    const minRevenue = (metrics.views / 1000) * rate.min
    const maxRevenue = (metrics.views / 1000) * rate.max
    const avgRevenue = (minRevenue + maxRevenue) / 2
    
    return {
      monthly: avgRevenue,
      range: { min: minRevenue, max: maxRevenue }
    }
  }
  
  if (platform === 'instagram' && metrics.followers) {
    const minRevenue = (metrics.followers / 1000) * rate.min
    const maxRevenue = (metrics.followers / 1000) * rate.max
    const avgRevenue = (minRevenue + maxRevenue) / 2
    
    return {
      monthly: avgRevenue,
      range: { min: minRevenue, max: maxRevenue }
    }
  }
  
  if (platform === 'tiktok' && metrics.views) {
    const minRevenue = (metrics.views / 1000) * rate.min
    const maxRevenue = (metrics.views / 1000) * rate.max
    const avgRevenue = (minRevenue + maxRevenue) / 2
    
    return {
      monthly: avgRevenue,
      range: { min: minRevenue, max: maxRevenue }
    }
  }
  
  return { monthly: 0, range: { min: 0, max: 0 } }
}

export const estimateInstagramViews = (
  avgLikes: number,
  totalPosts: number
): number => {
  // Formula: avg_likes × 2.5 × posts
  return Math.floor(avgLikes * 2.5 * totalPosts)
}

export const estimateTikTokViews = (
  avgViews: number,
  totalVideos: number
): number => {
  // Formula: avg_views × videos
  return Math.floor(avgViews * totalVideos)
}

export const calculateEngagementRate = (
  likes: number,
  views: number
): number => {
  if (views === 0) return 0
  return (likes / views) * 100
}

export const calculateGrowthRate = (
  current: number | undefined,
  previous: number | undefined
): number => {
  if (!current || !previous || previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const generateAIInsights = (
  analytics: Analytics[],
  account: SocialAccount
): string[] => {
  const insights: string[] = []
  
  if (!analytics || analytics.length === 0) {
    insights.push(`📊 Start tracking to unlock AI-powered insights`)
    return insights
  }

  // Check growth trends (comparing recent to older data)
  if (analytics.length >= 2) {
    const recent = analytics[0]
    const older = analytics[Math.min(7, analytics.length - 1)]
    
    if (recent.followers && older.followers) {
      const growth = calculateGrowthRate(recent.followers, older.followers)
      if (growth > 10) {
        insights.push(`🚀 Strong growth: +${growth.toFixed(1)}% followers! Keep up this momentum.`)
      } else if (growth > 0) {
        insights.push(`📈 Steady growth: +${growth.toFixed(1)}% followers. Keep posting consistently.`)
      } else if (growth < -5) {
        insights.push(`⚠️ Follower decline: ${growth.toFixed(1)}%. Consider analyzing your recent content.`)
      }
    }

    if (recent.total_views && older.total_views) {
      const viewsGrowth = calculateGrowthRate(recent.total_views, older.total_views)
      if (viewsGrowth > 20) {
        insights.push(`💥 Explosive views growth: +${viewsGrowth.toFixed(0)}%!`)
      }
    }
  }

  // Engagement rate insights
  if (analytics.length > 0) {
    const avgEngagement = analytics.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / analytics.length
    if (avgEngagement > 5) {
      insights.push(`💡 High engagement: ${avgEngagement.toFixed(1)}%. Your audience loves your content!`)
    } else if (avgEngagement > 2) {
      insights.push(`💡 Good engagement: ${avgEngagement.toFixed(1)}%. Try posting at peak hours.`)
    } else if (avgEngagement > 0) {
      insights.push(`💡 Engagement at ${avgEngagement.toFixed(1)}%. Use more calls-to-action to boost.`)
    }
  }

  // Post frequency insights
  if (analytics.length > 0) {
    const latestPosts = analytics[0].total_posts || 0
    if (latestPosts < 10) {
      insights.push(`📅 You have few posts. Increase posting frequency to grow faster.`)
    }
  }

  // Platform-specific suggestions
  if (account.platform === 'youtube') {
    insights.push(`📺 YouTube Tip: Optimize titles & thumbnails for higher CTR. Aim for 5-10 min videos.`)
  } else if (account.platform === 'instagram') {
    insights.push(`📸 Instagram Tip: Post 3-5 times per week. Use trending audio and hashtags.`)
  } else if (account.platform === 'tiktok') {
    insights.push(`🎵 TikTok Tip: Post 1-3 times daily. Follow trends within 48 hours of launch.`)
  }

  return insights
}

export const getRevenueSummary = (
  analytics: Analytics[],
  platform: 'youtube' | 'instagram' | 'tiktok'
): { monthly: number; yearly: number } => {
  if (!analytics || analytics.length === 0) {
    return { monthly: 0, yearly: 0 }
  }

  const latest = analytics[0]
  let revenue = { monthly: 0, range: { min: 0, max: 0 } }

  if (platform === 'youtube') {
    revenue = calculateRevenue(platform, { views: latest.total_views })
  } else if (platform === 'instagram') {
    revenue = calculateRevenue(platform, { followers: latest.followers })
  } else if (platform === 'tiktok') {
    revenue = calculateRevenue(platform, { views: latest.total_views })
  }

  return {
    monthly: revenue.monthly,
    yearly: revenue.monthly * 12,
  }
}
