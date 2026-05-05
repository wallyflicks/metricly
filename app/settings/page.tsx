'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useSocialAccounts } from '@/hooks/useAnalytics'
import { Sidebar } from '@/components/Sidebar'
import { AccountCard } from '@/components/AccountCard'
import { SocialAccount } from '@/lib/types'
import { Plus, Copy } from 'lucide-react'
import { fetchYouTubeChannelData } from '@/services/youtube'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { accounts, loading: accountsLoading } = useSocialAccounts()
  const [showAddForm, setShowAddForm] = useState(false)
  const [platform, setPlatform] = useState<'youtube' | 'instagram' | 'tiktok'>('youtube')
  const [youtubeApiKey, setYoutubeApiKey] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // If YouTube, validate API key and fetch channel data
      let channelData = null
      if (platform === 'youtube' && youtubeApiKey) {
        channelData = await fetchYouTubeChannelData(youtubeApiKey)
      }

      const { data, error: insertError } = await supabase
        .from('social_accounts')
        .insert({
          user_id: user.id,
          platform,
          platform_user_id: channelData?.channelId || username,
          name: channelData?.title || name,
          username: username,
          avatar_url: channelData?.thumbnail,
          api_key: youtubeApiKey || null,
        })
        .select()

      if (insertError) throw insertError

      // If YouTube, also create initial analytics entry
      if (platform === 'youtube' && channelData && data && data[0]) {
        await supabase.from('analytics').insert({
          account_id: data[0].id,
          platform: 'youtube',
          followers: channelData.subscribers,
          total_views: channelData.totalViews,
          total_posts: channelData.totalVideos,
          engagement_rate: 0,
          date: new Date().toISOString().split('T')[0],
        })
      }

      setSuccess('Account added successfully!')
      setName('')
      setUsername('')
      setYoutubeApiKey('')
      setPlatform('youtube')
      setShowAddForm(false)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add account')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure? This will delete all analytics data for this account.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error
      setSuccess('Account deleted successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
    }
  }

  if (authLoading || accountsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your social accounts</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Account
            </button>
          </div>

          {/* Add Account Form */}
          {showAddForm && (
            <div className="card-lg mb-8 max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New Account</h2>
              <form onSubmit={handleAddAccount} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    {success}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>

                {platform === 'youtube' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube API Key</label>
                    <input
                      type="password"
                      value={youtubeApiKey}
                      onChange={(e) => setYoutubeApiKey(e.target.value)}
                      className="input-field"
                      placeholder="Paste your YouTube Data API v3 key"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-2">
                      Get a free API key from{' '}
                      <a
                        href="https://developers.google.com/youtube/v3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black underline"
                      >
                        Google Cloud Console
                      </a>
                    </p>
                  </div>
                )}

                {platform !== 'youtube' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        placeholder="Your channel name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        placeholder="@username"
                        required
                      />
                    </div>
                  </>
                )}

                {platform !== 'youtube' && (
                  <p className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                    📊 For {platform === 'instagram' ? 'Instagram' : 'TikTok'}, you'll manually enter your metrics on the dashboard.
                    No API access required!
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Connected Accounts */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
            {accounts.length === 0 ? (
              <div className="card-lg text-center py-8 text-gray-600">
                No accounts connected yet
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map(account => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onDelete={handleDeleteAccount}
                  />
                ))}
              </div>
            )}
          </div>

          {/* API Documentation */}
          <div className="card-lg mt-8">
            <h3 className="text-lg font-semibold mb-4">How to Get Your YouTube API Key</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 text-sm">
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-black underline">Google Cloud Console</a></li>
              <li>Create a new project</li>
              <li>Enable the YouTube Data API v3</li>
              <li>Create OAuth 2.0 credentials (API Key)</li>
              <li>Copy your API key and paste it above</li>
              <li>No billing required - the free tier includes all you need!</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}
