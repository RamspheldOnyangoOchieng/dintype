-- Check the current structure of the profiles table
DO $$
DECLARE
    column_type TEXT;
BEGIN
    SELECT data_type INTO column_type
    FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'id';
    
    RAISE NOTICE 'Current profiles.id type: %', column_type;
    
    -- If the id column is an integer, create a new function that handles this correctly
    IF column_type = 'integer' THEN
        -- Create a function that works with integer IDs
        CREATE OR REPLACE FUNCTION public.delete_user_by_uuid(user_uuid UUID)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
            profile_id INTEGER;
        BEGIN
            -- Find the profile ID that corresponds to this UUID
            SELECT id INTO profile_id FROM public.profiles 
            WHERE auth_id = user_uuid::text OR auth_id = user_uuid;
            
            IF profile_id IS NOT NULL THEN
                -- Delete the profile using the integer ID
                DELETE FROM public.profiles WHERE id = profile_id;
                RETURN TRUE;
            END IF;
            
            RETURN FALSE;
        END;
        $$;
        
        -- Grant execute permission
        GRANT EXECUTE ON FUNCTION public.delete_user_by_uuid(UUID) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.delete_user_by_uuid(UUID) TO anon;
        
        RAISE NOTICE 'Created delete_user_by_uuid function for integer profile IDs';
    ELSE
        -- Create the standard function for UUID IDs
        CREATE OR REPLACE FUNCTION public.delete_user_direct(user_id UUID)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
            -- Delete from profiles first
            DELETE FROM public.profiles WHERE id = user_id;
            RETURN TRUE;
        END;
        $$;
        
        -- Grant execute permission
        GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO anon;
        
        RAISE NOTICE 'Created delete_user_direct function for UUID profile IDs';
    END IF;
END $$;
