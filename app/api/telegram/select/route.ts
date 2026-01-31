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

        const [charRes, linkRes] = await Promise.all([
            supabase.from('characters').select('id, name, image_url, description, system_prompt').eq('id', characterId).single(),
            supabase.from('telegram_links').select('user_id').eq('telegram_id', telegramId).maybeSingle()
        ]);

        const character = charRes.data;
        const linkedAccount = linkRes.data;

        if (!character) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

        // 2. Deliver Greeting (Await it to ensure it finishes before Mini App closes)
        const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

        try {
            // Signal "typing" immediately (don't await this one)
            fetch(`${TELEGRAM_API_URL}/sendChatAction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: telegramId, action: 'typing' }),
            }).catch(() => { });

            // Update DB and get plan info in parallel
            const [updateRes, planRes] = await Promise.all([
                supabase.from('telegram_links').update({ character_id: characterId }).eq('telegram_id', telegramId),
                linkedAccount?.user_id ? (async () => {
                    const { getUserPlanInfo } = await import('@/lib/subscription-limits');
                    return await getUserPlanInfo(linkedAccount.user_id);
                })() : Promise.resolve(null)
            ]);

            const isPremium = planRes?.planType === 'premium';

            // Generate the greeting
            const { generateAIGreeting } = await import('@/lib/telegram-ai');
            const charGreeting = await generateAIGreeting(
                character.name,
                character.system_prompt || character.description || "",
                telegramUser.first_name || "sweetheart",
                isPremium,
                'selected'
            );

            // Send the message
            await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: telegramId,
                    text: `💕 <b>${character.name}</b>\n\n${charGreeting}`,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '🔄 Switch Character', web_app: { url: `${request.nextUrl.origin}/telegram` } }
                        ]]
                    }
                }),
            });
        } catch (e) {
            console.error("Selection delivery error:", e);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Selection API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
