-- Check if the anonymous_id column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'generated_images' AND column_name = 'anonymous_id'
    ) THEN
        ALTER TABLE generated_images ADD COLUMN anonymous_id TEXT;
    END IF;
END $$;

-- Create an index on the anonymous_id column for faster lookups
CREATE INDEX IF NOT EXISTS idx_generated_images_anonymous_id ON generated_images(anonymous_id);

-- Update RLS policies to allow access via anonymous_id
CREATE POLICY IF NOT EXISTS "Allow anonymous access via anonymous_id" 
ON generated_images FOR SELECT 
TO anon, authenticated
USING (anonymous_id IS NOT NULL);
