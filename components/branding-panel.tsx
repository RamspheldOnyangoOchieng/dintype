"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { useSite, defaultBrandConfig } from "@/components/site-context"
import type { BrandConfig, HSLColor, BrandColors, BrandGradient } from "@/components/site-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Palette, Type, Globe, Image as ImageIcon, Save, RotateCcw,
  Sparkles, Heart, Eye, Layers, CheckCircle,
} from "lucide-react"

// ─── helpers ────────────────────────────────────────────────────────────────
const toHslStr = (c: HSLColor) => `hsl(${c.h},${c.s}%,${c.l}%)`

// ─── HSL Slider ─────────────────────────────────────────────────────────────
interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  trackStyle: React.CSSProperties
  onChange: (v: number) => void
  unit?: string
}
function SliderRow({ label, value, min, max, trackStyle, onChange, unit = "" }: SliderRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="tabular-nums text-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        <div
          className="absolute inset-0 rounded-full h-3 top-1/2 -translate-y-1/2"
          style={trackStyle}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="relative w-full h-3 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary
            [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
        />
      </div>
    </div>
  )
}

// ─── HSL Color Editor ────────────────────────────────────────────────────────
interface ColorEditorProps {
  label: string
  color: HSLColor
  onChange: (c: HSLColor) => void
}
function ColorEditor({ label, color, onChange }: ColorEditorProps) {
  const colorStr = toHslStr(color)
  return (
    <div className="p-3 rounded-xl border border-border bg-card space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg border border-white/20 shadow-inner"
            style={{ background: colorStr }}
          />
          <code className="text-[10px] text-muted-foreground bg-muted px-1 py-0.5 rounded">
            {color.h} {color.s}% {color.l}%
          </code>
        </div>
      </div>
      <SliderRow
        label="Hue"
        value={color.h}
        min={0}
        max={360}
        unit="°"
        trackStyle={{
          background: `linear-gradient(to right,
            hsl(0,${color.s}%,${color.l}%), hsl(30,${color.s}%,${color.l}%),
            hsl(60,${color.s}%,${color.l}%), hsl(90,${color.s}%,${color.l}%),
            hsl(120,${color.s}%,${color.l}%), hsl(150,${color.s}%,${color.l}%),
            hsl(180,${color.s}%,${color.l}%), hsl(210,${color.s}%,${color.l}%),
            hsl(240,${color.s}%,${color.l}%), hsl(270,${color.s}%,${color.l}%),
            hsl(300,${color.s}%,${color.l}%), hsl(330,${color.s}%,${color.l}%),
            hsl(360,${color.s}%,${color.l}%))`,
        }}
        onChange={h => onChange({ ...color, h })}
      />
      <SliderRow
        label="Saturation"
        value={color.s}
        min={0}
        max={100}
        unit="%"
        trackStyle={{
          background: `linear-gradient(to right,
            hsl(${color.h},0%,${color.l}%),
            hsl(${color.h},100%,${color.l}%))`,
        }}
        onChange={s => onChange({ ...color, s })}
      />
      <SliderRow
        label="Lightness"
        value={color.l}
        min={0}
        max={100}
        unit="%"
        trackStyle={{
          background: `linear-gradient(to right,
            hsl(${color.h},${color.s}%,0%),
            hsl(${color.h},${color.s}%,50%),
            hsl(${color.h},${color.s}%,100%))`,
        }}
        onChange={l => onChange({ ...color, l })}
      />
    </div>
  )
}

// ─── Gradient Preview ────────────────────────────────────────────────────────
function gradientCSS(g: BrandGradient): string {
  const dirs: Record<string, string> = {
    "to-r": "to right", "to-l": "to left", "to-b": "to bottom", "to-t": "to top",
    "to-br": "to bottom right", "to-bl": "to bottom left",
    "to-tr": "to top right", "to-tl": "to top left",
  }
  return `linear-gradient(${dirs[g.direction] ?? "to right"},
    ${toHslStr(g.from)}, ${toHslStr(g.via)}, ${toHslStr(g.to)})`
}

