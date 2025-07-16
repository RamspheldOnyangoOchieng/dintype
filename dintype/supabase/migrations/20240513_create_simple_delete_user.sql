-- Create a simple function to delete a user by their auth ID
CREATE OR REPLACE FUNCTION public.simple_delete_user(auth_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id int;
  success boolean := false;
BEGIN
  -- First try to find the profile ID
  BEGIN
    SELECT id INTO profile_id FROM profiles WHERE auth_id = auth_id OR id::text = auth_id;
    EXCEPTION WHEN OTHERS THEN
      -- If there's an error, try a different approach
      BEGIN
        SELECT id INTO profile_id FROM profiles WHERE id = auth_id::integer;
        EXCEPTION WHEN OTHERS THEN
          -- If that fails too, return false
          RETURN false;
      END;
  END;
  
  -- If we found a profile ID, delete it
  IF profile_id IS NOT NULL THEN
    DELETE FROM profiles WHERE id = profile_id;
    success := true;
  END IF;
  
  RETURN success;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.simple_delete_user(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.simple_delete_user(text) TO service_role;
