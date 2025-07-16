-- Create a function to update a user's admin status
CREATE OR REPLACE FUNCTION update_user_admin_status(user_id UUID, admin_status BOOLEAN)
RETURNS VOID AS $$
BEGIN
  -- Update the is_admin field in the auth.users table
  UPDATE auth.users
  SET is_admin = admin_status
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_admin_status TO authenticated;
