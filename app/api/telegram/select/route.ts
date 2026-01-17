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
        const { characterId, initData } = await request.json();

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

        // Get character info
        const { data: character } = await supabase
            .from('characters')
            .select('name, image_url, description')
            .eq('id', characterId)
            .single();

        if (!character) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

        // Update selection in DB
        await supabase
            .from('telegram_links')
            .update({ character_id: characterId })
            .eq('telegram_id', telegramId);

        // Send a message to the user via Bot API to confirm
        const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
        await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: telegramId,
                text: `💕 You've selected <b>${character.name}</b>!\n\n${character.description || ''}\n\n<i>You can now continue chatting here...</i>`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '🔄 Change Character', web_app: { url: `${request.nextUrl.origin}/telegram/characters` } }
                    ]]
                }
            }),
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Selection API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
