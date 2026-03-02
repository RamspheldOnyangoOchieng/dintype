/**
 * Enhanced content moderation for Dintype platform.
 * Implements strict Community Guidelines and Plan-based restrictions.
 */

// 1. Soft NSFW Keywords (Allowed for Premium, trigger Upgrade for Free)
const SOFT_NSFW_KEYWORDS = [
  "sex", "naked", "nude", "pussy", "dick", "cock", "fuck", "cum", "horny",
  "hardcore", "hentai", "milf", "bdsm", "fetish", "erotic", "orgasm", "masturbate",
  "anal", "blowjob", "clitoris", "vagina", "penis", "ballsack", "tit", "breast",
  "boob", "sexy", "hot", "slut", "whore", "escort", "prostitute", "stripper",
  "undress", "lingerie", "panties", "bra", "bikini"
];

const SWEDISH_SOFT_NSFW_KEYWORDS = [
  "sex", "porr", "naken", "kön", "kuk", "fitta", "knulla", "runka", "suga",
  "bröst", "tuttar", "stön", "våt", "kåt", "hård", "skönt", "komma",
  "analsex", "sugjobb", "penis", "vagina", "orgasm", "onani", "underkläder"
];

// 2. HARD PROHIBITED (Strictly forbidden for ALL users)
const PROHIBITED_CATEGORIES = {
  MINORS: [
    "child", "kid", "minor", "underage", "daughter", "son", "niece", "nephew",
    "schoolgirl", "young-looking", "loli", "shota", "kindergarten", "toddler",
    "barn", "unge", "minderårig", "skolflicka", "dotter", "son"
  ],
  NON_CONSENSUAL: [
    "rape", "rapey", "forced", "coercion", "blackmail", "non-consensual", "trafficking",
    "exploitation", "våldtäkt", "tvingad", "människohandel", "utnyttjande"
  ],
  INCEST: [
    "incest", "step-sister", "stepsister", "step-brother", "stepbrother", "stepdad", "stepmom",
    "father", "mother", "sister", "brother", "cousin", "family-related", "pappa", "mamma",
    "syster", "bror", "kusin", "styvdotter", "styvson"
  ],
  EXTREME_VIOLENCE: [
    "torture", "gore", "mutilation", "snuff", "corpse", "necrophilia", "terrorism",
    "extremism", "suicide", "self-harm", "murder", "tortyr", "självmord", "mord", "lik"
  ],
  ANIMAL: [
    "bestiality", "zoophilia", "animal sex", "dog sex", "horse sex", "tid"
  ]
};

const ALL_PROHIBITED = Object.values(PROHIBITED_CATEGORIES).flat();

/**
 * Checks if text contains soft NSFW content (Request upgrade for Free users)
 */
export function containsNSFW(text: string): boolean {
  if (!text) return false;
  const normalizedText = text.toLowerCase();

  // Combine all keywords for a generic NSFW check
  const allKeywords = [...SOFT_NSFW_KEYWORDS, ...SWEDISH_SOFT_NSFW_KEYWORDS];

  for (const word of allKeywords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalizedText)) return true;
  }

  // Also check if it's strictly prohibited (since that's obviously NSFW too)
  return containsProhibited(text);
}

/**
 * Checks if text contains strictly prohibited content (Banned for everyone)
 */
export function containsProhibited(text: string): boolean {
  if (!text) return false;
  const normalizedText = text.toLowerCase();

  for (const word of ALL_PROHIBITED) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(normalizedText)) return true;
  }

  return false;
}

export const SFW_SYSTEM_PROMPT = `
IMPORTANT CONTENT GUIDELINE:
You are in SAFE MODE. You must NOT use any sexually explicit language. Keep it friendly or romantic but strictly SFW.
`;

export const SFW_SYSTEM_PROMPT_SV = `
VIKTIG RIKTLINJE FÖR INNEHÅLL:
Du är i SÄKERT LÄGE. Du får INTE använda något sexuellt explicit språk. Håll det vänligt eller romantiskt men strikt SFW.
`;

export const BANNED_CONTENT_MESSAGE = "CONTENT_BANNED: This request violates our Community Guidelines regarding prohibited content. Please keep interactions respectful and within safety boundaries.";
export const BANNED_CONTENT_MESSAGE_SV = "INNEHÅLL_FÖRBJUDET: Denna begäran bryter mot våra riktlinjer för förbjudet innehåll. Vänligen håll interaktionen respektfull och inom våra säkerhetsgränser.";
