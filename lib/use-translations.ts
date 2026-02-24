"use client"

import { useMemo } from "react"
import { useSite } from "@/components/site-context"
import { type TranslationKey, translations } from "./translations"

export function useTranslations() {
  const { settings } = useSite()
  const language = (settings.language || "en") as "en" | "sv"

  const t = useMemo(() => (key: TranslationKey, variables?: Record<string, string>): string => {
    let message = translations[language]?.[key] || translations.en[key] || key
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        message = message.replace(`{${k}}`, v)
      })
    }
    return message
  }, [language])

  const t_db = useMemo(() => (text: string | undefined): string => {
    if (!text) return ""
    // Try to find a direct match in translations.db.*
    // Normalize: remove certain punctuation to increase match rate
    const normalized = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, '')
    const key = `db.${normalized}` as TranslationKey
    const translated = translations[language]?.[key]
    if (translated) return translated

    // Fallback search in all keys for exact match
    const entries = Object.values(translations[language] || {})
    const match = entries.find((val) => val.toLowerCase() === text.toLowerCase())
    if (match) return match

    return text
  }, [language])

  return { t, t_db, language }
}
