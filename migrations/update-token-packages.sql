-- Migration: Update Token Packages
-- Date: 2026-03-02
-- Description: Update token packages to new pricing structure for premium users only
-- 
-- New pricing:
-- 200 tokens — 9,99 € / 99 kr
-- 550 tokens - €24.99 / 249 kr
-- 1,550 tokens— €49.99 / 499 kr
-- 5,800 tokens — €149.99 / 1,499 kr

-- First, deactivate all existing packages
UPDATE token_packages SET active = false;

-- Delete existing packages (optional - uncomment if you want a clean slate)
-- DELETE FROM token_packages;

-- Insert new token packages
INSERT INTO token_packages (name, tokens, price, price_display, active) VALUES
  ('200 tokens', 200, 99, '€9.99 / 99 kr', true),
  ('550 tokens', 550, 249, '€24.99 / 249 kr', true),
  ('1,550 tokens', 1550, 499, '€49.99 / 499 kr', true),
  ('5,800 tokens', 5800, 1499, '€149.99 / 1,499 kr', true)
ON CONFLICT (name) DO UPDATE SET
  tokens = EXCLUDED.tokens,
  price = EXCLUDED.price,
  price_display = EXCLUDED.price_display,
  active = true;
