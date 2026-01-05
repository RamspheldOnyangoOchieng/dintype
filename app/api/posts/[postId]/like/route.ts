import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

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
        // Check if like exists
        const { data: existingLike } = await supabase
            .from("character_post_likes")
            .select("id")
            .eq("post_id", postId)
            .eq("user_id", user.id)
            .single();

        if (existingLike) {
            // Unlike
            await supabase
                .from("character_post_likes")
                .delete()
                .eq("id", existingLike.id);

            // Decrement count
            await supabase.rpc('decrement_likes', { row_id: postId }); // Assuming a function or just manually update if rpc not exists
            // Simpler: Just update post
            const { data: post } = await supabase.from('character_posts').select('likes_count').eq('id', postId).single();
            if (post) {
                await supabase.from('character_posts').update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) }).eq('id', postId);
            }

            return NextResponse.json({ liked: false });
        } else {
            // Like
            await supabase
                .from("character_post_likes")
                .insert({
                    post_id: postId,
                    user_id: user.id
                });

            // Increment count
            const { data: post } = await supabase.from('character_posts').select('likes_count').eq('id', postId).single();
            if (post) {
                await supabase.from('character_posts').update({ likes_count: (post.likes_count || 0) + 1 }).eq('id', postId);
            }

            return NextResponse.json({ liked: true });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
