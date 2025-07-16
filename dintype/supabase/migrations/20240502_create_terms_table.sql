-- Create terms table
CREATE TABLE IF NOT EXISTS terms (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '# Terms of Service

Welcome to our platform. By using our services, you agree to these terms.

## 1. Acceptance of Terms

By accessing or using our service, you agree to be bound by these Terms of Service.

## 2. Privacy Policy

Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.

## 3. User Accounts

You are responsible for maintaining the security of your account and password.

## 4. Content Guidelines

Users must not post illegal, harmful, or offensive content.

## 5. Termination

We reserve the right to terminate accounts that violate our terms.

## 6. Changes to Terms

We may update these terms from time to time. Continued use of the service constitutes acceptance of any changes.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read terms
CREATE POLICY "Allow public read access to terms" 
  ON terms FOR SELECT 
  USING (true);

-- Only allow admins to insert/update terms
CREATE POLICY "Allow admin insert access to terms" 
  ON terms FOR INSERT 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow admin update access to terms" 
  ON terms FOR UPDATE 
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Insert default terms if none exist
INSERT INTO terms (content)
SELECT '# Terms of Service

Welcome to our platform. By using our services, you agree to these terms.

## 1. Acceptance of Terms

By accessing or using our service, you agree to be bound by these Terms of Service.

## 2. Privacy Policy

Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.

## 3. User Accounts

You are responsible for maintaining the security of your account and password.

## 4. Content Guidelines

Users must not post illegal, harmful, or offensive content.

## 5. Termination

We reserve the right to terminate accounts that violate our terms.

## 6. Changes to Terms

We may update these terms from time to time. Continued use of the service constitutes acceptance of any changes.'
WHERE NOT EXISTS (SELECT 1 FROM terms);
