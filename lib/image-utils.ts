/**
 * Checks if a message is asking for an image generation.
 * @param message The message to check.
 * @returns True if the message asks for an image, false otherwise.
 */
export const isAskingForImage = (message: string): boolean => {
  if (!message) return false
  const lowerCaseMessage = message.toLowerCase().trim()

  // Standalone follow-up triggers (Aggressive matching for follow-ups)
  const standaloneTriggers = [
    "another", "another one", "one more", "more", "again", "send another", "give another", "show another",
    "en till", "en till tack", "mer", "igen", "visa en till", "skicka en till"
  ];
  if (standaloneTriggers.includes(lowerCaseMessage)) return true;

  // 1. High-intent direct keywords (Standalone triggers)
  const directKeywords = [
    "image", "picture", "selfie", "photo", "pic", "pics", "draw", "generate", "create", "teckna", "bild", "foto",
    "pantry", "nude", "nudes", "naked", "topless", "pose", "posing", "bikini", "lingerie", "undress", "undressing",
    "crop top", "skirt", "panties", "bra", "dress", "outfit", "wearing", "no clothes", "body", "pussy", "ass", "boobs", "tits"
  ];
  if (directKeywords.some(k => lowerCaseMessage.includes(k))) return true;

  // 1b. Specific phrases
  const directPhrases = [
    "send your", "show your", "send me your", "show me your", "how you look", "what you look like",
    "send pic", "send photo", "let me see", "can i see", "i need to see", "i need the photo", "send it", "show it"
  ];
  if (directPhrases.some(p => lowerCaseMessage.includes(p))) return true;

  // 1c. Scene descriptions (If user describes a scene/outfit, they want to see it)
  const sceneKeywords = ["sitting on", "lying on", "standing in", "wearing a", "dressed as", "in a"];
  if (sceneKeywords.some(k => lowerCaseMessage.startsWith(k))) return true;

  // 2. Clear intent phrases
  const intentPhrases = [
    "can i see", "send me", "show me", "give me",
    "kan jag få se", "skicka en", "visa mig", "ge mig",
    "send another", "give another", "show another", "send it now"
  ];
  if (intentPhrases.some(p => lowerCaseMessage.includes(p))) return true;

  // 3. Follow-up "another" patterns (Combinations)
  if (lowerCaseMessage.includes("another") || lowerCaseMessage.includes("one more") || lowerCaseMessage.includes("en till")) {
    return true;
  }

  return false;
}

/**
 * Extracts the prompt for image generation from a message.
 * @param message The message to extract the prompt from.
 * @returns The extracted prompt, or the original message if no specific prompt is found.
 */
export const extractImagePrompt = (message: string): string => {
  if (!message) return ""
  const lower = message.toLowerCase().trim()

  // If it's just a "more" request without detail, provide a good default
  const genericMore = ["another", "another one", "one more", "more", "again", "give me more", "show me more", "send me more"];
  if (genericMore.includes(lower) || lower === "another selfie" || lower === "another photo") {
    return "a beautiful and intimate candid masterpiece photography portrait, natural lighting, high quality"
  }

  // List of phrases to strip from the beginning of the prompt
  const triggersToStrip = [
    "generate a ", "generate an ", "generate ",
    "create a ", "create an ", "create ",
    "draw a ", "draw an ", "draw ",
    "send me a ", "send me an ", "send me ",
    "show me a ", "show me an ", "show me ",
    "give me a ", "give me an ", "give me ",
    "can i see a ", "can i see an ", "can i see ",
    "i want a ", "i want an ", "i want "
  ];

  let cleaned = message;
  let changed = true;
  while (changed) {
    changed = false;
    const currentLower = cleaned.toLowerCase().trim();
    for (const trigger of triggersToStrip) {
      if (currentLower.startsWith(trigger)) {
        cleaned = cleaned.trim().substring(trigger.length);
        changed = true;
        break;
      }
    }
  }

  // Handle "another one with", "another one where", etc.
  cleaned = cleaned.replace(/^(another\s+one\s+(with|where|when|of)?\s*)/i, "");
  cleaned = cleaned.replace(/^(send\s+it\s+now\s+(with|where|when|of)?\s*)/i, "");
  cleaned = cleaned.replace(/^(i\s+need\s+(to\s+see|the\s+photo)\s+(of|where|when)?\s*)/i, "");
  cleaned = cleaned.replace(/^(when\s+yu?\s+are\s+)/i, ""); // Handle "when yu are"
  cleaned = cleaned.replace(/^(yu?\s+are\s+)/i, "");     // Handle "yu are"

  // If after cleaning it's too short or just "another", use a better default
  if (cleaned.trim().length < 3 || cleaned.toLowerCase() === "another") {
    return "a beautiful and intimate candid masterpiece photography portrait, natural lighting, high quality"
  }

  return cleaned.trim()
}

/**
 * Converts an image URL to a base64 string.
 * @param imageUrl The URL of the image to convert.
 * @returns A promise that resolves with the base64 string, or null if an error occurs.
 */
export const imageUrlToBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
    }

    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error converting image to base64:", error)
    return null
  }
}

/**
 * Server-side compatible URL to base64 converter.
 */
export const urlToBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${response.headers.get("content-type")};base64,${buffer.toString("base64")}`;
};
