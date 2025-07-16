-- Create SEO table
CREATE TABLE IF NOT EXISTS seo_settings (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default global settings
INSERT INTO seo_settings (id, data)
VALUES (
  'global',
  '{
    "siteName": "AI Character Explorer",
    "siteUrl": "https://ai-character-explorer.vercel.app",
    "titleTemplate": "%s | AI Character Explorer",
    "description": "Explore and chat with AI characters in a fun and interactive way.",
    "keywords": "AI, characters, chat, virtual companions, artificial intelligence",
    "ogImage": "/og-image.jpg",
    "twitterHandle": "@aicharacterexplorer"
  }'
) ON CONFLICT (id) DO NOTHING;

-- Insert default page settings
INSERT INTO seo_settings (id, data)
VALUES (
  'pages',
  '{
    "/": {
      "title": "AI Character Explorer",
      "description": "Explore and chat with AI characters in a fun and interactive way.",
      "keywords": "AI, characters, chat, virtual companions, artificial intelligence",
      "ogImage": "/og-image.jpg"
    },
    "/characters": {
      "title": "Browse Characters",
      "description": "Browse our collection of AI characters and find your perfect virtual companion.",
      "keywords": "AI characters, virtual companions, character gallery, browse characters",
      "ogImage": "/characters-og.jpg"
    },
    "/chat": {
      "title": "Chat with Characters",
      "description": "Chat with your favorite AI characters in real-time.",
      "keywords": "AI chat, character chat, virtual companions, conversation",
      "ogImage": "/chat-og.jpg"
    }
  }'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to SEO settings" 
  ON seo_settings FOR SELECT 
  USING (true);

-- Create policy for admin users to update
CREATE POLICY "Allow admin users to update SEO settings" 
  ON seo_settings FOR ALL 
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));
