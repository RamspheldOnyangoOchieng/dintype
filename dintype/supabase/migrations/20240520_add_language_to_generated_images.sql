-- Add language column to generated_images table
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Add index for language queries
CREATE INDEX IF NOT EXISTS generated_images_language_idx ON generated_images (language);

-- Update existing records to have Swedish as default language
UPDATE generated_images 
SET language = 'sv' 
WHERE language IS NULL OR language = 'en';
