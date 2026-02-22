"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { createClient } from "@/utils/supabase/client"

export interface HSLColor { h: number; s: number; l: number }

export interface BrandColors {
  primary: HSLColor
  primaryForeground: HSLColor
  secondary: HSLColor
  secondaryForeground: HSLColor
  background: HSLColor
  foreground: HSLColor
  card: HSLColor
  cardForeground: HSLColor
  muted: HSLColor
  mutedForeground: HSLColor
  accent: HSLColor
  accentForeground: HSLColor
  border: HSLColor
  ring: HSLColor
}

export interface BrandGradient {
  from: HSLColor
  via: HSLColor
  to: HSLColor
  direction: "to-r" | "to-br" | "to-b" | "to-bl" | "to-l" | "to-tr" | "to-t" | "to-tl"
}

export interface BrandConfig {
  siteName: string
  logoText: string
  tagline: string
  domainExtension: string
  logoUrl: string
  faviconUrl: string
  fontFamily: string
  borderRadius: number
  colors: BrandColors
  gradient: BrandGradient
}

export const defaultBrandConfig: BrandConfig = {
  siteName: "Dintype",
  logoText: "Dintype",
  tagline: "Your AI Companion Awaits",
  domainExtension: ".se",
  logoUrl: "",
  faviconUrl: "",
  fontFamily: "Inter, system-ui, sans-serif",
  borderRadius: 0.5,
  colors: {
    primary:           { h: 199, s: 89, l: 60 },
    primaryForeground: { h: 0,   s: 0,  l: 100 },
    secondary:         { h: 322, s: 81, l: 65 },
    secondaryForeground:{ h: 0,  s: 0,  l: 100 },
    background:        { h: 0,   s: 0,  l: 4 },
    foreground:        { h: 0,   s: 0,  l: 98 },
    card:              { h: 0,   s: 0,  l: 4 },
    cardForeground:    { h: 0,   s: 0,  l: 98 },
    muted:             { h: 0,   s: 0,  l: 15 },
    mutedForeground:   { h: 0,   s: 0,  l: 64 },
    accent:            { h: 322, s: 81, l: 20 },
    accentForeground:  { h: 322, s: 90, l: 90 },
    border:            { h: 0,   s: 0,  l: 15 },
    ring:              { h: 199, s: 89, l: 60 },
  },
  gradient: {
    from: { h: 199, s: 89, l: 60 },
    via:  { h: 188, s: 85, l: 50 },
    to:   { h: 199, s: 89, l: 48 },
    direction: "to-r",
  },
}

// Update the SiteSettings type to include language settings
type SiteSettings = {
  siteName: string
  logoText: string
  siteUrl: string
  language: "en" | "sv"
  brandConfig: BrandConfig
  pricing: {
    currency: string
    currencyPosition: "left" | "right"
    monthly: { price: number; originalPrice: number; discount: number }
    quarterly: { price: number; originalPrice: number; discount: number }
    yearly: { price: number; originalPrice: number; discount: number }
  }
}

const defaultSettings: SiteSettings = {
  siteName: "Dintype",
  logoText: "Dintype",
  siteUrl: "",
  language: "en",
  brandConfig: defaultBrandConfig,
  pricing: {
    currency: "$",
    currencyPosition: "left",
    monthly:   { price: 12.99, originalPrice: 19.99, discount: 35 },
    quarterly: { price: 9.99,  originalPrice: 19.99, discount: 50 },
    yearly:    { price: 5.99,  originalPrice: 19.99, discount: 70 },
  },
}

type SiteContextType = {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => void
  updateBrandConfig: (config: Partial<BrandConfig>) => void
}

const SiteContext = createContext<SiteContextType | undefined>(undefined)

// ─── BroadcastChannel name for same-origin tab sync ──────────────────────────
const BC_CHANNEL = "site-settings-sync"

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Core: fetch from server and merge into state ───────────────────────────
  const refreshFromServer = useCallback(async () => {
    try {
      const response = await fetch("/api/public-settings", { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      if (!data.success || !data.settings) return

      setSettings(prev => {
        const rawBrand = data.settings.brandConfig
        const mergedBrand: BrandConfig = rawBrand
          ? {
              ...defaultBrandConfig,
              ...rawBrand,
              colors:   { ...defaultBrandConfig.colors,   ...(rawBrand.colors   ?? {}) },
              gradient: { ...defaultBrandConfig.gradient, ...(rawBrand.gradient ?? {}) },
            }
          : prev.brandConfig

        const updated: SiteSettings = {
          ...prev,
          siteName:  data.settings.siteName  || prev.siteName,
          logoText:  data.settings.logoText  || prev.logoText,
          siteUrl:   data.settings.siteUrl   || prev.siteUrl,
          language:  (data.settings.language as "en" | "sv") || prev.language,
          pricing: data.settings.pricingConfig
            ? {
                ...prev.pricing,
                ...data.settings.pricingConfig,
                currency: data.settings.pricingConfig.currency ?? data.settings.currency?.symbol ?? prev.pricing.currency,
              }
            : {
                ...prev.pricing,
                currency: data.settings.currency?.symbol ?? prev.pricing.currency,
              },
          brandConfig: mergedBrand,
        }

        // Persist locally so next mount is instant
        try { localStorage.setItem("siteSettings", JSON.stringify(updated)) } catch {}
        return updated
      })
    } catch (error) {
      console.error("Failed to fetch public settings:", error)
    }
  }, [])

  useEffect(() => {
    // 1. Load from localStorage immediately for instant paint
    try {
      const saved = localStorage.getItem("siteSettings")
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings(prev => ({ ...prev, ...parsed }))
      }
    } catch {}

    // 2. Fetch authoritative data from server on mount
    refreshFromServer()

    // 3. Supabase Realtime — listen for any change to the settings table
    //    Uses anon key; works if the table's INSERT/UPDATE publication is enabled.
    const supabase = createClient()
    const channel = supabase
      .channel("settings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings" },
        () => {
          // A setting changed — pull the latest from server
          refreshFromServer()
        }
      )
      .subscribe()

    // 4. BroadcastChannel — sync immediately across tabs in same browser
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(BC_CHANNEL)
      bc.onmessage = () => refreshFromServer()
      channelRef.current = bc
    }

    // 5. Polling fallback — every 30 s catches any gaps
    pollTimerRef.current = setInterval(refreshFromServer, 30_000)

    // 6. Refetch when tab regains focus (user comes back to the tab)
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshFromServer()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      supabase.removeChannel(channel)
      channelRef.current?.close()
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [refreshFromServer])

  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      try { localStorage.setItem("siteSettings", JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  const updateBrandConfig = useCallback((config: Partial<BrandConfig>) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        brandConfig: {
          ...defaultBrandConfig,
          ...prev.brandConfig,
          ...config,
          colors:   { ...defaultBrandConfig.colors,   ...(prev.brandConfig?.colors ?? {}),   ...((config as any).colors ?? {}) },
          gradient: { ...defaultBrandConfig.gradient, ...(prev.brandConfig?.gradient ?? {}), ...((config as any).gradient ?? {}) },
        },
      }
      try { localStorage.setItem("siteSettings", JSON.stringify(updated)) } catch {}
      return updated
    })
  }, [])

  return (
    <SiteContext.Provider value={{ settings, updateSettings, updateBrandConfig }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSite() {
  const context = useContext(SiteContext)
  if (!context) throw new Error("useSite must be used inside SiteProvider")
  return context
}