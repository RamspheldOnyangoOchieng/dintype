-- Create a function to delete users that bypasses RLS policies
CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
AS $$
BEGIN
  -- Delete from auth.users (this will cascade to profiles if set up correctly)
  DELETE FROM auth.users WHERE id = user_id;
  
  -- If you need to delete from other tables, add those deletions here
  -- For example:
  -- DELETE FROM profiles WHERE id = user_id;
  
  -- Return nothing (void)
  RETURN;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user(UUID) TO authenticated;
-- Grant execute permission to anon users if needed
GRANT EXECUTE ON FUNCTION public.delete_user(UUID) TO anon;
