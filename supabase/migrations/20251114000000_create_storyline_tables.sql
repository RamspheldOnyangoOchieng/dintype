-- ============================================================================
-- STORYLINE SYSTEM TABLES
-- Migration: 20251114000000_create_storyline_tables.sql
-- Description: Create database tables for character storylines and progress
-- ============================================================================

-- ============================================================================
-- 1. STORY_CHAPTERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.story_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  tone TEXT,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Includes branches, messages, media
  system_prompt TEXT, -- Specific tailored prompt for this chapter if needed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(character_id, chapter_number)
);

CREATE INDEX IF NOT EXISTS idx_story_chapters_character_id ON public.story_chapters(character_id);
CREATE INDEX IF NOT EXISTS idx_story_chapters_number ON public.story_chapters(chapter_number);

COMMENT ON TABLE public.story_chapters IS 'Interactive story chapters for characters';
COMMENT ON COLUMN public.story_chapters.content IS 'JSONB structure containing intro message, branching options, responses, and media assets';

-- ============================================================================
-- 2. USER_STORY_PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_story_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  current_chapter_number INTEGER NOT NULL DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  unlocked_chapters INTEGER[] DEFAULT '{1}',
  current_state JSONB DEFAULT '{}'::jsonb, -- To track variables or decisions made
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_user_story_progress_user_id ON public.user_story_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_story_progress_character_id ON public.user_story_progress(character_id);

COMMENT ON TABLE public.user_story_progress IS 'Tracks user progress through character storylines';

-- ============================================================================
-- 3. RLS POLICIES
-- ============================================================================

ALTER TABLE public.story_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_story_progress ENABLE ROW LEVEL SECURITY;

-- story_chapters: Public read (or authenticated), Admin manage
DROP POLICY IF EXISTS "Anyone can view story chapters" ON public.story_chapters;
CREATE POLICY "Anyone can view story chapters"
  ON public.story_chapters FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage story chapters" ON public.story_chapters;
CREATE POLICY "Admins can manage story chapters"
  ON public.story_chapters FOR ALL
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- user_story_progress: Users manage own, Admins view all
DROP POLICY IF EXISTS "Users can manage own story progress" ON public.user_story_progress;
CREATE POLICY "Users can manage own story progress"
  ON public.user_story_progress FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all story progress" ON public.user_story_progress;
CREATE POLICY "Admins can view all story progress"
  ON public.user_story_progress FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- Service role bypass
DROP POLICY IF EXISTS "Service role can manage story tables" ON public.story_chapters;
CREATE POLICY "Service role can manage story tables" ON public.story_chapters FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role can manage progress" ON public.user_story_progress;
CREATE POLICY "Service role can manage progress" ON public.user_story_progress FOR ALL USING (true);
