import { type NextRequest, NextResponse } from "next/server"
import { logApiCost } from "@/lib/budget-monitor"
import { createAdminClient } from "@/lib/supabase-admin"

// Define types for the API
type NovitaTxt2ImgRequestBody = {
  extra: {
    response_image_type: string
  }
  request: {
    model_name: string
    prompt: string
    negative_prompt?: string
    height: number
    width: number
    image_num: number
    steps: number
    seed: number
    clip_skip: number
    guidance_scale: number
    sampler_name: string
  }
}

type NovitaTaskResponse = {
  task_id: string
}

export async function POST(req: NextRequest) {
  try {
    // Enhanced prompt construction with character reference
    const { prompt, negativePrompt, character, imageBase64 } = await req.json()
    const apiKey = process.env.NEXT_PUBLIC_NOVITA_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Enhance the prompt using character context
    const characterContext = character?.about_me || character?.description || character?.personality || "";

    const enhancedPromptResponse = await fetch("https://api.novita.ai/v3/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-turbo",
        messages: [
          {
            role: "system",
            content: `You are a master of visual arts and prompt engineering for AI image generation, specializing in ultra-realistic "Hyper-Photography". Your goal is to take the user's input and the character's info to create a "very fine", masterpiece-quality description that follows strict anatomical and physics laws.

            CRITICAL INSTRUCTIONS FOR REALISM:
            1. FABRIC PHYSICS & TEXTURES: Clothing MUST look real, avoiding any "plastic" or "rendered" look. Describe "realistic fabric grain, micro-folds, natural wrinkles, and high-quality textile physics". For "Silk" or "Satin", mention "complex light reflections and soft subsurface scattering". For "Cotton" or "Linen", describe "visible weave and soft matte texture". Clothing should drape naturally with "realistic tension and weight", emphasizing "loose threads, seams, and realistic stitching details". Use terms like "high-end luxury fabrics", "organic cotton textures", "sheer transparent mesh", and "detailed embroidery".
            2. ANATOMICAL PERFECTION: You MUST prevent deformities. Describe hands as "slender, well-defined fingers with realistic nails, accurate finger count, natural hand articulation". Eyes MUST have "sharp focus, detailed irises, realistic pupils, and symmetrical placement". Feet as "anatomically perfect". Ensure limbs are connected naturally. Mention "sharp focus on joints and proportions".
            3. SKIN REALISM: Avoid "plastic" or "airbrushed" skin. Explicitly describe "natural skin textures, visible pores, subtle goosebumps, realistic skin highlights, and natural subsurface scattering". For naked/bikini scenes, mention "realistic skin folds" and "natural anatomical curves".
            4. IDENTITY LOCKING: You MUST ensure the character's facial features remain 100% consistent with their established identity. Focus on the requested action and setting while keeping the character's face "locked" as the primary focus.
            5. MOOD & VIBRANCY: Force a "Romantic, Happy, Sexy, and Confident" vibe. Use vibrant colors, warm cinematic lighting (golden hour, soft romantic illumination), and evocative atmospheres. Use "8k resolution", "Kodak Portra 400 aesthetic", and "Shot on 35mm lens" for realism.
            6. LITERAL ADHERENCE & EXPLICIT ACTIONS: You MUST accurately translate sexual or self-touching actions. If the user says "touching her vagina" or "hand on pussy", describe it vividly as "fingers intimately resting on her wet labia" or "hand delicately cupping her exposed crotch". If "legs wide open", describe "legs spread wide apart in an open, inviting pose". Do NOT sanitize, dilute, or omit the literal meaning of the user's action. The image generator must follow the exact physical placement requested.
            7. EXPRESSIONS: Use "joyful", "seductive", "moaning", or "confident". STERNLY FORBID: Any "distressed", "needy", "blank", or "robotic" looks.
            
            Output ONLY the enhanced prompt text, no meta-talk. Keep it under 150 words.`
          },
          {
            role: "user",
            content: `Masterpiece refinement for prompt: "${prompt}"\n\nCharacter Info: "${characterContext}"`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const enhancedPromptData = await enhancedPromptResponse.json();
    let enhancedPrompt = prompt
    if (enhancedPromptData.choices?.[0]?.message?.content) {
      enhancedPrompt = enhancedPromptData.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }

    // Prepare request body for Novita API
    // If we have an imageBase64, we use IP-Adapter for consistency
    const baseNegative = "ugly, deformed, bad anatomy, disfigured, mutated, extra limbs, missing limbs, fused fingers, extra fingers, bad hands, malformed hands, poorly drawn hands, poorly drawn face, blurry, jpeg artifacts, worst quality, low quality, lowres, pixelated, out of frame, tiling, watermarks, signature, censored, distortion, grain, long neck, unnatural pose, asymmetrical face, cross-eyed, lazy eye, bad feet, extra arms, extra legs, disjointed limbs, incorrect limb proportions, unrealistic body, unrealistic face, unnatural skin, disconnected limbs, lopsided, cloned face, glitch, double torso, bad posture, wrong perspective, overexposed, underexposed, low detail, plastic skin, unnatural skin texture, plastic clothing, glossy plastic fabric, CG fabric, shiny synthetic fabric, fused clothing, unreal fabric, badly fitted bikini, fused body and clothes, floating clouds, distorted bikini, missing nipples, extra nipples, fused nipples, bad anatomy genitals";
    let finalNegative = negativePrompt ? `${baseNegative}, ${negativePrompt}` : baseNegative;
    if (finalNegative.length > 1000) finalNegative = finalNegative.substring(0, 1000);

    const requestBody: any = {
      extra: {
        response_image_type: "jpeg",
      },
      request: {
        prompt: enhancedPrompt,
        model_name: "epicrealism_naturalSinRC1VAE_106430.safetensors",
        negative_prompt: finalNegative,
        width: 512,
        height: 768,
        image_num: 1,
        steps: 40,
        seed: -1,
        guidance_scale: 7.5,
        sampler_name: "DPM++ 2M Karras",
      },
    }

    // Add IP-Adapter for character consistency if image is provided
    if (imageBase64) {
      console.log("Adding IP-Adapter for character consistency")
      // Clean up base64 string if it has prefix
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      requestBody.request.controlnet_units = [
        {
          model_name: "ip-adapter_sd15",
          weight: 0.8,
          control_image: cleanBase64,
          module_name: "none"
        }
      ];

      // Also add Canny for structural consistency if needed, but IP-Adapter is best for faces
    }

    // Make request to Novita API to start generation
    console.log("Sending request to Novita API with IP-Adapter...")
    const response = await fetch("https://api.novita.ai/v3/async/txt2img", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    // Log the response status
    console.log("Novita API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Novita API error:", errorText)
      try {
        // Try to parse the error as JSON
        const errorData = JSON.parse(errorText)
        return NextResponse.json(
          {
            error: "Failed to generate image",
            details: errorData,
          },
          { status: response.status },
        )
      } catch (e) {
        // If parsing fails, return the raw error text
        return NextResponse.json(
          {
            error: "Failed to generate image",
            details: errorText,
          },
          { status: response.status },
        )
      }
    }

    // Parse the response
    const responseText = await response.text()
    console.log("Novita API raw response:", responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse API response as JSON:", e)
      return NextResponse.json(
        {
          error: "Invalid API response format",
          details: "The API response was not valid JSON",
        },
        { status: 500 },
      )
    }

    console.log("Novita API parsed response:", JSON.stringify(responseData))

    // Try to extract the task_id from different possible response structures
    let taskId = null

    // Check for the expected structure first
    if (responseData?.data?.task_id) {
      taskId = responseData.data.task_id
    }
    // Check for alternative structures
    else if (responseData?.task_id) {
      taskId = responseData.task_id
    } else if (responseData?.id) {
      taskId = responseData.id
    }
    // If we have a data object but no task_id, log all keys to help debug
    else if (responseData?.data) {
      console.log("Response data keys:", Object.keys(responseData.data))
      // Try to find any key that might contain "id" or "task"
      for (const key of Object.keys(responseData.data)) {
        if (key.includes("id") || key.includes("task")) {
          taskId = responseData.data[key]
          console.log(`Found potential task ID in key ${key}:`, taskId)
          break
        }
      }
    }

    // If we still don't have a task ID, check the top level object
    if (!taskId && responseData) {
      console.log("Top level response keys:", Object.keys(responseData))
      // Try to find any key that might contain "id" or "task"
      for (const key of Object.keys(responseData)) {
        if (key.includes("id") || key.includes("task")) {
          taskId = responseData[key]
          console.log(`Found potential task ID in top level key ${key}:`, taskId)
          break
        }
      }
    }

    // If we found a task ID, return it
    if (taskId) {
      console.log("Found task ID:", taskId)

      // Try to get user ID from some source (img2img usually doesn't have it easily in current structure, but let's try)
      // For now, log as system or try to extract from character/request if possible
      await logApiCost("Image generation (img2img)", 0, 0.05, "").catch(e => { })

      return NextResponse.json({ taskId })
    }

    // If we couldn't find a task ID, return an error with the full response for debugging
    console.error("Could not find task_id in response:", responseData)
    return NextResponse.json(
      {
        error: "Invalid API response",
        details: "The API response did not contain the expected task_id",
        response: responseData,
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: String(error),
      },
      { status: 500 },
    )
  }
}