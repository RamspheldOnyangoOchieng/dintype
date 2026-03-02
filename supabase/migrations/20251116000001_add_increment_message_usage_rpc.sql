-- Create a simple RPC function for incrementing message usage that the code expects
-- This is called directly from the application code for reliable usage tracking

CREATE OR REPLACE FUNCTION increment_message_usage_simple(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.message_usage_tracking (user_id, date, message_count, created_at, updated_at)
  VALUES (p_user_id, CURRENT_DATE, 1, NOW(), NOW())
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    message_count = public.message_usage_tracking.message_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (service role will call this through admin client)
GRANT EXECUTE ON FUNCTION increment_message_usage_simple(UUID) TO service_role;

COMMENT ON FUNCTION increment_message_usage_simple IS 'Increment daily message usage count for free plan limit enforcement';
