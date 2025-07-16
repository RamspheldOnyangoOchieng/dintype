"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { Home, Eye, EyeOff, Save, Check, AlertTriangle } from "lucide-react"
import { getApiKey, setApiKey } from "@/lib/db-init"

export default function AdminApiKeysPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [novitaApiKey, setNovitaApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  // Load API key on mount
  useEffect(() => {
    async function loadApiKey() {
      const key = await getApiKey("novita_api_key")
      if (key) {
        setNovitaApiKey(key)
      }
    }

    if (user?.isAdmin) {
      loadApiKey()
    }
  }, [user])

  const handleSaveApiKey = async () => {
    setIsSaving(true)
    setSaveStatus("idle")
    setStatusMessage("")

    try {
      const success = await setApiKey("novita_api_key", novitaApiKey)

      if (success) {
        setSaveStatus("success")
        setStatusMessage("API-nyckel sparad!")
      } else {
        setSaveStatus("error")
        setStatusMessage("Kunde inte spara API-nyckeln. Försök igen.")
      }
    } catch (error) {
      console.error("Error saving API key:", error)
      setSaveStatus("error")
      setStatusMessage("Ett fel uppstod när API-nyckeln skulle sparas.")
    } finally {
      setIsSaving(false)

      // Clear status message after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle")
        setStatusMessage("")
      }, 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-800">Laddar...</div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">API-nyckelhantering</h2>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-gray-300 hover:bg-gray-100 text-gray-900 font-medium"
            >
              <Home className="mr-2 h-4 w-4" />
              Visa webbplats
            </Button>
          </header>

          <div className="p-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Novita AI API-nyckel</h3>

              <p className="text-gray-600 mb-6">
                Ange din Novita AI API-nyckel nedan. Denna nyckel används för att generera karaktärsbeskrivningar och
                systemprompts. Du kan få en nyckel från{" "}
                <a
                  href="https://novita.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Novita AI webbplats
                </a>
                .
              </p>

              {saveStatus === "success" && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  {statusMessage}
                </div>
              )}

              {saveStatus === "error" && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {statusMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={novitaApiKey}
                    onChange={(e) => setNovitaApiKey(e.target.value)}
                    placeholder="Ange din Novita AI API-nyckel"
                    className="bg-white border-gray-300 text-gray-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Button
                  onClick={handleSaveApiKey}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Sparar...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Spara API-nyckel
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
                <h4 className="font-medium mb-2">Viktig information:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Din API-nyckel lagras säkert i databasen och är endast tillgänglig för administratörer.</li>
                  <li>API-nyckeln kommer att användas för alla AI-drivna funktioner i applikationen.</li>
                  <li>
                    Om du inte har en Novita AI API-nyckel kommer applikationen att använda en demonyckel med begränsad
                    funktionalitet.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
