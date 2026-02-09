-- Migration to add missing appearance and personality columns to the characters table
-- This supports the advanced AI identity engine and character editor

-- 1. Appearance Traits (Supporting both snake_case and camelCase for compatibility)
ALTER TABLE characters ADD COLUMN IF NOT EXISTS age NUMERIC;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS hobbies TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS ethnicity TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS relationship TEXT;

-- Hair
ALTER TABLE characters ADD COLUMN IF NOT EXISTS hair_color TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS hair_style TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "hairColor" TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "hairStyle" TEXT;

-- Eyes and Skin
ALTER TABLE characters ADD COLUMN IF NOT EXISTS eye_color TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "eyeColor" TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS skin_tone TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "skinTone" TEXT;

-- Style and Body
ALTER TABLE characters ADD COLUMN IF NOT EXISTS character_style TEXT DEFAULT 'realistic';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "characterStyle" TEXT DEFAULT 'realistic';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "bodyType" TEXT;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "artStyle" TEXT;

-- Metadata/Status
ALTER TABLE characters ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'girls';
ALTER TABLE characters ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "isNew" BOOLEAN DEFAULT FALSE;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT TRUE;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS is_storyline_active BOOLEAN DEFAULT FALSE;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "isStorylineActive" BOOLEAN DEFAULT FALSE;

-- Identification
ALTER TABLE characters ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS "userId" UUID;

-- 2. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_characters_category ON public.characters(category);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_is_public ON public.characters(is_public);
