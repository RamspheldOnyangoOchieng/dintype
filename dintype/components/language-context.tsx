"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSite } from "./site-context"
import { type TranslationKey, translations } from "@/lib/translations"

type LanguageContextType = {
  language: "en" | "sv"
  t: (key: TranslationKey) => string
  changeLanguage: (lang: "en" | "sv") => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSite()
  const [language, setLanguage] = useState<"en" | "sv">(settings.language || "en")

  // Sync language with settings
  useEffect(() => {
    if (settings.language && settings.language !== language) {
      setLanguage(settings.language as "en" | "sv")
    }
  }, [settings.language])

  // Log when language changes to help with debugging
  useEffect(() => {
    console.log("Language context initialized with:", language)

    // Store language preference in cookie for server components
    document.cookie = `language=${language}; path=/; max-age=31536000; SameSite=Lax`
  }, [language])

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  const changeLanguage = (lang: "en" | "sv") => {
    console.log("Changing language to:", lang)
    setLanguage(lang)
    updateSettings({ language: lang })
  }

  return <LanguageContext.Provider value={{ language, t, changeLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
