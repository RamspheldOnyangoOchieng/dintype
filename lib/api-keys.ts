/**
 * Centralized API Key Management Utility
 * 
 * This module provides a unified way to access API keys across the application.
 * It automatically falls back to environment variables if database values are not found.
 * 
 * Priority:
 * 1. Database value (admin-configured)
 * 2. Environment variable (.env)
 */

import { getApiKey } from "./db-init"

// Simple in-memory cache to avoid redundant DB calls during the same execution or warm container
let cachedNovitaKey: string | null = null;
let lastKeyFetch = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function getNovitaApiKey(): Promise<string | null> {
  const now = Date.now();
  if (cachedNovitaKey && (now - lastKeyFetch < CACHE_TTL)) {
    return cachedNovitaKey;
  }

  try {
    // Try environment variables first (fastest)
    const envKey = process.env.NOVITA_API || process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    if (envKey && envKey.trim() !== "") {
      cachedNovitaKey = envKey;
      lastKeyFetch = now;
      return envKey;
    }

    // Fall back to database
    const dbKey = await getApiKey("novita_api_key");
    if (dbKey && dbKey.trim() !== "") {
      cachedNovitaKey = dbKey;
      lastKeyFetch = now;
      return dbKey;
    }

    return null;
  } catch (error) {
    console.error("Error getting Novita API key:", error);
    return process.env.NOVITA_API || process.env.NEXT_PUBLIC_NOVITA_API_KEY || null;
  }
}

/**
 * Get Stripe Test Secret Key with fallback
 * Priority: DB → STRIPE_TEST_SECRET_KEY → null
 */
export async function getStripeTestSecretKey(): Promise<string | null> {
  try {
    const dbKey = await getApiKey("stripe_test_secret_key")
    if (dbKey && dbKey.trim() !== "") {
      console.log("✅ Using Stripe Test Secret Key from database")
      return dbKey
    }

    const envKey = process.env.STRIPE_TEST_SECRET_KEY
    if (envKey && envKey.trim() !== "") {
      console.log("✅ Using Stripe Test Secret Key from environment variables")
      return envKey
    }

    return null
  } catch (error) {
    console.error("Error getting Stripe Test Secret Key:", error)
    return process.env.STRIPE_TEST_SECRET_KEY || null
  }
}

/**
 * Get Stripe Test Publishable Key with fallback
 * Priority: DB → STRIPE_TEST_PUBLISHABLE_KEY → null
 */
export async function getStripeTestPublishableKey(): Promise<string | null> {
  try {
    const dbKey = await getApiKey("stripe_test_publishable_key")
    if (dbKey && dbKey.trim() !== "") {
      return dbKey
    }

    return process.env.STRIPE_TEST_PUBLISHABLE_KEY || null
  } catch (error) {
    console.error("Error getting Stripe Test Publishable Key:", error)
    return process.env.STRIPE_TEST_PUBLISHABLE_KEY || null
  }
}

/**
 * Get Stripe Live Secret Key with fallback
 * Priority: DB → STRIPE_LIVE_SECRET_KEY → null
 */
export async function getStripeLiveSecretKey(): Promise<string | null> {
  try {
    const dbKey = await getApiKey("stripe_live_secret_key")
    if (dbKey && dbKey.trim() !== "") {
      console.log("✅ Using Stripe Live Secret Key from database")
      return dbKey
    }

    const envKey = process.env.STRIPE_LIVE_SECRET_KEY
    if (envKey && envKey.trim() !== "") {
      console.log("✅ Using Stripe Live Secret Key from environment variables")
      return envKey
    }

    return null
  } catch (error) {
    console.error("Error getting Stripe Live Secret Key:", error)
    return process.env.STRIPE_LIVE_SECRET_KEY || null
  }
}

/**
 * Get Stripe Live Publishable Key with fallback
 * Priority: DB → STRIPE_LIVE_PUBLISHABLE_KEY → null
 */
