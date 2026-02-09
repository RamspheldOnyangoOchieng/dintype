/**
 * Novita AI Image Generation API Client
 * Uses Seedream 4.5 exclusively for masterpiece-quality image generation
 */

import { getUnifiedNovitaKey } from "./unified-api-keys"
import { containsNSFW } from "./nsfw-filter";

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
    negativePrompt: userNegativePrompt = "",
    width = 1600,
    height = 2400,
    steps = 30,
    seed = -1,
    style = 'realistic',
    guidance_scale = 4.5,
    controlnet_units = [],
    character,
    imageBase64,
  } = params;

  // --- FULL-SPECTRUM DNA TWINNING ENGINE ---
  const finalControlUnits = [...controlnet_units];
  const allReferences: { url: string; weight: number; model: string; source: string }[] = [];
  const nativeImageUrls: string[] = [];

  // Helper to construct Character Identity DNA (Textual)
  const buildIdentityDNA = (char: any) => {
    if (!char) return '';
    const dnaParts = [
      `NAME: ${char.name}`,
      `AGE: ${char.age}`,
      `ETHNICITY: ${char.ethnicity || 'mixed'}`,
      `BODY: ${char.bodyType || char.body_type || char.body || 'average'}`,
      `HAIR: ${char.hairStyle || char.hair_style || ''} ${char.hairColor || char.hair_color || 'natural'}`,
      `EYES: ${char.eyeColor || char.eye_color || 'beautiful'}`,
      `SKIN TONE: ${char.skinTone || char.skin_tone || 'natural tone'}`,
      `OCCUPATION: ${char.occupation || ''}`,
      `PERSONALITY: ${char.personality || ''}`,
      `GUIDELINES: ${char.systemPrompt || char.system_prompt || ''}`,
    ].filter(p => !p.endsWith(': ') && !p.endsWith(':'));

    return `### [CHARACTER: ${dnaParts.join(', ')}]. ### `;
  };

  const identityPrefix = buildIdentityDNA(character);

  const anatomyLock = character && (character.metadata?.anatomy_reference_url || character.anatomy_reference_url)
    ? `(STRICT ANATOMY LOCK: uncensored high anatomical accuracy, clear and detailed display of private parts, biological realism, intimate detail, ${character.skinTone || character.skin_tone || 'natural'} skin texture:1.6), `
    : '';

  // --- HARVEST REFERENCE ASSETS (SINGLE SOURCE MODE) ---
  if (character) {
    console.log(`🧬 [DNA Engine] initializing Single-Source Replication for ${character.name}...`);

    // 1. ANATOMY REFERENCE (Critical for body/genital consistency)
    const anatomyRef = character.metadata?.anatomy_reference_url || character.anatomy_reference_url || character.anatomyReferenceUrl;
    if (anatomyRef) {
      console.log("   - 🔒 Anatomy Lock Active");
      nativeImageUrls.push(anatomyRef);
      // High weight for structure to ensure anatomy matches reference
      allReferences.push({ url: anatomyRef, weight: 0.85, model: "ip-adapter_xl", source: "Anatomy Lock" });
    }

    // 2. IDENTITY SOURCE (Pick STRICTLY ONE from the pool to avoid blending/averaging)
    const availableReferences: string[] = [];

    // a) Add Golden Face if available
    const faceRef = character.metadata?.face_reference_url || character.face_reference_url || character.faceReferenceUrl;
    if (faceRef) availableReferences.push(faceRef);

    // b) Add Training Set (Pick ONE random for master context)
    const trainingSet = character.images || character.metadata?.images || [];
    if (Array.isArray(trainingSet)) {
      trainingSet.forEach((img: string) => {
        if (img) availableReferences.push(img);
      });
    }

    // Select ONE Master Reference
    if (availableReferences.length > 0) {
      // If we have a dedicated Face Ref, use it 40% of the time, otherwise pick from training set for variety
      // OR, per user request: "exact one of the images in the training set". 
      // We will perform a purely random selection from ALL valid references to ensure precise replication of that specific shot.
      const masterRefIndex = Math.floor(Math.random() * availableReferences.length);
      const masterRefUrl = availableReferences[masterRefIndex];

      console.log(`   - 💎 Selected Master Reference: [Image ${masterRefIndex + 1}]`);
      nativeImageUrls.push(masterRefUrl);

      // Use this SINGLE image as the heavy lifter for Identity
      allReferences.push({
        url: masterRefUrl,
        weight: 1.8, // Boosted to 1.8 for exact likeness
        model: "ip-adapter_plus_face_xl",
        source: "Master Context Reference (Face)"
      });

      // HAIR & HEAD SHAPE ANCHOR
      allReferences.push({
        url: masterRefUrl,
        weight: 1.2, // Boosted to 1.2 for hair and style match
        model: "ip-adapter_xl",
        source: "Master Context Reference (Hair/Style)"
      });
    }

    // 3. (Optional) Portfolio Consistency - strictly limited to NOT dilute the master ref
    // We do NOT add these to the active reference list to prevent blending artifacts.
    // The "Single Source" philosophy means we ignore the rest of the gallery for this specific generation.

    // Populate ControlNets based on our strict selection (max 2 items: Anatomy + Master Ref)
    allReferences.forEach(ref => {
      finalControlUnits.push({
        model_name: ref.model,
        weight: ref.weight,
        control_image: ref.url,
        module_name: "none"
      });
    });
  }

  const fusedImageUrls = Array.from(new Set(nativeImageUrls)).slice(0, 14);

  const skinToneVal = character?.skinTone || character?.skin_tone || 'natural';
  const isPale = /white|fair|pale|light/i.test(skinToneVal);
  const skinToneLock = character
    ? `(STRICT SKIN TONE MATCH:1.9), (IDENTICAL COMPLEXION:1.8), (${skinToneVal} skin:1.8), ${isPale ? '(very white skin:1.8), (pale complexion:1.7), (no tan:1.6), ' : ''}`
    : '';

  // --- FEATURE SHARPENING ---
  const featureLock = character
    ? `(FACIAL IDENTITY CLARITY: strict biometric replication:1.9), (EXACT COPY OF REFERENCE:1.8), (SAME PERSON:1.9), (IDENTICAL BIOMETRICS:1.9), (IDENTICAL HAIR STYLE:1.8), ${skinToneLock}(consistent anatomy:1.7), (vibrant skin texture:1.5), (consistent breast form:1.4), `
    : '';

  // --- PREFERENCE INJECTION ---
  const poses = character?.metadata?.preferred_poses || character?.preferred_poses || character?.preferredPoses || '';
  const environments = character?.metadata?.preferred_environments || character?.preferred_environments || character?.preferredEnvironments || '';
  const moods = character?.metadata?.preferred_moods || character?.preferred_moods || character?.preferredMoods || '';
  const promptHook = character?.prompt_hook || character?.metadata?.prompt_hook || '';
  const charNegativeRestrictions = character?.negative_prompt_restrictions || character?.metadata?.negative_prompt_restrictions || '';

  const preferencePrompt = [
    poses ? `(suggested pose: ${poses}:1.1)` : '',
    environments ? `(suggested environment: ${environments}:1.1)` : '',
    moods ? `(suggested mood: ${moods}:1.1)` : '',
  ].filter(Boolean).join(', ');

  const sanitizePrompt = (p: string) => {
    return p.replace(/selfie/gi, 'candid photo')
      .replace(/pov/gi, 'third-person view')
      .replace(/holding phone/gi, 'hands on body')
      .replace(/taking a photo/gi, 'posing')
      .replace(/holding camera/gi, 'hands on hips');
  };
  const cleanedPrompt = sanitizePrompt(prompt);

  const perspectiveMode = `(professional third-person photography:1.7), (dynamic camera angles:1.6), (cinematic perspectives:1.5), (full body shot:1.5), (wide angle:1.6), (remote camera:1.4), (candid from distance:1.4), (hands away from camera:1.6), (hands touching body:1.5), (MANDATORY THIRD-PERSON PERSPECTIVE:1.6), `;
  const perspectiveNegatives = `(extended arm:1.9), (prolonged arm:1.9), (arm in frame:1.8), (reaching towards camera:1.8), (POV selfie arm:1.9), (hand holding camera:1.8), (distorted hand:1.7), (camera in hand:1.7), (selfie photo:1.8), (POV:1.8), (holding phone:1.8), (arm stretching:1.7)`;

  const varietyEngine = `(high variety of poses:1.1), (dynamic body physics:1.2), `;

  const anatomyGuardrail = `(cleanly human:2.0), (anatomically correct:1.9), (physiologically sound:1.8), (natural human skeletal structure:1.8), (correct number of limbs:1.9), (perfectly placed body parts:1.9), (no extra parts:1.9), (biological integrity:1.8), `;

  const defaultNegatives = '(extra limbs:3.0), (multiple limbs:3.0), (extra legs:3.0), (extra arms:3.0), (detached limbs:2.5), (floating limbs:2.5), (misplaced anatomy:2.5), (mutated body:2.0), (broken body:2.0), (extra hands:2.5), (three hands:2.5), (extra fingers:2.0), (mutated fingers:2.0), (fused fingers:2.0), (deformed limbs:2.0), (long neck:1.8), (distorted body:1.8), (disfigured:1.5), (malformed:1.5), (anatomical error:2.0), (extra head:2.5), (no anime, no drawing, no illustration, no painting, no 3d render:2.5), muscular, masculine body, manly features, bodybuilder, strained muscle, man, male, couple, boy, together, two people, sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust, wrinkles, old, aged, grainy, symmetrical face, smooth skin, plastic skin, waxy skin, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, several views, watermark, text, logo, signature, letters, numbers, words, typography, font, sign, tattoo, writing, callout, poor background, messy room, cluttered environment, blurred background, low quality, blurry, distorted, deformed genitalia, malformed pussy, distorted private parts, unrealistic anatomy, missing labia, blurry genitals, bad pussy anatomy, ugly, disgusting, distorted face, uneven eyes, unrealistic skin, plastic look, double limbs, broken legs, floating body parts, lowres, error, cropped, worst quality, normal quality, jpeg artifacts, duplicate';
  const isNudeRequest = containsNSFW(cleanedPrompt);
  const nudityLock = isNudeRequest
    ? `(erotic masterpiece:1.6), (completely naked:1.9), (no clothes:1.9), (uncovered skin:1.7), (detailed anatomy:1.8), (smoothed structured anatomy:1.7), (clean well-defined biological structure:1.7), (perfect realistic breast form:1.7), (detailed nipples and teats:1.6), (detailed realistic pussy:1.8), (hyper-realistic vulva:1.7), (natural pussy texture:1.7), (high variety of erotic poses:1.6), `
    : '';
  const nudityNegatives = isNudeRequest
    ? `, clothing, underwear, panties, bra, lingerie, swimsuit, bikini, fabric, shirt, pants, skirt, outfit`
    : '';

  const finalNegativePrompt = `${defaultNegatives}${userNegativePrompt ? `, ${userNegativePrompt}` : ''}${perspectiveNegatives ? `, ${perspectiveNegatives}` : ''}${charNegativeRestrictions ? `, (${charNegativeRestrictions}:1.6)` : ''}${nudityNegatives}`;

  const biometricAnchor = character
    ? `### [BIOMETRIC ANCHOR: (precise facial DNA:2.0), (match training photos:1.8), (locked identity:1.9), (100% identical face:1.9), (consistent skin tone:1.8), ${character.name} face]. ### `
    : '';

  const outfitLiberation = `(PRIORITIZE PROMPT CLOTHING:1.5), (LIBERATE OUTFIT: ignore clothing in references:1.4), (CLOTHING VARIETY:1.3), `;
  const styleHookInfluence = promptHook ? `(STYLE: ${promptHook}:1.1), ` : '';

  const anatomyEngine = `(perfectly detailed biological anatomy:1.7), (smoothed structured anatomy:1.8), (clean well-defined biological structure:1.7), (perfect breast and teat form:1.6), (exact reference replication:1.6), (realistic physiological details:1.6), (high-fidelity private parts:1.6), (biological precision:1.6), `;

  let enhancedPrompt = style === 'realistic'
    ? `${cleanedPrompt}, (RAW photo:1.4), (photorealistic:1.5), (masterpiece:1.3), ${identityPrefix}${biometricAnchor}${featureLock}(solo:1.6), (1girl:1.6), (feminine body:1.5), ${outfitLiberation}${anatomyGuardrail}${nudityLock}${perspectiveMode}${anatomyLock}${styleHookInfluence}${preferencePrompt}, (unprocessed digital masterpiece:1.4), (soft skin:1.3), fascinating and sexy, ${anatomyEngine}explicit details, full nudity, ultra-detailed anatomy`
    : `(solo:1.6), (1girl:1.6), ${cleanedPrompt}, (masterpiece anime art:1.5), ${outfitLiberation}${perspectiveMode}(dynamic pose:1.3), ${biometricAnchor}${identityPrefix}${anatomyLock}${featureLock}${styleHookInfluence}${preferencePrompt}, clean aesthetic lines`;

  if (enhancedPrompt.length > 2000) enhancedPrompt = enhancedPrompt.substring(0, 2000);

  // Pre-process image to base64 if it's a URL
  let finalBase64 = imageBase64;
  if (imageBase64 && imageBase64.startsWith('http')) {
    try {
      const res = await fetch(imageBase64);
      const buffer = await res.arrayBuffer();
      finalBase64 = Buffer.from(buffer).toString('base64');
    } catch (e) {
      console.warn("⚠️ Failed to fetch source image for base64 conversion, using raw source", e);
    }
  } else if (imageBase64) {
    finalBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  }

  const MAX_RETRIES = 2;
  let lastError: Error | null = null;

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
          image_urls: fusedImageUrls,
          image_base64: finalBase64 || undefined,
          strength: finalBase64 ? 0.8 : undefined,
          controlnet_units: finalControlUnits,
          response_image_type: 'url',
          add_watermark: false,
          watermark: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.images && data.images.length > 0) {
          let imageUrl = data.images[0];
          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            imageUrl = `data:image/jpeg;base64,${imageUrl}`;
          }
          return { url: imageUrl, seed: seed, width: width, height: height };
        } else {
          throw new Error('No images returned from Seedream 4.5');
        }
      } else {
        const errorText = await response.text();
        lastError = new Error(`Seedream 4.5 error: ${errorText}`);
      }
    } catch (error: any) {
      lastError = new Error(error.name === 'AbortError' ? 'Request timed out' : error.message);
    }
    if (attempt < MAX_RETRIES) await new Promise(r => setTimeout(r, 1000));
  }
  throw lastError || new Error('Image generation failed after all retries');
}

export function buildAttributePrompt(attributes: {
  age?: string;
  ethnicity?: string;
  bodyType?: string;
  style?: 'realistic' | 'anime';
}): string {
  const { age, ethnicity, bodyType, style = 'realistic' } = attributes;
  const parts: string[] = [];
  if (style === 'realistic') {
    parts.push('attractive female avatar with life-like, ultra-realistic features, skin texture, and proportions');
    parts.push('idealized, polished, and highly desirable');
    parts.push('resembles a real person');
  } else {
    parts.push('attractive female avatar with anime-style features');
    parts.push('larger expressive eyes, stylized proportions, and vibrant color tones');
    parts.push('bold, artistic, and idealized for fantasy appeal');
  }
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
    } catch (error) {
      console.error(`Failed for ${category}: ${value}`, error);
    }
  }
  return results;
}
