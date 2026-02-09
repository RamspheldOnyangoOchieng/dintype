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
  type?: 'character' | 'banner'; // Add type parameter
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
    type = 'character'
  } = params;

  // Skip DNA Twinning for banners
  const isBanner = type === 'banner';

  // --- FULL-SPECTRUM DNA TWINNING ENGINE ---
  const finalControlUnits = [...controlnet_units];
  const allReferences: { url: string; weight: number; model: string; source: string }[] = [];
  const nativeImageUrls: string[] = [];

  // Helper to construct Character Identity DNA (Textual)
  const buildIdentityDNA = (char: any) => {
    if (!char || isBanner) return '';

    const bodyType = char.bodyType || char.body_type || char.body || 'average';

    // Explicit Body Shape & Bust Mapping for Consistency
    const getBustDNA = (body: string) => {
      const b = body.toLowerCase();
      if (b.includes('curvy')) return 'CURVY: large heavy breasts, full cleavage, hourglass figure';
      if (b.includes('plus')) return 'PROPORTIONAL PLUS: very large breasts, soft body, wide hips';
      if (b.includes('slim')) return 'SLENDER: small firm breasts, petite bust, thin waist';
      if (b.includes('athletic')) return 'ATHLETIC: medium firm breasts, toned bust, fit physique';
      if (b.includes('muscular')) return 'MUSCULAR: small breasts, hard pectorals, defined body';
      return 'NATURAL: medium natural breasts, average bust';
    };

    const dnaParts = [
      `NAME: ${char.name}`,
      `AGE: ${char.age}`,
      `ETHNICITY: ${char.ethnicity || 'mixed'}`,
      `BODY: ${bodyType}`,
      `BUST: ${getBustDNA(bodyType)}`, // Explicit Bust Lock
      `HAIR: ${char.hairStyle || char.hair_style || ''} ${char.hairColor || char.hair_color || 'natural'}`,
      `EYES: ${char.eyeColor || char.eye_color || 'beautiful'}`,
      `SKIN TONE: ${char.skinTone || char.skin_tone || 'natural tone'}`,
      `OCCUPATION: ${char.occupation || ''}`,
      `PERSONALITY: ${char.personality || ''}`,
      `GUIDELINES: ${char.systemPrompt || char.system_prompt || ''}`,
    ].filter(p => !p.endsWith(': ') && !p.endsWith(':'));

    return `### [CHARACTER IDENTITY DNA: ${dnaParts.join(', ')}]. ### `;
  };

  const identityPrefix = buildIdentityDNA(character);

  const anatomyLock = character && (character.metadata?.anatomy_reference_url || character.anatomy_reference_url)
    ? `(STRICT ANATOMY LOCK: uncensored high anatomical accuracy, clear and detailed display of private parts, biological realism, intimate detail, ${character.skinTone || character.skin_tone || 'natural'} skin texture:1.6), `
    : '';

  // --- HARVEST REFERENCE ASSETS (MULTI-SOURCE FUSION MODE) ---
  // Training assets are CRITICAL - they define the character's true appearance
  if (character && !isBanner) {
    console.log(`🧬 [DNA Engine] Initializing ENHANCED Multi-Source Fusion for ${character.name}...`);

    // 1. ANATOMY REFERENCE (Critical for body/genital consistency)
    const anatomyRef = character.metadata?.anatomy_reference_url || character.anatomy_reference_url || character.anatomyReferenceUrl;
    if (anatomyRef) {
      console.log("   - 🔒 Anatomy Lock Active (MAXIMUM WEIGHT)");
      nativeImageUrls.push(anatomyRef);
      // BOOSTED: High weight for structure to ensure anatomy matches reference
      allReferences.push({ url: anatomyRef, weight: 1.2, model: "ip-adapter_xl", source: "Anatomy Lock" });
    }

    // 2. IDENTITY SOURCE - USE MULTIPLE TRAINING IMAGES for stronger likeness
    const availableReferences: string[] = [];

    // a) Add Golden Face if available (PRIORITY)
    const faceRef = character.metadata?.face_reference_url || character.face_reference_url || character.faceReferenceUrl;
    if (faceRef) {
      availableReferences.push(faceRef);
      // Add face ref directly to native URLs with high priority
      nativeImageUrls.push(faceRef);
      console.log("   - 👤 Golden Face Reference Added");
    }

    // b) Add ALL Training Set images for maximum fusion
    const trainingSet = character.images || character.metadata?.images || [];
    if (Array.isArray(trainingSet) && trainingSet.length > 0) {
      console.log(`   - 📸 Found ${trainingSet.length} training images - ADDING ALL for fusion`);
      trainingSet.forEach((img: string, idx: number) => {
        if (img) {
          availableReferences.push(img);
          nativeImageUrls.push(img);
        }
      });
    }

    // Select PRIMARY Master Reference for Face (highest weight)
    if (availableReferences.length > 0) {
      const masterRefIndex = Math.floor(Math.random() * availableReferences.length);
      const masterRefUrl = availableReferences[masterRefIndex];

      console.log(`   - 💎 Primary Master Reference: [Image ${masterRefIndex + 1}]`);

      // BOOSTED: Use this as the PRIMARY identity anchor with MAXIMUM weight
      allReferences.push({
        url: masterRefUrl,
        weight: 2.5, // MAXIMUM BOOST for exact face likeness
        model: "ip-adapter_plus_face_xl",
        source: "Primary Master Reference (Face DNA)"
      });

      // HAIR & HEAD SHAPE ANCHOR - Also boosted
      allReferences.push({
        url: masterRefUrl,
        weight: 1.8, // BOOSTED for hair and style match
        model: "ip-adapter_xl",
        source: "Primary Master Reference (Hair/Style)"
      });

      // 3. ADD SECONDARY REFERENCES for reinforcement
      // Pick up to 2 more training images to reinforce the identity
      const secondaryRefs = availableReferences.filter((_, i) => i !== masterRefIndex).slice(0, 2);
      secondaryRefs.forEach((refUrl, idx) => {
        allReferences.push({
          url: refUrl,
          weight: 1.5, // Strong secondary weight
          model: "ip-adapter_plus_face_xl",
          source: `Secondary Reference ${idx + 1} (Reinforcement)`
        });
        console.log(`   - 🔗 Secondary Reference ${idx + 1} added for reinforcement`);
      });
    }

    // Populate ControlNets based on our enhanced selection
    allReferences.forEach(ref => {
      finalControlUnits.push({
        model_name: ref.model,
        weight: ref.weight,
        control_image: ref.url,
        module_name: "none"
      });
    });

    console.log(`   - ✅ Total references in fusion: ${allReferences.length}, Native URLs: ${nativeImageUrls.length}`);
  }

  const fusedImageUrls = Array.from(new Set(nativeImageUrls)).slice(0, 14);

  const skinToneVal = character?.skinTone || character?.skin_tone || 'natural';
  const isPale = /white|fair|pale|light/i.test(skinToneVal);
  const skinToneLock = (character && !isBanner)
    ? `(STRICT SKIN TONE MATCH:1.9), (IDENTICAL COMPLEXION:1.8), (${skinToneVal} skin:1.8), ${isPale ? '(very white skin:1.8), (pale complexion:1.7), (no tan:1.6), ' : ''}`
    : '';

  // --- FEATURE SHARPENING ---
  // Build explicit hair DNA from character data
  const hairStyleDNA = (character && !isBanner) ? (() => {
    const style = character.hairStyle || character.hair_style || '';
    const color = character.hairColor || character.hair_color || '';
    const length = style.toLowerCase().includes('long') ? 'long'
      : style.toLowerCase().includes('short') ? 'short'
        : style.toLowerCase().includes('medium') ? 'medium' : '';
    return `(EXACT HAIR MATCH:2.0), (${color} hair:1.9), (${style} hairstyle:1.9), ${length ? `(${length} hair:1.8), ` : ''}(IDENTICAL HAIR FROM TRAINING:2.0), (COPY REFERENCE HAIR EXACTLY:1.9), `;
  })() : '';

  const featureLock = (character && !isBanner)
    ? `(FACIAL IDENTITY CLARITY: strict biometric replication:2.0), (EXACT COPY OF REFERENCE:2.0), (SAME PERSON:2.0), (IDENTICAL BIOMETRICS:2.0), ${hairStyleDNA}${skinToneLock}(consistent anatomy:1.8), (vibrant skin texture:1.6), (STRICT CONSISTENT BUST SIZE:2.0), (LOCKED BODY PROPORTIONS:1.9), (TRAINING IMAGE FEATURES:2.0), `
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
  const perspectiveNegatives = `(extra hands:3.0), (three hands:3.0), (ghost hands:3.0), (extra arms:3.0), (detached limbs:3.0), (floating feet:3.0), (disconnected body parts:3.0), (extra legs:3.0), (leg emerging from back:3.0), (arm emerging from back:3.0), (extended arm:2.0), (prolonged arm:2.0), (arm in frame:1.8), (reaching towards camera:1.8), (POV selfie arm:2.0), (hand holding camera:1.8), (distorted hand:1.7), (camera in hand:1.7), (selfie photo:2.0), (POV:2.0), (holding phone:2.0), (arm stretching:1.7)`;

  const varietyEngine = `(high variety of poses:1.1), (dynamic body physics:1.2), `;

  const anatomyGuardrail = `(cleanly human:2.0), (coherent physical form:2.0), (limbs attached to torso:1.9), (anatomically logical:1.9), (correct number of limbs:1.9), (perfectly placed body parts:1.9), (no extra parts:1.9), (biological integrity:1.8), `;

  const defaultNegatives = '(anime:3.5), (cartoon:3.5), (manga:3.5), (illustration:3.5), (drawing:3.5), (painted:3.5), (digital art style:3.0), (cel shading:3.0), (line art:3.0), (comic:3.0), (stylized:3.0), (2d:3.0), (animated:3.0), (disney style:3.0), (pixar style:3.0), (game art:3.0), (concept art:3.0), (large anime eyes:3.5), (anime face:3.5), (manga style:3.5), (plastic skin:3.0), (waxy skin:3.0), (airbrushed skin:2.5), (smooth doll skin:2.5), (mannequin look:2.5), (CGI look:2.5), (artificial skin:2.5), (porcelain skin:2.0), (over-smooth texture:2.0), (shiny plastic:2.5), (rubbery texture:2.5), (synthetic look:2.5), (extra limbs:3.0), (multiple legs:3.0), (extra arms:3.0), (three legs:3.0), (three arms:3.0), (extra hands:3.0), (three hands:3.0), (ghost hands:3.0), (mutated body:2.0), (broken body:2.0), (extra fingers:2.0), (mutated fingers:2.0), (fused fingers:2.0), (deformed limbs:2.0), (long neck:1.8), (distorted body:1.8), (disfigured:1.5), (malformed:1.5), (anatomical error:2.0), (extra head:2.5), (misplaced belly:2.0), muscular, masculine body, manly features, bodybuilder, strained muscle, man, male, couple, boy, together, two people, sparkles, bloom, bokeh, ethereal, glowing, backlight, sun flare, glares, light artifacts, glitter, lens flare, bright spots, floating particles, magic glow, fairy dust, wrinkles, old, aged, grainy, symmetrical face, collage, grid, split view, two images, multiple images, diptych, triptych, multiple views, several views, watermark, text, logo, signature, letters, numbers, words, typography, font, sign, tattoo, writing, callout, poor background, messy room, cluttered environment, blurred background, low quality, blurry, distorted, deformed genitalia, malformed pussy, distorted private parts, unrealistic anatomy, missing labia, blurry genitals, bad pussy anatomy, ugly, disgusting, distorted face, uneven eyes, unrealistic skin, plastic look, double limbs, broken legs, floating body parts, lowres, error, cropped, worst quality, normal quality, jpeg artifacts, duplicate';
  const isNudeRequest = containsNSFW(cleanedPrompt);
  const nudityLock = isNudeRequest
    ? `(erotic masterpiece:1.6), (completely naked:1.9), (no clothes:1.9), (uncovered skin:1.7), (detailed anatomy:1.8), (smoothed structured anatomy:1.7), (clean well-defined biological structure:1.7), (perfect realistic breast form:1.7), (detailed nipples and teats:1.6), (detailed realistic pussy:1.8), (hyper-realistic vulva:1.7), (natural pussy texture:1.7), (high variety of erotic poses:1.6), `
    : '';
  const nudityNegatives = isNudeRequest
    ? `, clothing, underwear, panties, bra, lingerie, swimsuit, bikini, fabric, shirt, pants, skirt, outfit`
    : '';

  const finalNegativePrompt = `${perspectiveNegatives}, ${defaultNegatives}${userNegativePrompt ? `, ${userNegativePrompt}` : ''}${charNegativeRestrictions ? `, (${charNegativeRestrictions}:1.6)` : ''}${nudityNegatives}`;

  const biometricAnchor = (character && !isBanner)
    ? `### [BIOMETRIC ANCHOR: (precise facial DNA:2.0), (match training photos:1.8), (locked identity:1.9), (100% identical face:1.9), (consistent skin tone:1.8), ${character.name} face]. ### `
    : '';

  const clothingKeywords = /\b(wearing|dressed|outfit|clothes|shirt|pants|dress|swimsuit|bikini|lingerie|suit|jacket|top|bottom|skirt|blouse)\b/i;
  const hasSpecificClothing = clothingKeywords.test(cleanedPrompt);

  const outfitLogic = hasSpecificClothing
    ? `(PRIORITIZE PROMPT CLOTHING:1.6), (LIBERATE OUTFIT: ignore clothing in references:1.5), `
    : `(MATCH REFERENCE OUTFIT:1.4), (CONSISTENT CLOTHING:1.3), (SAME OUTFIT AS ASSET:1.3), `;
  const styleHookInfluence = promptHook ? `(STYLE: ${promptHook}:1.1), ` : '';

  // ENHANCED IMG2IMG SYNC - Preserves ALL features from training assets including hairstyle
  const img2imgSync = imageBase64
    ? `(STRICT POSE SYNC: match source image composition and background:1.6), (DEEP RESKIN: apply character DNA to provided template:1.7), (PRESERVE ALL TRAINING FEATURES:1.9), (EXACT HAIR FROM REFERENCES:1.8), (MATCH REFERENCE HAIRSTYLE:1.9), (IDENTICAL PHYSICAL FEATURES:1.8), (COPY TRAINING ASSET APPEARANCE:1.9), `
    : (character ? `(MATCH ALL TRAINING FEATURES:1.8), (EXACT HAIRSTYLE FROM REFERENCES:1.9), (COPY REFERENCE APPEARANCE:1.8), (IDENTICAL TO TRAINING IMAGES:1.9), ` : '');
  const anatomyEngine = `(perfectly detailed biological anatomy:1.7), (smoothed structured anatomy:1.8), (clean well-defined biological structure:1.7), (STRICT BUST AND TEAT CONSISTENCY:2.0), (IDENTICAL BODY DNA:1.9), (exact reference replication:1.8), (realistic physiological details:1.6), (high-fidelity private parts:1.6), (biological precision:1.6), `;

  // HYPER-REALISM SKIN ENGINE - Combats plastic/artificial look
  const skinRealismEngine = `(natural human skin texture:1.8), (visible skin pores:1.6), (subsurface skin scattering:1.5), (realistic skin imperfections:1.4), (natural skin oils:1.3), (real human complexion:1.7), (organic skin surface:1.6), (epidermis detail:1.5), (authentic flesh tones:1.6), (living skin:1.5), `;

  // BANNER-SPECIFIC SFW NEGATIVES - No intimate content for commercial banners
  const bannerSFWNegatives = `(nudity:3.0), (naked:3.0), (nude:3.0), (nsfw:3.0), (explicit:3.0), (erotic:3.0), (sexy pose:2.5), (seductive:2.5), (intimate:2.5), (suggestive:2.5), (provocative:2.5), (revealing clothing:2.0), (cleavage:2.0), (lingerie:2.5), (underwear:2.5), (bikini:2.0), (exposed skin:2.0), (adult content:3.0), (sexual:3.0), (sensual:2.5), (bedroom:2.0), (bed:1.8), (laying down:1.5), (spreading legs:3.0), (exotic pose:2.5), (seductive eyes:2.0), (bedroom eyes:2.0), (woman:2.5), (girl:2.5), (lady:2.5), (female:2.5), (person:2.0), (human figure:2.0), (model:2.0)`;

  let enhancedPrompt = "";

  if (isBanner) {
    // STRICT SFW COMMERCIAL BANNER - No people, focus on environments and abstract visuals
    enhancedPrompt = `${cleanedPrompt}, (professional commercial advertisement:1.7), (brand marketing visual:1.6), (corporate photography:1.5), (luxury product showcase:1.4), (abstract design:1.3), (scenic landscape:1.4), (architectural photography:1.3), (geometric patterns:1.2), (premium texture:1.3), (high-end editorial:1.4), (magazine cover quality:1.3), (clean minimalist design:1.4), (sophisticated color palette:1.3), (elegant composition:1.4), (professional lighting:1.5), (commercial grade quality:1.4), (advertising campaign:1.3), (8k UHD:1.3), (sharp focus:1.4), (depth of field:1.3), NO PEOPLE, NO HUMANS, NO FIGURES, abstract art, product photography, scenic view, architectural detail, texture close-up`;
  } else {
    // MANDATORY PHOTOREALISM ANCHOR - Applied to ALL character generations
    const photoRealismAnchor = `(MANDATORY PHOTOREALISTIC:2.0), (real photograph:1.9), (camera shot:1.8), (NOT anime:2.5), (NOT cartoon:2.5), (NOT illustration:2.5), (NOT drawing:2.5), (real human being:1.8), (actual person:1.7), `;

    // TRAINING ASSET PRIORITY - Force the model to honor reference images
    const trainingAssetPriority = character ? `(STRICT REFERENCE MATCH:2.0), (COPY TRAINING IMAGES:1.9), (IDENTICAL TO REFERENCE PHOTOS:1.8), (EXACT LIKENESS:1.9), ` : '';

    enhancedPrompt = style === 'realistic'
      ? `${photoRealismAnchor}${trainingAssetPriority}${img2imgSync}${cleanedPrompt}, (RAW unedited photo:1.8), (photorealistic:2.0), (EXACT CHARACTER MATCH:1.6), ${skinRealismEngine}${identityPrefix}${biometricAnchor}${featureLock}(solo:1.6), (1girl:1.6), (feminine body:1.5), ${outfitLogic}${anatomyGuardrail}${nudityLock}${perspectiveMode}${anatomyLock}${styleHookInfluence}${preferencePrompt}, (unprocessed digital masterpiece:1.5), (natural soft skin:1.4), (realistic skin texture:1.6), fascinating and sexy, ${anatomyEngine}explicit details, full nudity, ultra-detailed anatomy, (no airbrushing:1.8), (no digital smoothing:1.7), (film grain:1.2), (REAL PHOTOGRAPH NOT ART:2.0)`
      : `${photoRealismAnchor}(solo:1.6), (1girl:1.6), ${cleanedPrompt}, (semi-realistic art:1.5), ${outfitLogic}${perspectiveMode}(dynamic pose:1.3), ${biometricAnchor}${identityPrefix}${anatomyLock}${featureLock}${styleHookInfluence}${preferencePrompt}, clean aesthetic lines, (realistic proportions:1.4)`;
  }

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
          negative_prompt: isBanner ? `${finalNegativePrompt}, ${bannerSFWNegatives}` : finalNegativePrompt,
          size: `${width}x${height}`,
          seed: seed === -1 ? Math.floor(Math.random() * 2147483647) : seed,
          steps: steps,
          guidance_scale: guidance_scale,
          image_urls: fusedImageUrls,
          image_base64: finalBase64 || undefined,
          strength: finalBase64 ? 0.7 : undefined, // Optimized to 0.7 for "Proper & Deeper" reskinning
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
