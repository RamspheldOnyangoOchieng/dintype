"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, User, Key, CreditCard, Calendar, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"
import { useTranslations } from "@/lib/use-translations"
import { format } from "date-fns"
import { CreditsDashboard } from "@/components/credits-dashboard"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useTranslations()
  const [isPremium, setIsPremium] = useState<boolean | null>(null)
  const [premiumExpiry, setPremiumExpiry] = useState<string | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile")
    }
  }, [user, isLoading, router])

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        setIsCheckingStatus(true)

        // Get user ID from wherever we can
        const userId = user?.id || localStorage.getItem("userId") || sessionStorage.getItem("userId")

        if (!userId) {
          console.log("No user ID available for premium check")
          setIsPremium(false)
          setIsCheckingStatus(false)
          return
        }

        // Add a cache-busting parameter and user ID
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/check-premium-status?t=${timestamp}&userId=${userId}`, {
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        const data = await response.json()

        if (response.ok) {
          setIsPremium(data.isPremium)
          setPremiumExpiry(data.expiryDate || null)
        } else {
          console.error("Error checking premium status:", data.error || data.message)
          // Don't show an error toast, just log it
        }
      } catch (error) {
        console.error("Error checking premium status:", error)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    checkPremiumStatus()
  }, [user])

  const handleRefreshStatus = async () => {
    setIsRefreshing(true)
    try {
      // Get user ID from wherever we can
      const userId = user?.id || localStorage.getItem("userId") || sessionStorage.getItem("userId")

      if (!userId) {
        toast({
          title: t("error"),
          description: "No user ID available",
          variant: "destructive",
        })
        return
      }

      // Wait a moment
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check premium status again
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/check-premium-status?t=${timestamp}&userId=${userId}`, {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Premium status refresh error:", data)
        toast({
          title: t("error"),
          description: t("profile.errorRefreshingStatus"),
          variant: "destructive",
        })
      } else {
        setIsPremium(!!data.isPremium)
        setPremiumExpiry(data.expiryDate || null)
        toast({
          title: t("success"),
          description: t("profile.statusRefreshed"),
        })
      }
    } catch (error) {
      console.error("Error refreshing status:", error)
      toast({
        title: t("error"),
        description: t("profile.errorRefreshingStatus"),
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        title: t("error"),
        description: t("profile.passwordsDoNotMatch"),
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: t("error"),
        description: t("profile.passwordTooShort"),
        variant: "destructive",
      })
      return
    }

    try {
      setIsChangingPassword(true)

      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: t("success"),
          description: t("profile.passwordChanged"),
        })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast({
          title: t("error"),
          description: data.error || t("profile.errorChangingPassword"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: t("error"),
        description: t("profile.errorChangingPassword"),
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{t("profile.title")}</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="credits">Krediter</TabsTrigger>
          <TabsTrigger value="security">Säkerhet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card className="bg-white border-gray-200 md:col-span-3">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">{t("profile.accountInfo")}</CardTitle>
                <CardDescription className="text-gray-600">{t("profile.accountInfoDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">{t("profile.username")}</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">{user.username}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">{t("profile.email")}</Label>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-900 font-medium">{user.email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">{t("profile.accountCreated")}</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">
                        {user.createdAt ? format(new Date(user.createdAt), "PPP") : "-"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">{t("profile.accountType")}</Label>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">
                        {user.isAdmin ? (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            {t("profile.admin")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            {t("profile.user")}
                          </Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status Card */}
            <Card className="bg-white border-gray-200 md:col-span-3">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">{t("profile.subscriptionStatus")}</CardTitle>
                <CardDescription className="text-gray-600">{t("profile.subscriptionStatusDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {isCheckingStatus ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          isPremium ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isPremium ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {isPremium ? t("profile.premiumActive") : t("profile.notPremium")}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {isPremium ? t("profile.premiumActiveDesc") : t("profile.notPremiumDesc")}
                        </p>
                      </div>
                    </div>

                    {isPremium && premiumExpiry && (
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{t("profile.expiryDate")}</h3>
                          <p className="text-sm text-gray-600">{format(new Date(premiumExpiry), "PPP")}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-4">
                      {!isPremium && (
                        <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/premium")}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          {t("profile.upgradeToPremium")}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={handleRefreshStatus}
                        disabled={isRefreshing}
                        className="border-gray-300"
                      >
                        {isRefreshing ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Uppdaterar...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Uppdatera status
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credits">
          <CreditsDashboard />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Change Password Card */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-900">{t("profile.changePassword")}</CardTitle>
              <CardDescription className="text-gray-600">{t("profile.changePasswordDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-gray-700">
                    {t("profile.currentPassword")}
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="current-password"
                      type="password"
                      className="pl-10 bg-white border-gray-300 text-gray-900"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-700">
                    {t("profile.newPassword")}
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-password"
                      type="password"
                      className="pl-10 bg-white border-gray-300 text-gray-900"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{t("profile.passwordRequirements")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-700">
                    {t("profile.confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      className="pl-10 bg-white border-gray-300 text-gray-900"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full md:w-auto bg-primary hover:bg-primary/90"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? t("profile.changing") : t("profile.changePassword")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