// ─── Branding Panel ───────────────────────────────────────────────────────────
export function BrandingPanel() {
  const { settings, updateBrandConfig } = useSite()

  // ── CRASH FIX: deep-merge so nested gradient/colors are never undefined ──
  const [brand, setBrand] = useState<BrandConfig>(() => ({
    ...defaultBrandConfig,
    ...settings.brandConfig,
    colors: {
      ...defaultBrandConfig.colors,
      ...(settings.brandConfig?.colors ?? {}),
    },
    gradient: {
      ...defaultBrandConfig.gradient,
      ...(settings.brandConfig?.gradient ?? {}),
    },
  }))

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const update = useCallback(<K extends keyof BrandConfig>(key: K, val: BrandConfig[K]) => {
    setBrand(prev => ({ ...prev, [key]: val }))
  }, [])

  const updateColor = useCallback((key: keyof BrandColors, val: HSLColor) => {
    setBrand(prev => ({ ...prev, colors: { ...prev.colors, [key]: val } }))
  }, [])

  const updateGradient = useCallback(<K extends keyof BrandGradient>(key: K, val: BrandGradient[K]) => {
    setBrand(prev => ({ ...prev, gradient: { ...prev.gradient, [key]: val } }))
  }, [])

  const applyLive = () => {
    updateBrandConfig(brand)
    toast.success("Preview applied live!")
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Apply changes locally right away for instant feedback in this tab
      updateBrandConfig(brand)

      const saves = await Promise.all([
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "brand_config", value: brand }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "site_name", value: brand.siteName }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "logo_text", value: brand.logoText }),
        }),
      ])

      // Surface actual HTTP errors instead of silently swallowing them
      for (const res of saves) {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `HTTP ${res.status}`)
        }
      }

      // Notify all other same-origin tabs to re-sync immediately
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("site-settings-sync")
        bc.postMessage({ type: "settings-updated" })
        bc.close()
      }

      setSaved(true)
      toast.success("Brand settings saved!")
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      console.error("[branding-panel] save failed:", err)
      toast.error(`Failed to save: ${err?.message || "unknown error"}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setBrand({
      ...defaultBrandConfig,
      ...settings.brandConfig,
      colors: {
        ...defaultBrandConfig.colors,
        ...(settings.brandConfig?.colors ?? {}),
      },
      gradient: {
        ...defaultBrandConfig.gradient,
        ...(settings.brandConfig?.gradient ?? {}),
      },
    })
    toast.info("Reset to saved values")
  }

  const { colors: c, gradient: g } = brand
  const gradBg = gradientCSS(g)

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Brand &amp; Theme
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Control colors, logo, typography and all visual identity settings
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleReset} className="cursor-pointer gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={applyLive} className="cursor-pointer gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Preview Live
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="cursor-pointer gap-1.5">
            {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? "Saving…" : saved ? "Saved!" : "Save All"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        {/* ── Controls ── */}
        <Tabs defaultValue="identity">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-xl mb-4">
            <TabsTrigger value="identity" className="gap-1.5 cursor-pointer text-xs sm:text-sm">
              <Globe className="w-3.5 h-3.5" /> Identity
            </TabsTrigger>
            <TabsTrigger value="logo" className="gap-1.5 cursor-pointer text-xs sm:text-sm">
              <ImageIcon className="w-3.5 h-3.5" /> Logo
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-1.5 cursor-pointer text-xs sm:text-sm">
              <Palette className="w-3.5 h-3.5" /> Colors
            </TabsTrigger>
            <TabsTrigger value="gradient" className="gap-1.5 cursor-pointer text-xs sm:text-sm">
              <Layers className="w-3.5 h-3.5" /> Gradient
            </TabsTrigger>
            <TabsTrigger value="typography" className="gap-1.5 cursor-pointer text-xs sm:text-sm">
              <Type className="w-3.5 h-3.5" /> Typography
            </TabsTrigger>
          </TabsList>

          {/* ── Identity Tab ── */}
          <TabsContent value="identity">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Site Identity
                </CardTitle>
                <CardDescription>Brand name, domain, tagline and other identity fields</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" value={brand.siteName}
                    onChange={e => update("siteName", e.target.value)} placeholder="Dintype" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="logoText">Logo Text</Label>
                  <Input id="logoText" value={brand.logoText}
                    onChange={e => update("logoText", e.target.value)} placeholder="Dintype" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tagline">Tagline / Subtitle</Label>
                  <Input id="tagline" value={brand.tagline}
                    onChange={e => update("tagline", e.target.value)} placeholder="Your AI Companion Awaits" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="domain">Domain Extension</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Input id="domain" value={brand.domainExtension}
                      onChange={e => update("domainExtension", e.target.value)} placeholder=".se" className="w-28" />
                    <div className="flex gap-1 flex-wrap">
                      {[".se", ".com", ".ai", ".io", ".net", ".co"].map(ext => (
                        <button key={ext} onClick={() => update("domainExtension", ext)}
                          className={`px-2 py-1 text-xs rounded-lg border cursor-pointer transition-colors ${brand.domainExtension === ext ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                          {ext}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input id="fontFamily" value={brand.fontFamily}
                    onChange={e => update("fontFamily", e.target.value)}
                    placeholder="Inter, system-ui, sans-serif" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Border Radius — <span className="font-mono text-primary">{brand.borderRadius}rem</span></Label>
                  <SliderRow
                    label="Roundness"
                    value={Math.round(brand.borderRadius * 10)}
                    min={0} max={20}
                    trackStyle={{ background: "linear-gradient(to right, hsl(var(--muted)), hsl(var(--primary)))" }}
                    onChange={v => update("borderRadius", v / 10)}
                  />
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {[0, 0.25, 0.5, 0.75, 1, 1.5, 2].map(r => (
                      <button key={r} onClick={() => update("borderRadius", r)}
                        className={`px-2 py-1 text-xs border cursor-pointer transition-colors ${brand.borderRadius === r ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                        style={{ borderRadius: `${r}rem` }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Logo Tab ── */}
          <TabsContent value="logo">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" /> Logo &amp; Favicon
                </CardTitle>
                <CardDescription>Upload or paste URLs for your logo and favicon images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <Label>Logo Image URL</Label>
                    <Input value={brand.logoUrl}
                      onChange={e => update("logoUrl", e.target.value)}
                      placeholder="https://…/logo.png" />
                    <div className="h-20 border border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30">
                      {brand.logoUrl
                        ? <img src={brand.logoUrl} alt="logo preview" className="max-h-16 max-w-full object-contain" />
                        : <span className="text-muted-foreground text-xs">Logo preview</span>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Favicon URL</Label>
                    <Input value={brand.faviconUrl}
                      onChange={e => update("faviconUrl", e.target.value)}
                      placeholder="https://…/favicon.ico" />
                    <div className="h-20 border border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30">
                      {brand.faviconUrl
                        ? <img src={brand.faviconUrl} alt="favicon preview" className="w-8 h-8 object-contain" />
                        : <span className="text-muted-foreground text-xs">Favicon preview</span>}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo Text Display Preview</Label>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg" style={{ color: `hsl(${c.primary.h},${c.primary.s}%,${c.primary.l}%)` }}>
                      {brand.logoText || "Dintype"}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{brand.domainExtension}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Colors Tab ── */}
          <TabsContent value="colors">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Palette className="w-4 h-4 text-primary" /> Color Palette
                  </CardTitle>
                  <CardDescription>
                    Hue scrolls through the full color wheel, Saturation sets intensity, Lightness sets brightness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(Object.keys(c) as (keyof BrandColors)[]).map(key => (
                      <div key={key} title={key} className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 rounded-lg border border-white/10 shadow-inner"
                          style={{ background: toHslStr(c[key]) }} />
                        <span className="text-[8px] text-muted-foreground truncate w-12 text-center">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ColorEditor label="Primary" color={c.primary} onChange={v => updateColor("primary", v)} />
                <ColorEditor label="Primary Foreground" color={c.primaryForeground} onChange={v => updateColor("primaryForeground", v)} />
                <ColorEditor label="Secondary" color={c.secondary} onChange={v => updateColor("secondary", v)} />
                <ColorEditor label="Secondary Foreground" color={c.secondaryForeground} onChange={v => updateColor("secondaryForeground", v)} />
                <ColorEditor label="Background" color={c.background} onChange={v => updateColor("background", v)} />
                <ColorEditor label="Foreground (Text)" color={c.foreground} onChange={v => updateColor("foreground", v)} />
                <ColorEditor label="Card" color={c.card} onChange={v => updateColor("card", v)} />
                <ColorEditor label="Card Foreground" color={c.cardForeground} onChange={v => updateColor("cardForeground", v)} />
                <ColorEditor label="Muted" color={c.muted} onChange={v => updateColor("muted", v)} />
                <ColorEditor label="Muted Foreground" color={c.mutedForeground} onChange={v => updateColor("mutedForeground", v)} />
                <ColorEditor label="Accent" color={c.accent} onChange={v => updateColor("accent", v)} />
                <ColorEditor label="Accent Foreground" color={c.accentForeground} onChange={v => updateColor("accentForeground", v)} />
                <ColorEditor label="Border" color={c.border} onChange={v => updateColor("border", v)} />
                <ColorEditor label="Ring / Focus" color={c.ring} onChange={v => updateColor("ring", v)} />
              </div>
            </div>
          </TabsContent>

          {/* ── Gradient Tab ── */}
          <TabsContent value="gradient">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Brand Gradient
                </CardTitle>
                <CardDescription>Controls the gradient used for buttons, banners, and highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-16 rounded-2xl shadow-lg" style={{ background: gradBg }} />

                <div className="space-y-2">
                  <Label>Direction</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {(["to-r", "to-br", "to-b", "to-bl", "to-l", "to-tl", "to-t", "to-tr"] as const).map(dir => {
                      const icons: Record<string, string> = {
                        "to-r": "→", "to-br": "↘", "to-b": "↓", "to-bl": "↙",
                        "to-l": "←", "to-tl": "↖", "to-t": "↑", "to-tr": "↗",
                      }
                      return (
                        <button key={dir} onClick={() => updateGradient("direction", dir)}
                          className={`h-9 rounded-lg border text-sm font-bold cursor-pointer transition-colors ${g.direction === dir ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                          {icons[dir]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: toHslStr(g.from) }} />
                      <Label className="text-xs">From</Label>
                    </div>
                    <ColorEditor label="" color={g.from} onChange={v => updateGradient("from", v)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: toHslStr(g.via) }} />
                      <Label className="text-xs">Via (middle)</Label>
                    </div>
                    <ColorEditor label="" color={g.via} onChange={v => updateGradient("via", v)} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: toHslStr(g.to) }} />
                      <Label className="text-xs">To</Label>
                    </div>
                    <ColorEditor label="" color={g.to} onChange={v => updateGradient("to", v)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Typography Tab ── */}
          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" /> Typography
                </CardTitle>
                <CardDescription>Font family and sizing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Font Family</Label>
                  <Input value={brand.fontFamily}
                    onChange={e => update("fontFamily", e.target.value)}
                    placeholder="Inter, system-ui, sans-serif" />
                  <p className="text-xs text-muted-foreground">
                    Enter a valid CSS font stack. Make sure the font is loaded via Google Fonts or similar.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Font Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Inter, system-ui, sans-serif",
                      "Georgia, 'Times New Roman', serif",
                      "'Roboto', sans-serif",
                      "'Playfair Display', serif",
                      "'Space Grotesk', sans-serif",
                      "'DM Sans', sans-serif",
                    ].map(f => (
                      <button key={f} onClick={() => update("fontFamily", f)}
                        className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer transition-colors ${brand.fontFamily === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                        style={{ fontFamily: f }}>
                        {f.split(",")[0].replace(/'/g, "")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
                  <p className="font-black text-xl" style={{ fontFamily: brand.fontFamily }}>Welcome to {brand.siteName}</p>
                  <p className="font-semibold" style={{ fontFamily: brand.fontFamily }}>{brand.tagline}</p>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: brand.fontFamily }}>
                    The quick brown fox jumps over the lazy dog. 1234567890
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Live Preview Panel ── */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Fake nav bar */}
              <div className="rounded-xl overflow-hidden border border-border" style={{
                backgroundColor: toHslStr(c.card),
                fontFamily: brand.fontFamily,
              }}>
                <div className="flex items-center justify-between px-3 py-2 border-b"
                  style={{ borderColor: toHslStr(c.border) }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: gradBg }}>
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-bold text-sm" style={{ color: toHslStr(c.primary) }}>
                      {brand.logoText}
                    </span>
                    <span className="text-[10px]" style={{ color: toHslStr(c.mutedForeground) }}>
                      {brand.domainExtension}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {["Home", "Chat", "Premium"].map(n => (
                      <span key={n} className="text-[9px] px-1.5 py-0.5 rounded"
                        style={{ color: toHslStr(c.mutedForeground) }}>{n}</span>
                    ))}
                  </div>
                </div>

                {/* Hero area */}
                <div className="p-3 text-center" style={{ backgroundColor: toHslStr(c.background) }}>
                  <div className="h-8 rounded-lg mb-2" style={{ background: gradBg }} />
                  <p className="font-black text-xs mb-0.5" style={{ color: toHslStr(c.foreground), fontFamily: brand.fontFamily }}>
                    {brand.siteName}
                  </p>
                  <p className="text-[9px] mb-2" style={{ color: toHslStr(c.mutedForeground), fontFamily: brand.fontFamily }}>
                    {brand.tagline}
                  </p>
                  <div className="flex gap-1.5 justify-center">
                    <button className="px-3 py-1 rounded-lg text-[9px] font-bold text-white cursor-pointer"
                      style={{ background: gradBg }}>
                      {brand.logoText}
                    </button>
                    <button className="px-3 py-1 rounded-lg text-[9px] font-medium border cursor-pointer"
                      style={{
                        color: toHslStr(c.foreground),
                        borderColor: toHslStr(c.border),
                        backgroundColor: "transparent",
                      }}>
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Cards */}
                <div className="p-2 grid grid-cols-2 gap-1.5">
                  {["Connect", "Chat", "Generate", "Premium"].map((item, i) => (
                    <div key={item} className="rounded-lg p-2 border"
                      style={{
                        backgroundColor: toHslStr(c.card),
                        borderColor: toHslStr(c.border),
                      }}>
                      <div className="w-4 h-4 rounded mb-1"
                        style={{ background: i % 2 === 0 ? toHslStr(c.primary) : toHslStr(c.secondary) }} />
                      <p className="text-[8px] font-semibold" style={{ color: toHslStr(c.cardForeground), fontFamily: brand.fontFamily }}>{item}</p>
                      <p className="text-[7px]" style={{ color: toHslStr(c.mutedForeground) }}>Feature</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color swatches */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">Active Palette</p>
                <div className="grid grid-cols-7 gap-1">
                  {[
                    { key: "primary", color: c.primary },
                    { key: "secondary", color: c.secondary },
                    { key: "background", color: c.background },
                    { key: "foreground", color: c.foreground },
                    { key: "card", color: c.card },
                    { key: "muted", color: c.muted },
                    { key: "accent", color: c.accent },
                  ].map(({ key, color }) => (
                    <div key={key} title={key}
                      className="aspect-square rounded-md border border-white/10"
                      style={{ background: toHslStr(color) }} />
                  ))}
                </div>
              </div>

              {/* Gradient strip */}
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">Brand Gradient</p>
                <div className="h-6 rounded-lg" style={{ background: gradBg }} />
              </div>

              <Button className="w-full cursor-pointer text-xs" size="sm" onClick={applyLive} style={{ background: gradBg }}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Apply Live to Site
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
