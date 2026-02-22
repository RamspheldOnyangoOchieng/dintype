"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-context"
import { useSite } from "@/components/site-context"
import { useTranslations } from "@/lib/use-translations"
import { AdminDebug } from "@/components/admin-debug"
import { Settings, Globe, CreditCard, Save, AlertCircle, Plug, Palette } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BrandingPanel } from "@/components/branding-panel"

interface StripeSettings {
  stripe_secret_key: string
  stripe_webhook_secret: string
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<StripeSettings>({
    stripe_secret_key: "",
    stripe_webhook_secret: "",
  })


  const [currencyConfig, setCurrencyConfig] = useState({
    code: "USD",
    symbol: "$",
    rate: 1.0
  })
  const [isSavingCurrency, setIsSavingCurrency] = useState(false)

  const router = useRouter()
  const { user } = useAuth()
  const { settings: siteSettings, updateSettings: updateSiteSettings } = useSite()
  const { t } = useTranslations()

  useEffect(() => {
    // Check if user is admin and load settings
    const checkAdminAndLoadSettings = async () => {
      try {
        setIsLoading(true)

        // If no user, we're not authenticated
        if (!user) {
          router.push("/admin/login?redirect=/admin/settings")
          return
        }

        // Load all settings via secure API (avoids RLS/admin_settings issues)
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          const data = await res.json()
          if (data.settings) {
            const stripeKey = data.settings.find((s: any) => s.key === "stripe_secret_key")
            const stripeWebhook = data.settings.find((s: any) => s.key === "stripe_webhook_secret")
            const currencyEntry = data.settings.find((s: any) => s.key === "currency_config")
            if (stripeKey?.value)    setSettings(prev => ({ ...prev, stripe_secret_key: stripeKey.value }))
            if (stripeWebhook?.value) setSettings(prev => ({ ...prev, stripe_webhook_secret: stripeWebhook.value }))
            if (currencyEntry?.value) setCurrencyConfig(currencyEntry.value)
            const langEntry = data.settings.find((s: any) => s.key === "site_language")
            if (langEntry?.value) updateSiteSettings({ language: langEntry.value as "en" | "sv" })
          }
        }

      } catch (error) {
        console.error("Error loading admin settings:", error)
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAndLoadSettings()
  }, [user?.id]) // Only depend on user ID

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)

      const results = await Promise.all([
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "stripe_secret_key", value: settings.stripe_secret_key }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "stripe_webhook_secret", value: settings.stripe_webhook_secret }),
        }),
      ])

      for (const res of results) {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `HTTP ${res.status}`)
        }
      }

      toast.success(t("admin.settingsSaved"))
    } catch (error: any) {
      console.error("Error saving settings:", error)
      toast.error(error?.message || t("admin.settingsError"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveCurrency = async () => {
    try {
      setIsSavingCurrency(true)

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "currency_config",
          value: currencyConfig
        })
      })

      if (!response.ok) throw new Error("Failed to save currency config")

      toast.success("Currency settings updated successfully")

      // Notify all tabs to re-sync
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("site-settings-sync")
        bc.postMessage({ type: "settings-updated" })
        bc.close()
      }

      // Update site context too
      updateSiteSettings({
        pricing: {
          ...siteSettings.pricing,
          currency: currencyConfig.symbol
        }
      })
    } catch (error) {
      console.error("Error saving currency settings:", error)
      toast.error("Failed to update currency")
    } finally {
      setIsSavingCurrency(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleLanguageChange = async (value: "en" | "sv") => {
    updateSiteSettings({ language: value })
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site_language", value }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      // Broadcast to all same-origin tabs so they switch language immediately
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel("site-settings-sync")
        bc.postMessage({ type: "settings-updated" })
        bc.close()
      }
      toast.success(value === "sv" ? "Språk ändrat till Svenska" : "Language changed to English")
    } catch (err: any) {
      toast.error(`Failed to save language: ${err.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t ? t("admin.settings") : "Admin Settings"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Configure system settings and integrations</p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-xl">
          <TabsTrigger value="general" className="gap-1.5 cursor-pointer">
            <Settings className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5 cursor-pointer">
            <Palette className="w-4 h-4" /> Branding &amp; Theme
          </TabsTrigger>
        </TabsList>

        {/* ── General Tab ── */}
        <TabsContent value="general" className="space-y-8 mt-6">
          {/* Quick Links Card - MOVED TO TOP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plug className="h-5 w-5 text-primary" />
                  <span>🔌 External Integrations</span>
                </CardTitle>
                <CardDescription>
                  Configure Stripe webhooks, OAuth providers, and email services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/admin/settings/integrations")}
                  className="w-full"
                  size="lg"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Manage Integrations
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  ✨ Set up Stripe, OAuth, and email services from a simple admin interface.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>📧 Email Templates</span>
                </CardTitle>
                <CardDescription>
                  Customize welcome, payment, and notification emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/admin/settings/email-templates")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Email Templates
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  ✨ Edit HTML &amp; text templates with live preview - no code editing required!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span>{t("admin.language")}</span>
              </CardTitle>
              <CardDescription>{t("admin.languageDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t("admin.selectLanguage")}</Label>
                  <Select
                    value={siteSettings.language}
                    onValueChange={(value) => handleLanguageChange(value as "en" | "sv")}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t("admin.selectLanguage")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇺🇸</span>
                          <span>{t("admin.english")}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sv">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇸🇪</span>
                          <span>{t("admin.swedish")}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currency Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span>Currency Settings</span>
              </CardTitle>
              <CardDescription>Configure the primary currency for the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currencyCode">Currency Code</Label>
                  <Input
                    id="currencyCode"
                    placeholder="USD"
                    value={currencyConfig.code}
                    onChange={(e) => setCurrencyConfig({ ...currencyConfig, code: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">ISO 4217 Code (e.g. USD, EUR, SEK)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input
                    id="currencySymbol"
                    placeholder="$"
                    value={currencyConfig.symbol}
                    onChange={(e) => setCurrencyConfig({ ...currencyConfig, symbol: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Symbol displayed next to price (e.g. $, €, kr)</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currencyRate">Exchange Rate (vs USD)</Label>
                  <Input
                    id="currencyRate"
                    type="number"
                    step="0.001"
                    placeholder="1.0"
                    value={currencyConfig.rate}
                    onChange={(e) => setCurrencyConfig({ ...currencyConfig, rate: parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">1 USD = ? (Set 1.0 for USD)</p>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrencyConfig({ code: 'USD', symbol: '$', rate: 1.0 })}
                >
                  Reset to USD ($)
                </Button>
                <Button
                  onClick={handleSaveCurrency}
                  disabled={isSavingCurrency}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSavingCurrency ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Currency Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <div className="space-y-6">
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Current system status and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-500">Environment</Label>
                    <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {process.env.NODE_ENV || "development"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-500">Version</Label>
                    <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">v1.0.0</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-500">Last Updated</Label>
                    <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Branding & Theme Tab ── */}
        <TabsContent value="branding" className="mt-6">
          <BrandingPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
