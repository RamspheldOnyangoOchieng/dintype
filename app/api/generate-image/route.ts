// Last updated: 2025-12-14T20:15:00+03:00 - Force deployment refresh
import { type NextRequest, NextResponse } from "next/server"
import { deductTokens, refundTokens, getUserTokenBalance } from "@/lib/token-utils"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"
import { getUnifiedNovitaKey } from "@/lib/unified-api-keys"
import { containsNSFW } from "@/lib/nsfw-filter"
import type { Database } from "@/types/supabase"
import { logApiCost } from "@/lib/budget-monitor"

export const maxDuration = 300;

// Dynamic token costs based on image count
const getTokenCost = (imageCount: number = 1): number => {
  // Ensure imageCount is a valid number
  const count = isNaN(imageCount) ? 1 : Math.max(1, imageCount)

  // Single image generation is free
  if (count === 1) return 0

  // 5 tokens per additional image
  return 5 * count
}

const DEFAULT_NEGATIVE_PROMPT = "man, male, boy, gentleman, husband, boyfriend, couple, together, two people, multiple people, group of people, partner, companion, another person, lady and man, man and woman, second person, closeup, portrait, headshot, cropped head, studio lighting, harsh light, orange light, makeup, airbrushed, corporate portrait, anime, illustration, cartoon, drawing, painting, digital art, stylized, cgi, 3d render, unreal, wrinkles, old, aged, grainy, artifacts, noise, grit, dots, freckles, spots, blotchy skin, rough skin, acne, skin texture artifacts, messy skin, high contrast, over-processed, saturated, deformed, extra fingers, malformed hands, fused fingers, missing fingers, extra limbs, extra bodies, mutilated, gross proportions, bad anatomy, symmetrical face, smooth skin, plastic skin, waxy skin, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, several views, watermark, text, logo, signature, letters, numbers, words, typography, font, sign, tattoo, writing, callout, poor background, messy room, cluttered environment, blurred background, low quality, blurry, distorted, deformed genitalia, malformed pussy, distorted private parts, unrealistic anatomy, missing labia, blurry genitals, bad pussy anatomy, ugly, disgusting, distorted face, uneven eyes, unrealistic skin, plastic look, double limbs, broken legs, floating body parts, lowres, error, cropped, worst quality, normal quality, jpeg artifacts, duplicate, sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust";

/**
 * Get webhook URL for Novita callbacks
 * Automatically detects deployment URL or uses local development URL
 */
function getWebhookUrl(): string {
  const deploymentUrl = process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_APP_URL

  if (deploymentUrl) {
    const baseUrl = deploymentUrl.startsWith('http')
      ? deploymentUrl
      : `https://${deploymentUrl}`
    return `${baseUrl}/api/novita-webhook`
  }

  // Fallback to localhost for development
  return 'http://localhost:3000/api/novita-webhook'
}

