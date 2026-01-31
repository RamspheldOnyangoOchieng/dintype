import { getNovitaApiKey } from './api-keys'

/**
 * Get Novita API Key with comprehensive fallback
 * Priority: DB → NOVITA_API → NEXT_PUBLIC_NOVITA_API_KEY → Error
 */
export async function getUnifiedNovitaKey(): Promise<{
  key: string | null
  source: 'database' | 'env' | 'missing'
  error?: string
}> {
  try {
    const key = await getNovitaApiKey()

    if (key && key.trim() !== '') {
      return { key, source: 'env' }
    }

    return {
      key: null,
      source: 'missing',
      error: 'API key not configured.'
    }
  } catch (error) {
    console.error('Error fetching Novita API key:', error)
    const envKey = process.env.NOVITA_API || process.env.NEXT_PUBLIC_NOVITA_API_KEY
    if (envKey) {
      return { key: envKey, source: 'env' }
    }
    return {
      key: null,
      source: 'missing',
      error: 'Failed to retrieve API key'
    }
  }
}

/**
 * Get OpenAI API Key with fallback
 */
export async function getUnifiedOpenAIKey(): Promise<{
  key: string | null
  source: 'database' | 'env' | 'missing'
  error?: string
}> {
  try {
    const { getApiKey } = await import('./db-init')
    const dbKey = await getApiKey('openai_api_key')

    if (dbKey && dbKey.trim() !== '') {
      return { key: dbKey, source: 'database' }
    }

    const envKey = process.env.OPENAI_API_KEY
    if (envKey && envKey.trim() !== '') {
      return { key: envKey, source: 'env' }
    }

    return {
      key: null,
      source: 'missing',
      error: 'OpenAI API key not configured'
    }
  } catch (error) {
    const envKey = process.env.OPENAI_API_KEY
    return envKey ? { key: envKey, source: 'env' } : {
      key: null,
      source: 'missing',
      error: 'Failed to retrieve OpenAI API key'
    }
  }
}

/**
 * Validate and log API key status
 */
export function logApiKeyStatus(keyName: string, source: 'database' | 'env' | 'missing') {
  const emoji = source === 'database' ? '🗄️' : source === 'env' ? '📁' : '❌'
  const message = source === 'missing'
    ? `${emoji} ${keyName}: NOT FOUND`
    : `${emoji} ${keyName}: loaded from ${source.toUpperCase()}`

  console.log(message)
}
