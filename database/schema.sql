-- Metricly Database Schema Setup
-- Paste this entire script into Supabase SQL Editor to set up the database

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok')),
  platform_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  api_key TEXT,
  connected_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, platform, username)
);

-- Create analytics table for storing daily metrics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'tiktok')),
  followers INTEGER,
  following INTEGER,
  total_posts INTEGER,
  total_views INTEGER,
  total_likes INTEGER,
  total_comments INTEGER,
  avg_likes DECIMAL,
  avg_views DECIMAL,
  engagement_rate DECIMAL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(account_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_account_id ON analytics(account_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);

-- Enable Row Level Security (RLS)
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own accounts" ON social_accounts;
DROP POLICY IF EXISTS "Users can insert their own accounts" ON social_accounts;
DROP POLICY IF EXISTS "Users can update their own accounts" ON social_accounts;
DROP POLICY IF EXISTS "Users can delete their own accounts" ON social_accounts;
DROP POLICY IF EXISTS "Users can view their own analytics" ON analytics;
DROP POLICY IF EXISTS "Users can insert their own analytics" ON analytics;

-- Create RLS Policies for social_accounts
CREATE POLICY "Users can view their own accounts"
  ON social_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON social_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON social_accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON social_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS Policies for analytics
CREATE POLICY "Users can view their own analytics"
  ON analytics FOR SELECT
  USING (account_id IN (SELECT id FROM social_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own analytics"
  ON analytics FOR INSERT
  WITH CHECK (account_id IN (SELECT id FROM social_accounts WHERE user_id = auth.uid()));

-- Grant permissions
GRANT SELECT ON social_accounts TO authenticated;
GRANT INSERT ON social_accounts TO authenticated;
GRANT UPDATE ON social_accounts TO authenticated;
GRANT DELETE ON social_accounts TO authenticated;

GRANT SELECT ON analytics TO authenticated;
GRANT INSERT ON analytics TO authenticated;

-- Success message
-- If you see no errors above, your Metricly database is ready to use!
