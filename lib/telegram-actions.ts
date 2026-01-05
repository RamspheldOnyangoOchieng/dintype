'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import crypto from 'crypto'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BOT_USERNAME = 'pocketloveaibot'

export interface TelegramLinkResult {
    success: boolean
    linkUrl?: string
    error?: string
    isAlreadyLinked?: boolean
    linkedTelegramUsername?: string
}

/**
 * Generate a one-time link code for connecting Telegram to Pocketlove
 */
export async function generateTelegramLinkCode(
    userId: string,
    characterId: string,
    characterName: string
): Promise<TelegramLinkResult> {
    try {
        const supabase = await createAdminClient()
        if (!supabase) {
            return { success: false, error: 'Database connection failed' }
        }

        // Check if user already has a Telegram link for this character
        const { data: existingLink } = await supabase
            .from('telegram_links')
            .select('telegram_username, telegram_first_name')
            .eq('user_id', userId)
            .eq('character_id', characterId)
            .maybeSingle()

        if (existingLink) {
            return {
                success: true,
                isAlreadyLinked: true,
                linkedTelegramUsername: existingLink.telegram_username || existingLink.telegram_first_name || 'Unknown',
            }
        }

        // Generate a unique link code
        const code = `link_${crypto.randomBytes(16).toString('hex')}`
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        // Save the pending link code
        await supabase.from('telegram_link_codes').insert({
            code,
            user_id: userId,
            character_id: characterId,
            character_name: characterName,
            expires_at: expiresAt.toISOString(),
            used: false,
        })

        // Generate the Telegram deep link
        const linkUrl = `https://t.me/${BOT_USERNAME}?start=${code}`

        return { success: true, linkUrl }
    } catch (error) {
        console.error('[Telegram Link] Error generating code:', error)
        return { success: false, error: 'Failed to generate link' }
    }
}

/**
 * Check if a user has linked their Telegram for a specific character
 */
export async function checkTelegramLink(
    userId: string,
    characterId: string
): Promise<{ isLinked: boolean; telegramUsername?: string }> {
    try {
        const supabase = await createAdminClient()
        if (!supabase) return { isLinked: false }

        const { data } = await supabase
            .from('telegram_links')
            .select('telegram_username, telegram_first_name')
            .eq('user_id', userId)
            .eq('character_id', characterId)
            .maybeSingle()

        if (data) {
            return {
                isLinked: true,
                telegramUsername: data.telegram_username || data.telegram_first_name,
            }
        }

        return { isLinked: false }
    } catch (error) {
        console.error('[Telegram Link] Error checking link:', error)
        return { isLinked: false }
    }
}

/**
 * Unlink Telegram from a character
 */
export async function unlinkTelegram(
    userId: string,
    characterId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createAdminClient()
        if (!supabase) {
            return { success: false, error: 'Database connection failed' }
        }

        await supabase
            .from('telegram_links')
            .delete()
            .eq('user_id', userId)
            .eq('character_id', characterId)

        return { success: true }
    } catch (error) {
        console.error('[Telegram Link] Error unlinking:', error)
        return { success: false, error: 'Failed to unlink Telegram' }
    }
}

/**
 * Get all Telegram links for a user
 */
export async function getUserTelegramLinks(userId: string): Promise<{
    links: Array<{
        characterId: string
        telegramUsername: string
        createdAt: string
    }>
}> {
    try {
        const supabase = await createAdminClient()
        if (!supabase) return { links: [] }

        const { data } = await supabase
            .from('telegram_links')
            .select('character_id, telegram_username, telegram_first_name, created_at')
            .eq('user_id', userId)

        const links = (data || []).map((link) => ({
            characterId: link.character_id,
            telegramUsername: link.telegram_username || link.telegram_first_name || 'Unknown',
            createdAt: link.created_at,
        }))

        return { links }
    } catch (error) {
        console.error('[Telegram Link] Error getting links:', error)
        return { links: [] }
    }
}
