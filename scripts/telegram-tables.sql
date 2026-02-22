-- Telegram Integration Tables for Dintype
-- Run this migration in Supabase SQL Editor

-- Table to store active links between Telegram users and Dintype accounts
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

-- Table to store one-time link codes (for the /start link_xxx flow)
CREATE TABLE IF NOT EXISTS public.telegram_link_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL,
  character_name TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_telegram_links_telegram_id ON public.telegram_links(telegram_id);
CREATE INDEX IF NOT EXISTS idx_telegram_links_user_id ON public.telegram_links(user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_links_character_id ON public.telegram_links(character_id);
CREATE INDEX IF NOT EXISTS idx_telegram_link_codes_code ON public.telegram_link_codes(code);
CREATE INDEX IF NOT EXISTS idx_telegram_link_codes_expires_at ON public.telegram_link_codes(expires_at);

-- Enable RLS
ALTER TABLE public.telegram_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_link_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for telegram_links
CREATE POLICY "Users can view their own telegram links" ON public.telegram_links
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own telegram links" ON public.telegram_links
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all telegram links" ON public.telegram_links
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for telegram_link_codes
CREATE POLICY "Users can view their own link codes" ON public.telegram_link_codes
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all link codes" ON public.telegram_link_codes
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to clean up expired link codes (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_telegram_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.telegram_link_codes
  WHERE expires_at < now() OR used = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION cleanup_expired_telegram_codes() TO service_role;

-- Add telegram_message_id to messages metadata for sync tracking
-- (No schema change needed - we use JSONB metadata column)

COMMENT ON TABLE public.telegram_links IS 'Links between Telegram accounts and Dintype user accounts';
COMMENT ON TABLE public.telegram_link_codes IS 'One-time codes for linking Telegram accounts';
