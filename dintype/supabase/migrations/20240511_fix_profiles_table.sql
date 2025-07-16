-- This migration will help fix the profiles table structure
-- to work with Supabase Auth UUIDs

-- First, check if the profiles table exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Check if the id column is an integer
        IF EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'id' 
            AND data_type = 'integer'
        ) THEN
            -- Create a backup of the existing profiles table
            CREATE TABLE IF NOT EXISTS profiles_backup AS SELECT * FROM profiles;
            
            -- Drop the existing profiles table
            DROP TABLE profiles;
            
            -- Create a new profiles table with UUID as primary key
            CREATE TABLE profiles (
                id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                is_admin BOOLEAN DEFAULT FALSE
                -- Add other columns as needed
            );
            
            -- Note: You'll need to manually migrate data from profiles_backup
            -- to the new profiles table, converting integer IDs to UUIDs if possible
        END IF;
    ELSE
        -- Create the profiles table if it doesn't exist
        CREATE TABLE profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            is_admin BOOLEAN DEFAULT FALSE
            -- Add other columns as needed
        );
    END IF;
END
$$;

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );
