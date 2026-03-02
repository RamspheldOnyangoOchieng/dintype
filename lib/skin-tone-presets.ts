/**
 * Deterministic Skin Tone Preset System
 * Version 1.0 - Locked Skin Tone Cluster for Rendering Control
 * 
 * This system uses:
 * - Numeric melanin scalar (0-1) for precise control
 * - CIELAB and HEX ranges for shader precision
 * - Non-overlapping primary bands to reduce blending errors
 * - Enforcement policy to prevent cross-range interpolation
 */

export interface SkinTonePreset {
  melanin_index_range: [number, number];
  cielab_range: {
    L: [number, number];
    a: [number, number];
    b: [number, number];
  };
  srgb_hex_range_examples: string[];
  undertone_bias: string[];
  prompt_keywords: string[];
  negative_keywords: string[];
  skin_description: string;
}

export interface SkinToneConfig {
  version: string;
  preset_type: string;
  color_space: string;
  interpolation_policy: {
    allow_cross_cluster_blend: boolean;
    lock_melanin_range: boolean;
    clamp_out_of_range_values: boolean;
  };
  skin_tone_presets: Record<string, SkinTonePreset>;
}

/**
 * Deterministic Skin Tone Configuration
 * Designed for strict rendering control without cross-cluster blending
 */
export const SKIN_TONE_CONFIG: SkinToneConfig = {
  version: "1.0",
  preset_type: "locked_skin_tone_cluster",
  color_space: "CIELAB + sRGB",
  interpolation_policy: {
    allow_cross_cluster_blend: false,
    lock_melanin_range: true,
    clamp_out_of_range_values: true
  },
  skin_tone_presets: {
    caucasian: {
      melanin_index_range: [0.15, 0.32],
      cielab_range: {
        L: [68, 85],
        a: [6, 18],
        b: [12, 22]
      },
      srgb_hex_range_examples: ["#F6D5C3", "#EBC1A3", "#D8A98C", "#C68663"],
      undertone_bias: ["cool", "neutral", "pink"],
      prompt_keywords: [
        "caucasian woman", "white woman", "european woman", "fair skin", "light skin",
        "pale complexion", "porcelain skin", "ivory skin", "cream colored skin",
        "light beige skin", "rosy complexion", "pink undertones"
      ],
      negative_keywords: [
        "dark skin", "brown skin", "black skin", "tan skin", "olive skin",
        "golden skin", "caramel skin", "ebony skin", "chocolate skin"
      ],
      skin_description: "fair porcelain skin with light pink undertones, smooth ivory complexion, light caucasian skin tone"
    },

    latina: {
      melanin_index_range: [0.30, 0.55],
      cielab_range: {
        L: [55, 70],
        a: [8, 20],
        b: [18, 32]
      },
      srgb_hex_range_examples: ["#D6A57A", "#C48A64", "#B37452", "#9F5F3F"],
      undertone_bias: ["warm", "golden", "neutral"],
      prompt_keywords: [
        "latina woman", "hispanic woman", "latin american woman", "warm tan skin",
        "golden brown skin", "bronze skin", "honey colored skin", "caramel complexion",
        "sun-kissed skin", "warm olive undertones", "mestizo skin tone"
      ],
      negative_keywords: [
        "pale skin", "fair skin", "white skin", "dark black skin", "ebony skin",
        "porcelain skin", "ivory skin", "very dark skin"
      ],
      skin_description: "warm golden-brown skin with honey undertones, sun-kissed latina complexion, caramel bronze skin tone"
    },

    asian: {
      melanin_index_range: [0.20, 0.45],
      cielab_range: {
        L: [60, 78],
        a: [4, 14],
        b: [16, 30]
      },
      srgb_hex_range_examples: ["#F1D1B3", "#E2B98F", "#D3A575", "#BE8C5F"],
      undertone_bias: ["yellow", "neutral", "olive"],
      prompt_keywords: [
        "asian woman", "east asian woman", "japanese woman", "korean woman", "chinese woman",
        "light golden skin", "warm beige skin", "yellow undertones", "light tan skin",
        "creamy skin", "soft golden complexion", "light olive skin"
      ],
      negative_keywords: [
        "dark skin", "black skin", "ebony skin", "deep brown skin", "pale white skin",
        "pink undertones", "very dark complexion"
      ],
      skin_description: "smooth light golden skin with warm yellow undertones, soft creamy asian complexion, delicate beige skin tone"
    },

    african: {
      melanin_index_range: [0.55, 0.95],
      cielab_range: {
        L: [25, 50],
        a: [10, 24],
        b: [12, 28]
      },
      srgb_hex_range_examples: ["#8D5524", "#6F3E1E", "#4B2E1A", "#2C1B12"],
      undertone_bias: ["warm", "red", "neutral"],
      prompt_keywords: [
        "african woman", "black woman", "dark skin woman", "ebony skin", "deep brown skin",
        "rich dark complexion", "chocolate skin", "mahogany skin", "deep melanin skin",
        "warm dark undertones", "beautiful dark skin", "high melanin"
      ],
      negative_keywords: [
        "pale skin", "fair skin", "white skin", "light skin", "tan skin",
        "golden skin", "beige skin", "ivory skin", "cream skin"
      ],
      skin_description: "rich deep ebony skin with warm brown undertones, beautiful dark African complexion, high melanin dark skin tone"
    },

    indian: {
      melanin_index_range: [0.40, 0.75],
      cielab_range: {
        L: [45, 65],
        a: [8, 20],
        b: [18, 34]
      },
      srgb_hex_range_examples: ["#C68642", "#A66A3F", "#8C4F2B", "#6E3B20"],
      undertone_bias: ["golden", "olive", "warm"],
      prompt_keywords: [
        "indian woman", "south asian woman", "desi woman", "brown skin", "warm brown complexion",
        "golden brown skin", "olive brown skin", "dusky skin", "wheatish complexion",
        "medium dark skin", "copper undertones", "rich brown skin"
      ],
      negative_keywords: [
        "pale skin", "fair skin", "white skin", "very dark skin", "ebony skin",
        "porcelain skin", "ivory skin", "black skin"
      ],
      skin_description: "warm golden-brown skin with rich olive undertones, beautiful dusky indian complexion, copper brown skin tone"
    },

    // Middle Eastern / Arab
    arab: {
      melanin_index_range: [0.25, 0.50],
      cielab_range: {
        L: [55, 75],
        a: [6, 16],
        b: [16, 28]
      },
      srgb_hex_range_examples: ["#E8C49A", "#D4A574", "#C08A5C", "#A67245"],
      undertone_bias: ["olive", "warm", "golden"],
      prompt_keywords: [
        "arab woman", "middle eastern woman", "persian woman", "mediterranean woman",
        "olive skin", "warm olive complexion", "light brown skin", "golden olive skin",
        "sun-kissed mediterranean skin", "warm beige brown skin"
      ],
      negative_keywords: [
        "pale skin", "fair skin", "dark black skin", "ebony skin",
        "porcelain skin", "very dark skin"
      ],
      skin_description: "warm olive skin with golden undertones, sun-kissed mediterranean complexion, light brown olive skin tone"
    },

    // Mixed / Multiracial
    mixed: {
      melanin_index_range: [0.30, 0.60],
      cielab_range: {
        L: [50, 70],
        a: [8, 18],
        b: [16, 30]
      },
      srgb_hex_range_examples: ["#D4A574", "#C08A5C", "#A67245", "#8C5A32"],
      undertone_bias: ["warm", "neutral", "golden"],
      prompt_keywords: [
        "mixed race woman", "multiracial woman", "biracial woman", "light brown skin",
        "caramel skin", "warm tan complexion", "honey skin", "ambiguous ethnicity",
        "exotic mixed features", "beautiful brown skin"
      ],
      negative_keywords: [
        "pale white skin", "very dark ebony skin", "porcelain skin"
      ],
      skin_description: "warm caramel skin with blended undertones, beautiful mixed race complexion, honey brown skin tone"
    }
  }
};

/**
 * Get skin tone preset for a given ethnicity
 * Normalizes input and maps to the closest preset
 */
