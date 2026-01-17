import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import crypto from 'crypto';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Verify Telegram Web App initData
function verifyInitData(initData: string): boolean {
    if (!TELEGRAM_BOT_TOKEN) return false;

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData')
        .update(TELEGRAM_BOT_TOKEN)
        .digest();

    const calculatedHash = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    return calculatedHash === hash;
}

export async function POST(request: NextRequest) {
    try {
        const { initData } = await request.json();

        if (!verifyInitData(initData)) {
            return NextResponse.json({ error: 'Invalid initData' }, { status: 401 });
        }

        const urlParams = new URLSearchParams(initData);
        const userJSON = urlParams.get('user');
        if (!userJSON) return NextResponse.json({ error: 'No user data' }, { status: 400 });

        const telegramUser = JSON.parse(userJSON);
        const telegramId = telegramUser.id.toString();

        const supabase = await createAdminClient();
        if (!supabase) return NextResponse.json({ error: 'Internal Error' }, { status: 500 });

        // Get linked account
        const { data: link } = await supabase
            .from('telegram_links')
            .select('user_id, character_id')
            .eq('telegram_id', telegramId)
            .maybeSingle();

        let tokens = 12; // Default for guests
        let diamonds = 0;
        let activeCharacterId = null;

        if (link) {
            activeCharacterId = link.character_id;

            if (link.user_id) {
                // Get real tokens
                const { data: tokenData } = await supabase
                    .from('user_tokens')
                    .select('balance')
                    .eq('user_id', link.user_id)
                    .maybeSingle();

                if (tokenData) tokens = tokenData.balance;

                // Also check for diamonds if you have a diamonds table, 
                // for now we'll mock it if not found
            }
        }

        return NextResponse.json({
            success: true,
            user: {
                tokens,
                diamonds,
                activeCharacterId
            }
        });

    } catch (error) {
        console.error('Telegram user-data error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
