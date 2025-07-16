"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Update the SiteSettings type to include character types
export interface SiteSettings {
  siteName: string
  logoText: string
  characterTypes: string[]
  language: "en" | "sv" // Add language setting
  pricing: {
    currency: string
    currencyPosition: "left" | "right"
    monthly: {
      price: number
      originalPrice: number
      discount: number
    }
    quarterly: {
      price: number
      originalPrice: number
      discount: number
    }
    yearly: {
      price: number
      originalPrice: number
      discount: number
    }
  }
}

// Update the default settings to include characterTypes
const defaultSettings: SiteSettings = {
  siteName: "AI Character Explorer",
  logoText: "Character",
  characterTypes: ["Girls", "Anime", "Guys"],
  language: "sv", // Default to Swedish
  pricing: {
    currency: "$",
    currencyPosition: "left",
    monthly: {
      price: 9.99,
      originalPrice: 19.99,
      discount: 50,
    },
    quarterly: {
      price: 24.99,
      originalPrice: 59.97,
      discount: 58,
    },
    yearly: {
      price: 89.99,
      originalPrice: 239.88,
      discount: 62,
    },
  },
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

type SiteContextType = {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => void
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

  // Load settings from localStorage on client side
  useEffect(() => {
    const savedSettings = localStorage.getItem("siteSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse site settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage when they change
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem("siteSettings", JSON.stringify(updated))
      return updated
    })
  }

  return <SiteContext.Provider value={{ settings, updateSettings }}>{children}</SiteContext.Provider>
}

export function useSite() {
  const context = useContext(SiteContext)
  if (context === undefined) {
    throw new Error("useSite must be used within a SiteProvider")
  }
  return context
}
