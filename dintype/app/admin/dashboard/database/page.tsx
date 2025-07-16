"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { useCharacters } from "@/components/character-context"
import { Home, RefreshCw, Check, AlertTriangle, Copy, ExternalLink, Database } from "lucide-react"

export default function AdminDatabasePage() {
  const { user, isLoading } = useAuth()
  const { initDb, error: dbError, storageBucketExists, createAdminUsersTable } = useCharacters()
  const router = useRouter()
  const [isInitializing, setIsInitializing] = useState(false)
  const [initStatus, setInitStatus] = useState<"idle" | "success" | "error" | "warning">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [dbInitialized, setDbInitialized] = useState(false)

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  const handleInitializeDatabase = async () => {
    setIsInitializing(true)
    setStatusMessage("Initierar databas...")

    try {
      const success = await initDb()

      if (success) {
        if (!storageBucketExists) {
          setInitStatus("warning")
          setStatusMessage(
            "Databastabell skapades framgångsrikt, men lagringsbehållaren kräver manuella steg. Se instruktionerna nedan.",
          )
        } else {
          setInitStatus("success")
          setStatusMessage("Databasen initierades framgångsrikt!")
        }
        setDbInitialized(true)
      } else {
        setInitStatus("error")
        setStatusMessage(
          "Kunde inte initiera databasen automatiskt. Använd de manuella inställningsinstruktionerna nedan.",
        )
        setDbInitialized(false)
      }
    } catch (err) {
      console.error("Fel vid initiering av databas:", err)
      setInitStatus("error")
      setStatusMessage("Ett fel uppstod under initieringen.")
      setDbInitialized(false)
    } finally {
      setIsInitializing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
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
            <h2 className="text-xl font-bold">Databashantering</h2>
            <Button variant="outline" onClick={() => router.push("/")}>
              <Home className="mr-2 h-4 w-4" />
              Visa webbplats
            </Button>
          </header>

          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Databasstatus</h3>

              {dbError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Databasfel</p>
                    <p className="text-sm">{dbError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                  className={`p-4 rounded-lg border ${dbInitialized ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}
                >
                  <div className="flex items-center mb-2">
                    {dbInitialized ? <Check className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
                    <h4 className="font-medium">Databastabell</h4>
                  </div>
                  <p className="text-sm">
                    {dbInitialized
                      ? "Karaktärstabellen är korrekt inställd."
                      : "Karaktärstabellen existerar inte. Initiera den med knappen nedan eller följ de manuella inställningsinstruktionerna."}
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-blue-50 border-blue-200 text-blue-700">
                  <div className="flex items-center mb-2">
                    <Check className="h-5 w-5 mr-2" />
                    <h4 className="font-medium">Bildlagring</h4>
                  </div>
                  <p className="text-sm">Använder Cloudinary för bildlagring. Ingen ytterligare inställning krävs.</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Om du ser fel om saknade tabeller eller relationer kan du försöka initiera databasschemat här. Detta
                  kommer att försöka skapa karaktärstabellen, men du måste manuellt ställa in lagringsbehållaren.
                </p>

                {initStatus === "success" && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    {statusMessage}
                  </div>
                )}

                {initStatus === "warning" && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {statusMessage}
                  </div>
                )}

                {initStatus === "error" && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {statusMessage}
                  </div>
                )}

                <Button
                  onClick={handleInitializeDatabase}
                  disabled={isInitializing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isInitializing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Initierar...
                    </>
                  ) : (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      Initiera databastabell
                    </>
                  )}
                </Button>
                <Button
                  onClick={async () => {
                    setIsInitializing(true)
                    try {
                      const success = await createAdminUsersTable()
                      if (success) {
                        setInitStatus("success")
                        setStatusMessage("Administratörsanvändartabell skapades framgångsrikt!")
                      } else {
                        setInitStatus("error")
                        setStatusMessage("Kunde inte skapa administratörsanvändartabell.")
                      }
                    } catch (error) {
                      console.error("Fel vid skapande av administratörsanvändartabell:", error)
                      setInitStatus("error")
                      setStatusMessage("Ett fel uppstod vid skapande av administratörsanvändartabell.")
                    } finally {
                      setIsInitializing(false)
                    }
                  }}
                  disabled={isInitializing}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Initiera administratörsanvändartabell
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Manuella inställningsinstruktioner</h3>

              <p className="text-gray-600 mb-4">
                För den mest tillförlitliga inställningen, följ dessa manuella steg för att konfigurera din databas:
              </p>

              <div className="mb-6">
                <h4 className="font-medium mb-2 text-gray-800">Steg 1: Skapa databastabell</h4>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4 ml-2">
                  <li>
                    <p>
                      Gå till{" "}
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center"
                      >
                        Supabase Dashboard
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>{" "}
                      och välj ditt projekt
                    </p>
                  </li>
                  <li>
                    <p>Navigera till SQL Editor</p>
                  </li>
                  <li>
                    <p>Skapa en ny fråga och klistra in följande SQL:</p>
                    <div className="relative mt-2">
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-gray-600 hover:text-gray-800"
                          onClick={copyToClipboard}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="ml-1">{copied ? "Kopierad!" : "Kopiera"}</span>
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-80 border border-gray-200">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{sqlScript}</pre>
                      </div>
                    </div>
                  </li>
                  <li>
                    <p>Kör frågan för att skapa tabellen och policyer</p>
                  </li>
                </ol>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2 text-gray-800">Steg 2: Skapa lagringsbehållare</h4>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4 ml-2">
                  <li>
                    <p>I Supabase Dashboard, navigera till Storage</p>
                  </li>
                  <li>
                    <p>Klicka på "Skapa en ny behållare"</p>
                  </li>
                  <li>
                    <p>Ange "assets" som behållarnamn</p>
                  </li>
                  <li>
                    <p>Markera "Offentlig behållare" för att göra behållaren offentligt tillgänglig</p>
                  </li>
                  <li>
                    <p>Klicka på "Skapa behållare"</p>
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-gray-800">Steg 3: Ställ in lagringspolicyer</h4>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-4 ml-2">
                  <li>
                    <p>I Storage-sektionen, klicka på "assets"-behållaren</p>
                  </li>
                  <li>
                    <p>Gå till fliken "Policyer"</p>
                  </li>
                  <li>
                    <p>Klicka på "Lägg till policyer" och skapa följande policyer:</p>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-600">
                      <li>Välj policy: Tillåt offentlig åtkomst (för alla)</li>
                      <li>Infoga policy: Tillåt endast autentiserade användare</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
                <p className="font-medium mb-1">Efter att ha slutfört dessa steg:</p>
                <p className="text-sm">
                  Uppdatera applikationen och navigera tillbaka till denna sida för att verifiera att både databastabell
                  och lagringsbehållare är korrekt inställda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// SQL script for manual setup
const sqlScript = `-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  personality TEXT,
  occupation TEXT,
  hobbies TEXT,
  body TEXT,
  ethnicity TEXT,
  language TEXT,
  relationship TEXT,
  is_new BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  system_prompt TEXT NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS characters_created_at_idx ON characters (created_at DESC);

-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" 
  ON characters FOR SELECT 
  USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access" 
  ON characters FOR ALL 
  USING (auth.role() = 'authenticated');

-- Set up storage for character images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to assets
CREATE POLICY "Allow public access to assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- Allow authenticated users to upload assets
CREATE POLICY "Allow authenticated users to upload assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');`
