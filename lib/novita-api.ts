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
  character?: any; // Add character object for Multi-Referencing Engine
  imageBase64?: string; // Optional context image
}

export interface GeneratedImage {
  url: string;
  seed: number;
  width: number;
  height: number;
}

/**
 * Generate image using Seedream 4.5 (exclusive engine)
 * Features: Multi-Referencing Engine for character consistency
 */
export async function generateImage(params: ImageGenerationParams): Promise<GeneratedImage> {
  const { key: NOVITA_API_KEY, error: keyError } = await getUnifiedNovitaKey();

  if (!NOVITA_API_KEY) {
    throw new Error(keyError || 'Novita API key is not configured');
  }

  const {
    prompt,
    negativePrompt = 'sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust, husband, boyfriend, second person, another person, man, male, lady and man, man and woman, multiple people, two ladies, two people, group of people, flat light, harsh glare, orange light, closeup, headshot, portrait, cropped head, anime, illustration, cartoon, drawing, painting, digital art, stylized, 3d render, cgi, wrinkles, old, aged, grainy, man, male, couple, boy, together, two people, symmetrical face, smooth skin, plastic skin, waxy skin, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, several views, multiview, card, frame, border, comparison, side by side, collage layout, photo grid, vertical split, horizontal split, montage, comic strip, collection of images, duplicate subject, mirror image, screenshot, multi-panel, panels, quad, grid-layout, contact sheet, storyboard panels, sequence, comparison shot, watermark, text, logo, signature, letters, numbers, words, typography, font, sign, tattoo, writing, callout, poor background, messy room, cluttered environment, blurred background, low quality, blurry, distorted, deformed genitalia, malformed pussy, distorted private parts, unrealistic anatomy, missing labia, blurry genitals, bad pussy anatomy, ugly, disgusting, distorted face, uneven eyes, unrealistic skin, plastic look, double limbs, broken legs, floating body parts, lowres, error, cropped, worst quality, normal quality, jpeg artifacts, duplicate, sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust',
    width = 1600,
    height = 2400,
    steps = 25,
    seed = -1,
    style = 'realistic',
    guidance_scale = 3.5,
    controlnet_units = [],
    character,
    imageBase64,
  } = params;

  // --- FULL-SPECTRUM DNA TWINNING ENGINE ---
  const finalControlUnits = [...controlnet_units];

  // Helper to construct Character Identity DNA
  const buildIdentityDNA = (char: any) => {
    if (!char) return '';
    const dnaParts = [
      `NAME: ${char.name}`,
      `AGE: ${char.age}`,
      `ETHNICITY: ${char.ethnicity || 'mixed'}`,
      `BODY: ${char.bodyType || char.body_type || char.body || 'average'}`,
      `HAIR: ${char.hairColor || char.hair_color || 'natural'}`,
      `EYES: ${char.eyeColor || char.eye_color || 'beautiful'}`,
      `SKIN TONE: ${char.skinTone || char.skin_tone || 'natural tone'}`,
      `OCCUPATION: ${char.occupation || ''}`,
      `PERSONALITY: ${char.personality || ''}`,
      `GUIDELINES: ${char.systemPrompt || char.system_prompt || ''}`,
    ].filter(p => !p.endsWith(': '));

    return `### [IDENTITY DNA LOCK: ${dnaParts.join(' | ')} | ANATOMY: Unrestricted biological study]. STUDY ALL PROVIDED REFERENCES FOR 100% LIKENESS. MATCH CHARACTER DNA AND BIOMETRICS EXACTLY. ### `;
  };

  const identityPrefix = buildIdentityDNA(character);

  const anatomyLock = character && (character.metadata?.anatomy_reference_url || character.anatomy_reference_url)
    ? `(ANATOMY LOCK: high anatomical accuracy, detailed realistic genitalia, biological realism, uncensored, ${character.skinTone || character.skin_tone || 'natural'} skin texture:1.5), `
    : '';

  if (character) {
    console.log(`🧬 [DNA Engine] Harvesting total character DNA for ${character.name}...`);
    const allReferences: { url: string; weight: number; model: string; source: string }[] = [];

    // 1. Golden Face Reference
    const faceRef = character.metadata?.face_reference_url || character.face_reference_url || character.faceReferenceUrl;
    if (faceRef) {
      allReferences.push({
        url: faceRef,
        weight: 0.85,
        model: "ip-adapter_plus_face_xl",
        source: "Golden Face"
      });
    }

    // 2. Anatomy Lock Reference
    const anatomyRef = character.metadata?.anatomy_reference_url || character.anatomy_reference_url || character.anatomyReferenceUrl;
    if (anatomyRef) {
      allReferences.push({
        url: anatomyRef,
        weight: 0.85,
        model: "ip-adapter_xl",
        source: "Anatomy Lock"
      });
    }

    // 3. Training Set (Multi-image array)
    const trainingSet = character.images || character.metadata?.images || [];
    if (Array.isArray(trainingSet)) {
      trainingSet.forEach((img: string, idx: number) => {
        allReferences.push({
          url: img,
          weight: 0.7,
          model: "ip-adapter_xl",
          source: `Training Set Image ${idx + 1}`
        });
      });
    }

    // 4. Portfolio/Gallery Feed
    const galleryItems = character.gallery || character.character_gallery || [];
    if (Array.isArray(galleryItems)) {
      galleryItems.forEach((img: any, idx: number) => {
        const url = typeof img === 'string' ? img : img.imageUrl || img.image_url;
        if (url) {
          allReferences.push({
            url: url,
            weight: 0.65,
            model: "ip-adapter_xl",
            source: `Portfolio Image ${idx + 1}`
          });
        }
      });
    }

    // 5. User Provided Context/Feature Image (img2img source)
    if (imageBase64) {
      allReferences.push({
        url: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        weight: 0.8, // Increased for perfect feature clarity
        model: "ip-adapter_xl",
        source: "User Feature Reference"
      });
    }

    // Remove duplicates and cap at 12 to ensure stability
    const uniqueRefs = allReferences.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
    const finalRefs = uniqueRefs.slice(0, 12);

    console.log(`🧬 [DNA Engine] Studying ${finalRefs.length} assets with sharpened feature clarity...`);

    for (const ref of finalRefs) {
      finalControlUnits.push({
        model_name: ref.model,
        weight: ref.weight,
        control_image: ref.url,
        module_name: "none"
      });
    }
  }

  // --- FEATURE SHARPENING (Micro-Step 6) ---
  const featureLock = imageBase64
    ? `(FEATURE CLARITY: high-fidelity transfer of character features and posture:1.4), (MATCH SOURCE BIOMETRICS:1.3), `
    : '';

  // --- PREFERENCE INJECTION (Micro-Step 5) ---
  const poses = character?.metadata?.preferred_poses || character?.preferredPoses || '';
  const environments = character?.metadata?.preferred_environments || character?.preferredEnvironments || '';
  const moods = character?.metadata?.preferred_moods || character?.preferredMoods || '';

  const preferencePrompt = [
    poses ? `(STRICT POSE: ${poses}:1.4)` : '',
    environments ? `(SETTING: ${environments}:1.3)` : '',
    moods ? `(EXPRESSION: ${moods}:1.2)` : ''
  ].filter(Boolean).join(', ');

  // Enhance prompt based on style
  let enhancedPrompt = style === 'realistic'
    ? `(solo:1.6), (1girl:1.6), (ONE CONTINUOUS PHOTOGRAPH:1.4), (ONE FRAME ONLY:1.4), (hyper-focused face:1.4), (sharp detailed eyes:1.4), (ultra-realistic raw photography:1.4), (natural skin textures:1.4), (detailed skin pores:1.3), no collage, no split screen, full screen, ${identityPrefix}${anatomyLock}${featureLock}${preferencePrompt}, ${prompt}, dynamic pose, interesting environment, highly detailed, sharp focus, 8k UHD, authentic raw photo`
    : `(solo:1.6), (1girl:1.6), (ONE CONTINUOUS ILLUSTRATION:1.4), (ONE FRAME ONLY:1.4), (perfect face:1.2), (clear eyes:1.3), (masterpiece anime art:1.3), dynamic anime pose, no collage, no split screen, ${identityPrefix}${anatomyLock}${featureLock}${preferencePrompt}, ${prompt}, high quality anime illustration, masterwork, clean lines, vibrant colors, cel-shaded, professional anime art, detailed scenery`;

  if (enhancedPrompt.length > 2000) {
    enhancedPrompt = enhancedPrompt.substring(0, 2000);
  }

  // Seedream 4.5 with retry logic
  const MAX_RETRIES = 2;
  let lastError: Error | null = null;

  console.log(`🚀 Generating image with Seedream 4.5 (Max ${MAX_RETRIES} attempts)...`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
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
          controlnet_units: finalControlUnits,
          response_image_type: 'url',
          add_watermark: false,
          watermark: false,
          // optimize_prompt_options: {
          //   mode: 'standard'
          // }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          console.log(`✅ Seedream 4.5 succeeded on attempt ${attempt}`);

          let imageUrl = data.images[0];
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
    parts.push('natural indoor lighting, smooth clear skin with flawless features');
    parts.push('(solo:1.4), lone woman taking a photo of herself, ONE SINGLE CONTINUOUS FRAME');
    parts.push('raw digital look, slight camera shake, realistic room background, NO COLLAGE');
    parts.push('unfiltered, sharp focus on face, non-studio lighting, NO SPLIT-VIEW');
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
