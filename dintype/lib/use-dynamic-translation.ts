"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-context"

export function useDynamicTranslation(text: string) {
  const { language } = useLanguage()
  const [translatedText, setTranslatedText] = useState(text)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only translate if language is not English and text exists
    if (language !== "en" && text) {
      const translateText = async () => {
        setIsLoading(true)
        try {
          const response = await fetch("/api/translate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text,
              targetLanguage: language,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.translatedText) {
              setTranslatedText(data.translatedText)
            }
          }
        } catch (error) {
          console.error("Translation error:", error)
        } finally {
          setIsLoading(false)
        }
      }

      translateText()
    } else {
      setTranslatedText(text)
    }
  }, [text, language])

  return { translatedText, isLoading }
}
