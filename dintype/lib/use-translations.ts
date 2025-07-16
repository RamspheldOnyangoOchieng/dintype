"use client"

import { useCallback } from "react"
import { useLanguage } from "@/components/language-context"
import type { TranslationKey } from "./translations"

// Fallback translation function that doesn't depend on context
const fallbackTranslate = (key: TranslationKey, fallback?: string): string => {
  return fallback || key.toString()
}

// This is the main hook with the plural name (useTranslations)
export function useTranslations() {
  let language = "en"
  let translate = fallbackTranslate
  const context = useLanguage() // Call useLanguage unconditionally

  language = context?.language || language // Use optional chaining and fallback
  translate = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      return context?.t(key, fallback) || fallbackTranslate(key, fallback) // Use optional chaining and fallback
    },
    [context?.t],
  )

  return {
    t: translate,
    language,
  }
}

// Add this compatibility export for components using the singular name (useTranslation)
export const useTranslation = useTranslations
