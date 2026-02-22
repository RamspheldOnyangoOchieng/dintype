"use client"

import { useState, useCallback, useRef } from "react"

// Simple in-memory cache: "text::target" → translatedText
const cache = new Map<string, string>()

interface UseGoogleTranslateReturn {
  translate: (text: string, target: string, source?: string) => Promise<string>
  translateBatch: (texts: string[], target: string, source?: string) => Promise<string[]>
  detectLanguage: (text: string) => Promise<{ language: string; confidence: number } | null>
  isTranslating: boolean
}

export function useGoogleTranslate(): UseGoogleTranslateReturn {
  const [isTranslating, setIsTranslating] = useState(false)
  const pendingRef = useRef<Map<string, Promise<string>>>(new Map())

  const translate = useCallback(async (text: string, target: string, source?: string): Promise<string> => {
    if (!text.trim()) return text

    // Return source unchanged if target language matches source
    if (source && source === target) return text

    const cacheKey = `${text}::${target}`
    if (cache.has(cacheKey)) return cache.get(cacheKey)!

    // Deduplicate in-flight requests for the same text
    if (pendingRef.current.has(cacheKey)) return pendingRef.current.get(cacheKey)!

    const promise = (async () => {
      setIsTranslating(true)
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, target, source }),
        })
        if (!res.ok) return text
        const data = await res.json()
        const translated = data.translatedText ?? text
        cache.set(cacheKey, translated)
        return translated
      } catch {
        return text
      } finally {
        setIsTranslating(false)
        pendingRef.current.delete(cacheKey)
      }
    })()

    pendingRef.current.set(cacheKey, promise)
    return promise
  }, [])

  const translateBatch = useCallback(async (texts: string[], target: string, source?: string): Promise<string[]> => {
    if (!texts.length) return texts
    if (source && source === target) return texts

    // Check cache for all entries
    const uncachedIndices: number[] = []
    const result: string[] = texts.map((t, i) => {
      const key = `${t}::${target}`
      if (cache.has(key)) return cache.get(key)!
      uncachedIndices.push(i)
      return t // placeholder, overwritten below
    })

    if (!uncachedIndices.length) return result

    setIsTranslating(true)
    try {
      const uncachedTexts = uncachedIndices.map(i => texts[i])
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: uncachedTexts, target, source }),
      })
      if (!res.ok) return result
      const data = await res.json()
      const translated: string[] = data.translations ?? []
      uncachedIndices.forEach((origIdx, batchIdx) => {
        const t = translated[batchIdx] ?? texts[origIdx]
        cache.set(`${texts[origIdx]}::${target}`, t)
        result[origIdx] = t
      })
      return result
    } catch {
      return result
    } finally {
      setIsTranslating(false)
    }
  }, [])

  const detectLanguage = useCallback(async (text: string) => {
    try {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(text)}`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }, [])

  return { translate, translateBatch, detectLanguage, isTranslating }
}
