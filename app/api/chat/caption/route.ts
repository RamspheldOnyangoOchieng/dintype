import { NextRequest, NextResponse } from "next/server";
import { generatePhotoCaption } from "@/lib/ai-greetings";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { characterName, systemPrompt, photoContext, isPremium, storyContext, imageUrl, relationship } = body;

        if (!characterName) {
            return NextResponse.json({ error: "characterName is required" }, { status: 400 });
        }

        const caption = await generatePhotoCaption(
            characterName,
            systemPrompt,
            photoContext,
            isPremium,
            storyContext,
            imageUrl,
            relationship || "romantic partner"
        );

        return NextResponse.json({ caption });
    } catch (error: any) {
        console.error("Caption API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
