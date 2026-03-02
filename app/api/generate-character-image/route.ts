import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary-upload';
import { generateImage } from '@/lib/novita-api';
import { getUnifiedNovitaKey } from '@/lib/unified-api-keys';
import { createClient } from '@/lib/supabase-server';
import { getUserPlanInfo } from '@/lib/subscription-limits';

import { containsNSFW, containsProhibited } from '@/lib/nsfw-filter';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterDetails, gender, additionalInstructions } = body;

    // 1. Content Moderation Check
    if (additionalInstructions && containsProhibited(additionalInstructions)) {
      console.warn("🚫 PROHIBITED content detected in character instructions:", additionalInstructions);
      return NextResponse.json(
        { error: 'Innehållet bryter mot våra riktlinjer för säkerhet.' },
        { status: 400 }
      );
    }

    // Check authentication and premium status
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Berättigande krävs' }, { status: 401 });
    }

    const planInfo = await getUserPlanInfo(user.id);
    const { data: adminUser } = await supabase.from('admin_users').select('id').eq('user_id', user.id).maybeSingle();
    const isAdmin = !!adminUser;

    if (planInfo.planType !== 'premium' && !isAdmin) {
      return NextResponse.json(
        {
          error: 'Upgrade to Premium to generate AI girlfriends.',
          upgrade_required: true
        },
        { status: 403 }
      );
    }

    // Check model access (Seedream is used for character generation)
    const { checkModelAccess } = await import('@/lib/subscription-limits');
    const modelAccess = await checkModelAccess(user.id, 'seedream-4.5');
    if (!modelAccess.allowed) {
      return NextResponse.json(
        {
          error: modelAccess.message,
          upgrade_required: true
        },
        { status: 403 }
      );
    }
    // Default to 'lady' if not specified or invalid
    const isMale = gender === 'gent';
    const subjectTerm = isMale ? 'man' : 'woman';

    if (!characterDetails) {
      return NextResponse.json(
        { error: 'Character details are required' },
        { status: 400 }
      );
    }

    // Step 1: Build the character description from details
    let description = '';

    if (isMale) {
      description = `A ${characterDetails.style || 'realistic'} ${characterDetails.age || 'young'} ${characterDetails.ethnicity || ''} man. Body: ${characterDetails.bodyType || 'average'}. Personality: ${characterDetails.personality || 'friendly'}.`;
    } else {
      description = `A ${characterDetails.style || 'realistic'} ${characterDetails.age || 'young'} ${characterDetails.ethnicity || ''} woman. Eyes: ${characterDetails.eyeColor || 'brown'}. Hair: ${characterDetails.hairColor || 'brown'} ${characterDetails.hairStyle || 'long'}. Body: ${characterDetails.bodyType || 'slim'} with ${characterDetails.breastSize || 'medium'} breasts and ${characterDetails.buttSize || 'medium'} curves.`;
    }

    // Step 2: Enhance the description using Novità API
    const { key: novitaApiKey, error: keyError } = await getUnifiedNovitaKey();
    if (!novitaApiKey) {
      return NextResponse.json(
        { error: keyError || 'Novità API key not configured' },
        { status: 500 }
      );
    }

    const novitaResponse = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${novitaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v3.1',
        messages: [
          {
            role: 'system',
            content: `You are a master prompt engineer specializing in ultra-realistic human photography with HEALTHY, SMOOTH, NATURAL skin. Your goal is to produce breathtaking character portraits that look like REAL photographs - NOT plastic or CGI.

            CRITICAL SKIN QUALITY RULES (TOP PRIORITY):
            1. HEALTHY RADIANT SKIN: Always describe skin as "healthy smooth radiant skin", "soft supple texture", "natural healthy glow", "dewy fresh complexion", "vibrant youthful skin", "even skin tone". 
            2. ANTI-PLASTIC MANDATE: STERNLY FORBID any plastic, waxy, airbrushed, synthetic, or CGI-looking skin. The skin must have "natural subsurface scattering", "organic skin texture", "realistic skin pores at close range".
            3. NOT OVER-SMOOTHED: Avoid "overly smooth" or "beauty filtered" looks. Real skin has subtle natural texture.

            CRITICAL IDENTITY LOCK (ABSOLUTE PRIORITY):
            1. IDENTITY ANCHOR: The ethnicity (${characterDetails.ethnicity}), age (${characterDetails.age}), and gender (${gender}) are MATHEMATICAL CONSTANTS. Do NOT mix these with other ethnicities.
            2. TRAIT FAITHFULNESS: If the user selected "${characterDetails.hairColor} hair" or "${characterDetails.eyeColor} eyes", these must be EXACT.
            3. PHOTOGRAPHIC REALISM: Use "shot on Canon EOS R5", "85mm portrait lens", "f/1.8 aperture", "natural soft lighting", "RAW unprocessed photo", "film grain texture". AVOID "CGI", "plastic", or "industrial" looks.
            4. EXTREME ENVIRONMENTAL DIVERSITY: STERNLY FORBID plain/studio backgrounds. You MUST place the character in a detailed, dynamic real-world location with "sharp, clear, and distinguishable" background elements. Choose randomly from:
               - URBAN: Rooftop bar, rainy Tokyo street, neon arcade, busy coffee shop, library, modern café.
               - NATURE: Golden hour beach, snowy cabin porch, flower field, forest trail, desert sunset, waterfall.
               - LUXURY: Penthouse lounge, art gallery, high-end restaurant, spa, yacht deck.
               - DOMESTIC: Cozy kitchen, sunlit bedroom, bubble bath, balcony with city view, living room.
            5. INTIMATE MOODS: Describe CANDID, ALLURING moments (e.g., "waking up", "sipping coffee", "warm genuine smile", "relaxed natural pose").
            6. AGE-APPROPRIATE SKIN: 
               - If Age < 25: "firm, plump, youthful skin with natural collagen", "soft healthy glow".
               - If Age > 35: "refined elegant features", "mature healthy complexion", "sophisticated beauty".
            7. CLEAN MATTE FACE: "clean, clear, matte skin", "soft diffused lighting on face", "even skin tone". FORBID "oily skin", "harsh glare", "strong reflections".
            8. ANATOMY: "anatomically perfect hands with five fingers", "natural body proportions".
            9. WORD COUNT: Under 180 words.
            10. FORMAT: Provide ONLY the raw photographic prompt text.`
          },
          {
            role: 'user',
            content: `Identity: ${description}. ${additionalInstructions ? `User Additions: ${additionalInstructions}.` : ""} 
            
            TASK: Create a breathtaking, intimate photographic prompt with HEALTHY, SMOOTH, NATURAL-looking skin.
            - Style: ${characterDetails.style === 'anime' ? 'High-end modern anime art' : 'Ultra-realistic photography with healthy radiant skin - NOT plastic or artificial'}.
            - Skin: MUST look healthy, smooth, radiant, and REAL - never plastic, waxy, or airbrushed.
            - Background: MUST be a specific, detailed natural environment with "crystal clear clarity".
            - Vibe: Confident, natural, authentic beauty.
            
            Create a masterpiece prompt that produces a REAL-looking person.`
          }
        ],
        max_tokens: 350,
        temperature: 0.7,
        response_format: { type: 'text' }
      }),
    });

    if (!novitaResponse.ok) {
      const errorText = await novitaResponse.text();
      console.error('Novità API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to enhance character description' },
        { status: 500 }
      );
    }

    const novitaData = await novitaResponse.json();
    const enhancedPrompt = novitaData.choices?.[0]?.message?.content || description;

    console.log('Enhanced prompt:', enhancedPrompt);

    // Step 3: Generate image using Novita API
    console.log('Generating image with Novita...');

    // Determine style
    const style = characterDetails.style === 'anime' ? 'anime' : 'realistic';

    // Enhanced negative prompts - specifically targeting plastic/artificial look
    const REALISTIC_NEGATIVE_PROMPT = "(plastic skin:3.0), (waxy skin:3.0), (airbrushed:2.5), (CGI look:3.0), (synthetic skin:3.0), (mannequin:3.0), (doll face:3.0), (artificial look:3.0), (rubbery texture:3.0), (shiny plastic:3.0), (overly smooth:2.5), (beauty filter:2.5), anime, cartoon, illustration, painting, stylized, low quality, blurry, distorted, deformed, bad anatomy, ugly, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, double limbs, broken legs, floating body parts, lowres, text, watermark, error, cropped, worst quality, jpeg artifacts, signature, duplicate, harsh lighting, ring light, freckles, spots, moles, blemishes";
    const ANIME_NEGATIVE_PROMPT = "low quality, blurry, distorted, deformed, bad anatomy, ugly, disgusting, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, unrealistic skin, waxy skin, plastic look, double limbs, broken legs, floating body parts, lowres, text, watermark, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, duplicate, photorealistic, photography, 3d, digital render";

    // Select settings based on style
    const selectedNegativePrompt = style === 'anime' ? ANIME_NEGATIVE_PROMPT : REALISTIC_NEGATIVE_PROMPT;

    // Resolution: Seedream 4.5 requires high resolution (1600x2400 > 3.6MP)
    const width = 1600;
    const height = 2400;

    // Add realism anchors to the prompt for healthy, smooth, real-looking skin
    const realismSuffix = style === 'realistic' 
      ? ", (MANDATORY PHOTOREALISTIC:2.0), (real photograph:1.9), (NOT plastic skin:2.0), (NOT waxy:2.0), (healthy smooth radiant skin:1.9), (natural skin texture:1.8), (soft supple skin:1.7), (organic skin texture:1.7), (natural subsurface scattering:1.5), masterpiece, professional photography, raw photo, film grain, highly detailed skin texture, sharp focus, natural soft lighting, shot on Canon EOS R5, 85mm lens, 8k UHD, deep depth of field, sharp background, extremely detailed environment"
      : ", masterpiece, trending on pixiv, high-quality anime illustration, sharp lines, hyper-detailed, high-resolution style, detailed background";

    // Generate the image using Seedream 4.5 (via unified client)
    const generatedImage = await generateImage({
      prompt: enhancedPrompt + realismSuffix,
      negativePrompt: selectedNegativePrompt,
      style: style,
      width: width,
      height: height,
      steps: 30, // Optimized for Seedream
      guidance_scale: 7.0 // Optimized for Seedream
    });

    const novitaImageUrl = generatedImage.url;

    if (!novitaImageUrl) {
      console.error('No image URL generated');
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    console.log('Image generated successfully from Novita:', novitaImageUrl);

    // Step 4: Upload to Cloudinary CDN
    let cloudinaryImageUrl = novitaImageUrl;
    try {
      console.log('[Character Creation] Uploading image to Cloudinary CDN...');
      // Upload directly from Novita URL
      cloudinaryImageUrl = await uploadImageToCloudinary(novitaImageUrl, 'character-images');
      console.log('[Character Creation] Image uploaded to Cloudinary:', cloudinaryImageUrl);
    } catch (cloudinaryError) {
      console.error('[Character Creation] Failed to upload to Cloudinary:', cloudinaryError);
      // Fall back to Novita URL if Cloudinary fails
      console.log('[Character Creation] Using Novita URL as fallback');
    }

    return NextResponse.json({
      success: true,
      imageUrl: cloudinaryImageUrl,
      enhancedPrompt,
    });

  } catch (error: any) {
    console.error('Error generating character image:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