export async function getStripeLivePublishableKey(): Promise<string | null> {
  try {
    const dbKey = await getApiKey("stripe_live_publishable_key")
    if (dbKey && dbKey.trim() !== "") {
      return dbKey
    }

    return process.env.STRIPE_LIVE_PUBLISHABLE_KEY || null
  } catch (error) {
    console.error("Error getting Stripe Live Publishable Key:", error)
    return process.env.STRIPE_LIVE_PUBLISHABLE_KEY || null
  }
}

/**
 * Get Stripe Webhook Secret with fallback
 * Priority: DB → STRIPE_WEBHOOK_SECRET → null
 */
export async function getStripeWebhookSecret(): Promise<string | null> {
  try {
    const dbKey = await getApiKey("stripe_webhook_secret")
    if (dbKey && dbKey.trim() !== "") {
      console.log("✅ Using Stripe Webhook Secret from database")
      return dbKey
    }

    const envKey = process.env.STRIPE_WEBHOOK_SECRET
    if (envKey && envKey.trim() !== "") {
      console.log("✅ Using Stripe Webhook Secret from environment variables")
      return envKey
    }

    return null
  } catch (error) {
    console.error("Error getting Stripe Webhook Secret:", error)
    return process.env.STRIPE_WEBHOOK_SECRET || null
  }
}

/**
 * Get the active Stripe secret key based on mode
 * Uses STRIPE_LIVE_MODE environment variable to determine which key to use
 */
export async function getActiveStripeSecretKey(): Promise<string | null> {
  const isLiveMode = process.env.STRIPE_LIVE_MODE === "true"

  if (isLiveMode) {
    return await getStripeLiveSecretKey()
  } else {
    return await getStripeTestSecretKey()
  }
}

/**
 * Get the active Stripe publishable key based on mode
 * Uses STRIPE_LIVE_MODE environment variable to determine which key to use
 */
export async function getActiveStripePublishableKey(): Promise<string | null> {
  const isLiveMode = process.env.STRIPE_LIVE_MODE === "true"

  if (isLiveMode) {
    return await getStripeLivePublishableKey()
  } else {
    return await getStripeTestPublishableKey()
  }
}

/**
 * Synchronous version for client-side (uses only env variables)
 * Should only be used when async is not available
 */
export function getNovitaApiKeySync(): string | null {
  return process.env.NOVITA_API || process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY || null
}

/**
 * Check if all required API keys are configured
 */
export async function checkApiKeysStatus(): Promise<{
  novita: boolean
  stripe: boolean
  webhook: boolean
  details: {
    novita_source: 'database' | 'env' | 'missing'
    stripe_test_source: 'database' | 'env' | 'missing'
    stripe_live_source: 'database' | 'env' | 'missing'
    webhook_source: 'database' | 'env' | 'missing'
  }
}> {
  const novitaKey = await getNovitaApiKey()
  const stripeTestKey = await getStripeTestSecretKey()
  const stripeLiveKey = await getStripeLiveSecretKey()
  const webhookSecret = await getStripeWebhookSecret()

  // Determine sources
  const novitaDb = await getApiKey("novita_api_key")
  const stripeTestDb = await getApiKey("stripe_test_secret_key")
  const stripeLiveDb = await getApiKey("stripe_live_secret_key")
  const webhookDb = await getApiKey("stripe_webhook_secret")

  return {
    novita: !!novitaKey,
    stripe: !!(stripeTestKey || stripeLiveKey),
    webhook: !!webhookSecret,
    details: {
      novita_source: novitaDb ? 'database' : (novitaKey ? 'env' : 'missing'),
      stripe_test_source: stripeTestDb ? 'database' : (stripeTestKey ? 'env' : 'missing'),
      stripe_live_source: stripeLiveDb ? 'database' : (stripeLiveKey ? 'env' : 'missing'),
      webhook_source: webhookDb ? 'database' : (webhookSecret ? 'env' : 'missing')
    }
  }
}
