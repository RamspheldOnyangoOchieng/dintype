"use client"

import { useMemo } from "react"
import { useSite } from "@/components/site-context"
import { type TranslationKey, translations } from "./translations"

export function useTranslations() {
  const { settings } = useSite()
  const language = (settings.language || "en") as "en" | "sv"

  const t = useMemo(() => (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }, [language])

  return { t, language }
}
