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
            .select('name, image_url, description, system_prompt')
            .eq('id', characterId)
            .single();

        if (!character) return NextResponse.json({ error: 'Character not found' }, { status: 404 });

        // 1. Get user link info to check premium status
        const { data: linkedAccount } = await supabase
            .from('telegram_links')
            .select('user_id')
            .eq('telegram_id', telegramId)
            .maybeSingle();

        let isPremium = false;
        if (linkedAccount?.user_id) {
            const { getUserPlanInfo } = await import('@/lib/subscription-limits');
            const planInfo = await getUserPlanInfo(linkedAccount.user_id);
            isPremium = planInfo.planType === 'premium';
        }

        // 2. Update selection in DB
        await supabase
            .from('telegram_links')
            .update({ character_id: characterId })
            .eq('telegram_id', telegramId);

        // 3. Send confirming message as the character
        const { generateAIGreeting } = await import('@/lib/telegram-ai');
        const charGreeting = await generateAIGreeting(
            character.name,
            character.system_prompt || character.description || "",
            telegramUser.first_name || "sweetheart",
            isPremium,
            'selected'
        );

        const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

        // Show typing indicator for a more "alive" feel
        await fetch(`${TELEGRAM_API_URL}/sendChatAction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: telegramId, action: 'typing' }),
        });

        // Delay slightly for effect
        await new Promise(r => setTimeout(r, 800));

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

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Selection API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
