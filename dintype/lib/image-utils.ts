/**
 * Checks if a message is asking for an image generation.
 * @param message The message to check.
 * @returns True if the message asks for an image, false otherwise.
 */
export function isAskingForImage(message: string): boolean {
  const lowerMessage = message.toLowerCase()

  // English phrases
  const englishPhrases = [
    "show me",
    "can i see",
    "generate an image",
    "create an image",
    "make a picture",
    "draw",
    "picture of",
    "image of",
  ]

  // Swedish phrases
  const swedishPhrases = [
    "visa mig",
    "kan jag se",
    "skapa en bild",
    "generera en bild",
    "rita",
    "bild av",
    "kan du skapa en bild",
  ]

  // Check both English and Swedish phrases
  return [...englishPhrases, ...swedishPhrases].some((phrase) => lowerMessage.includes(phrase))
}

/**
 * Extracts the prompt for image generation from a message.
 * @param message The message to extract the prompt from.
 * @returns The extracted prompt, or the original message if no specific prompt is found.
 */
export function extractImagePrompt(message: string): string {
  const lowerMessage = message.toLowerCase()

  // English phrases with their extraction patterns
  const englishPatterns = [
    { phrase: "show me", extract: (msg: string) => msg.replace(/show me/i, "").trim() },
    { phrase: "can i see", extract: (msg: string) => msg.replace(/can i see/i, "").trim() },
    { phrase: "generate an image", extract: (msg: string) => msg.replace(/generate an image( of)?/i, "").trim() },
    { phrase: "create an image", extract: (msg: string) => msg.replace(/create an image( of)?/i, "").trim() },
    { phrase: "make a picture", extract: (msg: string) => msg.replace(/make a picture( of)?/i, "").trim() },
    { phrase: "draw", extract: (msg: string) => msg.replace(/draw/i, "").trim() },
    { phrase: "picture of", extract: (msg: string) => msg.replace(/picture of/i, "").trim() },
    { phrase: "image of", extract: (msg: string) => msg.replace(/image of/i, "").trim() },
  ]

  // Swedish phrases with their extraction patterns
  const swedishPatterns = [
    { phrase: "visa mig", extract: (msg: string) => msg.replace(/visa mig/i, "").trim() },
    { phrase: "kan jag se", extract: (msg: string) => msg.replace(/kan jag se/i, "").trim() },
    { phrase: "skapa en bild", extract: (msg: string) => msg.replace(/skapa en bild( med| av)?/i, "").trim() },
    { phrase: "generera en bild", extract: (msg: string) => msg.replace(/generera en bild( av)?/i, "").trim() },
    { phrase: "rita", extract: (msg: string) => msg.replace(/rita/i, "").trim() },
    { phrase: "bild av", extract: (msg: string) => msg.replace(/bild av/i, "").trim() },
    {
      phrase: "kan du skapa en bild",
      extract: (msg: string) => msg.replace(/kan du skapa en bild( med| av)?/i, "").trim(),
    },
  ]

  // Combine patterns
  const allPatterns = [...englishPatterns, ...swedishPatterns]

  // Find the first matching pattern
  for (const pattern of allPatterns) {
    if (lowerMessage.includes(pattern.phrase)) {
      return pattern.extract(message)
    }
  }

  // If no pattern matches, return the original message
  return message
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
