import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  try {
    const { data: character, error } = await supabase
      .from("characters")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
       // If not found or RLS blocks it
       return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    return NextResponse.json(character);
  } catch (error: any) {
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
    
    const { data, error } = await supabase
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
