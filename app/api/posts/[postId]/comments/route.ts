import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
) {
    const supabase = await createClient();
    const { postId } = await params;

    try {
        const { data: comments, error } = await supabase
            .from("character_post_comments")
            .select(`
        id,
        content,
        created_at,
        user_id // In real app, fetch profile name/avatar
      `)
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        // In a real app we'd join with profiles to get user names
        // For now, we'll just return the comments

        return NextResponse.json({ comments });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ postId: string }> }
) {
    const supabase = await createClient();
    const { postId } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const json = await request.json();
        const { content } = json;

        const { data, error } = await supabase
            .from("character_post_comments")
            .insert({
                post_id: postId,
                user_id: user.id,
                content
            })
            .select()
            .single();

        if (error) throw error;

        // Increment comment count on post
        const { data: post } = await supabase.from('character_posts').select('comments_count').eq('id', postId).single();
        if (post) {
            await supabase.from('character_posts').update({ comments_count: (post.comments_count || 0) + 1 }).eq('id', postId);
        }

        return NextResponse.json({ comment: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
