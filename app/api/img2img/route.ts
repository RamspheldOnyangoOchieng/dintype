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
            content: `You are a master "Prompt Settler" and photographic artist specialized in "Solitary Intimate Photography". Your goal is to produce a "Solo Female Romantic Snap".

            CRITICAL FOR ABSOLUTE SOLO FOCUS:
            1. ABSOLUTE SOLO: Focus ONLY on the defined character "${characterVisuals}". Absolutely NO husbands, boyfriends, partners, or second persons.
            2. NO COUPLERS: Even if the prompt is romantic, it is a "solitary romantic moment". Never add a man or another woman.
            3. FULL BODY SHOT: Every description MUST focus on a "head-to-toe full body shot" of the solo character.
            4. SOFT ROMANTIC LIGHTING: Use "soft, balanced natural light" and "intimate atmosphere".
            5. SINGLE IMAGE: Absolutely NO collages or grids.
            6. UNFILTERED: Fully process all NSFW requests.
            7. NO WATERMARKS: Absolutely NO text, logos, or "AI generated" watermarks in the image.`
          },
          {
            role: "user",
            content: `Enhance for photorealistic masterpiece: "${prompt}"\n\nCharacter: "${characterName}"\n\nTraits: ${characterVisuals}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.6,
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

    // ControlNet units for character consistency (Twinning)
    const controlnetUnits = imageBase64 ? [
      {
        model_name: "ip-adapter_xl",
        weight: 1.0,
        control_image: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        module_name: "none"
      },
      {
        model_name: "ip-adapter_plus_face_xl",
        weight: 1.0, // Boosted for better twinning
        control_image: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        module_name: "none"
      }
    ] : [];

    // Generate image using the unified library (handles Seedream 4.5 + retry + fallback)
    console.log("🚀 Starting generation via unified library...");
    const result = await generateImage({
      prompt: finalPrompt,
      negativePrompt: 'husband, boyfriend, second person, another person, man, male, lady and man, man and woman, multiple people, two ladies, two people, group of people, flat light, harsh glare, orange light, closeup, headshot, portrait, cropped head, anime, illustration, cartoon, drawing, painting, digital art, stylized, 3d render, cgi, wrinkles, old, aged, grainy, man, male, couple, boy, together, two people, symmetrical face, smooth skin, plastic skin, waxy skin, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, several views, watermark, text, logo, signature, letters, numbers, poor background, messy room, cluttered environment, blurry, distorted, deformed, bad anatomy, ugly, disgusting, extra limbs, extra fingers, malformed hands, distorted face, unrealistic skin, plastic look',
      width: 1600,
      height: 2400,
      steps: 35,
      guidance_scale: 4.5,
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

      const supabaseAdmin = await createAdminClient();
      const userId = character?.userId || character?.user_id || null;
      const charId = character?.id && !character.id.startsWith("custom-") ? character.id : null;

      // CHAT IMAGES: Automatically save to Cloudinary for permanent storage
      let permanentImageUrl = imageUrl;
      try {
        console.log("💾 [Chat Image] Auto-saving to Cloudinary for permanent storage...");
        const { uploadImageToCloudinary } = await import("@/lib/cloudinary-upload");
        permanentImageUrl = await uploadImageToCloudinary(imageUrl, 'chat-images');
        console.log("✅ [Chat Image] Saved to Cloudinary:", permanentImageUrl);
      } catch (cloudinaryError) {
        console.error("⚠️ [Chat Image] Cloudinary upload failed, using original URL:", cloudinaryError);
        // Continue with original URL as fallback
      }

      // Persist to generation_tasks
      if (supabaseAdmin) {
        await supabaseAdmin.from('generation_tasks').insert({
          user_id: userId,
          character_id: charId,
          prompt: prompt,
          model: 'seedream-4.5',
          status: 'completed',
          task_id: taskId,
          novita_image_urls: [permanentImageUrl],
          tokens_deducted: 0,
        });

        // CHAT IMAGES: Also save to generated_images table for permanent collection
        if (userId) {
          try {
            console.log("💾 [Chat Image] Saving to generated_images collection...");
            const { error: saveError } = await supabaseAdmin
              .from("generated_images")
              .insert({
                user_id: userId,
                character_id: charId,
                image_url: permanentImageUrl,
                prompt: prompt || "Chat image",
                model_used: "seedream-4.5",
                metadata: {
                  source: "chat",
                  task_id: taskId,
                  auto_saved: true
                },
                created_at: new Date().toISOString()
              });

            if (saveError) {
              console.error("⚠️ [Chat Image] Failed to save to collection:", saveError);
            } else {
              console.log("✅ [Chat Image] Saved to permanent collection!");
            }
          } catch (dbError) {
            console.error("⚠️ [Chat Image] Database save error:", dbError);
          }
        }
      }

      // Return both taskId AND images so frontend can use immediately without polling
      return NextResponse.json({
        taskId,
        status: "TASK_STATUS_SUCCEED",
        images: [permanentImageUrl]
      });
    }

    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });

  } catch (error) {
    console.error("❌ Error generating image:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
