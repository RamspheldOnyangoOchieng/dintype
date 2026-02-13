-- Migration: 20260213_telegram_schema_fixes.sql
-- Description: Ensure all Telegram-related tables, columns, and relations are present and correct.

-- 1. Create telegram_link_codes table
CREATE TABLE IF NOT EXISTS public.telegram_link_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    character_name TEXT,
    used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for link codes
CREATE INDEX IF NOT EXISTS idx_telegram_link_codes_code ON public.telegram_link_codes(code);
CREATE INDEX IF NOT EXISTS idx_telegram_link_codes_expires ON public.telegram_link_codes(expires_at);

-- RLS for telegram_link_codes
ALTER TABLE public.telegram_link_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage link codes" ON public.telegram_link_codes;
CREATE POLICY "Service role can manage link codes" ON public.telegram_link_codes
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. Update telegram_links table
-- Add is_guest column and make user_id nullable
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='telegram_links' AND column_name='is_guest') THEN
        ALTER TABLE public.telegram_links ADD COLUMN is_guest BOOLEAN DEFAULT false;
    END IF;
    
    -- Make user_id nullable for guest users
    ALTER TABLE public.telegram_links ALTER COLUMN user_id DROP NOT NULL;
END $$;

-- 3. Create chat_history view for compatibility
-- This maps the modern 'messages' table to the 'chat_history' name used in some legacy/stats code
CREATE OR REPLACE VIEW public.chat_history AS
SELECT 
    m.id,
    m.user_id,
    m.role,
    m.content,
    m.is_image,
    m.image_url,
    m.created_at,
    tl.telegram_id as telegram_user_id,
    cs.character_id
FROM public.messages m
JOIN public.conversation_sessions cs ON m.session_id = cs.id
LEFT JOIN public.telegram_links tl ON cs.user_id = tl.user_id;

-- 4. Ensure exec_sql RPC exists (if not already present)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Ensure settings table can handle telegram keys (RLS already allows service_role)
-- No changes needed to structure, but good to have a policy for bot identity
DROP POLICY IF EXISTS "Service role all for settings" ON public.settings;
CREATE POLICY "Service role all for settings" ON public.settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6. Add telegram_user_id and is_image to messages table if they don't exist
-- (The webhook uses 'telegram_user_id' in some queries and we might want it for faster stats)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='telegram_user_id') THEN
        ALTER TABLE public.messages ADD COLUMN telegram_user_id TEXT;
    END IF;
END $$;
