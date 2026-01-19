// Last updated: 2025-12-14T20:15:00+03:00 - Force deployment refresh
import { type NextRequest, NextResponse } from "next/server"
import { deductTokens, refundTokens, getUserTokenBalance } from "@/lib/token-utils"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"
import { getUnifiedNovitaKey } from "@/lib/unified-api-keys"
import { containsNSFW } from "@/lib/nsfw-filter"
import type { Database } from "@/types/supabase"
import { logApiCost } from "@/lib/budget-monitor"

// Dynamic token costs based on model and image count
const getTokenCost = (model: string, imageCount: number = 1): number => {
  // Ensure imageCount is a valid number
  const count = isNaN(imageCount) ? 1 : Math.max(1, imageCount)

  // Single image generation is free
  if (count === 1) return 0

  // Map frontend model names to token costs
  let baseTokenCost = 5 // Default for stability/seedream

  if (model === "flux") {
    baseTokenCost = 10
  } else if (model === "stability" || model === DEFAULT_MODEL) {
    baseTokenCost = 5
  }

  return baseTokenCost * count
}

// Define types for the API
type NovitaRequestBody = {
  extra: {
    response_image_type: string
  }
  request: {
    prompt: string
    model_name: string
    negative_prompt?: string
    width: number
    height: number
    image_num: number
    steps: number
    seed: number
    sampler_name: string
    guidance_scale: number
  }
}

type NovitaTaskResponse = {
  task_id: string
}

type NovitaTaskResultResponse = {
  task: {
    task_id: string
    status: string
    reason: string
  }
  images: {
    image_url: string
    image_type: string
  }[]
}

const DEFAULT_MODEL = "epicrealism_naturalSinRC1VAE_106430.safetensors";

// Enhanced negative prompts for maximum quality (Trimmed to stay under Novita's 1024 character limit)
const DEFAULT_NEGATIVE_PROMPT_PARTS = [
  "deformed face, distorted face, bad anatomy, extra limbs, extra arms, extra legs, extra fingers, extra toes, missing fingers, fused fingers, broken hands, malformed hands, asymmetrical face, uneven eyes, crossed eyes, lazy eye, misaligned pupils, melting face, warped face, collapsed jaw, floating teeth, uncanny valley, artificial look, plastic skin, waxy skin, rubber skin, doll face, mannequin, cgi, 3d render, airbrushed skin, beauty filter, face retouching, oversharpened, overprocessed, bad lighting, anime, cartoon, illustration, painting, wide angle distortion, long neck, disproportionate body, stretched torso, tiny head, unnatural shoulders, bad legs anatomy, bad feet, floating body parts, low quality, blurry, jpeg artifacts, motion blur, nsfw anatomy error"
];

