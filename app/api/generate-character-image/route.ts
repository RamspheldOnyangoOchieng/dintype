import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary-upload';
import { generateImage } from '@/lib/novita-api';
import { getUnifiedNovitaKey } from '@/lib/unified-api-keys';
import { createClient } from '@/lib/supabase-server';
import { getUserPlanInfo } from '@/lib/subscription-limits';

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { characterDetails, gender } = body;
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
      description = `A ${characterDetails.style || 'realistic'} style image of a ${characterDetails.age || 'young'} ${characterDetails.ethnicity || ''} ${subjectTerm}. He has a ${characterDetails.bodyType || 'average'} body type. His personality is ${characterDetails.personality || 'friendly'} and he's your ${characterDetails.relationship || 'friend'}.`;
    } else {
      description = `A ${characterDetails.style || 'realistic'} style image of a ${characterDetails.age || 'young'} ${characterDetails.ethnicity || ''} ${subjectTerm}. She has ${characterDetails.eyeColor || 'brown'} eyes, ${characterDetails.hairColor || 'brown'} ${characterDetails.hairStyle || 'long'} hair. Her body type is ${characterDetails.bodyType || 'slim'} with ${characterDetails.breastSize || 'medium'} breasts and ${characterDetails.buttSize || 'medium'} butt. Her personality is ${characterDetails.personality || 'friendly'} and she's your ${characterDetails.relationship || 'friend'}.`;
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
            content: 'You are an elite prompt engineer for state-of-the-art AI image generators. Your specialty is creating masterpiece-quality prompts for characters. You focus on: 1) Physical features with micro-details like skin texture, eye highlights, and ANATOMICAL PERFECTION. Specifically describe hands as "slender, well-defined fingers with EXACTLY 5 FINGERS PER HAND, and clear, beautiful nails with elegant high-gloss polish". STERNLY AVOID malformations. 2) Composition and cinematic lighting. 3) High-fashion or thematic attire. 4) Atmospheric settings. Use artistic keywords like "hyper-detailed", "8k resolution", "cinematic". Keep it poetic yet technically precise. Under 110 words.'
          },
          {
            role: 'user',
            content: `Masterpiece request for a ${gender} character: ${description}. Style: ${characterDetails.style === 'anime' ? 'High-end modern anime art/illustration with saturated colors and intricate linework' : 'Ultra-photorealistic photography, 85mm lens, f/1.8, bokeh background'}. Enhance this into a breathtaking, fine-detailed prompt.`
          }
        ],
        max_tokens: 250,
        temperature: 0.75,
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

    // Enhanced negative prompts
    const REALISTIC_NEGATIVE_PROMPT = "low quality, blurry, distorted, deformed, bad anatomy, ugly, disgusting, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, unrealistic skin, waxy skin, plastic look, double limbs, broken legs, floating body parts, lowres, text, watermark, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, duplicate";
    const ANIME_NEGATIVE_PROMPT = "low quality, blurry, distorted, deformed, bad anatomy, ugly, disgusting, malformed hands, extra fingers, missing fingers, fused fingers, distorted face, uneven eyes, unrealistic skin, waxy skin, plastic look, double limbs, broken legs, floating body parts, lowres, text, watermark, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, duplicate, photorealistic, photography, 3d, digital render";

    // Select settings based on style
    const selectedNegativePrompt = style === 'anime' ? ANIME_NEGATIVE_PROMPT : REALISTIC_NEGATIVE_PROMPT;

    // Resolution: Seedream 4.5 works best with 512x768 (Portrait)
    const width = 512;
    const height = 768;

    // Generate the image using Seedream 4.5 (via unified client)
    const generatedImage = await generateImage({
      prompt: enhancedPrompt + (style === 'realistic' ? ", masterpiece, professional photography, raw photo, film grain, highly detailed skin texture, sharp focus, natural lighting, Fujifilm instax, 4k" : ", masterpiece, trending on pixiv, high-quality anime illustration, sharp lines, hyper-detailed, high-resolution style"),
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
