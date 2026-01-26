-- Create page_meta table for SEO management
CREATE TABLE IF NOT EXISTS page_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  twitter_card TEXT DEFAULT 'summary_large_image',
  canonical_url TEXT,
  robots TEXT DEFAULT 'index,follow',
  language TEXT DEFAULT 'en',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE page_meta ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access"
  ON page_meta FOR SELECT
  USING (true);

CREATE POLICY "Admin full access"
  ON page_meta FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_meta_path ON page_meta(page_path);

-- Seed defaults
INSERT INTO page_meta (page_path, meta_title, meta_description, robots)
VALUES 
  ('/', 'PocketLove - Your AI Companion', 'Experience the next generation of AI companionship. chat, connect, and create memories with your perfect virtual partner.', 'index,follow'),
  ('/characters', 'Browse AI Characters - PocketLove', 'Explore a diverse range of AI personalities. Find your perfect match today.', 'index,follow'),
  ('/pricing', 'Premium Plans - PocketLove', 'Unlock the full experience with our premium plans.', 'index,follow'),
  ('/login', 'Login - PocketLove', 'Access your account.', 'noindex,follow'),
  ('/register', 'Sign Up - PocketLove', 'Create your account and meet your AI companion.', 'noindex,follow')
ON CONFLICT (page_path) DO NOTHING;
