-- Create a function to get images by text ID
CREATE OR REPLACE FUNCTION get_images_by_text_id(user_text_id TEXT)
RETURNS SETOF generated_images AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM generated_images
  WHERE user_id::text = user_text_id
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_images_by_text_id(TEXT) TO authenticated, anon;
