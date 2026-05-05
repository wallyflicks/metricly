export interface User {
  id: string
  email: string
  username?: string
  created_at: string
}

export interface SocialAccount {
  id: string
  user_id: string
  platform: 'youtube' | 'instagram' | 'tiktok'
  platform_user_id: string
  name: string
  username: string
  avatar_url?: string
  connected_at: string
  api_key?: string // For YouTube
}

export interface Analytics {
  id: string
  account_id: string
  platform: 'youtube' | 'instagram' | 'tiktok'
  followers?: number
  following?: number
  total_posts?: number
  total_views?: number
  total_likes?: number
  total_comments?: number
  avg_likes?: number
  avg_views?: number
  engagement_rate?: number
  date: string
  created_at: string
}

export interface DailySnapshot {
  id: string
  account_id: string
  platform: 'youtube' | 'instagram' | 'tiktok'
  followers?: number
  views?: number
  posts?: number
  engagement_rate?: number
  date: string
  created_at: string
}

export interface RevenueData {
  account_id: string
  platform: 'youtube' | 'instagram' | 'tiktok'
  estimated_monthly_revenue: number
  last_calculated: string
}

export type Period = '7d' | '30d'
