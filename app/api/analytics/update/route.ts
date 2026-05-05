import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const {
      accountId,
      followers,
      views,
      posts,
      engagementRate,
    } = await request.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the account belongs to the user
    const { data: account } = await supabase
      .from('social_accounts')
      .select('user_id')
      .eq('id', accountId)
      .single()

    if (account?.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Get account details to know the platform
    const { data: accountData } = await supabase
      .from('social_accounts')
      .select('platform')
      .eq('id', accountId)
      .single()

    // Insert new analytics entry
    const { data, error } = await supabase.from('analytics').insert({
      account_id: accountId,
      platform: accountData?.platform,
      followers,
      total_views: views,
      total_posts: posts,
      engagement_rate: engagementRate,
      date: today,
    })

    if (error) throw error

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error updating analytics:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
