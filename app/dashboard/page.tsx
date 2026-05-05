'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useSocialAccounts, useAnalytics } from '@/hooks/useAnalytics'
import { Sidebar } from '@/components/Sidebar'
import { MetricCard } from '@/components/MetricCard'
import { GrowthChart } from '@/components/GrowthChart'
import { InsightsSection } from '@/components/InsightsSection'
import { RevenueCard } from '@/components/RevenueCard'
import { UpdateMetricsModal } from '@/components/UpdateMetricsModal'
import { generateAIInsights, getRevenueSummary } from '@/services/analytics'
import { SocialAccount, Analytics } from '@/lib/types'
import { Plus, TrendingUp, Users, Eye, Heart } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { accounts, loading: accountsLoading } = useSocialAccounts()
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null)
  const { analytics } = useAnalytics(selectedAccount?.id)
  const [insights, setInsights] = useState<string[]>([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [revenue, setRevenue] = useState({ monthly: 0, yearly: 0 })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0])
    }
  }, [accounts, selectedAccount])

  useEffect(() => {
    if (selectedAccount && analytics.length > 0) {
      const generatedInsights = generateAIInsights(analytics, selectedAccount)
      setInsights(generatedInsights)
      
      const revenueSummary = getRevenueSummary(analytics, selectedAccount.platform)
      setRevenue(revenueSummary)
    }
  }, [selectedAccount, analytics])

  if (authLoading || accountsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  const calculateTotals = (data: Analytics[]) => {
    if (!data || data.length === 0) {
      return {
        followers: 0,
        views: 0,
        posts: 0,
        engagement: 0,
      }
    }

    const latest = data[0]
    return {
      followers: latest.followers || 0,
      views: latest.total_views || 0,
      posts: latest.total_posts || 0,
      engagement: latest.engagement_rate || 0,
    }
  }

  const totals = calculateTotals(analytics)

  const handleMetricsUpdateSuccess = async () => {
    // Refresh the page to show updated data
    window.location.reload()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your creator analytics</p>
            </div>
            <button
              onClick={() => router.push('/settings')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Add Account
            </button>
          </div>

          {/* Accounts Tabs */}
          {accounts.length > 0 && (
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {accounts.map(account => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    selectedAccount?.id === account.id
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {account.name}
                </button>
              ))}
            </div>
          )}

          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No social accounts connected yet</p>
              <button
                onClick={() => router.push('/settings')}
                className="btn-primary"
              >
                Connect Your First Account
              </button>
            </div>
          ) : selectedAccount ? (
            <div className="space-y-6">
              {/* Update Metrics Button */}
              {selectedAccount.platform !== 'youtube' && (
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="btn-secondary"
                >
                  Update Metrics for {selectedAccount.platform}
                </button>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                  label="Followers"
                  value={totals.followers.toLocaleString()}
                  icon={<Users size={24} />}
                  platform={selectedAccount.platform}
                />
                <MetricCard
                  label="Total Views"
                  value={totals.views.toLocaleString()}
                  icon={<Eye size={24} />}
                />
                <MetricCard
                  label="Posts"
                  value={totals.posts}
                  icon={<TrendingUp size={24} />}
                />
                <MetricCard
                  label="Engagement Rate"
                  value={`${totals.engagement.toFixed(2)}%`}
                  icon={<Heart size={24} />}
                />
              </div>

              {/* Revenue Card */}
              {revenue.monthly > 0 && (
                <RevenueCard
                  monthly={revenue.monthly}
                  yearly={revenue.yearly}
                  platform={selectedAccount.platform}
                />
              )}

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GrowthChart
                  data={analytics}
                  metric="followers"
                  title="Followers Growth (30d)"
                  color="#000000"
                />
                <GrowthChart
                  data={analytics}
                  metric="total_views"
                  title="Views Growth (30d)"
                  color="#666666"
                />
              </div>

              {/* Insights */}
              <InsightsSection insights={insights} />
            </div>
          ) : null}
        </div>
      </main>

      {/* Update Metrics Modal */}
      {showUpdateModal && selectedAccount && (
        <UpdateMetricsModal
          account={selectedAccount}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleMetricsUpdateSuccess}
        />
      )}
    </div>
  )
}
