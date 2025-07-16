import { translations, type TranslationKey } from "./translations"

// Function to get translations for server components
export async function getTranslations(language = "en") {
  // Function that returns translations based on the language
  return (key: TranslationKey, fallback?: string): string => {
    // Try to get the translation from the translations object
    if (translations[language as keyof typeof translations]?.[key]) {
      return translations[language as keyof typeof translations][key]
    }

    // If not found in the current language, try English
    if (language !== "en" && translations.en[key]) {
      return translations.en[key]
    }

    // If still not found, return the fallback or the key itself
    return fallback || key
  }
}
