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

            // Fetch gallery for Multi-Referencing consistency
            const { data: galleryImages } = await supabaseAdmin
              .from('character_gallery')
              .select('image_url')
              .eq('character_id', character.id)
              .order('created_at', { ascending: false })
              .limit(10);

            latestCharacter = {
              ...dbChar,
              character_gallery: galleryImages || [],
              hairColor: dbChar.hair_color || dbChar.hairColor,
              eyeColor: dbChar.eye_color || dbChar.eyeColor,
              skinTone: dbChar.skin_tone || dbChar.skinTone,
              bodyType: dbChar.body_type || dbChar.bodyType || dbChar.body,
              characterStyle: dbChar.character_style || dbChar.characterStyle || dbChar.style,
              face_reference_url: dbChar.metadata?.face_reference_url,
              anatomy_reference_url: dbChar.metadata?.anatomy_reference_url,
              preferredPoses: dbChar.metadata?.preferred_poses || dbChar.metadata?.preferredPoses,
              preferredEnvironments: dbChar.metadata?.preferred_environments || dbChar.metadata?.preferredEnvironments,
              preferredMoods: dbChar.metadata?.preferred_moods || dbChar.metadata?.preferredMoods,
              negativeRestrictions: dbChar.metadata?.negative_prompt_restrictions || dbChar.metadata?.negativeRestrictions,
              prompt_hook: dbChar.metadata?.prompt_hook || dbChar.metadata?.promptHook
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
      latestCharacter?.preferredPoses ? `(STRICT POSE: ${latestCharacter.preferredPoses}:1.8)` : null,
      latestCharacter?.preferredEnvironments ? `(SETTING: ${latestCharacter.preferredEnvironments}:1.8)` : null,
      latestCharacter?.preferredMoods ? `(EXPRESSION: ${latestCharacter.preferredMoods}:1.4)` : null,
      latestCharacter?.negativeRestrictions ? `(RESTRICT: ${latestCharacter.negativeRestrictions}:1.6)` : null,
    ].filter(Boolean).join(", ");

    // --- MASTERPIECE PROMPT ENHANCEMENT (DeepSeek-V3.1) ---
    console.log("✨ Enhancing chat image prompt for masterpiece quality...");
    const enhancedPromptResponse = await fetch("https://api.novita.ai/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v3.1",
        messages: [
          {
            role: "system",
            content: `You are a master "Prompt Settler" and photographic artist specialized in "Solitary Intimate Photography". Your goal is to produce a "Solo Female Romantic Snap".

            CORE DIRECTIVES:
            1. IDENTITY DNA LOCK: Maintain 100% trait consistency. Study all provided references to match her established look EXACTLY. Focus on vibrant healthy complexion and matching their facial structure perfectly. 100% Likeness is MANDATORY.
            2. FEMININE AESTHETIC: Prioritize the character's defined body type. Describe a relaxed graceful posture, avoid stiff or shrugged shoulders.
            3. MANDATORY THIRD-PERSON VIEW: ABSOLUTELY FORBID any "selfie" or "camera-holding" posture.
            4. HAND PLACEMENT: Hands must be naturally touching her body or environment. NO extended arms.
            5. ADMIN PREFERENCES (MAX PRIORITY): Strictly follow the character's "Preferred Poses", "Preferred Environments", and "Preferred Moods" as defined in the Admin profile. These are MANDATORY and take precedence over default styles.
            6. REFERENCE ADHERENCE: Aggressively match the character's established visual history and settings.
            7. PHOTOGRAPHIC REALISM: Use "unprocessed digital look", "natural lighting", and "8k UHD".
            8. BIO-REALISTIC ANATOMY: Absolute mandate for "biological precision". If the user asks for nudes or specific parts, describe them with literal realistic detail (e.g., "detailed realistic labia", "natural pussy texture", "exposed wet vulva"). STERNLY FORBID "plastic", "blurred", or "censored" anatomy.
            9. ANATOMY GUARDRAIL: STERNLY FORBID extra limbs or elongated arms.
            10. NO CLOTHES LOCK: If the request involves nudity, ensure NO clothing, underwear, or fabric is described in the result.
            11. DYNAMIC VARIETY: Always vary the pose (standing, kneeling, arched back), camera angle (low angle, side view, high angle), and facial expression (moaning, biting lip, seductive gaze) to ensure each shot is unique.
            12. NO COLLAGE: One single frame only.`
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

    // Identity and strict adherence handled by novita-api for consistency
    if (latestCharacter?.metadata?.default_prompt) {
      finalPrompt += `, ${latestCharacter.metadata.default_prompt}`;
    }

    // Inject prompt hook if exists
    if (latestCharacter?.metadata?.prompt_hook) {
      finalPrompt += `, ${latestCharacter.metadata.prompt_hook}`;
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
