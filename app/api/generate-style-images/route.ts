import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getNovitaApiKey } from '@/lib/api-keys';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Supabase admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface GenerateImageRequest {
  style: 'realistic' | 'anime';
}

import { generateImage } from '@/lib/novita-api';

async function generateImageWithNovita(prompt: string, negativePrompt: string, style: 'realistic' | 'anime'): Promise<string> {
  const result = await generateImage({
    prompt,
    negativePrompt,
    style,
    width: 512,
    height: 768
  });
  return result.url;
}

async function downloadImage(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download image');
  }
  return response.arrayBuffer();
}

async function uploadToSupabase(imageBuffer: ArrayBuffer, fileName: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from('assets')
    .upload(fileName, imageBuffer, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('assets')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json();
    const { style } = body;

    if (!style || !['realistic', 'anime'].includes(style)) {
      return NextResponse.json(
        { error: 'Invalid style. Must be "realistic" or "anime"' },
        { status: 400 }
      );
    }

    // Define prompts for each style
    const baseNegative = 'ugly, deformed, bad anatomy, disfigured, mutated, extra limbs, missing limbs, fused fingers, extra fingers, mutated hands, bad hands, malformed hands, poorly drawn hands, poorly drawn face, distorted eyes, asymmetrical eyes, iris distortion, bloodshot eyes, blurry, jpeg artifacts, worst quality, low quality, lowres, pixelated, out of frame, tiling, watermarks, signature, censored, distortion, grain, long neck, unnatural pose, asymmetrical face, cross-eyed, lazy eye, bad feet, extra arms, extra legs, disjointed limbs, incorrect limb proportions, unrealistic body, unrealistic face, unnatural skin, disconnected limbs, lopsided, cloned face, glitch, double torso, bad posture, wrong perspective, overexposed, underexposed, low detail, plastic skin, unnatural skin texture, plastic clothing, fused clothing, unreal fabric, badly fitted bikini, fused body and clothes, floating clouds, distorted bikini, missing nipples, extra nipples, fused nipples, bad anatomy genitals';

    const prompts = {
      realistic: {
        prompt: 'masterpiece, professional portrait photography, beautiful woman, sophisticated fashion, warm cinematic lighting, photorealistic, 8k resolution, Kodak Portra 400 aesthetic, shot on 35mm lens, sharp focus, natural skin texture, visible pores, slender fingers with clear, beautiful nails and high-gloss polish, elegant pose, confident expression, vibrant colors',
        negative: baseNegative
      },
      anime: {
        prompt: 'masterpiece, high-quality anime style, vibrant colors, detailed anime illustration, manga aesthetic, sharp lines, cel-shaded, professional anime art, expressive features, elegant pose, slender fingers with clear beautiful nails, beautiful anime girl, background blur',
        negative: 'ugly, deformed, bad anatomy, disfigured, mutated, extra limbs, missing limbs, fused fingers, extra fingers, bad hands, malformed hands, poorly drawn hands, poorly drawn face, blurry, jpeg artifacts, worst quality, low quality, lowres, pixelated, out of frame, tiling, watermarks, signature, censored, distortion, grain, realistic, 3d, photograph, western cartoon'
      }
    };

    let { prompt, negative } = prompts[style];
    if (prompt.length > 1000) prompt = prompt.substring(0, 1000);
    if (negative.length > 1000) negative = negative.substring(0, 1000);

    console.log(`Generating ${style} style image...`);

    // Generate image with NOVITA
    const imageUrl = await generateImageWithNovita(prompt, negative, style);
    console.log('Image generated:', imageUrl);

    // Download the image
    console.log('Downloading image...');
    const imageBuffer = await downloadImage(imageUrl);

    // Upload to Supabase storage
    const fileName = `style-images/${style}-style-${Date.now()}.jpg`;
    console.log('Uploading to Supabase...');
    const publicUrl = await uploadToSupabase(imageBuffer, fileName);

    console.log('Upload complete:', publicUrl);

    return NextResponse.json({
      success: true,
      style,
      imageUrl: publicUrl,
      originalUrl: imageUrl,
    });

  } catch (error) {
    console.error('Error generating style image:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      },
      { status: 500 }
    );
  }
}

// GET endpoint to generate both style images at once
export async function GET() {
  try {
    const results = {
      realistic: null as string | null,
      anime: null as string | null,
      errors: [] as string[],
    };

    // Generate realistic style
    try {
      const realisticPrompt = {
        prompt: 'masterpiece, professional portrait photography, beautiful woman, sophisticated fashion, warm cinematic lighting, photorealistic, 8k resolution, Kodak Portra 400 aesthetic, shot on 35mm lens, sharp focus, natural skin texture, visible pores, slender fingers with clear, beautiful nails and high-gloss polish, elegant pose, confident expression, vibrant colors',
        negative: 'ugly, deformed, bad anatomy, disfigured, mutated, extra limbs, missing limbs, fused fingers, extra fingers, bad hands, malformed hands, poorly drawn hands, poorly drawn face, blurry, jpeg artifacts, worst quality, low quality, lowres, pixelated, out of frame, tiling, watermarks, signature, censored, distortion, grain, long neck, unnatural pose, asymmetrical face, cross-eyed, lazy eye, bad feet, extra arms, extra legs, disjointed limbs, incorrect limb proportions, unrealistic body, unrealistic face, unnatural skin, disconnected limbs, lopsided, cloned face, glitch, double torso, bad posture, wrong perspective, overexposed, underexposed, low detail, plastic skin, unnatural skin texture, plastic clothing, fused clothing, unreal fabric, badly fitted bikini, fused body and clothes, floating clothes, distorted bikini, missing nipples, extra nipples, fused nipples, bad anatomy genitals'
      };

      const realisticUrl = await generateImageWithNovita(realisticPrompt.prompt, realisticPrompt.negative, 'realistic');
      const realisticBuffer = await downloadImage(realisticUrl);
      results.realistic = await uploadToSupabase(realisticBuffer, `style-images/realistic-style-${Date.now()}.jpg`);
    } catch (error) {
      results.errors.push(`Realistic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Wait a bit before generating anime style to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate anime style
    try {
      const animePrompt = {
        prompt: 'masterpiece, high-quality anime style, vibrant colors, detailed anime illustration, manga aesthetic, sharp lines, cel-shaded, professional anime art, expressive features, elegant pose, slender fingers with clear beautiful nails, beautiful anime girl, background blur',
        negative: 'ugly, deformed, bad anatomy, disfigured, mutated, extra limbs, missing limbs, fused fingers, extra fingers, bad hands, malformed hands, poorly drawn hands, poorly drawn face, blurry, jpeg artifacts, worst quality, low quality, lowres, pixelated, out of frame, tiling, watermarks, signature, censored, distortion, grain, realistic, 3d, photograph, western cartoon'
      };

      const animeUrl = await generateImageWithNovita(animePrompt.prompt, animePrompt.negative, 'anime');
      const animeBuffer = await downloadImage(animeUrl);
      results.anime = await uploadToSupabase(animeBuffer, `style-images/anime-style-${Date.now()}.jpg`);
    } catch (error) {
      results.errors.push(`Anime: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return NextResponse.json({
      success: results.realistic !== null || results.anime !== null,
      results,
    });

  } catch (error) {
    console.error('Error in batch generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