export function getSkinTonePreset(ethnicity: string | null | undefined): SkinTonePreset {
  if (!ethnicity) {
    return SKIN_TONE_CONFIG.skin_tone_presets.mixed;
  }

  const normalized = ethnicity.toLowerCase().trim();

  // Direct mapping
  const directMappings: Record<string, string> = {
    // Caucasian variants
    'caucasian': 'caucasian',
    'white': 'caucasian',
    'european': 'caucasian',
    'western': 'caucasian',
    'american': 'caucasian',
    'russian': 'caucasian',
    'scandinavian': 'caucasian',
    'british': 'caucasian',
    'german': 'caucasian',
    'french': 'caucasian',
    'italian': 'caucasian',
    'spanish': 'caucasian',
    
    // Latina variants
    'latina': 'latina',
    'latino': 'latina',
    'hispanic': 'latina',
    'latin': 'latina',
    'mexican': 'latina',
    'brazilian': 'latina',
    'colombian': 'latina',
    'argentinian': 'latina',
    'puerto rican': 'latina',
    'cuban': 'latina',
    
    // Asian variants
    'asian': 'asian',
    'east asian': 'asian',
    'japanese': 'asian',
    'korean': 'asian',
    'chinese': 'asian',
    'vietnamese': 'asian',
    'thai': 'asian',
    'filipino': 'asian',
    'taiwanese': 'asian',
    'southeast asian': 'asian',
    
    // African variants
    'african': 'african',
    'black': 'african',
    'african american': 'african',
    'nigerian': 'african',
    'kenyan': 'african',
    'ethiopian': 'african',
    'ghanaian': 'african',
    'jamaican': 'african',
    'caribbean': 'african',
    'dark skin': 'african',
    'ebony': 'african',
    
    // Indian variants
    'indian': 'indian',
    'south asian': 'indian',
    'desi': 'indian',
    'pakistani': 'indian',
    'bangladeshi': 'indian',
    'sri lankan': 'indian',
    'nepali': 'indian',
    
    // Arab/Middle Eastern variants
    'arab': 'arab',
    'middle eastern': 'arab',
    'persian': 'arab',
    'iranian': 'arab',
    'turkish': 'arab',
    'lebanese': 'arab',
    'egyptian': 'arab',
    'moroccan': 'arab',
    'mediterranean': 'arab',
    
    // Mixed variants
    'mixed': 'mixed',
    'multiracial': 'mixed',
    'biracial': 'mixed',
    'other': 'mixed'
  };

  const presetKey = directMappings[normalized] || 'mixed';
  return SKIN_TONE_CONFIG.skin_tone_presets[presetKey];
}

/**
 * Build ethnicity-locked prompt segment for image generation
 * Ensures the AI model strictly adheres to the selected ethnicity
 */
export function buildEthnicityPromptSegment(ethnicity: string | null | undefined): {
  positivePrompt: string;
  negativePrompt: string;
  skinDescription: string;
} {
  const preset = getSkinTonePreset(ethnicity);
  
  // Build strong positive keywords
  const positiveKeywords = preset.prompt_keywords.slice(0, 5).join(', ');
  
  // Build negative keywords to prevent cross-cluster blending
  const negativeKeywords = preset.negative_keywords.join(', ');
  
  return {
    positivePrompt: `(${positiveKeywords}:1.8), (${preset.skin_description}:1.7)`,
    negativePrompt: `(${negativeKeywords}:2.0)`,
    skinDescription: preset.skin_description
  };
}

/**
 * Get the full identity lock prompt for character generation
 * This creates a strong anchor for ethnicity that prevents the AI from drifting
 */
export function getIdentityLockPrompt(
  ethnicity: string | null | undefined,
  age: number | string | null | undefined,
  gender: string = 'woman'
): string {
  const preset = getSkinTonePreset(ethnicity);
  const ageStr = age ? `${age} year old` : '';
  const ethnicLabel = ethnicity || 'mixed ethnicity';
  
  // Melanin range description
  const melaninDesc = preset.melanin_index_range[0] > 0.5 
    ? 'high melanin' 
    : preset.melanin_index_range[0] > 0.3 
      ? 'medium melanin' 
      : 'low melanin';
  
  return `CRITICAL IDENTITY LOCK: ${ageStr} ${ethnicLabel} ${gender}, ${preset.skin_description}, ${melaninDesc} skin. EXACT skin tone required - NO mixing with other ethnicities.`;
}

/**
 * Get negative prompts to prevent unwanted skin tones
 */
export function getExclusionNegatives(ethnicity: string | null | undefined): string {
  const preset = getSkinTonePreset(ethnicity);
  
  // Collect negatives from OTHER presets (not the selected one)
  const otherNegatives: string[] = [];
  
  for (const [key, otherPreset] of Object.entries(SKIN_TONE_CONFIG.skin_tone_presets)) {
    if (getSkinTonePreset(ethnicity) !== otherPreset) {
      // Add first 2 positive keywords from other presets as negatives
      otherNegatives.push(...otherPreset.prompt_keywords.slice(0, 2));
    }
  }
  
  // Combine with the preset's own negative keywords
  const allNegatives = [...new Set([...preset.negative_keywords, ...otherNegatives])];
  
  return allNegatives.map(n => `(${n}:1.5)`).join(', ');
}

export default SKIN_TONE_CONFIG;
