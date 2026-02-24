"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  Shield,
  Coins,
  CreditCard,
  Activity,
  Settings,
  LogOut,
  Trash2,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Loader2,
  Lock,
  Globe,
  Bell,
  XCircle
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/lib/use-translations"
import DeleteFeedbackModal from "@/components/delete-feedback-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { TokenTransactionHistory } from "@/components/token-transaction-history"
import { TokenUsageStats } from "@/components/token-usage-stats"
import { UnifiedActivityList } from "@/components/unified-activity-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

const rules = [
  "profile.rule1",
  "profile.rule2",
  "profile.rule3",
  "profile.rule4",
  "profile.rule5",
  "profile.rule6",
  "profile.rule7",
  "profile.rule8",
  "profile.rule9",
]

export default function ProfilePage() {
  const { user, isLoading, logout, refreshUser, tokenBalance, creditBalance } = useAuth()
  const router = useRouter()
  const { t } = useTranslations()

  const [mounted, setMounted] = useState(false)

  // Profile Data State
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "Male",
    language: "en",
    notifications: true,
  })

  const [isPremium, setIsPremium] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  // Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Deletion Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteFeedback, setDeleteFeedback] = useState({ reason: "", description: "" })

  useEffect(() => {
    setMounted(true)
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile")
    }
  }, [user, isLoading, router])

  // Fetch Full Profile on mount or user change
  useEffect(() => {
    const fetchFullProfile = async () => {
      // Don't fetch if already fetching or if user doesn't exist
      if (!user) return

      try {
        setIsDataLoading(true)
        const supabase = createClient()

        // Fetch from profiles table
        const { data: profile } = await (supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle() as any)

        if (profile) {
          setProfileData({
            username: profile.username || user.username || "",
            email: profile.email || user.email || "",
            phone: profile.phone || "",
            gender: profile.gender || "Male",
            language: profile.language || "en",
            notifications: profile.notifications !== false,
          })
          setIsPremium(profile.is_premium || false)
        } else {
          // Fallback if profile row doesn't exist yet
          setProfileData(prev => ({
            ...prev,
            username: user.username || "",
            email: user.email || "",
          }))
          setIsPremium(user.isPremium || false)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsDataLoading(false)
      }
    }

    if (user && mounted) {
      fetchFullProfile()
    }
  }, [user?.id, mounted])

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      setIsSaving(true)
      const supabase = createClient()

      const { error } = await ((supabase
        .from("profiles") as any)
        .update({
          username: profileData.username,
          email: profileData.email,
          phone: profileData.phone,
          gender: profileData.gender,
          language: profileData.language,
          notifications: profileData.notifications,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", user.id) as any)

      if (error) throw error

      // Update auth metadata if username changed
      await supabase.auth.updateUser({
        data: { username: profileData.username }
      })

      await refreshUser()

      // Decouple modal opening from the state update 'storm' to prevent DOM conflicts
      setTimeout(() => {
        setIsSaving(false)
        setShowSuccessModal(true)
      }, 100)
    } catch (error: any) {
      console.error("Error saving profile:", error)
      setIsSaving(false)
      setErrorMessage(error.message || t("profile.updateErrorDesc"))
      setShowErrorModal(true)
    }
  }

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password")
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("Please enter a new password")
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    try {
      setIsPasswordSaving(true)
      const supabase = createClient()

      // 1. Verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordData.currentPassword
      })

      if (signInError) {
        throw new Error("Current password is incorrect")
      }

      // 2. Update to new password
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      toast.success("Password updated successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast.error(error.message || "Failed to update password")
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          reason: deleteFeedback.reason,
          description: deleteFeedback.description
        })
      })

      if (response.ok) {
        toast.success('Your account will be deleted shortly.')
        logout()
        router.push("/")
      } else {
        throw new Error("Failed to submit deletion")
      }
    } catch (e: any) {
      toast.error('Could not request deletion')
    } finally {
      setShowDeleteConfirm(false)
      setShowDeleteModal(false)
    }
  }

  // Prevent rendering until mounted to avoid insertBefore errors and hydration issues
  // Only show full-page loader on INITIAL load
  if (!mounted || isLoading || (isDataLoading && !profileData.username)) {
    return (
      <div key="profile-loader" className="min-h-[80vh] flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">{t("profile.loading")}</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div key="profile-content-container" className="min-h-screen bg-background text-foreground pb-20">
      {/* Dynamic Header */}
      <div className="relative h-64 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-purple-500/10 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="container max-w-6xl mx-auto h-full flex items-end pb-8 px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-4 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-4xl bg-muted text-muted-foreground uppercase">
                  {(user.username || user.email || "?").charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isPremium && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg ring-2 ring-background">
                  PRO
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profileData.username || t("profile.welcome")}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </div>
                {user.isAdmin && (
                  <Badge variant="destructive" className="uppercase font-black tracking-widest text-[10px]">ADMIN</Badge>
                )}
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {t("profile.joined").replace("{date}", new Date(user.createdAt).toLocaleDateString(profileData.language === 'sv' ? 'sv-SE' : 'en-US', { month: 'long', year: 'numeric' }))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-background/60 backdrop-blur-md border border-border/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-0.5">{t("profile.tokens")}</p>
                    <p className="text-xl font-black leading-none">{tokenBalance}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => router.push("/premium")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto pt-10 px-4">
        <Tabs defaultValue="account" className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-4">
            <TabsList className="bg-muted/50 p-1 rounded-xl h-11 border border-border/40">
              <TabsTrigger value="account" className="rounded-lg font-bold text-xs uppercase tracking-widest px-6 h-9">
                <User className="w-4 h-4 mr-2" /> {t("profile.overview")}
              </TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg font-bold text-xs uppercase tracking-widest px-6 h-9">
                <Activity className="w-4 h-4 mr-2" /> {t("profile.activity")}
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg font-bold text-xs uppercase tracking-widest px-6 h-9">
                <Shield className="w-4 h-4 mr-2" /> {t("profile.security")}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-9 px-4 rounded-xl border-primary/20 bg-primary/5 text-primary">
                ID: {user.id.substring(0, 8)}...
              </Badge>
            </div>
          </div>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden shadow-xl">
                  <CardHeader className="border-b border-border/40 bg-muted/20">
                    <CardTitle className="flex items-center gap-2 font-bold text-zinc-800 dark:text-white">
                      <Settings className="w-5 h-5 text-primary" /> {t("profile.accountInfo")}
                    </CardTitle>
                    <CardDescription>{t("profile.accountInfoDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 text-zinc-800 dark:text-zinc-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("profile.username")}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="username"
                            className="pl-10 h-11 bg-background/50 border-border/40 focus:ring-primary/20 focus:border-primary transition-all"
                            value={profileData.username}
                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("profile.gender")}</Label>
                        <div className="relative">
                          <select
                            id="gender"
                            className="w-full pl-3 pr-10 h-11 bg-background/50 border border-border/40 rounded-md flex items-center appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            value={profileData.gender}
                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          >
                            <option value="Male">{t("profile.male")}</option>
                            <option value="Female">{t("profile.female")}</option>
                            <option value="Other">{t("profile.other")}</option>
                          </select>
                          <ChevronRight className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("profile.email")}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10 h-11 bg-background/50 border-border/40"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">{t("profile.verificationNote")}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("profile.phone")}</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            className="pl-10 h-11 bg-background/50 border-border/40"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            placeholder="+1 XXX XX XX XX"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-border/40" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Language</Label>
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-muted-foreground" />
                          <div className="flex gap-2">
                            {["sv", "en"].map((lang) => (
                              <Button
                                key={lang}
                                variant={profileData.language === lang ? "default" : "outline"}
                                size="sm"
                                className="uppercase text-[10px] font-black w-24 h-9 rounded-lg"
                                onClick={() => setProfileData({ ...profileData, language: lang })}
                              >
                                {lang === "sv" ? t("admin.swedish") : t("admin.english")}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("profile.notifications")}</Label>
                        <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-xl border border-border/40 transition-colors hover:bg-muted/60 min-h-[50px]">
                          <Bell className={cn("w-5 h-5 transition-colors", profileData.notifications ? "text-primary" : "text-muted-foreground")} />
                          <div className="flex-1">
                            <p className="text-xs font-bold">{t("profile.autoNotifications")}</p>
                            <p className="text-[10px] text-muted-foreground">{t("profile.autoNotificationsDesc")}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profileData.notifications}
                            onChange={(e) => setProfileData({ ...profileData, notifications: e.target.checked })}
                            className="w-5 h-5 accent-primary rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 border-t border-border/40 p-4">
                    <Button
                      className="ml-auto bg-primary hover:bg-primary/90 font-black tracking-wide text-white px-8"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {isSaving ? t("profile.saving") : t("profile.saveProfile")}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Rules Section */}
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-primary italic font-black">
                      <Lock className="w-5 h-5" /> {t("profile.rulesTitle")}
                    </CardTitle>
                    <CardDescription className="text-primary/70">{t("profile.rulesDesc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      {rules.map((rule, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-primary/80">
                          <div className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                          {t(rule as any)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">{t("profile.membership")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/10">
                      <div className="flex items-center gap-2">
                        <Sparkles className={cn("w-4 h-4", isPremium ? "text-yellow-500" : "text-muted-foreground")} />
                        <span className="text-sm font-bold">Membership</span>
                      </div>
                      <Badge variant={isPremium ? "default" : "secondary"} className={cn(isPremium && "bg-yellow-500 text-black border-none")}>
                        {isPremium ? "PREMIUM" : "FREE"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/10 text-sm font-bold">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span>{t("profile.credits")}</span>
                      </div>
                      <span>${creditBalance}</span>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 font-black tracking-wide text-white h-11"
                        onClick={() => router.push("/premium")}
                      >
                        {isPremium ? t("profile.manageSubscription") : t("profile.upgradeNow")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-white">{t("profile.statsOverview")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                        <span>{t("profile.generations")}</span>
                        <span>30%</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[30%] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                      {t("profile.statsDesc").replace("{percent}", "30")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <UnifiedActivityList userId={user.id} />

            <div className="pt-6">
              <TokenUsageStats userId={user.id} initialData={null} />
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-bold text-zinc-800 dark:text-white">
                  <Lock className="w-5 h-5 text-primary" /> {t("profile.passwordManagement")}
                </CardTitle>
                <CardDescription>{t("profile.passwordSecurityDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t("profile.currentPassword")}</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder={t("profile.currentPasswordPlaceholder")}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t("profile.newPassword")}</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder={t("profile.newPasswordPlaceholder")}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("profile.confirmPassword")}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder={t("profile.confirmPasswordPlaceholder")}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 border-t border-border/40 p-4">
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isPasswordSaving || !passwordData.newPassword}
                  className="ml-auto bg-primary hover:bg-primary/90 font-bold text-white px-8"
                >
                  {isPasswordSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {t("profile.updatePassword")}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-red-500/20 bg-red-500/5 shadow-inner">
              <CardHeader>
                <CardTitle className="text-red-500 flex items-center gap-2 italic font-black uppercase tracking-wider">
                  <AlertTriangle className="w-5 h-5" /> {t("profile.dangerZone")}
                </CardTitle>
                <CardDescription className="text-red-500/70 font-medium">
                  {t("profile.dangerZoneNote")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-background border border-red-500/20 shadow-sm gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-black uppercase mb-1">{t("profile.permanentlyDelete")}</p>
                    <p className="text-xs text-muted-foreground max-w-sm">{t("profile.deleteDataDesc")}</p>
                  </div>
                  <Button
                    variant="destructive"
                    className="font-black h-11 px-8 rounded-xl shadow-lg shadow-red-500/10"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> {t("profile.deleteAccount")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Sidebar Footer */}
      <div className="container max-w-6xl mx-auto mt-16 px-4 flex justify-center">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-red-500 font-bold flex items-center gap-2 py-6 px-8 rounded-full transition-all"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" /> {t("profile.logoutAllDevices")}
        </Button>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-background border-border/40">
          <DialogHeader className="flex flex-col items-center justify-center pt-6">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-zinc-800 dark:text-white">{t("profile.saved")}</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground mt-2">
              {t("profile.savedDesc")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pb-6">
            <Button className="font-bold px-12 rounded-full" onClick={() => setShowSuccessModal(false)}>
              {t("profile.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md bg-background border-red-500/20">
          <DialogHeader className="flex flex-col items-center justify-center pt-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-zinc-800 dark:text-white">{t("profile.errorTitle")}</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground mt-2">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pb-6">
            <Button variant="outline" className="font-bold px-12 rounded-full" onClick={() => setShowErrorModal(false)}>
              {t("profile.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deletion Modals */}
      <DeleteFeedbackModal
        open={showDeleteModal && !showDeleteConfirm}
        onClose={() => setShowDeleteModal(false)}
        lang={profileData.language as any}
        onNext={(reason, description) => {
          setDeleteFeedback({ reason, description });
          setShowDeleteConfirm(true);
        }}
      />
      <DeleteConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        lang={profileData.language as any}
        onDelete={handleDeleteAccount}
      />
    </div>
  )
}
