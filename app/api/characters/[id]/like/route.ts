import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/lib/supabase-admin";
import crypto from "crypto";

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

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: characterId } = await params;
    const body = await request.json();
    const { initData, source } = body;

    let userId: string | null = null;
    let supabase;

    if (source === 'telegram' && initData) {
        if (!verifyInitData(initData)) {
            return NextResponse.json({ error: "Invalid Telegram data" }, { status: 401 });
        }

        const urlParams = new URLSearchParams(initData);
        const userJSON = urlParams.get('user');
        if (!userJSON) return NextResponse.json({ error: "No user data" }, { status: 400 });

        const telegramUser = JSON.parse(userJSON);
        const telegramId = telegramUser.id.toString();

        supabase = await createAdminClient();
        if (!supabase) return NextResponse.json({ error: "Internal Error" }, { status: 500 });

        // Get linked user_id
        const { data: link } = await supabase
            .from('telegram_links')
            .select('user_id')
            .eq('telegram_id', telegramId)
            .maybeSingle();

        if (link?.user_id) {
            userId = link.user_id;
        } else {
            return NextResponse.json({ error: "Please link your account first" }, { status: 403 });
        }
    } else {
        // Standard Web App Auth
        supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
    }

    if (!userId || !supabase) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = supabase as any;

    try {
        // Check if like exists
        const { data: existingLike } = await client
            .from("character_likes")
            .select("id")
            .eq("character_id", characterId)
            .eq("user_id", userId)
            .maybeSingle();

        if (existingLike) {
            // Unlike
            await client
                .from("character_likes")
                .delete()
                .eq("id", existingLike.id);

            return NextResponse.json({ liked: false });
        } else {
            // Like
            await client
                .from("character_likes")
                .insert({
                    character_id: characterId,
                    user_id: userId
                });

            return NextResponse.json({ liked: true });
        }
    } catch (error: any) {
        console.error("Like API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
