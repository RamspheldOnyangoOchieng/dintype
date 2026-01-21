import { type NextRequest, NextResponse } from "next/server"
import { logApiCost } from "@/lib/budget-monitor"
import { createAdminClient } from "@/lib/supabase-admin"
import { generateImage } from "@/lib/novita-api"
import { getUnifiedNovitaKey } from "@/lib/unified-api-keys"

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { prompt, negativePrompt, character, imageBase64 } = await req.json()
    const { key: apiKey } = await getUnifiedNovitaKey()

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const characterName = character?.name || "the character";
    const characterContext = character?.about_me || character?.description || character?.personality || "";
    const characterVisuals = [
      character?.name,
      character?.hairColor ? `${character.hairColor} hair` : null,
      character?.eyeColor ? `${character.eyeColor} eyes` : null,
      character?.skinTone ? `${character.skinTone} skin tone` : null,
      character?.bodyType || character?.body,
      character?.characterStyle ? `${character.characterStyle} style` : null,
      character?.ethnicity,
      character?.age ? `${character.age} years old` : null,
      character?.mood ? `${character.mood} expression` : null,
      character?.personality,
      character?.description
    ].filter(Boolean).join(", ");

    // Enhance prompt
    const enhancedPromptResponse = await fetch("https://api.novita.ai/v3/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v3",
        messages: [
          {
            role: "system",
            content: `You are a master of visual arts and prompt engineering for AI image generation, specializing in ultra-realistic "Hyper-Photography". Your goal is to take the user's input and the character's info to create a masterpiece-quality description. Focus on character identity, facial consistency, skin realism, and photographic style. Output ONLY the enhanced prompt text.`
          },
          {
            role: "user",
            content: `Enhance for photorealistic masterpiece: "${prompt}"\n\nCharacter: "${characterName}"\n\nTraits: ${characterVisuals}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    let finalPrompt = prompt
    if (enhancedPromptResponse.ok) {
      const data = await enhancedPromptResponse.json();
      if (data.choices?.[0]?.message?.content) {
        finalPrompt = data.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      }
    }

    if (!finalPrompt.toLowerCase().includes(characterName.toLowerCase())) {
      finalPrompt = `${characterName}, ${finalPrompt}`;
    }

    // ControlNet units for character consistency (used in fallback)
    const controlnetUnits = imageBase64 ? [
      {
        model_name: "ip-adapter_xl",
        weight: 1.0,
        control_image: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        module_name: "none"
      },
      {
        model_name: "ip-adapter_plus_face_xl",
        weight: 0.8,
        control_image: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        module_name: "none"
      }
    ] : [];

    // Generate image using the unified library (handles Seedream 4.5 + retry + fallback)
    console.log("🚀 Starting generation via unified library...");
    const result = await generateImage({
      prompt: finalPrompt,
      negativePrompt: negativePrompt,
      width: 1024,
      height: 1536,
      steps: 30,
      guidance_scale: 7.0,
      controlnet_units: controlnetUnits
    });

    if (result.url) {
      await logApiCost("Image generation (img2img/unified)", 0, 0.05, "").catch(() => { });
      const batchId = Math.random().toString(36).substring(2, 15);
      const taskId = `seedream_${batchId}`;

      // Normalize the image URL
      let imageUrl = result.url;
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        imageUrl = `data:image/jpeg;base64,${imageUrl}`;
      }

      // Persist to DB immediately so polling can find it
      const supabaseAdmin = await createAdminClient();
      if (supabaseAdmin) {
        await supabaseAdmin.from('generated_images').insert({
          user_id: character?.userId || character?.user_id || null,
          character_id: character?.id && !character.id.startsWith("custom-") ? character.id : null,
          prompt: prompt,
          image_url: imageUrl,
          status: 'completed',
          task_id: taskId,
          model: 'seedream-4.5',
          is_private: true
        });
      }

      // Return both taskId AND images so frontend can use immediately without polling
      return NextResponse.json({
        taskId,
        status: "TASK_STATUS_SUCCEED",
        images: [imageUrl]
      });
    }

    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });

  } catch (error) {
    console.error("❌ Error generating image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