export async function POST(req: NextRequest) {
  let userId: string | undefined
  let tokenCost: number | undefined
  let actualImageCount: number
  let actualModel: string
  let isAdmin: boolean = false
  let isPremium: boolean = false
  let lastError: string | null = null

  try {
    const supabase = await createClient();
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid or empty request body" }, { status: 400 });
    }

    const {
      prompt,
      negativePrompt: userNegativePrompt = "",
      size = "512x1024",
      seed = -1,
      guidance_scale = 7.0,
      image_num = 1,
      selectedCount,
      selectedModel,
      characterId,
      character,
      imageBase64,
      autoSave = false,
    } = body;

    // Use frontend parameters if available, otherwise fall back to defaults
    actualImageCount = selectedCount ? parseInt(selectedCount as string) : image_num;
    if (isNaN(actualImageCount)) actualImageCount = 1;

    actualModel = selectedModel || 'seedream-4.5';

    // Calculate dynamic token cost based on image count
    tokenCost = getTokenCost(actualImageCount);
    console.log(`💰 Token cost calculation: ${tokenCost} tokens (images: ${actualImageCount})`);

    // Ensure guidance_scale is a number - Seedream 4.5 performs better with lower CFG (3-5) for realism
    const finalGuidanceScale = typeof guidance_scale === 'number' ? guidance_scale : 3.5;

    // Get API key with fallback (DB → .env)
    const { key: apiKey, source, error: keyError } = await getUnifiedNovitaKey()
    if (!apiKey) {
      console.error("❌ API key error:", keyError)
      return NextResponse.json({
        error: "API key not configured",
        details: keyError || "Please configure NOVITA_API_KEY in .env or Admin Dashboard → API Keys"
      }, { status: 500 });
    }
    console.log(`✅ Using Novita API key from ${source}`)

    // Try multiple authentication methods
    const authHeader = req.headers.get('authorization')
    const userIdHeader = req.headers.get('x-user-id')

    console.log("🔑 Auth headers:", {
      hasAuthHeader: !!authHeader,
      hasUserIdHeader: !!userIdHeader
    })

    // Method 1: Try Authorization header (JWT token)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      console.log("🎫 Token extracted:", token.substring(0, 20) + '...')


      try {
        // Create a new client instance for auth verification
        const authSupabase = await createClient()
        const { data: { user }, error: authError } = await authSupabase.auth.getUser(token)

        if (authError || !user) {
          console.error("❌ Token verification failed:", authError?.message)
        } else {
          userId = user.id
          console.log("✅ Authentication successful via token for user:", userId.substring(0, 8) + '...')
        }
      } catch (error) {
        console.error("❌ Token authentication error:", error)
      }
    }

    // Method 2: Fallback to User ID header (for cases where session token is not available)
    if (!userId && userIdHeader) {
      console.log("🔄 Trying fallback authentication with user ID:", userIdHeader.substring(0, 8) + '...')

      try {
        const { createAdminClient } = await import("@/lib/supabase-admin")
        const adminClient = await createAdminClient()

        if (adminClient) {
          const { data: userData, error: userError } = await adminClient
            .from('profiles')
            .select('id')
            .eq('id', userIdHeader)
            .single()

          if (userError || !userData) {
            console.error("❌ User ID validation failed:", userError?.message)
          } else {
            userId = userIdHeader
            console.log("✅ Authentication successful via user ID for user (verified via admin):", userId.substring(0, 8) + '...')
          }
        }
      } catch (error) {
        console.error("❌ User ID validation error:", error)
      }
    }

    // If neither method worked, return unauthorized
    if (!userId) {
      console.error("❌ All authentication methods failed")
      return NextResponse.json({
        error: "Unauthorized",
        details: "Please ensure you are logged in. Authentication failed."
      }, { status: 401 })
    }

    // Check if user is an admin to bypass token costs (Use Admin Client for reliability)
    try {
      const supabaseAdmin = await createAdminClient()
      if (supabaseAdmin) {
        // Check admin_users table first
        const { data: adminRecord } = await supabaseAdmin
          .from('admin_users')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle()

        if (adminRecord) {
          isAdmin = true
          console.log(`👑 User ${userId.substring(0, 8)} identified as Admin (admin_users table)`)
        } else {
          // Fallback: Check profiles table
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .maybeSingle()

          if (profile?.is_admin) {
            isAdmin = true
            console.log(`👑 User ${userId.substring(0, 8)} identified as Admin (profiles table)`)
          }
        }

        // Check premium status
        const { data: premiumRecord } = await supabaseAdmin
          .from('premium_profiles')
          .select('status')
          .eq('user_id', userId)
          .eq('status', 'active')
          .maybeSingle()

        if (premiumRecord) {
          isPremium = true
          console.log(`💎 User ${userId.substring(0, 8)} identified as Premium`)
        }
      }
    } catch (error) {
      console.error("⚠️ Error checking user status details:", error)
    }

    // --- ENFORCE FREE TIER LIMITS ---
    const planInfo = await (async () => {
      const { getUserPlanInfo } = await import("@/lib/subscription-limits")
      return await getUserPlanInfo(userId as string)
    })()

    isPremium = planInfo.planType === 'premium'

    if (!isAdmin && !isPremium) {
      // 1. Enforce NSFW check in prompt
      if (containsNSFW(prompt)) {
        return NextResponse.json({
          error: "NSFW content detected. Free users can only generate SFW images.",
          upgrade_required: true,
          upgradeUrl: "/premium"
        }, { status: 403 });
      }

      // 2. Enforce 1-image-only limit for free users
      if (actualImageCount > 1) {
        return NextResponse.json({
          error: "Free users can only generate 1 image at a time. Upgrade to Premium for 4, 6, or 8 images.",
          upgrade_required: true,
          upgradeUrl: "/premium"
        }, { status: 403 });
      }

      // 3. Check weekly limit for free users
      const { checkImageGenerationLimit } = await import("@/lib/subscription-limits")
      const imageCheck = await checkImageGenerationLimit(userId as string)

      if (!imageCheck.allowed) {
        return NextResponse.json({
          error: imageCheck.message,
          upgrade_required: true,
          upgradeUrl: "/premium"
        }, { status: 403 });
      }
    }

    // --- STORYLINE RESTRICTION ---
    // If a character has an active storyline, AI generation is blocked until completion
    if (characterId && !isAdmin) {
      try {
        const supabaseAdmin = await createAdminClient()
        if (supabaseAdmin) {
          const { data: storyProgress } = await supabaseAdmin
            .from("user_story_progress")
            .select("*")
            .eq("user_id", userId)
            .eq("character_id", characterId)
            .maybeSingle();

          if (storyProgress && !storyProgress.is_completed) {
            console.log(`🚫 AI Generation blocked: Character ${characterId} has an active storyline for user ${userId}`);
            return NextResponse.json({
              error: "This character is currently in an active storyline. AI generation is locked until you complete her story.",
              isStoryLocked: true
            }, { status: 403 });
          }
        }
      } catch (e) {
        console.error("Error checking storyline restriction:", e);
      }
    }

    // --- ENFORCE MODEL ACCESS RESTRICTIONS (applies to all users based on plan) ---
    const { checkModelAccess, checkNsfwAccess } = await import("@/lib/subscription-limits")

    // Check if user can use the selected model
    const modelAccess = await checkModelAccess(userId as string, actualModel)
    if (!modelAccess.allowed) {
      console.log(`🚫 Model access denied for ${userId.substring(0, 8)}: ${actualModel}`)
      return NextResponse.json({
        error: modelAccess.message,
        upgrade_required: true,
        upgradeUrl: "/premium"
      }, { status: 403 });
    }

    // Check NSFW content restriction based on plan (even for premium users if explicitly disabled)
    if (containsNSFW(prompt)) {
      const nsfwAccess = await checkNsfwAccess(userId as string)
      if (!nsfwAccess.allowed) {
        console.log(`🚫 NSFW access denied for ${userId.substring(0, 8)}`)
        return NextResponse.json({
          error: nsfwAccess.message,
          upgrade_required: true,
          upgradeUrl: "/premium"
        }, { status: 403 });
      }
    }
    // --- RE-FETCH CHARACTER FROM DB FOR TWINNING ---
    let latestCharacter = character;
    if (characterId) {
      try {
        const supabaseAdmin = await createAdminClient();
        if (supabaseAdmin) {
          const { data: dbChar } = await supabaseAdmin
            .from('characters')
            .select('*')
            .eq('id', characterId)
            .maybeSingle();

          if (dbChar) {
            console.log(`🧬 Re-fetched latest traits for character: ${dbChar.name}`);
            // Map snake_case to camelCase for the prompt builder
            latestCharacter = {
              ...dbChar,
              hairColor: dbChar.hair_color || dbChar.hairColor,
              eyeColor: dbChar.eye_color || dbChar.eyeColor,
              skinTone: dbChar.skin_tone || dbChar.skinTone,
              bodyType: dbChar.body_type || dbChar.bodyType || dbChar.body,
              characterStyle: dbChar.character_style || dbChar.characterStyle || dbChar.style,
              faceReferenceUrl: dbChar.metadata?.face_reference_url,
              anatomyReferenceUrl: dbChar.metadata?.anatomy_reference_url,
              preferredPoses: dbChar.metadata?.preferred_poses,
              preferredEnvironments: dbChar.metadata?.preferred_environments,
              preferredMoods: dbChar.metadata?.preferred_moods,
              negativeRestrictions: dbChar.metadata?.negative_prompt_restrictions
            };
          }
        }
      } catch (e) {
        console.warn("⚠️ Failed to re-fetch character, using provided character data", e);
      }
    }
    // --- END RE-FETCH ---

    // --- END MODEL ACCESS RESTRICTIONS ---

    // Check token balance before deduction
    // Only deduct if cost is greater than 0 AND user is not an admin
    if (tokenCost > 0 && !isAdmin) {
      console.log(`💳 Attempting to deduct ${tokenCost} tokens for user ${userId.substring(0, 8)}...`)

      try {
        const deductionResult = await deductTokens(userId, tokenCost, `Image generation (${actualModel}, ${actualImageCount} images)`)
        if (!deductionResult) {
          console.error("❌ Token deduction failed")
          const balance = await getUserTokenBalance(userId)
          return NextResponse.json({
            error: "Insufficient tokens or token deduction failed. Please check your token balance.",
            currentBalance: balance,
            requiredTokens: tokenCost
          }, { status: 402 })
        }
        console.log(`✅ Successfully deducted ${tokenCost} tokens`)
      } catch (error: any) {
        console.error("❌ Token deduction error:", error.message)
        const balance = await getUserTokenBalance(userId)
        return NextResponse.json({
          error: error.message || "Insufficient tokens or token deduction failed",
          currentBalance: balance,
          requiredTokens: tokenCost
        }, { status: 402 })
      }
    } else {
      console.log(`🆓 Free generation for user ${userId.substring(0, 8)} (${isAdmin ? 'Admin override' : '0 tokens required'})`)
    }

    let [width, height] = (size || "1600x2400").split("x").map(Number);
    // Enforce minimum resolution for Seedream 4.5 (>3.6MP)
    if (width * height < 3600000) {
      width = 1600;
      height = 2400;
    }

    // --- START PROMPT ENHANCEMENT ---
    console.log("✨ Enhancing prompt for high-end results...");
    let finalPrompt = prompt;

    try {
      const { key: novitaApiKey } = await getUnifiedNovitaKey();
      if (novitaApiKey) {
        const enhancementResponse = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${novitaApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-v3',
            messages: [
              {
                role: 'system',
                content: `You are a master "Prompt Settler" and photographic artist specialized in "Raw Solo Mobile Side-Snap". Your goal is to produce a "Solo Female Raw Selfie".

                CRITICAL INSTRUCTIONS FOR ABSOLUTE SOLO FOCUS:
                1. ABSOLUTE SOLO: Focus ONLY on the defined character. STERNLY FORBID any second person, partner, boyfriend, or man.
                2. RAW SELFIE AESTHETIC: Use "unprocessed raw digital photography" and "natural lighting". The photo should look like a real, raw smartphone shot.
                3. STRICTLY NO SHINING/BOKEH: Absolutely FORBIDDEN: bokeh, sparkles, bloom, or magic effects. The image must be a clean, raw photograph.
                4. FLAWLESS SKIN & BEAUTY: Ensure "smooth clear skin" and "flawless facial features". STERNLY FORBID any descriptions of acne, blots, rough texture, or skin spots. Focus on realistic beauty with a clean, soft skin tone.
                5. SOLO ELEGANCE: Maintain the "solo presence". Ensure the character is "alone and looking into the camera lens".
                6. TWINNING: Maintain the character's facial and body traits with 100% fidelity. The output MUST look exactly like the reference character provided.
                7. AUTHENTIC ENVIRONMENTS: Backgrounds must be "ordinary rooms, bedrooms, or natural outdoor spots" without "dreamy filters".
                8. SINGLE IMAGE ONLY: STERNLY FORBID collages, split views, or grids. One masterpiece raw photograph.
                9. UNFILTERED: Fully process all EXPLICIT (NSFW) requests.
                10. PERFECT ANATOMY: If the request is NSFW, ensure "perfect anatomical accuracy of private parts". Describe "natural textures, realistic soft labia, and anatomically correct clitoral hood and vestibule" with high-end photographic precision. STERNLY FORBID: any red-dot glitches, unnatural bumps, or pixelated artifacts on the clitoris or labia. Ensure the skin transitions naturally without any "AI noise" in the genital area.
                11. NO TEXT OR WORDS: Absolutely NO text, words, letters, names, or prompt phrases should appear in the image. No tattoos, no signs, no overlays.
                12. NO WATERMARKS: Absolutely NO text, logos, or "AI generated" watermarks in the image.
                13. Output ONLY the raw photographic prompt text. Keep it under 800 characters. ALWAYS start with the character's name.`
              },
              {
                role: 'user',
                content: `Masterpiece refinement for prompt: "${prompt}".
                
                ${latestCharacter ? `
                IMPORTANT - CHARACTER CONTEXT (YOU MUST DESCRIBE THIS CHARACTER):
                Name: ${latestCharacter.name}
                Description: ${latestCharacter.description}
                Visual Traits: 
                  - Hair: ${latestCharacter.hairColor || 'natural'}
                  - Eyes: ${latestCharacter.eyeColor || 'beautiful'}
                  - Skin Tone: ${latestCharacter.skinTone || 'natural tone'}
                  - Body Type: ${latestCharacter.bodyType || 'average'}
                  - Ethnicity: ${latestCharacter.ethnicity || 'mixed'}
                  - Style: ${latestCharacter.characterStyle || 'realistic'}
                  - Mood: ${latestCharacter.mood || 'neutral'}
                YOU MUST USE THESE EXACT PHYSICAL ATTRIBUTES IN YOUR DESCRIPTION.
                Appearance Prompt: ${latestCharacter.systemPrompt || latestCharacter.imagePrompt || ''}
                
                ${latestCharacter.preferredPoses ? `CHARACTER POSES (STRICT): ${latestCharacter.preferredPoses}` : ''}
                ${latestCharacter.preferredEnvironments ? `CHARACTER ENVIRONMENTS: ${latestCharacter.preferredEnvironments}` : ''}
                ${latestCharacter.preferredMoods ? `CHARACTER MOODS: ${latestCharacter.preferredMoods}` : ''}
                ${latestCharacter.negativeRestrictions ? `STRICT RESTRICTIONS (AERIAL/NO-GO): ${latestCharacter.negativeRestrictions}` : ''}
                ` : ''}

                Style: ${actualModel.includes('anime') || actualModel.includes('dreamshaper') ? 'High-end stylized anime/illustration' : 'Breathtaking photorealistic photography'}. ${actualImageCount > 1 ? `Generate a prompt that encourages diverse backgrounds for a batch of ${actualImageCount} images.` : ''}`
              }
            ],
            max_tokens: 400,
            temperature: 0.6,
          }),
        });

        if (enhancementResponse.ok) {
          const enhancementData = await enhancementResponse.json();
          const enhancedText = enhancementData.choices?.[0]?.message?.content;
          if (enhancedText) {
            console.log("✅ Prompt enhanced successfully");
            // Remove thinking process or common AI noise if present
            let cleanedPrompt = enhancedText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            // Ensure character traits are included even in the enhanced prompt - BE VERY AGGRESSIVE WITH TWINNING
            if (latestCharacter) {
              const characterPrefix = `### MASTER TRAITS (MATCH EXACTLY): ${latestCharacter.name}, a woman with ${latestCharacter.hairColor || 'natural'} hair, ${latestCharacter.eyeColor || 'beautiful'} eyes, and ${latestCharacter.skinTone || ''} skin. ### `;
              const characterSuffix = ` (Remember: ${latestCharacter.name} MUST have ${latestCharacter.hairColor || 'natural'} hair and ${latestCharacter.eyeColor || 'beautiful'} eyes).`;

              if (!cleanedPrompt.toLowerCase().includes(latestCharacter.name.toLowerCase())) {
                cleanedPrompt = characterPrefix + cleanedPrompt + characterSuffix;
              } else {
                cleanedPrompt = characterPrefix + cleanedPrompt + characterSuffix;
              }
            }
            // Truncate to 900 characters to leave room for environment additions
            finalPrompt = cleanedPrompt.length > 900 ? cleanedPrompt.substring(0, 900) : cleanedPrompt;
          }
        } else {
          console.warn("⚠️ Prompt enhancement failed (response not ok), using original prompt");
        }
      }
    } catch (e) {
      console.error("❌ Error during prompt enhancement:", e);
      // Fallback to original prompt silently
    }
    // --- END PROMPT ENHANCEMENT ---

    // Get webhook URL for automatic result processing
    const webhookUrl = getWebhookUrl()
    console.log(`📞 Webhook URL: ${webhookUrl}`)

    // Create enhanced request body with webhook support and NSFW bypass
    // For free users generating 1 image, we enforce SFW (NSFW detection enabled)
    // For admins or premium users, or paid generations (>1 image), we allow NSFW (bypass detection)
    const enforceSFW = !isAdmin && !isPremium && tokenCost === 0
    console.log(`🛡️  NSFW Policy: ${enforceSFW ? 'ENFORCE SFW' : 'ALLOW NSFW'} (Cost: ${tokenCost}, Admin: ${isAdmin}, Premium: ${isPremium})`)

    const taskIds: string[] = [];
    const promptsForTasks: string[] = [];

    for (let i = 0; i < actualImageCount; i++) {
      // Standardize all prompts in the batch to be identical
      // This ensures the user gets multiple variations of the EXACT same scenario/character
      // rather than forcing different environments like mountains or beaches.
      promptsForTasks.push(finalPrompt);
    }

    const controlnetUnits = imageBase64 ? [
      {
        model_name: "ip-adapter_xl",
        weight: 1.0,
        control_image: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        module_name: "none"
      },
      {
        model_name: "ip-adapter_plus_face_xl",
        weight: 1.0,
        control_image: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        module_name: "none"
      }
    ] : [];

    // Add character-specific reference photos (Face and Anatomy) if they exist
    if (latestCharacter?.faceReferenceUrl) {
      controlnetUnits.push({
        model_name: "ip-adapter_plus_face_xl",
        weight: 1.0,
        control_image: latestCharacter.faceReferenceUrl,
        module_name: "none"
      });
    }

    if (latestCharacter?.anatomyReferenceUrl) {
      controlnetUnits.push({
        model_name: "ip-adapter_xl",
        weight: 0.8, // Slightly lower weight for anatomy to allow pose flexibility
        control_image: latestCharacter.anatomyReferenceUrl,
        module_name: "none"
      });
    }

    // --- GENERATE IMAGES WITH SEEDREAM 4.5 (PRIMARY) ---
    console.log(`🚀 Generating ${actualImageCount} images with Seedream 4.5 (Masterpiece Engine)...`);

    const { generateImage } = await import("@/lib/novita-api");

    // Process all images in the batch
    const seedreamResults = await Promise.all(
      Array.from({ length: actualImageCount }).map(async (_, idx) => {
        try {
          let taskPromptFinal = promptsForTasks[idx];
          const result = await generateImage({
            prompt: taskPromptFinal,
            negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}${userNegativePrompt ? `, ${userNegativePrompt}` : ""}`,
            width: width,
            height: height,
            steps: 25,
            guidance_scale: finalGuidanceScale,
            style: actualModel.includes('anime') ? 'anime' : 'realistic',
            controlnet_units: controlnetUnits
          });
          return { success: true, image: result.url };
        } catch (e: any) {
          console.warn(`⚠️ Seedream 4.5 image ${idx + 1} failed: ${e.message}`);
          return { success: false, error: e.message };
        }
      })
    );

    const successfulSeedreams = seedreamResults.filter(r => r.success).map(r => r.image);
    const failedIndices = seedreamResults.map((r, i) => r.success ? -1 : i).filter(i => i !== -1);

    if (failedIndices.length > 0) {
      console.log(`⚠️ ${failedIndices.length} Seedream tasks failed after all retries`);
    }

    // Persist Seedream results temporarily to generation_tasks (NOT generated_images)
    const batchId = Math.random().toString(36).substring(2, 15);
    let successfullySavedCount = 0;

    // Prepare normalized URLs for temporary storage
    const normalizedSeedreamUrls = successfulSeedreams.map(base64 => {
      let imageUrl = base64;
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        imageUrl = `data:image/jpeg;base64,${imageUrl}`;
      }
      return imageUrl;
    });

    if (successfulSeedreams.length > 0) {
      const tide = `seedream_${batchId}`;
      taskIds.push(tide);
      successfullySavedCount = successfulSeedreams.length; // Now means "successfully generated and ready"
      console.log(`✅ ${successfullySavedCount} Seedream images ready for batch ${batchId}`);
    }

    if (taskIds.length === 0 || (successfulSeedreams.length > 0 && successfullySavedCount === 0)) {
      // Refund if ALL failed or ALL failed to save
      if (tokenCost > 0 && !isAdmin) {
        await refundTokens(userId, tokenCost, "Refund for failed generation (DB persistence failed)");
      }
      return NextResponse.json({
        error: "Failed to save generated images to database",
        details: lastError || "The generation succeeded but we couldn't save the results. Your tokens have been refunded."
      }, { status: 500 });
    }

    const combinedTaskId = taskIds.join(',');

    // Create database task record for tracking and history
    console.log('💾 Logging generation task to database...')
    const taskRecord = {
      user_id: userId,
      prompt: prompt,
      negative_prompt: userNegativePrompt,
      model: actualModel,
      image_count: actualImageCount,
      width,
      height,
      status: successfullySavedCount > 0 ? 'completed' : 'pending',
      tokens_deducted: isAdmin ? 0 : tokenCost,
      task_id: combinedTaskId,
      character_id: characterId && !characterId.startsWith("custom-") ? characterId : null,
      novita_image_urls: normalizedSeedreamUrls.length > 0 ? normalizedSeedreamUrls : null
    }

    const supabaseAdminForTask = await createAdminClient()
    let createdTask = null

    if (supabaseAdminForTask) {
      const { data, error: taskError } = await supabaseAdminForTask
        .from('generation_tasks')
        .insert(taskRecord)
        .select()
        .single()

      if (taskError) {
        console.error('⚠️  Warning: Failed to create task record:', taskError)
      } else {
        createdTask = data
        console.log('✅ Task record created successfully')
      }
    }

    // Log total API cost for monitoring based on actual successful tasks
    const perImageCost = actualModel === 'flux' ? 0.04 : 0.02
    const totalApiCost = perImageCost * taskIds.length
    await logApiCost(`Image generation (${actualModel} - Batch)`, 0, totalApiCost, userId as string).catch(err =>
      console.error('Failed to log API cost:', err)
    )

    // Increment image usage for free users
    if (!isAdmin && !isPremium) {
      const { incrementImageUsage } = await import("@/lib/subscription-limits")
      await incrementImageUsage(userId as string).catch(err =>
        console.error('Failed to increment image usage:', err)
      )
    }

    // --- PERSISTENT SAVING (Auto-save) ---
    if (autoSave && userId && supabaseAdminForTask && normalizedSeedreamUrls.length > 0) {
      try {
        console.log("💾 [Auto-save] Starting persistent storage process...");
        const { uploadImageToCloudinary } = await import("@/lib/cloudinary-upload");

        // Upload each image to Cloudinary
        const permanentUrls = await Promise.all(
          normalizedSeedreamUrls.map(async (url) => {
            try {
              if (!url) return null;
              // Fix lint by explicitly checking and casting
              const validUrl = String(url);
              return await uploadImageToCloudinary(validUrl, 'generated-images');
            } catch (err) {
              console.error("⚠️ Cloudinary upload failed:", err);
              return url;
            }
          })
        ).then(results => results.filter((url): url is string => url !== null));

        // Update task record with permanent URLs
        if (createdTask) {
          await supabaseAdminForTask
            .from('generation_tasks')
            .update({ novita_image_urls: permanentUrls } as any)
            .eq('id', createdTask.id);
        }

        // Save to generated_images collection
        const imagesToSave = permanentUrls.map(url => ({
          user_id: userId as string,
          character_id: characterId && !characterId.startsWith("custom-") ? characterId : null,
          image_url: url,
          prompt: prompt || "Generated image",
          model_used: actualModel,
          metadata: { source: "web_generate", auto_saved: true },
          created_at: new Date().toISOString()
        }));

        await supabaseAdminForTask.from("generated_images").insert(imagesToSave as any);
        console.log("✅ [Auto-save] Images saved to collection!");

        // Return permanent URLs to frontend
        normalizedSeedreamUrls.splice(0, normalizedSeedreamUrls.length, ...permanentUrls);
      } catch (saveErr) {
        console.error("❌ Auto-save failed in generate-image:", saveErr);
      }
    }

    // Update database task record with the task_id from Novita (primarily for Async tasks)
    if (createdTask && supabaseAdminForTask && !combinedTaskId.includes('seedream_')) {
      const { error: updateError } = await supabaseAdminForTask
        .from('generation_tasks')
        .update({
          task_id: combinedTaskId,
          status: 'processing'
        })
        .eq('id', createdTask.id)

      if (updateError) {
        console.error('⚠️  Warning: Failed to update task with task_id:', updateError)
      }
    }

    // Return the combined task ID to the frontend
    return NextResponse.json({
      task_id: combinedTaskId,
      tokens_used: isAdmin ? 0 : tokenCost,
      webhook_enabled: true,
      message: `${taskIds.length} tasks submitted successfully for diverse environments.`,
    })
  } catch (error) {
    console.error("❌ Error generating image:", error);

    // If we have a userId and tokenCost, attempt to refund tokens
    if (userId && tokenCost && !isAdmin) {
      console.log(`🔄 Unexpected error occurred after deducting ${tokenCost} tokens. Attempting refund...`)

      try {
        const refundResult = await refundTokens(
          userId,
          tokenCost,
          `Refund for failed image generation due to server error`,
          {
            error_message: error instanceof Error ? error.message : String(error),
            refund_reason: "Server error during generation"
          }
        )

        if (refundResult) {
          console.log(`✅ Successfully refunded ${tokenCost} tokens due to server error`)
        }
      } catch (refundError) {
        console.error("❌ Error during emergency token refund:", refundError)
      }
    }

    return NextResponse.json({
      error: "Internal server error",
      details: "An unexpected error occurred. If tokens were deducted, they have been refunded.",
      refunded: !!userId && !!tokenCost
    }, { status: 500 });
  }
}
