"use client"

import { useEffect, useMemo } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useSite } from "@/components/site-context"
import type { HSLColor } from "@/components/site-context"

function hsl(c: HSLColor) {
  return `${c.h} ${c.s}% ${c.l}%`
}

function rgb(c: HSLColor) {
  // Convert HSL to approximate RGB for helper vars
  const h = c.h / 360, s = c.s / 100, l = c.l / 100
  let r, g, b
  if (s === 0) { r = g = b = l } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`
}

// CSS variable names that control background/foreground colors.
// These are cleared in light mode so the :root CSS variables (globals.css) take over.
const THEME_SENSITIVE_VARS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--border",
  "--input",
  "--sidebar-background",
  "--sidebar-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
]

export function BrandThemeInjector() {
  const { settings } = useSite()
  const brand = settings.brandConfig
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()

  const isAdmin = useMemo(() => pathname?.startsWith("/admin"), [pathname])

  useEffect(() => {
    if (!brand) return
    const root = document.documentElement
    const c = brand.colors
    const isDark = resolvedTheme === "dark"

    // Admin panel should use standard clean colors, not brand background overrides
    if (isAdmin) {
      // Clear all brand-specific overrides in Admin to ensure readability
      THEME_SENSITIVE_VARS.forEach(key => root.style.removeProperty(key))

      // Still apply primary/secondary/radius for branding consistency
      const adminBrandVars: [string, string][] = [
        ["--primary", hsl(c.primary)],
        ["--primary-foreground", hsl(c.primaryForeground)],
        ["--secondary", hsl(c.secondary)],
        ["--secondary-foreground", hsl(c.secondaryForeground)],
        ["--ring", hsl(c.ring)],
        ["--radius", `${brand.borderRadius}rem`],
        ["--primary-rgb", rgb(c.primary)],
        ["--secondary-rgb", rgb(c.secondary)],
        ["--sidebar-primary", hsl(c.primary)],
        ["--sidebar-primary-foreground", hsl(c.primaryForeground)],
        // Ensure sidebar has a clean default in admin
        ["--sidebar-background", isDark ? "240 5.9% 10%" : "0 0% 98%"],
        ["--sidebar-foreground", isDark ? "240 4.8% 95.9%" : "240 5.3% 26.1%"],
      ]
      adminBrandVars.forEach(([key, val]) => root.style.setProperty(key, val))
      return
    }

    if (isDark) {
      // In dark mode: apply all brand color overrides as inline styles
      const vars: [string, string][] = [
        ["--primary", hsl(c.primary)],
        ["--primary-foreground", hsl(c.primaryForeground)],
        ["--secondary", hsl(c.secondary)],
        ["--secondary-foreground", hsl(c.secondaryForeground)],
        ["--background", hsl(c.background)],
        ["--foreground", hsl(c.foreground)],
        ["--card", hsl(c.card)],
        ["--card-foreground", hsl(c.cardForeground)],
        ["--muted", hsl(c.muted)],
        ["--muted-foreground", hsl(c.mutedForeground)],
        ["--accent", hsl(c.accent)],
        ["--accent-foreground", hsl(c.accentForeground)],
        ["--border", hsl(c.border)],
        ["--input", hsl(c.border)],
        ["--ring", hsl(c.ring)],
        ["--radius", `${brand.borderRadius}rem`],
        ["--primary-rgb", rgb(c.primary)],
        ["--secondary-rgb", rgb(c.secondary)],
        // sidebar mirrors
        ["--sidebar-primary", hsl(c.primary)],
        ["--sidebar-primary-foreground", hsl(c.primaryForeground)],
        ["--sidebar-background", hsl({ h: c.card.h, s: c.card.s, l: Math.min(c.card.l + 4, 100) })],
        ["--sidebar-foreground", hsl(c.foreground)],
        ["--sidebar-accent", hsl(c.muted)],
        ["--sidebar-accent-foreground", hsl(c.foreground)],
        ["--sidebar-border", hsl(c.border)],
      ]
      vars.forEach(([key, val]) => root.style.setProperty(key, val))
    } else {
      // In light mode: clear theme-sensitive inline overrides so globals.css :root takes over.
      // Only keep theme-neutral brand vars (primary, secondary, radius, font).
      THEME_SENSITIVE_VARS.forEach(key => root.style.removeProperty(key))

      // Still apply brand primary/secondary/ring/radius so the brand accent colours carry through
      const neutralVars: [string, string][] = [
        ["--primary", hsl(c.primary)],
        ["--primary-foreground", hsl(c.primaryForeground)],
        ["--secondary", hsl(c.secondary)],
        ["--secondary-foreground", hsl(c.secondaryForeground)],
        ["--ring", hsl(c.ring)],
        ["--radius", `${brand.borderRadius}rem`],
        ["--primary-rgb", rgb(c.primary)],
        ["--secondary-rgb", rgb(c.secondary)],
        ["--sidebar-primary", hsl(c.primary)],
        ["--sidebar-primary-foreground", hsl(c.primaryForeground)],
      ]
      neutralVars.forEach(([key, val]) => root.style.setProperty(key, val))
    }

    // Font family applies in both modes
    if (brand.fontFamily) {
      root.style.setProperty("--font-sans", brand.fontFamily)
      document.body.style.fontFamily = brand.fontFamily
    }
  }, [brand, resolvedTheme])

  return null
}
