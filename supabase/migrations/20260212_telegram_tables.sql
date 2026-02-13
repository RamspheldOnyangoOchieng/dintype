-- Create telegram_users table
CREATE TABLE IF NOT EXISTS public.telegram_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  bio TEXT,
  active_character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create telegram_links table if not exists (redundant but safe)
CREATE TABLE IF NOT EXISTS public.telegram_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  telegram_username TEXT,
  telegram_first_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_telegram_users_telegram_id ON public.telegram_users(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_users_last_active ON public.telegram_users(last_active_at);
CREATE INDEX IF NOT EXISTS idx_telegram_links_telegram_id ON public.telegram_links(telegram_id);

-- Enable RLS
ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_links ENABLE ROW LEVEL SECURITY;

-- Policies for telegram_users
CREATE POLICY "Allow public read for telegram_users" ON public.telegram_users
  FOR SELECT USING (true);

CREATE POLICY "Allow service role all for telegram_users" ON public.telegram_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Policies for telegram_links
CREATE POLICY "Users can view their own telegram links" ON public.telegram_links
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all telegram links" ON public.telegram_links
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Add last_active_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_telegram_users_updated_at BEFORE UPDATE ON public.telegram_users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_telegram_links_updated_at BEFORE UPDATE ON public.telegram_links FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
