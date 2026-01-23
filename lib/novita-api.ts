/**
 * Novita AI Image Generation API Client
 * Uses Seedream 4.5 exclusively for masterpiece-quality image generation
 */

import { getUnifiedNovitaKey } from "./unified-api-keys"

export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  style?: 'realistic' | 'anime';
  guidance_scale?: number;
  controlnet_units?: any[];
}

export interface GeneratedImage {
  url: string;
  seed: number;
  width: number;
  height: number;
}

/**
 * Generate image using Seedream 4.5 (exclusive engine)
 * Features: Ultra-realistic rendering, natural skin textures, superior lighting
 */
export async function generateImage(params: ImageGenerationParams): Promise<GeneratedImage> {
  const { key: NOVITA_API_KEY, error: keyError } = await getUnifiedNovitaKey();

  if (!NOVITA_API_KEY) {
    throw new Error(keyError || 'Novita API key is not configured');
  }

  const {
    prompt,
    negativePrompt = 'sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust, husband, boyfriend, second person, another person, man, male, lady and man, man and woman, multiple people, two ladies, two people, group of people, flat light, harsh glare, orange light, closeup, headshot, portrait, cropped head, anime, illustration, cartoon, drawing, painting, digital art, stylized, 3d render, cgi, wrinkles, old, aged, grainy, man, male, couple, boy, together, two people, symmetrical face, smooth skin, plastic skin, waxy skin, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, several views, watermark, text, logo, signature, letters, numbers, words, typography, font, sign, tattoo, writing, callout, poor background, messy room, cluttered environment, blurry, distorted, deformed, bad anatomy, ugly, disgusting, extra limbs, extra fingers, malformed hands, distorted face, unrealistic skin, plastic look, deformed genitalia, malformed pussy, distorted private parts, unrealistic anatomy, missing labia, blurry genitals, bad pussy anatomy',
    width = 1600,
    height = 2400,
    steps = 35,
    seed = -1,
    style = 'realistic',
    guidance_scale = 4.5,
    controlnet_units,
  } = params;

  // Enhance prompt based on style - focus on Solitary Intimate Photography
  let enhancedPrompt = style === 'realistic'
    ? `Solo female raw mobile selfie, unprocessed digital photography, authentic skin texture, lone woman, ${prompt}, natural lighting, ordinary room background, highly detailed, sharp focus, 8k UHD, wide angle lens, authentic raw photo`
    : `high-end anime style, ${prompt}, high quality anime illustration, masterwork, clean lines, vibrant colors, cel-shaded, professional anime art, detailed scenery`;

  if (enhancedPrompt.length > 1000) {
    enhancedPrompt = enhancedPrompt.substring(0, 1000);
  }

  // Seedream 4.5 with retry logic
  const MAX_RETRIES = 2;
  let lastError: Error | null = null;

  console.log(`🚀 Generating image with Seedream 4.5 (Max ${MAX_RETRIES} attempts)...`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 90 second timeout per attempt
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const response = await fetch('https://api.novita.ai/v3/seedream-4.5', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOVITA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          negative_prompt: negativePrompt,
          size: `${width}x${height}`,
          seed: seed === -1 ? Math.floor(Math.random() * 2147483647) : seed,
          steps: steps,
          guidance_scale: guidance_scale,
          controlnet_units: controlnet_units,
          response_image_type: 'url',
          add_watermark: false,
          watermark: false,
          optimize_prompt_options: {
            mode: 'standard'
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          console.log(`✅ Seedream 4.5 succeeded on attempt ${attempt}`);

          let imageUrl = data.images[0];
          // Add base64 prefix if needed
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            imageUrl = `data:image/jpeg;base64,${imageUrl}`;
          }

          return {
            url: imageUrl,
            seed: seed,
            width: width,
            height: height,
          };
        } else {
          throw new Error('No images returned from Seedream 4.5');
        }
      } else {
        const errorText = await response.text();
        console.warn(`⚠️ Seedream 4.5 attempt ${attempt} failed: ${errorText}`);
        lastError = new Error(`Seedream 4.5 error: ${errorText}`);
      }
    } catch (error: any) {
      const errMsg = error.name === 'AbortError' ? 'Request timed out' : error.message;
      console.warn(`⚠️ Seedream 4.5 attempt ${attempt} exception: ${errMsg}`);
      lastError = new Error(errMsg);
    }

    if (attempt < MAX_RETRIES) {
      console.log(`🔄 Retrying Seedream 4.5 in 1 second...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // All retries failed
  console.error('❌ Seedream 4.5 failed all attempts');
  throw lastError || new Error('Image generation failed after all retries');
}

/**
 * Build prompt for specific attributes based on detailed specifications
 */
export function buildAttributePrompt(attributes: {
  age?: string;
  ethnicity?: string;
  bodyType?: string;
  style?: 'realistic' | 'anime';
}): string {
  const { age, ethnicity, bodyType, style = 'realistic' } = attributes;

  const parts: string[] = [];

  // Base style description
  if (style === 'realistic') {
    parts.push('attractive female avatar with life-like, ultra-realistic features, skin texture, and proportions');
    parts.push('idealized, polished, and highly desirable');
    parts.push('resembles a real person');
  } else {
    parts.push('attractive female avatar with anime-style features');
    parts.push('larger expressive eyes, stylized proportions, and vibrant color tones');
    parts.push('bold, artistic, and idealized for fantasy appeal');
  }

  // Age description with detailed specifications
  if (age) {
    const ageMap: Record<string, string> = {
      '18-19': 'very youthful, fresh-faced, with smooth skin and a playful, energetic presence typical of late teens',
      '20s': 'woman in her twenties: vibrant, fit, adventurous, with a sense of youthful maturity starting to emerge',
      '30s': 'confident woman in her thirties: balanced, attractive, slightly more defined features, showing maturity and self-assurance',
      '40s': 'woman in her forties: sophisticated, experienced, with a confident and attractive adult presence',
      '50s': 'woman in her fifties: mature, refined, with signs of life experience and charisma, possibly with subtle aging features',
      '60s': 'woman in her sixties: distinguished, wise, still attractive, possibly silver-haired or showing graceful aging',
      '70+': 'older woman, 70 years or more: deeply mature, unique charm, with strong character lines that show wisdom and life lived',
    };
    parts.push(ageMap[age] || 'beautiful woman');
  }

  // Ethnicity description with detailed specifications
  if (ethnicity) {
    const ethnicityMap: Record<string, string> = {
      'Caucasian': 'attractive woman with lighter skin tones and a sharper or angular facial structure, idealized and desirable',
      'Asian': 'attractive woman with fair to golden skin tones and a softer or oval facial structure, idealized and desirable',
      'Arab': 'attractive woman with olive to light brown skin tones and strong, defined facial features, idealized and desirable',
      'Indian': 'attractive woman with medium brown to deep brown skin tones and rounded or symmetrical facial features, idealized and desirable',
      'Latina': 'attractive woman with warm tan to light brown skin tones and expressive, vibrant facial features, idealized and desirable',
      'African': 'attractive woman with deep brown to dark skin tones and bold, well-defined facial features, idealized and desirable',
      'Mixed': 'attractive woman with blended skin tones and unique facial harmony that combines traits from multiple backgrounds, idealized and desirable',
      'European': 'attractive woman with lighter skin tones and a sharper or angular facial structure, idealized and desirable',
      'East Asian': 'attractive woman with fair to golden skin tones and a softer or oval facial structure, idealized and desirable',
      'South Asian': 'attractive woman with medium brown to deep brown skin tones and rounded or symmetrical facial features, idealized and desirable',
      'Middle Eastern': 'attractive woman with olive to light brown skin tones and strong, defined facial features, idealized and desirable',
      'Caribbean': 'attractive woman with warm tan to light brown skin tones and expressive, vibrant facial features, idealized and desirable',
    };
    parts.push(ethnicityMap[ethnicity] || '');
  }

  // Body type description with detailed specifications
  if (bodyType) {
    const bodyMap: Record<string, string> = {
      'Muscular': 'defined and strong physique, emphasizing power and intensity',
      'Athletic': 'lean and toned body, reflecting agility and balanced strength',
      'Slim': 'slender and light figure, projecting elegance and subtle charm',
      'Chubby': 'soft and full body, radiating warmth, comfort, and approachability',
      'Cub': 'youthful yet stocky build, blending a playful vibe with strength',
      'Average': 'natural and relatable physique, offering versatility and everyday realism',
      'Curvy': 'curvy hourglass figure, full and feminine proportions',
      'Plus-size': 'full-figured, plus size beauty with soft curves',
    };
    parts.push(bodyMap[bodyType] || '');
  }

  // Professional photography details for realistic style
  if (style === 'realistic') {
    parts.push('unprocessed raw mobile phone selfie');
    parts.push('natural indoor lighting, authentic skin texture with slight imperfections');
    parts.push('lone woman taking a photo of herself');
    parts.push('raw digital look, slight camera shake, realistic room background');
    parts.push('unfiltered, sharp focus on face, non-studio lighting');
    parts.push('raw photo, film grain, 4k, Fujifilm instax, NO SHINING, NO BOKEH, NO TEXT');
  } else {
    parts.push('professional anime illustration');
    parts.push('detailed face and eyes, clean lines');
    parts.push('stylish anime outfit, vibrant colors');
    parts.push('upper body portrait, dynamic pose');
    parts.push('studio quality anime art, cel shading');
    parts.push('high detail, professional digital art');
  }

  return parts.filter(Boolean).join(', ');
}

/**
 * Generate images for all attribute combinations
 */
export async function generateAttributeImages(
  style: 'realistic' | 'anime',
  category: 'age' | 'body' | 'ethnicity',
  values: string[]
): Promise<Map<string, GeneratedImage>> {
  const results = new Map<string, GeneratedImage>();

  for (const value of values) {
    try {
      const attributes: any = { style };
      attributes[category] = value;

      const prompt = buildAttributePrompt(attributes);
      const image = await generateImage({ prompt, style });

      results.set(value, image);

      console.log(`Generated image for ${category}: ${value}`);
    } catch (error) {
      console.error(`Failed to generate image for ${category}: ${value}`, error);
    }
  }

  return results;
}
