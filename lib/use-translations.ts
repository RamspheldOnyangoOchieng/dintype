"use client"

import { useMemo } from "react"
import { useSite } from "@/components/site-context"
import { type TranslationKey, translations } from "./translations"

export function useTranslations() {
  // Always default to English, ignoring any potentially cached 'sv' setting
  const language = "en"

  const t = useMemo(() => (key: TranslationKey): string => {
    return translations.en[key] || key
  }, [])

  return { t, language }
}
