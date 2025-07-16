CREATE TABLE public.moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content_type TEXT NOT NULL,
    original_content TEXT NOT NULL,
    moderated_content TEXT,
    policy_violation TEXT,
    action_taken TEXT NOT NULL,
    triggered_rules TEXT[],
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY; 