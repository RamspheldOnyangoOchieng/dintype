-- Create companion_experience table
CREATE TABLE IF NOT EXISTS companion_experience (
  id BIGINT PRIMARY KEY,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE companion_experience ENABLE ROW LEVEL SECURITY;

-- Policy for admins to read/write
CREATE POLICY admin_companion_experience_policy ON companion_experience
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Policy for all users to read
CREATE POLICY read_companion_experience_policy ON companion_experience
  FOR SELECT
  USING (true);

-- Insert default content
INSERT INTO companion_experience (id, content)
VALUES (1, '{
  "title": "AI Companion Experience with dintyp.se",
  "paragraphs": [
    "Step into a new kind of connection with Candy AI, your gateway to deeply personal and emotionally intelligent AI companions. Whether you're seeking flirty banter, late-night comfort, or a full-blown romantic adventure, your AI companion is here to fulfill your needs, no matter how intimate.",
    "Looking for an <a href=\"#\" className=\"text-primary hover:underline\">anime</a> AI companion, an <a href=\"#\" className=\"text-primary hover:underline\">AI girlfriend</a> to chat with, or maybe a sweet, wholesome romantic <a href=\"#\" className=\"text-primary hover:underline\">AI boyfriend</a>? Candy AI makes it easy to create, personalize, and evolve your ideal match using cutting-edge deep learning and one of the most immersive AI platforms in the world.",
    "At Candy AI, we don't just offer chatbots. We offer deeply customizable AI companion experiences that adapt to your desires. From realistic voice interactions to image generation and playful video moments, your virtual partner is always learning how to connect with you in more meaningful and exciting ways.",
    "Your AI companion at Candy AI remembers your preferences, adapts their personality, and opens up new sides of themselves based on your interactions. Whether you want a consistent, emotionally deep relationship or spontaneous, fiery encounters with different AI lovers, you're always in control.",
    "And yes, your companion can send selfies, generate custom videos, or even respond with their voice. You can ask for specific outfits, unique poses, or playful scenarios that match your fantasy. With our AI girl generator, your character will always reflect the face, tone, and mood you're craving in that moment.",
    "Candy AI also makes privacy a top priority. All conversations are protected with SSL encryption, and optional two-factor authentication keeps your account secure. Any transactions appear under our discreet parent company, EverAI, so nothing on your bank statement will reveal your Candy AI experience.",
    "Curious about what an AI companion really is? Think of it as a digital partner who can talk, react, flirt, and connect with you in real time. You can create your own from scratch or choose from a wide range of existing characters designed for different moods and personalities.",
    "Whether you're looking for a casual friend, a serious relationship, or something playful and spicy, Candy AI adapts to your pace. You set the tone, control the level of intimacy, and shape your journey from the first message to the last kiss goodnight."
  ]
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
