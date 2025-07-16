CREATE TABLE public.forbidden_phrases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phrase TEXT NOT NULL UNIQUE,
    category TEXT,
    severity INT DEFAULT 1,
    is_regex BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.forbidden_phrases ENABLE ROW LEVEL SECURITY; 