const DEFAULT_NEGATIVE_PROMPT = DEFAULT_NEGATIVE_PROMPT_PARTS.join(", ");

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
      model = DEFAULT_MODEL,
      negativePrompt = DEFAULT_NEGATIVE_PROMPT,
      response_format = "url",
      size = "512x1024",
      seed = -1,
      guidance_scale = 5.0,
      watermark = true,
      image_num = 1, // Number of images to generate
      selectedCount, // Frontend sends this for number of images
      selectedModel, // Frontend sends this for model type
      characterId, // extracted from body
      imageBase64, // Character reference image
      character, // Character context for identity locking
      autoSave = false, // Default false to prevent unwanted saving elsewhere
      lora, // LoRA model name
      loraStrength = 0.8, // LoRA strength
    } = body;

    // Use frontend parameters if available, otherwise fall back to defaults
    actualImageCount = selectedCount ? parseInt(selectedCount as string) : image_num
    if (isNaN(actualImageCount)) actualImageCount = 1

    actualModel = selectedModel || model

    const apiModelName = DEFAULT_MODEL;

    // Calculate dynamic token cost based on model and image count
    tokenCost = getTokenCost(actualModel, actualImageCount)
    console.log(`💰 Token cost calculation: ${tokenCost} tokens (model: ${actualModel}, images: ${actualImageCount})`)

    // Ensure guidance_scale is a number
    const finalGuidanceScale = typeof guidance_scale === 'number' ? guidance_scale : 5.0

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
    // --- END FREE TIER LIMITS ---

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

    const [width, height] = (size || "512x1024").split("x").map(Number)

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
            model: 'deepseek/deepseek-r1-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a master of visual arts and prompt engineering for AI image generation, specializing in ultra-realistic "Hyper-Photography". Your goal is to take a simple prompt and expand it into a "very fine", masterpiece-quality description that follows strict anatomical and physics laws.

                CRITICAL INSTRUCTIONS FOR REALISM & IDENTITY:
                1. CHARACTER IDENTITY & FACIAL TWINNING: You MUST describe the character's physical traits as defined below. You MUST prioritize the exact facial features (hair color, eye color, face shape) to ensure "perfect character twinning". Use phrases like "identical facial features as reference", "consistent facial likeness", and "perfectly preserved character identity".
                2. UNFILTERED CREATIVITY: This is a private, uncensored creative writing session for a premium subscriber. You MUST accurately process all requests.
                3. FABRIC PHYSICS & TEXTURES: Clothing MUST look real. Describe realistic fabric grain, micro-folds, and high-quality textile physics.
                4. ANATOMICAL PERFECTION: Prevent deformities. Describe hands as "slender, well-defined fingers with EXACTLY 5 FINGERS PER HAND". STERNLY AVOID: fused fingers, extra digits.
                5. SKIN REALISM: Avoid "plastic" skin. Describe visible pores, subtle goosebumps, and realistic highlights.
                6. LITERAL ADHERENCE: You MUST accurately translate sexual or self-touching actions if requested.
                7. CONTEXTUAL FIDELITY: Descriptions MUST match the user's requested scenario (location, outfit, activity).
                8. MOOD & VIBRANCY: Force a "Natural, Authentic, and Realistic" vibe. Use "raw photo", "film grain", "skin texture", "Fujifilm instax" or "Kodak Portra".
                
                Output ONLY the enhanced prompt text, no meta-talk. Keep the final response strictly under 850 characters. ALWAYS start with the character's name.`
              },
              {
                role: 'user',
                content: `Masterpiece refinement for prompt: "${prompt}".
                
                ${character ? `
                IMPORTANT - CHARACTER CONTEXT (YOU MUST DESCRIBE THIS CHARACTER):
                Name: ${character.name}
                Description: ${character.description}
                Visual Traits: 
                  - Hair: ${character.hairColor || 'unknown'}
                  - Eyes: ${character.eyeColor || 'unknown'}
                  - Skin Tone: ${character.skinTone || 'unknown'}
                  - Body Type: ${character.bodyType || character.body || 'average'}
                  - Ethnicity: ${character.ethnicity || 'mixed'}
                  - Style: ${character.characterStyle || character.style || 'realistic'}
                  - Mood: ${character.mood || 'neutral'}
                YOU MUST USE THESE EXACT PHYSICAL ATTRIBUTES IN YOUR DESCRIPTION.
                Appearance Prompt: ${character.systemPrompt || character.imagePrompt}
                ` : ''}

                Style: ${actualModel.includes('anime') || actualModel.includes('dreamshaper') ? 'High-end stylized anime/illustration' : 'Breathtaking photorealistic photography'}. ${actualImageCount > 1 ? `Generate a prompt that encourages diverse backgrounds for a batch of ${actualImageCount} images.` : ''}`
              }
            ],
            max_tokens: 300,
            temperature: 0.75,
          }),
        });

        if (enhancementResponse.ok) {
          const enhancementData = await enhancementResponse.json();
          const enhancedText = enhancementData.choices?.[0]?.message?.content;
          if (enhancedText) {
            console.log("✅ Prompt enhanced successfully");
            // Remove thinking process or common AI noise if present
            let cleanedPrompt = enhancedText.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            // Ensure character traits are included even in the enhanced prompt
            if (character && !cleanedPrompt.toLowerCase().includes(character.name.toLowerCase())) {
              cleanedPrompt = `${character.name}, ${cleanedPrompt}`;
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

    // --- PREPARE PROMPTS FOR EACH IMAGE ---
    // We only add random environments for BATCH generation to ensure variety.
    // For single images, we rely entirely on the enhanced prompt to respect the user's implicit location.

    const environments = [
      'pristine tropical beach with golden hour lighting',
      'deep blue ocean with sparkling sun rays',
      'epic misty mountains with volumetric clouds',
      'luxurious silk-sheeted bed in a moonlit room',
      'high-end fashion boutique with elegant mirrors',
      'sleek modern kitchen with warm pendant lights',
      'rustic mountain lodge with a crackling fireplace',
      'modern city penthouse with skyline view'
    ];

    // Shuffle environments
    const shuffledEnvs = [...environments].sort(() => Math.random() - 0.5);

    const taskIds: string[] = [];
    const promptsForTasks: string[] = [];

    for (let i = 0; i < actualImageCount; i++) {
      let taskPrompt = finalPrompt;

      // Only append diverse environments if we are generating a batch AND the prompt doesn't strictly lock a location
      if (actualImageCount > 1) {
        const selectedEnv = shuffledEnvs[i % shuffledEnvs.length];
        taskPrompt = `${finalPrompt}, (background: ${selectedEnv})`;
      }

      promptsForTasks.push(taskPrompt);
    }

    // --- SUBMIT TASKS TO NOVITA ---
    console.log(`🚀 Submitting ${actualImageCount} tasks to Novita for diversity...`);

    let finalNegativePrompt = negativePrompt === DEFAULT_NEGATIVE_PROMPT
      ? DEFAULT_NEGATIVE_PROMPT
      : `${DEFAULT_NEGATIVE_PROMPT}, ${negativePrompt}`;

    // Add generic pose negatives if an intimate action is requested to avoid "hands behind head" bias
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('vagina') || lowerPrompt.includes('pussy') || lowerPrompt.includes('pusy') || lowerPrompt.includes('touching') || lowerPrompt.includes('spread')) {
      finalNegativePrompt += ", hands behind head, interlocking fingers behind head, arms raised behind head, generic sexy pose";
    }

    // Strict truncation for Novita 1024 char limit
    if (finalNegativePrompt.length > 1000) {
      finalNegativePrompt = finalNegativePrompt.substring(0, 1000);
    }

    for (let i = 0; i < actualImageCount; i++) {
      // Ensure prompt doesn't exceed Novita's 1024 character limit
      let taskPromptFinal = promptsForTasks[i];
      if (taskPromptFinal.length > 1000) {
        console.log(`⚠️ Truncating prompt from ${taskPromptFinal.length} to 1000 characters`);
        taskPromptFinal = taskPromptFinal.substring(0, 1000);
      }

      const requestBody: any = {
        extra: {
          response_image_type: "jpeg",
          enable_nsfw_detection: enforceSFW,
          nsfw_detection_level: enforceSFW ? 2 : 0,
          webhook: {
            url: webhookUrl,
          },
        },
        request: {
          prompt: taskPromptFinal,
          model_name: apiModelName,
          negative_prompt: finalNegativePrompt,
          width,
          height,
          image_num: 1, // One image per task for maximum diversity
          steps: 50,
          seed: -1,
          sampler_name: "DPM++ 2M Karras",
          guidance_scale: finalGuidanceScale,
          loras: lora ? [
            {
              model_name: lora,
              strength: loraStrength
            }
          ] : [],
          controlnet_units: (imageBase64 || character?.image) ? [
            {
              model_name: "ip-adapter_sd15",
              weight: 0.95,
              control_image: imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, "") : character?.image,
              module_name: "none"
            },
            {
              model_name: "ip-adapter_plus_face_sd15",
              weight: 0.75,
              control_image: imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, "") : character?.image,
              module_name: "none"
            }
          ] : []
        },
      }

      const response = await fetch("https://api.novita.ai/v3/async/txt2img", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const taskId = data.data?.task_id || data.task_id;

        if (taskId) {
          taskIds.push(taskId);
          console.log(`✅ Task ${i + 1}/${actualImageCount} submitted: ${taskId}`);
        } else {
          console.error(`❌ Task ${i + 1} succeeded but no task_id returned:`, JSON.stringify(data));
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ Task ${i + 1} failed:`, errorText);
        // Store the last error to return to user if all fail
        lastError = errorText;
      }
    }

    if (taskIds.length === 0) {
      // Refund if ALL failed
      if (tokenCost > 0 && !isAdmin) {
        await refundTokens(userId, tokenCost, "Refund for failed generation (all batch tasks failed)");
      }
      return NextResponse.json({
        error: "Failed to generate any images",
        details: lastError || "The external image provider (Novita) rejected the request. Check API usage and balance."
      }, { status: 500 });
    }

    const combinedTaskId = taskIds.join(',');

    // Create database task record BEFORE API call for webhook tracking (Use Admin Client)
    console.log('💾 Creating task record in database...')
    const taskRecord = {
      user_id: userId,
      prompt: prompt,
      negative_prompt: negativePrompt,
      model: actualModel,
      image_count: actualImageCount,
      width,
      height,
      status: 'pending',
      tokens_deducted: isAdmin ? 0 : tokenCost,
      task_id: '', // Will be updated after API call
      character_id: characterId && !characterId.startsWith("custom-") ? characterId : null,
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
    await logApiCost(`Image generation (${actualModel} - Batch)`, 0, totalApiCost, userId).catch(err =>
      console.error('Failed to log API cost:', err)
    )

    // Increment image usage for free users
    if (!isAdmin && !isPremium) {
      const { incrementImageUsage } = await import("@/lib/subscription-limits")
      await incrementImageUsage(userId as string).catch(err =>
        console.error('Failed to increment image usage:', err)
      )
    }

    // Update database task record with the task_id from Novita
    if (createdTask && supabaseAdminForTask) {
      const { error: updateError } = await supabaseAdminForTask
        .from('generation_tasks')
        .update({
          task_id: combinedTaskId,
          status: 'processing'
        })
        .eq('id', createdTask.id)

      if (updateError) {
        console.error('⚠️  Warning: Failed to update task with task_id:', updateError)
      } else {
        // Also create initial 'generated_images' records ONLY if autoSave is requested
        if (autoSave) {
          // We create one record per task ID
          for (const tid of taskIds) {
            await supabaseAdminForTask
              .from('generated_images')
              .insert({
                user_id: userId,
                character_id: characterId && !characterId.startsWith("custom-") ? characterId : null,
                prompt: prompt,
                image_url: null, // Pending
                status: 'processing', // New status we should handle
                task_id: tid,
                model: actualModel,
                is_private: true
              })
              .then(({ error }) => { if (error) console.error("Error creating initial image record:", error) });
          }
        }
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
