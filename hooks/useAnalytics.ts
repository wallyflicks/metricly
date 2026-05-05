'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Analytics, SocialAccount } from '@/lib/types'

export const useAnalytics = (accountId?: string) => {
  const [analytics, setAnalytics] = useState<Analytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accountId) {
      setLoading(false)
      return
    }

    const fetchAnalytics = async () => {
      try {
        setError(null)
        const { data, error } = await supabase
          .from('analytics')
          .select('*')
          .eq('account_id', accountId)
          .order('date', { ascending: false })
          .limit(30)

        if (error) throw error
        setAnalytics(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [accountId])

  return { analytics, loading, error }
}

export const useSocialAccounts = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setError(null)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('user_id', user.id)

        if (error) throw error
        setAccounts(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load accounts')
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  return { accounts, loading, error }
}
