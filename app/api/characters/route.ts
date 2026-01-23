import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const supabaseAdmin = await createAdminClient();
        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        let isAdmin = false;
        if (user) {
            const { data: adminRecord } = await supabaseAdmin
                .from('admin_users')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();
            isAdmin = !!adminRecord;
        }

        let query;
        if (isAdmin) {
            // Admin sees EVERYTHING
            query = supabaseAdmin.from("characters").select("*");
        } else if (user) {
            // Logged in user sees public ones AND their own
            query = supabaseAdmin
                .from("characters")
                .select("*")
                .or(`is_public.eq.true,user_id.eq.${user.id}`);
        } else {
            // Anonymous users only see public ones
            query = supabaseAdmin.from("characters").select("*").eq("is_public", true);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching characters:", error);
            return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Characters API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
