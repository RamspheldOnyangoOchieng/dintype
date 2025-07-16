-- Create payment_redirects table
CREATE TABLE IF NOT EXISTS payment_redirects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  redirect_page TEXT NOT NULL,
  redirect_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  is_premium BOOLEAN DEFAULT FALSE
);

-- Add RLS policies
ALTER TABLE payment_redirects ENABLE ROW LEVEL SECURITY;

-- Admin can see all redirects
CREATE POLICY "Admins can see all payment redirects" 
ON payment_redirects FOR SELECT 
TO authenticated 
USING (
  is_admin()
);

-- Users can see their own redirects
CREATE POLICY "Users can see their own payment redirects" 
ON payment_redirects FOR SELECT 
TO authenticated 
USING (
  auth.uid() = user_id
);

-- Admin can insert redirects
CREATE POLICY "Admins can insert payment redirects" 
ON payment_redirects FOR INSERT 
TO authenticated 
WITH CHECK (
  is_admin()
);

-- Users can insert their own redirects
CREATE POLICY "Users can insert their own payment redirects" 
ON payment_redirects FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = user_id
);

-- Admin can update redirects
CREATE POLICY "Admins can update payment redirects" 
ON payment_redirects FOR UPDATE 
TO authenticated 
USING (
  is_admin()
);

-- Users can update their own redirects
CREATE POLICY "Users can update their own payment redirects" 
ON payment_redirects FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = user_id
);
