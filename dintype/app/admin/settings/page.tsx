"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSite } from "@/components/site-context"
import { useLanguage } from "@/components/language-context"
import { AlertCircle } from "lucide-react"

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useSite()
  const { t } = useLanguage()
  const [siteSettings, setSiteSettings] = useState(settings)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    setSiteSettings(settings)
  }, [settings])

  const handleLanguageChange = (value: "en" | "sv") => {
    setSiteSettings((prev) => ({ ...prev, language: value }))
  }

  const handleStripeSecretKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteSettings((prev) => ({ ...prev, stripeSecretKey: e.target.value }))
  }

  const handleStripeWebhookSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiteSettings((prev) => ({ ...prev, stripeWebhookSecret: e.target.value }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveStatus("idle")

    try {
      await updateSettings(siteSettings)
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
      setSaveStatus("error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Inställningar</h1>

      <div className="mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Språk</h2>
          <p className="text-gray-600 mt-1">Välj standardspråk för administratörsgränssnittet</p>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-gray-900">
              Välj språk
            </Label>
            <Select value={siteSettings.language} onValueChange={(value) => handleLanguageChange(value as "en" | "sv")}>
              <SelectTrigger id="language" className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Välj språk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">Engelska</SelectItem>
                <SelectItem value="sv">Svenska</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Språkinställningen påverkar endast administratörsgränssnittet. Användarnas språk ställs in separat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Stripe-integration</h2>
          <p className="text-gray-600 mt-1">Hantera betalningsinställningar för Stripe</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="stripeSecretKey" className="text-gray-900">
                Stripe hemlig nyckel
              </Label>
              <Input
                id="stripeSecretKey"
                type="password"
                value={siteSettings.stripeSecretKey || ""}
                onChange={handleStripeSecretKeyChange}
                className="mt-1 bg-white border-gray-300 text-gray-900"
              />
              <p className="text-sm text-gray-600 mt-1">
                Den hemliga nyckeln används för att autentisera förfrågningar till Stripe API
              </p>
            </div>
            <div>
              <Label htmlFor="stripeWebhookSecret" className="text-gray-900">
                Stripe Webhook-hemlighet
              </Label>
              <Input
                id="stripeWebhookSecret"
                type="password"
                value={siteSettings.stripeWebhookSecret || ""}
                onChange={handleStripeWebhookSecretChange}
                className="mt-1 bg-white border-gray-300 text-gray-900"
              />
              <p className="text-sm text-gray-600 mt-1">
                Används för att verifiera att webhook-händelser kommer från Stripe
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-gray-900 hover:bg-gray-800 text-white">
            {isSaving ? "Sparar..." : "Spara inställningar"}
          </Button>
          {saveStatus === "success" && <span className="text-green-600 ml-4">Inställningarna har sparats!</span>}
          {saveStatus === "error" && (
            <span className="text-red-600 ml-4">Ett fel uppstod när inställningarna skulle sparas.</span>
          )}
        </div>
      </div>
    </div>
  )
}
