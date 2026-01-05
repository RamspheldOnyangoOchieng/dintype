import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    try {
        const { characterId, characterName } = await request.json();

        if (!session) {
            // Guest User: Return simple character deep link
            // Using just the ID, or maybe a specially signed guest token if we wanted to be fancy, 
            // but 'char_ID' is sufficient for guests.
            return NextResponse.json({
                url: `https://t.me/pocketloveaibot?start=char_${characterId}`
            });
        }

        // Authenticated User: Generate a secure one-time link code
        // Short code for easier URL handling, but UUID is safer. 
        // Let's use a random 8-char string for brevity similar to referral codes or just a UUID part.
        // Actually, UUID is fine for safety.
        const code = `link_${uuidv4().replace(/-/g, '')}`;

        const { error } = await supabase
            .from("telegram_link_codes")
            .insert({
                code: code,
                user_id: session.user.id,
                character_id: characterId,
                character_name: characterName,
                expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins expiry
            });

        if (error) throw error;

        return NextResponse.json({
            url: `https://t.me/pocketloveaibot?start=${code}`
        });

    } catch (error: any) {
        console.error("Link generation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
