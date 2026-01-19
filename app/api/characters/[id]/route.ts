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

    // Check ownership or admin
    // Note: RLS might handle this automatically, but explicit check is good for 403 vs 404
    const { data: existing, error: fetchError } = await supabase
      .from('characters')
      .select('user_id')
      .eq('id', id)
      .single();

    // If user is owner, they can update.
    // We assume RLS policies are SET UP for update.
    // If not, we might need service role, but usually we prefer user role.

    const { data, error } = await (supabase as any)
      .from("characters")
      .update(json)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
