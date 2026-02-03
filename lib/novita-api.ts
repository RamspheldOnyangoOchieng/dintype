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
    negativePrompt = '(extra hands:1.6), (three hands:1.6), (deformed limbs:1.5), (mutated fingers:1.5), (extra fingers:1.5), (long body:1.3), (disfigured:1.4), (malformed:1.4), muscular, masculine body, manly features, bodybuilder, strained muscle, man, male, couple, boy, together, two people, sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust, wrinkles, old, aged, grainy, symmetrical face, smooth skin, plastic skin, waxy skin, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, multiview, card, frame, border, watermark, text, logo, signature, letters, numbers, words, typography, font, sign, tattoo, writing, callout, poor background, messy room, cluttered environment, blurred background, low quality, blurry, distorted, deformed genitalia, malformed pussy, distorted private parts, unrealistic anatomy, missing labia, blurry genitals, bad pussy anatomy, ugly, disgusting, distorted face, uneven eyes, unrealistic skin, plastic look, double limbs, broken legs, floating body parts, lowres, error, cropped, worst quality, normal quality, jpeg artifacts, duplicate',
    width = 1600,
    height = 2400,
    steps = 30, // Increased for masterpiece clarity
    seed = -1,
    style = 'realistic',
    guidance_scale = 4.5, // Increased for better prompt adherence
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
    ? `(STRICT ANATOMY LOCK: uncensored high anatomical accuracy, clear and detailed display of private parts, biological realism, intimate detail, ${character.skinTone || character.skin_tone || 'natural'} skin texture:1.6), `
    : '';

  if (character) {
    console.log(`🧬 [DNA Engine] Harvesting total character DNA for ${character.name}...`);
    const allReferences: { url: string; weight: number; model: string; source: string }[] = [];

    // 1. Golden Face Reference (CRITICAL)
    const faceRef = character.metadata?.face_reference_url || character.face_reference_url || character.faceReferenceUrl;
    if (faceRef) {
      allReferences.push({
        url: faceRef,
        weight: 1.1, // OVERMAX weight for the primary identity
        model: "ip-adapter_plus_face_xl",
        source: "Golden Face"
      });
    }

    // 2. Anatomy Lock Reference (Body Structure)
    const anatomyRef = character.metadata?.anatomy_reference_url || character.anatomy_reference_url || character.anatomyReferenceUrl;
    if (anatomyRef) {
      allReferences.push({
        url: anatomyRef,
        weight: 0.65, // Lowered slightly to prevent 'shrugged' stiffness from references
        model: "ip-adapter_xl",
        source: "Anatomy Lock"
      });
    }

    // 3. Training Set (Identity & Likeness Focus)
    const trainingSet = character.images || character.metadata?.images || [];
    if (Array.isArray(trainingSet)) {
      trainingSet.forEach((img: string, idx: number) => {
        allReferences.push({
          url: img,
          weight: 0.85,
          model: "ip-adapter_plus_face_xl", // Face-only model: ignores the outfit
          source: `Training Set Image ${idx + 1}`
        });
      });
    }

    // 4. Portfolio/Gallery Feed (Secondary Identity Support)
    const galleryItems = character.gallery || character.character_gallery || [];
    if (Array.isArray(galleryItems)) {
      galleryItems.forEach((img: any, idx: number) => {
        const url = typeof img === 'string' ? img : img.imageUrl || img.image_url;
        if (url) {
          allReferences.push({
            url: url,
            weight: 0.85, // Tightened: High consistency with portfolio
            model: "ip-adapter_plus_face_xl", // Shifted to face-only model
            source: `Portfolio Image ${idx + 1}`
          });
        }
      });
    }

    // 5. User Provided Context/Feature Image (img2img source)
    if (imageBase64) {
      allReferences.push({
        url: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        weight: 0.8,
        model: "ip-adapter_plus_face_xl",
        source: "User Feature Reference"
      });
    }

    // Remove duplicates and cap at 8 for MAXIMUM IDENTITY FOCUS
    // Too many references can cause 'sick' or 'muddy' faces due to feature blending
    const uniqueRefs = allReferences.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);
    const finalRefs = uniqueRefs.slice(0, 8);

    console.log(`🧬 [DNA Engine] Studying ${finalRefs.length} high-priority assets for perfect likeness...`);

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
  const featureLock = character
    ? `(FACIAL IDENTITY CLARITY: high-fidelity transfer of biometric features:1.7), (MATCH CHARACTER FACE:1.6), (vibrant healthy skin:1.3), (natural healthy complexion:1.3), (relaxed shoulders:1.4), (natural facial expression:1.4), (DISREGARD SOURCE POSTURE: prioritize prompt for body and pose), `
    : '';

  // --- PREFERENCE INJECTION (Micro-Step 5) ---
  const poses = character?.metadata?.preferred_poses || character?.preferred_poses || character?.preferredPoses || '';
  const environments = character?.metadata?.preferred_environments || character?.preferred_environments || character?.preferredEnvironments || '';
  const moods = character?.metadata?.preferred_moods || character?.preferred_moods || character?.preferredMoods || '';
  const promptHook = character?.prompt_hook || character?.metadata?.prompt_hook || '';
  const charNegativeRestrictions = character?.negative_prompt_restrictions || character?.metadata?.negative_prompt_restrictions || '';

  const preferencePrompt = [
    poses ? `(STRICT POSE: ${poses}:1.8)` : '',
    environments ? `(SETTING: ${environments}:1.8)` : '',
    moods ? `(EXPRESSION: ${moods}:1.4)` : '',
  ].filter(Boolean).join(', ');

  // --- PROMPT SANITIZER (Removes selfie triggers) ---
  const sanitizePrompt = (p: string) => {
    return p.replace(/selfie/gi, 'candid photo')
      .replace(/pov/gi, 'third-person view')
      .replace(/holding phone/gi, 'hands on body')
      .replace(/taking a photo/gi, 'posing')
      .replace(/holding camera/gi, 'hands on hips');
  };
  const cleanedPrompt = sanitizePrompt(prompt);

  // --- PERSPECTIVE ENGINE (Natural Mastery Focus - ABSOLUTE THIRD PERSON) ---
  const perspectiveMode = `(professional third-person photography:1.7), (full body shot:1.5), (wide angle:1.6), (remote camera:1.4), (candid from distance:1.4), (hands away from camera:1.6), (hands touching body:1.5), (MANDATORY THIRD-PERSON PERSPECTIVE:1.6), `;

  // Aggressively forbid 'selfie arm' artifacts with MAXIMUM PENALTY
  const perspectiveNegatives = `(extended arm:1.9), (prolonged arm:1.9), (arm in frame:1.8), (reaching towards camera:1.8), (POV selfie arm:1.9), (hand holding camera:1.8), (distorted hand:1.7), (camera in hand:1.7), (selfie photo:1.8), (POV:1.8), (holding phone:1.8), (arm stretching:1.7)`;

  const finalNegativePrompt = `${negativePrompt}${perspectiveNegatives ? `, ${perspectiveNegatives}` : ''}${charNegativeRestrictions ? `, (${charNegativeRestrictions}:1.6)` : ''}`;

  const biometricAnchor = character
    ? `### [BIOMETRIC ANCHOR: (precise facial DNA:1.6), (match training photos:1.5), (locked identity:1.5), ${character.name} face]. ### `
    : '';

  const outfitLiberation = `(PRIORITIZE PROMPT CLOTHING:1.5), (LIBERATE OUTFIT: ignore clothing in references:1.4), (CLOTHING VARIETY:1.3), `;
  const styleHookInfluence = promptHook ? `(STYLE: ${promptHook}:1.1), ` : '';

  // Enhance prompt based on style
  let enhancedPrompt = style === 'realistic'
    ? `(solo:1.6), (1girl:1.6), (feminine body:1.5), (natural female proportions:1.4), ${cleanedPrompt}, ${outfitLiberation}${perspectiveMode}(dynamic composition:1.3), (8k UHD photography:1.4), ${biometricAnchor}${identityPrefix}${anatomyLock}${featureLock}${styleHookInfluence}${preferencePrompt}, (unprocessed digital masterpiece:1.4), (soft skin:1.3), fascinating and sexy, clear and romantic display of private parts, full nudity`
    : `(solo:1.6), (1girl:1.6), ${cleanedPrompt}, ${outfitLiberation}(dynamic pose:1.3), ${biometricAnchor}${identityPrefix}${anatomyLock}${featureLock}${styleHookInfluence}${preferencePrompt}, (masterpiece anime art:1.4), clean aesthetic lines`;

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
          negative_prompt: finalNegativePrompt,
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
    parts.push('professional third-person photography, captured by Canon EOS R5, 85mm lens, f/1.8');
    parts.push('cinematic lighting, elegant masterpiece photography, sharp focus on subject');
    parts.push('(solo:1.4), full body shot, wide angle view, ONE SINGLE CONTINUOUS FRAME');
    parts.push('unprocessed high-fidelity digital photo, realistic environment, NO COLLAGE, NO TEXT');
    parts.push('masterpiece quality, intimate and fascinating, NO SHINING, NO BOKEH ARTIFACTS');
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
