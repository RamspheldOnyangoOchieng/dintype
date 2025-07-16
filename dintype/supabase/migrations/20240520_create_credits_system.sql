-- Create credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_credits INTEGER NOT NULL DEFAULT 0,
  used_credits INTEGER NOT NULL DEFAULT 0,
  remaining_credits INTEGER GENERATED ALWAYS AS (total_credits - used_credits) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS user_credits_user_id_idx ON user_credits (user_id);

-- Enable Row Level Security
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own credits
CREATE POLICY "Users can view their own credits" 
ON user_credits FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to update their own credits
CREATE POLICY "Users can update their own credits" 
ON user_credits FOR UPDATE 
USING (auth.uid() = user_id);

-- Create credit transactions table for tracking usage
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_used INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('message', 'image_generation', 'premium_feature', 'purchase', 'bonus')),
  description TEXT,
  conversation_id TEXT,
  character_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS credit_transactions_user_id_idx ON credit_transactions (user_id);
CREATE INDEX IF NOT EXISTS credit_transactions_created_at_idx ON credit_transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS credit_transactions_conversation_id_idx ON credit_transactions (conversation_id);

-- Enable Row Level Security
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own transactions
CREATE POLICY "Users can view their own credit transactions" 
ON credit_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own transactions
CREATE POLICY "Users can insert their own credit transactions" 
ON credit_transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Function to initialize user credits (called when user signs up)
CREATE OR REPLACE FUNCTION initialize_user_credits(user_uuid UUID, initial_credits INTEGER DEFAULT 100)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_credits (user_id, total_credits, used_credits)
  VALUES (user_uuid, initial_credits, 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(
  user_uuid UUID,
  credits_to_deduct INTEGER,
  transaction_type_param TEXT,
  description_param TEXT DEFAULT NULL,
  conversation_id_param TEXT DEFAULT NULL,
  character_id_param UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_remaining INTEGER;
BEGIN
  -- Get current remaining credits
  SELECT remaining_credits INTO current_remaining
  FROM user_credits
  WHERE user_id = user_uuid;
  
  -- Check if user has enough credits
  IF current_remaining IS NULL OR current_remaining < credits_to_deduct THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct credits
  UPDATE user_credits
  SET used_credits = used_credits + credits_to_deduct,
      updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    credits_used,
    transaction_type,
    description,
    conversation_id,
    character_id
  ) VALUES (
    user_uuid,
    credits_to_deduct,
    transaction_type_param,
    description_param,
    conversation_id_param,
    character_id_param
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (for purchases)
CREATE OR REPLACE FUNCTION add_credits(
  user_uuid UUID,
  credits_to_add INTEGER,
  description_param TEXT DEFAULT 'Credits purchased'
)
RETURNS VOID AS $$
BEGIN
  -- Add credits to total
  UPDATE user_credits
  SET total_credits = total_credits + credits_to_add,
      updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    credits_used,
    transaction_type,
    description
  ) VALUES (
    user_uuid,
    -credits_to_add, -- Negative because it's adding credits
    'purchase',
    description_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize credits for new users
CREATE OR REPLACE FUNCTION handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM initialize_user_credits(NEW.id, 100); -- Give new users 100 credits
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_credits();
