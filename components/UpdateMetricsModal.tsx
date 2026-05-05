'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SocialAccount } from '@/lib/types'
import { X } from 'lucide-react'

interface UpdateMetricsModalProps {
  account: SocialAccount
  onClose: () => void
  onSuccess: () => void
}

export const UpdateMetricsModal = ({ account, onClose, onSuccess }: UpdateMetricsModalProps) => {
  const [followers, setFollowers] = useState('')
  const [views, setViews] = useState('')
  const [posts, setPosts] = useState('')
  const [avgLikes, setAvgLikes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateEngagementRate = (likes: number, v: number) => {
    if (v === 0) return 0
    return (likes / v) * 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const followerCount = parseInt(followers) || 0
      const viewCount = parseInt(views) || 0
      const postCount = parseInt(posts) || 0
      const avgLikeCount = parseInt(avgLikes) || 0

      const engagement = calculateEngagementRate(avgLikeCount, viewCount)

      const { error: insertError } = await supabase.from('analytics').insert({
        account_id: account.id,
        platform: account.platform,
        followers: followerCount,
        total_views: viewCount,
        total_posts: postCount,
        avg_likes: avgLikeCount,
        engagement_rate: engagement,
        date: new Date().toISOString().split('T')[0],
      })

      if (insertError) throw insertError

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update metrics')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Update {account.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Followers</label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="input-field"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Views</label>
            <input
              type="number"
              value={views}
              onChange={(e) => setViews(e.target.value)}
              className="input-field"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Posts</label>
            <input
              type="number"
              value={posts}
              onChange={(e) => setPosts(e.target.value)}
              className="input-field"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avg Likes per Post</label>
            <input
              type="number"
              value={avgLikes}
              onChange={(e) => setAvgLikes(e.target.value)}
              className="input-field"
              placeholder="0"
              required
            />
          </div>

          <p className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
            Engagement rate will be calculated automatically based on average likes and views.
          </p>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Metrics'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
