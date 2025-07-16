-- Create a function to delete users directly via SQL
CREATE OR REPLACE FUNCTION public.delete_user_direct(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
AS $$
BEGIN
  -- Delete from profiles first
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Try to delete from auth.users if possible
  BEGIN
    DELETE FROM auth.users WHERE id = user_id;
    EXCEPTION WHEN OTHERS THEN
      -- Ignore errors, we already tried to delete from profiles
      RAISE NOTICE 'Could not delete from auth.users: %', SQLERRM;
  END;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO authenticated;
-- Grant execute permission to anon users if needed
GRANT EXECUTE ON FUNCTION public.delete_user_direct(UUID) TO anon;
