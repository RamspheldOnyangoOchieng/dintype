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

// Enhanced negative prompts for maximum NSFW undetectability and quality
// These prompts help bypass content filters while maintaining high image quality
const DEFAULT_NEGATIVE_PROMPT_PARTS = [
  // Quality-related (keeps filters from flagging low-quality generation)
  "ugly", "deformed", "bad anatomy", "disfigured", "mutated", "extra limbs",
  "missing limbs", "fused fingers", "extra fingers", "bad hands", "malformed hands",
  "poorly drawn hands", "poorly drawn face", "blurry", "jpeg artifacts",
  "worst quality", "low quality", "lowres", "pixelated", "out of frame",
  "tiling", "watermarks", "signature", "censored", "distortion", "grain",
  "long neck", "unnatural pose", "asymmetrical face", "cross-eyed", "lazy eye",
  "bad feet", "extra arms", "extra legs", "disjointed limbs",
  "incorrect limb proportions", "unrealistic body", "unrealistic face",
  "unnatural skin", "disconnected limbs", "lopsided", "cloned face", "glitch",
  "double torso", "bad posture", "wrong perspective", "overexposed",
  "underexposed", "low detail", "plastic skin", "unnatural skin texture",
  "plastic clothing", "fused clothing", "unreal fabric", "badly fitted bikini",
  "fused body and clothes", "floating clothes", "distorted bikini", "missing nipples",
  "extra nipples", "fused nipples", "bad anatomy genitals",

  // Enhanced undetectability markers
  "unrealistic proportions", "cartoon", "anime style", "3d render",
  "illustration", "painting", "sketch", "drawing", "digital art",
  "compressed", "noisy", "artifacts", "chromatic aberration",
  "duplicate", "morbid", "mutilated", "poorly drawn", "cloned",
  "gross proportions", "malformed", "missing", "error", "cropped",
  "lowres quality", "normal quality", "username", "text", "logo",
  "low quality clothing", "cartoonish clothes", "3d clothes",

  // Aesthetic-related (prevents gloomy/dull outputs)
  "gloomy", "gray", "depressing", "monochrome", "dull colors", "low contrast",
  "bad lighting", "backlit", "dimly lit",

  // Expression-related (prevents distorted/surprised/sad looks)
  "surprised", "shocked", "scared", "mouth agape", "open mouth", "wide eyes", "staring", "blank stare",
  "needy", "frustrated", "sad", "worried", "unhappy", "angry", "distressed", "tearful", "pouty"
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
      guidance_scale = 7.5,
      watermark = true,
      image_num = 1, // Number of images to generate
      selectedCount, // Frontend sends this for number of images
      selectedModel, // Frontend sends this for model type
      characterId, // extracted from body
      imageBase64, // Character reference image
      character, // Character context for identity locking
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
    const finalGuidanceScale = typeof guidance_scale === 'number' ? guidance_scale : 7.5

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

                CRITICAL INSTRUCTIONS FOR REALISM:
                1. FABRIC PHYSICS & TEXTURES: Clothing MUST look real. If the user mentions "Silk", specify "shimmering, fluid silk that clings naturally to the curves". If "Lace", specify "intricate, delicate see-through lace patterns with high-resolution fiber details". If "Bikini" or "Dress", describe how it sits on the skin, the weight of the fabric, and the realistic seams and stitching. Use terms like "high-end luxury fabrics", "organic cotton textures", "sheer transparent mesh", and "detailed embroidery".
                2. ANATOMICAL PERFECTION: You MUST prevent deformities. Describe hands as "slender, well-defined fingers with realistic nails". Feet as "anatomically perfect". Ensure limbs are connected naturally. Mention "sharp focus on joints and proportions".
                3. SKIN REALISM: Avoid "plastic" or "airbrushed" skin. Explicitly describe "natural skin textures, visible pores, subtle goosebumps, realistic skin highlights, and natural subsurface scattering". For naked/bikini scenes, mention "realistic skin folds" and "natural anatomical curves".
                4. IDENTITY LOCKING: If character info is provided (Name: ${character?.name}, Ethnicity: ${character?.ethnicity}), you MUST ensure the character's facial features remain 100% consistent with their established identity. Focus on the requested action and setting while keeping the character's face "locked" as the primary focus.
                5. MOOD & VIBRANCY: Force a "Romantic, Happy, Sexy, and Confident" vibe. Use vibrant colors, warm cinematic lighting (golden hour, soft romantic illumination), and evocative atmospheres. Use "8k resolution", "Kodak Portra 400 aesthetic", and "Shot on 35mm lens" for realism.
                6. LITERAL ADHERENCE: If the user says "legs wide open", describe it as "legs spread wide apart" or "seated in an open-legged pose" to ensure the AI generator obeys. Do NOT dilute the literal meaning of the user's action.
                7. EXPRESSIONS: Use "joyful", "seductive", or "confident". STERNLY FORBID: Any "distressed", "needy", "blank", or "robotic" looks.
                
                IMPORTANT FOR DIVERSITY: Mention premium settings like: a luxurious silk-sheeted bed, a pristine tropical beach, an intimate dimly-lit penthouse, or a sleek modern setting. Output ONLY the enhanced prompt text, no meta-talk. Keep it under 150 words.`
              },
              {
                role: 'user',
                content: `Masterpiece refinement for prompt: "${prompt}". Style: ${actualModel.includes('anime') || actualModel.includes('dreamshaper') ? 'High-end stylized anime/illustration' : 'Breathtaking photorealistic photography'}. ${actualImageCount > 1 ? `Generate a prompt that encourages diverse backgrounds for a batch of ${actualImageCount} images.` : ''}`
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
            finalPrompt = enhancedText;
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
    const environments = [
      'pristine tropical beach with golden hour lighting',
      'deep blue ocean with sparkling sun rays',
      'epic misty mountains with volumetric clouds',
      'luxurious silk-sheeted bed in a moonlit room',
      'high-end fashion boutique with elegant mirrors',
      'sleek modern kitchen with warm pendant lights',
      'rustic mountain lodge with a crackling fireplace',
      'intimate, dimly-lit "fuck room" with red velvet and neon'
    ];

    // Shuffle environments
    const shuffledEnvs = [...environments].sort(() => Math.random() - 0.5);

    const taskIds: string[] = [];
    const promptsForTasks: string[] = [];

    for (let i = 0; i < actualImageCount; i++) {
      const selectedEnv = shuffledEnvs[i % shuffledEnvs.length];
      const taskPrompt = `${finalPrompt}, in a ${selectedEnv}`;
      promptsForTasks.push(taskPrompt);
    }

    // --- SUBMIT TASKS TO NOVITA ---
    console.log(`🚀 Submitting ${actualImageCount} tasks to Novita for diversity...`);

    for (let i = 0; i < actualImageCount; i++) {
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
          prompt: promptsForTasks[i],
          model_name: apiModelName,
          negative_prompt: negativePrompt === DEFAULT_NEGATIVE_PROMPT
            ? DEFAULT_NEGATIVE_PROMPT
            : `${DEFAULT_NEGATIVE_PROMPT}, ${negativePrompt}`,
          width,
          height,
          image_num: 1, // One image per task for maximum diversity
          steps: 50,
          seed: -1,
          sampler_name: "DPM++ 2M Karras",
          guidance_scale: finalGuidanceScale,
          controlnet_units: imageBase64 ? [
            {
              model_name: "ip-adapter_sd15",
              weight: 0.95, // Increased weight for much stronger identity lock
              control_image: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
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
        console.log('✅ Task record updated with task_id')
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
