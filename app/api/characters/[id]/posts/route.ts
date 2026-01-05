import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient();
    const { id } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    try {
        const { data: posts, error } = await supabase
            .from("character_posts")
            .select(`
        id,
        content,
        image_url,
        likes_count,
        comments_count,
        created_at,
        character_post_likes ( user_id )
      `)
            .eq("character_id", id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Process posts to add isLiked status
        const processedPosts = posts.map((post: any) => ({
            ...post,
            isLiked: user ? post.character_post_likes.some((like: any) => like.user_id === user.id) : false,
            character_post_likes: undefined // Remove the array
        }));

        return NextResponse.json({ posts: processedPosts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(
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
        const { content, imageUrl } = json;

        const { data, error } = await supabase
            .from("character_posts")
            .insert({
                character_id: id,
                content,
                image_url: imageUrl,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ post: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
