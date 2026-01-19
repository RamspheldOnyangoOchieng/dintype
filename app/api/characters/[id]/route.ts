import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { createAdminClient } = await import("@/lib/supabase-admin");
    const supabaseAdmin = await createAdminClient();

    if (!supabaseAdmin) {
      throw new Error("Server configuration error");
    }

    // Check if user is admin
    let isAdmin = false;
    if (user) {
      const { data: adminRecord } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      isAdmin = !!adminRecord;
    }

    let query = supabaseAdmin.from("characters").select("*").eq("id", id);

    if (!isAdmin) {
      // If not admin, restrict to public or owned
      if (user) {
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
      } else {
        query = query.eq('is_public', true);
      }
    }

    const { data: character, error } = await query.maybeSingle();

    if (error) {
      console.error("Error fetching character:", error);
      return NextResponse.json({ error: "Failed to fetch character" }, { status: 500 });
    }

    if (!character) {
      return NextResponse.json({ error: "Character not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(character);
  } catch (error: any) {
    console.error("Characters GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();

    // Check if user is admin
    const { createAdminClient } = await import("@/lib/supabase-admin");
    const supabaseAdmin = await createAdminClient();

    let isAdmin = false;
    if (supabaseAdmin) {
      const { data: adminRecord } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      isAdmin = !!adminRecord;
    }

    // Use admin client for admins, regular client for normal users
    const client = isAdmin && supabaseAdmin ? supabaseAdmin : supabase;

    const { data, error } = await (client as any)
      .from("characters")
      .update(json)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Update error:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Character not found or you don't have permission to update it" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
