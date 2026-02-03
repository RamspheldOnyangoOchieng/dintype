import { type NextRequest, NextResponse } from "next/server"
import { logApiCost } from "@/lib/budget-monitor"
import { createAdminClient } from "@/lib/supabase-admin"
import { generateImage } from "@/lib/novita-api"
import { getUnifiedNovitaKey } from "@/lib/unified-api-keys"
import { createClient } from "@/lib/supabase-server"
import { checkModelAccess, checkNsfwAccess } from "@/lib/subscription-limits"
import { containsNSFW } from "@/lib/nsfw-filter"

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { prompt, negativePrompt, character, imageBase64 } = await req.json()
    const { key: apiKey } = await getUnifiedNovitaKey()

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Get authenticated user
    let userId: string | undefined
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userIdHeader = req.headers.get('x-user-id')

    if (user) {
      userId = user.id
    } else if (userIdHeader) {
      userId = userIdHeader
    }

    if (userId) {

      // Check model access (Seedream is default for img2img)
      const modelAccess = await checkModelAccess(userId, 'seedream-4.5')
      if (!modelAccess.allowed) {
        return NextResponse.json({
          error: modelAccess.message,
          upgrade_required: true,
          upgradeUrl: "/premium"
        }, { status: 403 })
      }

      // Check NSFW access if prompt contains NSFW content
      if (containsNSFW(prompt)) {
        const nsfwAccess = await checkNsfwAccess(userId)
        if (!nsfwAccess.allowed) {
          return NextResponse.json({
            error: nsfwAccess.message,
            upgrade_required: true,
            upgradeUrl: "/premium"
          }, { status: 403 })
        }
      }
    }

    const characterName = character?.name || "the character";

    // --- RE-FETCH CHARACTER FROM DB FOR TWINNING ---
    let latestCharacter = character;
    if (character?.id) {
      try {
        const supabaseAdmin = await createAdminClient();
        if (supabaseAdmin) {
          const { data: dbChar } = await supabaseAdmin
            .from('characters')
            .select('*')
            .eq('id', character.id)
            .maybeSingle();

          if (dbChar) {
            console.log(`🧬 [img2img] Re-fetched latest traits for character: ${dbChar.name}`);
            latestCharacter = {
              ...dbChar,
              hairColor: dbChar.hair_color || dbChar.hairColor,
              eyeColor: dbChar.eye_color || dbChar.eyeColor,
              skinTone: dbChar.skin_tone || dbChar.skinTone,
              bodyType: dbChar.body_type || dbChar.bodyType || dbChar.body,
              characterStyle: dbChar.character_style || dbChar.characterStyle || dbChar.style
            };
          }
        }
      } catch (e) {
        console.warn("⚠️ [img2img] Failed to re-fetch character, using provided character data");
      }
    }

    const characterVisuals = [
      latestCharacter?.name,
      latestCharacter?.hairColor ? `${latestCharacter.hairColor} hair` : null,
      latestCharacter?.eyeColor ? `${latestCharacter.eyeColor} eyes` : null,
      latestCharacter?.skinTone ? `${latestCharacter.skinTone} skin tone` : null,
      latestCharacter?.bodyType || latestCharacter?.body,
      latestCharacter?.characterStyle ? `${latestCharacter.characterStyle} style` : null,
      latestCharacter?.ethnicity,
      latestCharacter?.age ? `${latestCharacter.age} years old` : null,
      latestCharacter?.mood ? `${latestCharacter.mood} expression` : null,
      latestCharacter?.personality,
      latestCharacter?.description,
      // NEW METADATA PREFERENCES
      latestCharacter?.metadata?.preferred_poses ? `preferred poses: ${latestCharacter.metadata.preferred_poses}` : null,
      latestCharacter?.metadata?.preferred_environments ? `preferred environments: ${latestCharacter.metadata.preferred_environments}` : null,
      latestCharacter?.metadata?.preferred_moods ? `preferred moods: ${latestCharacter.metadata.preferred_moods}` : null,
      latestCharacter?.metadata?.negative_prompt_restrictions ? `strict restrictions: ${latestCharacter.metadata.negative_prompt_restrictions}` : null,
    ].filter(Boolean).join(", ");

    // Enhance prompt
    const enhancedPromptResponse = await fetch("https://api.novita.ai/v3/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1",
        messages: [
          {
            role: "system",
            content: `You are a master "Prompt Settler" and photographic artist specialized in "Solitary Intimate Photography". Your goal is to produce a "Solo Female Romantic Snap".

            CRITICAL IDENTITY DNA LOCK (ABSOLUTE PRIORITY):
            1. MATHEMATICAL FIDELITY: You MUST maintain 100% facial structure consistency with the character.
            2. TRAIT PRIORITY: STERNLY prioritize the character's text traits (hair color, eye color, skin tone, ethnicity) over any reference image colors. If a reference suggests blonde but text says "dark hair", YOU MUST generate DARK HAIR.
            3. RAW SELFIE AESTHETIC: Focus on "raw mobile phone photography". Use "unprocessed digital look" and "natural indoor/outdoor lighting".
            4. FLAWLESS SKIN & BEAUTY: Ensure "smooth clear skin" and "flawless facial features". STERNLY FORBID acne, noise, or rough textures.
            5. SOLO MASTERPIECE: Focus ONLY on the solo character. No second persons.
            6. PERFECT ANATOMY: If NSFW, describe "natural textures, realistic labia, and anatomically correct proportions" with high-end photographic precision.
            8. FEATURE SHARPENING: If an image is provided, STERNLY study every detail (posture, curves, gaze, and limbs) and sharpen them for the final render. Maintain a "High-Fidelity Transfer" from the source to the character's DNA.
            9. NO PLACEHOLDERS: Describe the features with literal, material descriptions (e.g., "dewy skin", "strained muscle", "wet hair") to ensure the AI "sees" the features clearly.`
          },
          {
            role: "user",
            content: `Enhance for photorealistic masterpiece: "${prompt}"\n\nCharacter: "${latestCharacter?.name || characterName}"\n\nTraits: ${characterVisuals}`,
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

    // Aggressive Twinning: Prepend core visual traits to ensure facial similarity
    if (latestCharacter) {
      const characterPrefix = `### IDENTITY DNA LOCK ENABLED: ${latestCharacter.name}, ${latestCharacter.hairColor || 'natural'} hair, ${latestCharacter.eyeColor || 'beautiful'} eyes, ${latestCharacter.skinTone || ''} skin, ${latestCharacter.ethnicity || ''} ethnicity. FACE ID: MATCH REFERENCE EXACTLY. ### `;
      const characterSuffix = ` (Visual Identity DNA Lock: ${latestCharacter.name}, ${latestCharacter.hairColor || 'natural'} hair, ${latestCharacter.eyeColor || 'beautiful'} eyes, MANDATORY TRAIT ENFORCEMENT).`;

      finalPrompt = characterPrefix + finalPrompt + characterSuffix;

      // Apply Default Prompt Hook
      if (latestCharacter.metadata?.default_prompt) {
        finalPrompt += `, ${latestCharacter.metadata.default_prompt}`;
      }
    }

    const negativePromptBase = `husband, boyfriend, second person, another person, man, male, lady and man, man and woman, multiple people, two ladies, two people, group of people, flat light, harsh glare, orange light, closeup, headshot, portrait, cropped head, anime, illustration, cartoon, drawing, painting, digital art, stylized, 3d render, cgi, wrinkles, old, aged, grainy, man, male, couple, boy, together, two people, symmetrical face, smooth skin, plastic skin, waxy skin, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, several views, watermark, text, logo, signature, letters, numbers, words, typography, font, sign, tattoo, writing, callout, poor background, messy room, cluttered environment, blurry, distorted, deformed genitalia, malformed pussy, distorted private parts, unrealistic anatomy, missing labia, blurry genitals, bad pussy anatomy, deformed, bad anatomy, ugly, disgusting, extra limbs, extra fingers, malformed hands, distorted face, unrealistic skin, plastic look, sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust`;

    let finalNegativePrompt = negativePromptBase;
    if (latestCharacter?.metadata?.negative_prompt) {
      finalNegativePrompt = `${latestCharacter.metadata.negative_prompt}, ${finalNegativePrompt}`;
    }
    if (negativePrompt) {
      finalNegativePrompt = `${negativePrompt}, ${finalNegativePrompt}`;
    }

    // Generate image using the unified library (handles Seedream 4.5 + Multi-Referencing Engine)
    console.log("🚀 Starting generation via unified library [Multi-Engine]...");
    const result = await generateImage({
      prompt: finalPrompt,
      negativePrompt: finalNegativePrompt,
      width: 1600,
      height: 2400,
      steps: 25,
      guidance_scale: 3.5, // Seedream 4.5 sweet spot
      character: latestCharacter,
      imageBase64: imageBase64
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
      const actualUserId = userId || character?.userId || character?.user_id || null;
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
          user_id: actualUserId,
          character_id: charId,
          prompt: prompt,
          model: 'seedream-4.5',
          status: 'completed',
          task_id: taskId,
          novita_image_urls: [permanentImageUrl],
          tokens_deducted: 0,
        });

        // CHAT IMAGES: Also save to generated_images table for permanent collection
        if (actualUserId) {
          try {
            console.log("💾 [Chat Image] Saving to generated_images collection...");
            const { error: saveError } = await supabaseAdmin
              .from("generated_images")
              .insert({
                user_id: actualUserId,
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
