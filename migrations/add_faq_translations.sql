-- Adds a JSONB translations column to the faqs table.
-- Structure: { "sv": { "question": "...", "answer": "..." }, "fr": { ... } }
-- The primary `question` and `answer` TEXT columns keep the English (default) content.
-- When a new language is added later, just add an entry under that language code - no schema change needed.

ALTER TABLE faqs ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';

-- GIN index for fast language key lookups
CREATE INDEX IF NOT EXISTS faqs_translations_gin ON faqs USING GIN (translations);
