"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertCircle, Users, ImageIcon, MessageSquare, Settings, Database } from "lucide-react"
import Link from "next/link"

// Swedish translations
const translations = {
  dashboard: "Kontrollpanel",
  manageContent: "Hantera webbplatsinnehåll och inställningar",
  overview: "Översikt",
  content: "Innehåll",
  users: "Användare",
  settings: "Inställningar",
  manageUserAccounts: "Hantera användarkonton",
  manageAICharacters: "Hantera AI-karaktärer",
  manageGeneratedImages: "Hantera genererade bilder",
  quickActions: "Snabbåtgärder",
  createCharacter: "Skapa karaktär",
  manageBanners: "Hantera banners",
  manageSubscriptions: "Hantera prenumerationer",
  viewTransactions: "Visa transaktioner",
  apiKeys: "API-nycklar",
  database: "Databas",
  contentManagement: "Innehållshantering",
  manageAllContent: "Hantera allt innehåll på din webbplats",
  characters: "Karaktärer",
  banners: "Banners",
  imageSuggestions: "Bildförslag",
  termsConditions: "Användarvillkor",
  userManagement: "Användarhantering",
  manageUsersPermissions: "Hantera användare och behörigheter",
  allUsers: "Alla användare",
  premiumUsers: "Premiumanvändare",
  systemSettings: "Systeminställningar",
  configureSystemSettings: "Konfigurera systeminställningar",
  generalSettings: "Allmänna inställningar",
  paymentMethods: "Betalningsmetoder",
  seoSettings: "SEO-inställningar",
  accessDenied: "Åtkomst nekad. Administratörsbehörighet krävs.",
  returnToLogin: "Återgå till inloggning",
  loading: "Laddar...",
  view: "Visa",
}

export default function AdminDashboardPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Add console logs to debug
    console.log("Dashboard - Auth state:", { user, isAdmin, isLoading })

    // Only check after loading is complete
    if (!isLoading) {
      setAuthChecked(true)

      if (!user) {
        console.log("No user found, redirecting to login")
        router.push("/admin/login")
      } else if (!isAdmin) {
        console.log("User is not admin, redirecting to login")
        router.push("/admin/login")
      } else {
        console.log("User is admin, staying on dashboard")
      }
    }
  }, [user, isAdmin, isLoading, router])

  // Show loading state while checking auth
  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D8D]"></div>
      </div>
    )
  }

  // If we've checked auth and the user is not admin, show access denied
  // This is a fallback in case the redirect doesn't happen immediately
  if (authChecked && (!user || !isAdmin)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center">
          <AlertCircle className="h-6 w-6 mr-3" />
          <span className="text-lg">{translations.accessDenied}</span>
        </div>
        <Button asChild className="bg-[#FF4D8D] hover:bg-[#FF3D7D] text-white">
          <Link href="/admin/login">{translations.returnToLogin}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{translations.dashboard}</h1>
        <p className="text-gray-600 mt-2">{translations.manageContent}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-gray-100 border border-gray-200 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
            {translations.overview}
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
            {translations.content}
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
            {translations.users}
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#FF4D8D] data-[state=active]:text-white">
            {translations.settings}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center text-gray-900">
                  <Users className="mr-2 h-5 w-5 text-[#FF4D8D]" />
                  {translations.users}
                </CardTitle>
                <CardDescription className="text-gray-600">{translations.manageUserAccounts}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">--</span>
                  <Button asChild variant="outline" className="border-gray-300 text-[#FF4D8D] hover:bg-gray-100">
                    <Link href="/admin/dashboard/users">{translations.view}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center text-gray-900">
                  <MessageSquare className="mr-2 h-5 w-5 text-[#FF4D8D]" />
                  {translations.characters}
                </CardTitle>
                <CardDescription className="text-gray-600">{translations.manageAICharacters}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">--</span>
                  <Button asChild variant="outline" className="border-gray-300 text-[#FF4D8D] hover:bg-gray-100">
                    <Link href="/admin/dashboard/characters">{translations.view}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center text-gray-900">
                  <ImageIcon className="mr-2 h-5 w-5 text-[#FF4D8D]" />
                  {translations.imageSuggestions}
                </CardTitle>
                <CardDescription className="text-gray-600">{translations.manageGeneratedImages}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">--</span>
                  <Button asChild variant="outline" className="border-gray-300 text-[#FF4D8D] hover:bg-gray-100">
                    <Link href="/admin/dashboard/image-suggestions">{translations.view}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center text-gray-900">
                <Settings className="mr-2 h-5 w-5 text-[#FF4D8D]" />
                {translations.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/banners">{translations.manageBanners}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/subscriptions">{translations.manageSubscriptions}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/transactions">{translations.viewTransactions}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/api-keys">{translations.apiKeys}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/database">{translations.database}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">{translations.contentManagement}</CardTitle>
              <CardDescription className="text-gray-600">{translations.manageAllContent}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/characters">{translations.characters}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/banners">{translations.banners}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/image-suggestions">{translations.imageSuggestions}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/terms">{translations.termsConditions}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">{translations.userManagement}</CardTitle>
              <CardDescription className="text-gray-600">{translations.manageUsersPermissions}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/users">{translations.allUsers}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/premium-users">{translations.premiumUsers}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">{translations.systemSettings}</CardTitle>
              <CardDescription className="text-gray-600">{translations.configureSystemSettings}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/settings">{translations.generalSettings}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/payment-methods">{translations.paymentMethods}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/api-keys">{translations.apiKeys}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/seo">{translations.seoSettings}</Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100">
                  <Link href="/admin/dashboard/database">
                    <Database className="mr-2 h-4 w-4" />
                    {translations.database}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
