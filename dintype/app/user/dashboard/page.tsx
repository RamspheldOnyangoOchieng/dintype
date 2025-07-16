"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { User, Crown, Coins, MessageSquare, ImageIcon, Settings, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { SubscriptionSection } from "@/components/dashboard/subscription-section"
import { CreditsSection } from "@/components/dashboard/credits-section"
import { ChatHistorySection } from "@/components/dashboard/chat-history-section"
import { ImageHistorySection } from "@/components/dashboard/image-history-section"
import { QuickActions } from "@/components/dashboard/quick-actions"

interface DashboardStats {
  totalMessages: number
  totalImages: number
  creditsUsed: number
  remainingCredits: number
  totalCredits: number
  isPremium: boolean
  premiumExpiry?: string
}

export default function UserDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/user/dashboard")
    }
  }, [user, isLoading, router])

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        setIsLoadingStats(true)

        // Fetch credits
        const creditsResponse = await fetch("/api/credits", {
          credentials: "include",
        })
        const creditsData = await creditsResponse.json()

        // Fetch premium status
        const premiumResponse = await fetch("/api/check-premium-status", {
          credentials: "include",
        })
        const premiumData = await premiumResponse.json()

        // Fetch chat stats
        const chatResponse = await fetch("/api/user/stats", {
          credentials: "include",
        })
        const chatData = await chatResponse.json()

        setStats({
          totalMessages: chatData.totalMessages || 0,
          totalImages: chatData.totalImages || 0,
          creditsUsed: creditsData.credits?.used_credits || 0,
          remainingCredits: creditsData.credits?.remaining_credits || 0,
          totalCredits: creditsData.credits?.total_credits || 0,
          isPremium: premiumData.isPremium || false,
          premiumExpiry: premiumData.expiryDate,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          title: "Fel",
          description: "Kunde inte hämta dashboard-statistik",
          variant: "destructive",
        })
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [user, toast])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const usagePercentage = stats ? (stats.creditsUsed / stats.totalCredits) * 100 : 0
  const isLowCredits = stats && stats.remainingCredits < 10
  const isOutOfCredits = stats && stats.remainingCredits <= 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Välkommen tillbaka, {user.username}!</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              {stats?.isPremium ? (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <Crown className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              ) : (
                <Badge variant="outline">Gratis</Badge>
              )}
              <Button variant="outline" onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Inställningar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Återstående krediter</CardTitle>
              <Coins
                className={`h-4 w-4 ${isOutOfCredits ? "text-red-500" : isLowCredits ? "text-yellow-500" : "text-muted-foreground"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? "..." : stats?.remainingCredits || 0}
                {isOutOfCredits && <AlertTriangle className="inline ml-2 h-5 w-5 text-red-500" />}
              </div>
              <p className="text-xs text-muted-foreground">av {stats?.totalCredits || 0} totala</p>
              <Progress value={100 - usagePercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meddelanden</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats?.totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground">totalt skickade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Genererade bilder</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingStats ? "..." : stats?.totalImages || 0}</div>
              <p className="text-xs text-muted-foreground">totalt skapade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prenumeration</CardTitle>
              {stats?.isPremium ? (
                <Crown className="h-4 w-4 text-yellow-500" />
              ) : (
                <User className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.isPremium ? "Premium" : "Gratis"}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.isPremium && stats.premiumExpiry
                  ? `Förnyelse ${format(new Date(stats.premiumExpiry), "d MMM", { locale: sv })}`
                  : "Uppgradera för fler funktioner"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Low Credits Warning */}
        {isLowCredits && (
          <Card className="border-yellow-500 bg-yellow-50 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-800">
                    {isOutOfCredits ? "Inga krediter kvar!" : "Lågt antal krediter!"}
                  </h3>
                  <p className="text-sm text-yellow-700">
                    {isOutOfCredits
                      ? "Du har inga krediter kvar. Köp fler krediter för att fortsätta använda tjänsten."
                      : "Du har få krediter kvar. Överväg att köpa fler krediter snart."}
                  </p>
                </div>
                <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={() => router.push("/premium")}>
                  Köp krediter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Översikt</TabsTrigger>
            <TabsTrigger value="credits">Krediter</TabsTrigger>
            <TabsTrigger value="chats">Chattar</TabsTrigger>
            <TabsTrigger value="images">Bilder</TabsTrigger>
            <TabsTrigger value="subscription">Prenumeration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProfileSection user={user} />
                <QuickActions />
              </div>
              <div className="space-y-6">
                <SubscriptionSection isPremium={stats?.isPremium} premiumExpiry={stats?.premiumExpiry} />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Senaste aktivitet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Inloggad just nu</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Skickade meddelande för 5 min sedan</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ImageIcon className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Genererade bild igår</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credits">
            <CreditsSection />
          </TabsContent>

          <TabsContent value="chats">
            <ChatHistorySection />
          </TabsContent>

          <TabsContent value="images">
            <ImageHistorySection />
          </TabsContent>

          <TabsContent value="subscription">
            <SubscriptionSection isPremium={stats?.isPremium} premiumExpiry={stats?.premiumExpiry} detailed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
