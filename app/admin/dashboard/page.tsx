"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { useSite } from "@/components/site-context"
import { useCharacters } from "@/components/character-context"
import { useTranslations } from "@/lib/use-translations"
import {
  Home,
  Save,
  Edit,
  Settings,
  Users,
  MessageSquare,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  UserPlus,
  Database,
  Sparkles,
  Shield,
  Coins,
  Smartphone,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()
  const { settings, updateSettings } = useSite()
  const { characters } = useCharacters()
  const router = useRouter()
  const { t } = useTranslations()
  const [siteName, setSiteName] = useState(settings.siteName)
  const [logoText, setLogoText] = useState(settings.logoText)
  const [siteUrl, setSiteUrl] = useState(settings.siteUrl || "")
  const [currency, setCurrency] = useState(settings.pricing.currency)
  const [currencyPosition, setCurrencyPosition] = useState(settings.pricing.currencyPosition)
  const [monthlyPrice, setMonthlyPrice] = useState(settings.pricing.monthly.price.toString())
  const [monthlyOriginalPrice, setMonthlyOriginalPrice] = useState(settings.pricing.monthly.originalPrice.toString())
  const [monthlyDiscount, setMonthlyDiscount] = useState(settings.pricing.monthly.discount.toString())
  const [quarterlyPrice, setQuarterlyPrice] = useState(settings.pricing.quarterly.price.toString())
  const [quarterlyOriginalPrice, setQuarterlyOriginalPrice] = useState(
    settings.pricing.quarterly.originalPrice.toString(),
  )
  const [quarterlyDiscount, setQuarterlyDiscount] = useState(settings.pricing.quarterly.discount.toString())
  const [yearlyPrice, setYearlyPrice] = useState(settings.pricing.yearly.price.toString())
  const [yearlyOriginalPrice, setYearlyOriginalPrice] = useState(settings.pricing.yearly.originalPrice.toString())
  const [yearlyDiscount, setYearlyDiscount] = useState(settings.pricing.yearly.discount.toString())
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Budget state
  const [budgetLimits, setBudgetLimits] = useState({
    apiCost: 100,
    messages: 4000000,
    images: 2500,
  })

  // Real stats from actual data
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | undefined>(undefined)
  const [totalRevenue, setTotalRevenue] = useState<number | undefined>(undefined)
  const [totalOrders, setTotalOrders] = useState<number | undefined>(undefined)
  const [totalUsers, setTotalUsers] = useState<number | undefined>(undefined)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [usageStats, setUsageStats] = useState<{ totalTokens: number, totalCredits: number, premiumCount: number, monthlyApiCost: number } | null>(null)
  const [telegramStats, setTelegramStats] = useState<{ total_users: number, active_today: number } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/usage-stats")
        if (response.ok) {
          const data = await response.json()
          setUsageStats(data)
        }
      } catch (e) {
        console.error("Failed to fetch usage stats")
      }
      try {
        const monthlyResponse = await fetch("/api/monthly-revenue", { next: { revalidate: 0 } })
        if (monthlyResponse.ok) {
          const monthlyData = await monthlyResponse.json()
          setMonthlyRevenue(monthlyData.totalRevenue)
        } else {
          setMonthlyRevenue(0)
        }
      } catch (error) {
        console.error("Failed to fetch monthly revenue:", error)
        setMonthlyRevenue(0)
      }

      try {
        const totalResponse = await fetch("/api/revenue", { next: { revalidate: 0 } })
        if (totalResponse.ok) {
          const totalData = await totalResponse.json()
          setTotalRevenue(totalData.totalRevenue)
          setTotalOrders(totalData.totalOrders)
        } else {
          setTotalRevenue(0)
          setTotalOrders(0)
        }
      } catch (error) {
        console.error("Failed to fetch total revenue:", error)
        setTotalRevenue(0)
        setTotalOrders(0)
      }

      try {
        const usersResponse = await fetch("/api/total-users", { next: { revalidate: 0 } })
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setTotalUsers(usersData.totalUsers)
        } else {
          setTotalUsers(0)
        }
      } catch (error) {
        console.error("Failed to fetch total users:", error)
        setTotalUsers(0)
      }

      try {
        const activityResponse = await fetch("/api/recent-activity", { next: { revalidate: 0 } })
        if (activityResponse.ok) {
          const activityData = await activityResponse.json()
          setRecentActivity(activityData.activity)
        } else {
          setRecentActivity([])
        }
      } catch (error) {
        console.error("Failed to fetch recent activity:", error)
        setRecentActivity([])
      }

      try {
        const budgetResponse = await fetch("/api/admin/settings")
        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json()
          const limits = budgetData.settings.find((s: any) => s.key === 'budget_limits')
          if (limits) {
            setBudgetLimits(prev => ({ ...prev, ...limits.value }))
          }
        }
      } catch (e) {
        // Silently fail for budget limits to avoid console noise
        // console.warn("Failed to fetch budget limits")
      }
      setMonthlyPrice(settings.pricing.monthly.price.toString())
      setMonthlyOriginalPrice(settings.pricing.monthly.originalPrice.toString())
      setMonthlyDiscount(settings.pricing.monthly.discount.toString())
      setQuarterlyPrice(settings.pricing.quarterly.price.toString())
      setQuarterlyOriginalPrice(settings.pricing.quarterly.originalPrice.toString())
      setQuarterlyDiscount(settings.pricing.quarterly.discount.toString())
      setYearlyPrice(settings.pricing.yearly.price.toString())
      setYearlyOriginalPrice(settings.pricing.yearly.originalPrice.toString())
      setYearlyDiscount(settings.pricing.yearly.discount.toString())

      // Try to load from DB to sync
      try {
        const response = await fetch("/api/admin/settings")
        if (response.ok) {
          const data = await response.json()
          const dbCurrencyConfig = data.settings.find((s: any) => s.key === 'currency_config')
          if (dbCurrencyConfig?.value) {
            setCurrency(dbCurrencyConfig.value.symbol || '$')
          }
          const limits = data.settings.find((s: any) => s.key === 'budget_limits')
          if (limits) {
            setBudgetLimits(prev => ({ ...prev, ...limits.value }))
          }
        }
      } catch (e) {
        console.error("Failed to load settings from DB")
      }

      try {
        const telegramStatsResponse = await fetch("/api/telegram/stats")
        if (telegramStatsResponse.ok) {
          const telegramData = await telegramStatsResponse.json()
          setTelegramStats(telegramData)
        }
      } catch (e) {
        console.error("Failed to fetch telegram stats")
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      title: t("admin.stat.totalUsers"),
      value: typeof totalUsers === 'number' ? totalUsers.toString() : "0",
      change: t("admin.stat.allTime"),
      changeType: "neutral",
      icon: Users,
    },
    {
      title: t("admin.stat.activeCharacters"),
      value: characters?.length?.toString() || "0",
      change: "0%",
      changeType: "neutral",
      icon: MessageSquare,
    },
    {
      title: t("admin.stat.monthlyRevenue"),
      value: typeof monthlyRevenue === 'number' ? `${currency} ${monthlyRevenue.toFixed(2)}` : `${currency} 0.00`,
      change: t("admin.stat.thisMonth"),
      changeType: "neutral",
      icon: DollarSign,
    },
    {
      title: t("admin.stat.apiCosts"),
      value: usageStats ? `${currency} ${usageStats.monthlyApiCost.toFixed(2)}` : `${currency} 0.00`,
      change: t("admin.stat.thisMonth"),
      changeType: "negative",
      icon: Activity,
    },
    {
      title: t("admin.stat.totalRevenue"),
      value: typeof totalRevenue === 'number' ? `${currency} ${totalRevenue.toFixed(2)}` : `${currency} 0.00`,
      change: t("admin.stat.allTime"),
      changeType: "positive",
      icon: CreditCard,
    },
    {
      title: t("admin.stat.premiumMembers"),
      value: usageStats ? usageStats.premiumCount.toString() : "0",
      change: t("admin.stat.allTime"),
      changeType: "positive",
      icon: Sparkles,
    },
    {
      title: t("admin.stat.activeCharacters"),
      value: usageStats ? usageStats.totalCredits.toString() : "0",
      change: t("admin.stat.allTime"),
      changeType: "neutral",
      icon: Shield,
    },
    {
      title: t("admin.nav.telegramProfiles"),
      value: telegramStats?.total_users?.toString() || "0",
      change: `${telegramStats?.active_today || 0} ${t("admin.stat.allTime")}`,
      changeType: "neutral",
      icon: Smartphone,
    },
    {
      title: t("admin.stat.totalRevenue"),
      value: usageStats ? usageStats.totalTokens.toString() : "0",
      change: t("admin.stat.allTime"),
      changeType: "neutral",
      icon: Coins,
    },
  ]

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(async () => {
      // Update local context
      updateSettings({
        siteName,
        logoText,
        siteUrl,
        pricing: {
          currency,
          currencyPosition,
          monthly: {
            price: Number.parseFloat(monthlyPrice),
            originalPrice: Number.parseFloat(monthlyOriginalPrice),
            discount: Number.parseInt(monthlyDiscount),
          },
          quarterly: {
            price: Number.parseFloat(quarterlyPrice),
            originalPrice: Number.parseFloat(quarterlyOriginalPrice),
            discount: Number.parseInt(quarterlyDiscount),
          },
          yearly: {
            price: Number.parseFloat(yearlyPrice),
            originalPrice: Number.parseFloat(yearlyOriginalPrice),
            discount: Number.parseInt(yearlyDiscount),
          },
        },
      })

      // Save to DB
      try {
        // Save budget
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "budget_limits",
            value: budgetLimits
          })
        })

        // Save currency config for the whole system
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "currency_config",
            value: {
              code: "USD",
              symbol: currency,
              rate: 1.0
            }
          })
        })


        // Save site identity
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "site_name", value: siteName })
        })
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "logo_text", value: logoText })
        })
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "site_url", value: siteUrl })
        })
      } catch (e) {
        console.error("Failed to save settings to DB")
      }

      setSaveMessage("Settings saved successfully!")
      setIsSaving(false)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">{t("admin.dashboard.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t("admin.dashboard.title")}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t("admin.dashboard.welcome")}</p>
        </div>
        <Button onClick={() => router.push("/")} variant="outline" className="flex items-center space-x-2">
          <Home className="h-4 w-4" />
          <span>{t("admin.dashboard.viewSite")}</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="flex items-center space-x-1 mt-1">
                <Badge
                  variant={
                    stat.changeType === "positive"
                      ? "default"
                      : stat.changeType === "negative"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t("admin.dashboard.overviewOnly")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 h-auto p-1 bg-zinc-100 dark:bg-zinc-800">
          <TabsTrigger value="overview">{t("admin.dashboard.overview")}</TabsTrigger>
          <TabsTrigger value="settings">{t("admin.dashboard.siteSettings")}</TabsTrigger>
          <TabsTrigger value="pricing">{t("admin.dashboard.pricing")}</TabsTrigger>
          <TabsTrigger value="budget">{t("admin.dashboard.budget")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>{t("admin.dashboard.systemStatus")}</span>
                </CardTitle>
                <CardDescription>{t("admin.systemStatus" as any) || "Current system health and status"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Services</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Image Generation</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{t("admin.dashboard.quickActions")}</span>
                </CardTitle>
                <CardDescription>{t("admin.dashboard.quickActions" as any) || "Common administrative tasks"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => router.push("/admin/dashboard/users")}
                  >
                    <div className="flex items-center space-x-3">
                      <UserPlus className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">{t("admin.dashboard.manageUsers")}</div>
                        <div className="text-xs text-slate-500">{t("admin.dashboard.manageUsers" as any)}</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => router.push("/admin/dashboard/characters")}
                  >
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <div className="text-left">
                        <div className="font-medium">{t("admin.dashboard.manageCharacters")}</div>
                        <div className="text-xs text-slate-500">{t("admin.dashboard.manageCharacters" as any)}</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => router.push("/admin/dashboard/subscriptions")}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">{t("admin.dashboard.subscriptions")}</div>
                        <div className="text-xs text-slate-500">{t("admin.dashboard.subscriptions" as any)}</div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 bg-transparent"
                    onClick={() => router.push("/admin/dashboard/database")}
                  >
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <div className="text-left">
                        <div className="font-medium">{t("admin.dashboard.database")}</div>
                        <div className="text-xs text-slate-500">{t("admin.dashboard.database" as any)}</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-zinc-800 dark:text-white">
                <Activity className="h-5 w-5 text-primary" />
                <span>{t("admin.dashboard.recentActivity")}</span>
              </CardTitle>
              <CardDescription>{t("admin.dashboard.recentActivity" as any)}</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <ul className="space-y-4">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                        {activity.user?.username ? activity.user.username.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {activity.user?.username || 'System'}
                        </p>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] h-4 px-1 lowercase font-black bg-zinc-100 dark:bg-zinc-800">
                            {activity.activity_kind || 'action'}
                          </Badge>
                          {activity.description || `${activity.type}: ${activity.amount > 0 ? '+' : ''}${activity.amount}`}
                        </div>
                      </div>
                      <div className="ml-auto text-xs text-slate-400 whitespace-nowrap italic">
                        {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-400 mb-2">No activities recorded yet</h3>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.dashboard.siteSettings")}</CardTitle>
              <CardDescription>{t("admin.dashboard.siteIdentityDesc" as any) || "Configure site name and visual identity"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="font-bold">{t("admin.dashboard.portalName")}</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Dintype"
                  />
                  <p className="text-[11px] text-slate-500 italic">
                    Affects page titles and metadata across the platform.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteUrl" className="font-bold">{t("admin.dashboard.siteUrl")}</Label>
                  <Input
                    id="siteUrl"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    placeholder="https://yourdomain.com"
                  />
                  <p className="text-[11px] text-slate-500 italic">
                    The primary domain of your application. Used for Telegram integration and absolute links.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoText" className="font-bold">{t("admin.dashboard.brandingText")}</Label>
                  <Input
                    id="logoText"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="Dintype"
                  />
                  <p className="text-[11px] text-slate-500 italic">The wordmark displayed in the header.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white font-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? t("admin.branding.saving") : t("admin.dashboard.commitChanges")}
                </Button>
                {saveMessage && <p className="text-green-500 text-sm font-bold animate-bounce">{saveMessage}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="bg-zinc-50 dark:bg-zinc-900/50 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-400">{t("admin.dashboard.headerPreview")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center">
                <div className="text-4xl font-black flex items-center tracking-tighter">
                  {logoText}
                  <span className="text-primary">.ai</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.dashboard.revenueStrategy")}</CardTitle>
              <CardDescription>{t("admin.dashboard.revenueStrategy" as any) || "Customize subscription tiers and currency display"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="font-bold">{t("admin.currencySettings" as any) || "Active Currency"}</Label>
                  <Input
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-24 font-bold"
                    placeholder="$"
                  />
                  <p className="text-[11px] text-slate-500 italic">Visual symbol used across UI ($ for USD, £ for GBP etc.)</p>
                </div>

                <div className="space-y-3">
                  <Label className="font-bold text-zinc-800 dark:text-zinc-200">Symbol Positioning</Label>
                  <RadioGroup
                    value={currencyPosition}
                    onValueChange={(value) => setCurrencyPosition(value as "left" | "right")}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="left" />
                      <Label htmlFor="left">Prefix ({currency}10.00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="right" />
                      <Label htmlFor="right">Suffix (10.00{currency})</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Tabs defaultValue="monthly" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-zinc-100 dark:bg-zinc-800">
                  <TabsTrigger value="monthly" className="font-bold uppercase text-[10px]">{t("admin.dashboard.billingMonthly")}</TabsTrigger>
                  <TabsTrigger value="quarterly" className="font-bold uppercase text-[10px]">{t("admin.dashboard.billingQuarterly")}</TabsTrigger>
                  <TabsTrigger value="yearly" className="font-bold uppercase text-[10px]">{t("admin.dashboard.billingYearly")}</TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">{t("admin.dashboard.basePrice")}</Label>
                      <Input
                        id="monthlyPrice"
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">{t("admin.dashboard.originalPrice")}</Label>
                      <Input
                        id="monthlyOriginalPrice"
                        value={monthlyOriginalPrice}
                        onChange={(e) => setMonthlyOriginalPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">{t("admin.dashboard.discount")}</Label>
                      <Input
                        id="monthlyDiscount"
                        value={monthlyDiscount}
                        onChange={(e) => setMonthlyDiscount(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Quarterly Tab Content */}
                <TabsContent value="quarterly" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">Base Price</Label>
                      <Input
                        id="quarterlyPrice"
                        value={quarterlyPrice}
                        onChange={(e) => setQuarterlyPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">Strike-through Price</Label>
                      <Input
                        id="quarterlyOriginalPrice"
                        value={quarterlyOriginalPrice}
                        onChange={(e) => setQuarterlyOriginalPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">Discount Text (%)</Label>
                      <Input
                        id="quarterlyDiscount"
                        value={quarterlyDiscount}
                        onChange={(e) => setQuarterlyDiscount(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Yearly Tab Content */}
                <TabsContent value="yearly" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">{t("admin.dashboard.basePrice")}</Label>
                      <Input
                        id="yearlyPrice"
                        value={yearlyPrice}
                        onChange={(e) => setYearlyPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">Strike-through Price</Label>
                      <Input
                        id="yearlyOriginalPrice"
                        value={yearlyOriginalPrice}
                        onChange={(e) => setYearlyOriginalPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase">Discount Text (%)</Label>
                      <Input
                        id="yearlyDiscount"
                        value={yearlyDiscount}
                        onChange={(e) => setYearlyDiscount(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white font-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? t("admin.branding.saving") : t("admin.dashboard.commitChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.dashboard.budget")}</CardTitle>
              <CardDescription>
                {t("admin.dashboard.budget" as any) || "Set hard monthly caps to control operational expenses."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiCostLimit" className="font-bold">{t("admin.stat.apiCosts")}</Label>
                  <Input
                    id="apiCostLimit"
                    type="number"
                    value={budgetLimits.apiCost}
                    onChange={(e) => setBudgetLimits({ ...budgetLimits, apiCost: Number(e.target.value) })}
                  />
                  <p className="text-[11px] text-zinc-500 italic">Target threshold: $100.00 recommended.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messagesLimit" className="font-bold">Volume: Messages/Month</Label>
                  <Input
                    id="messagesLimit"
                    type="number"
                    value={budgetLimits.messages}
                    onChange={(e) => setBudgetLimits({ ...budgetLimits, messages: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imagesLimit" className="font-bold">Volume: Image Genes/Month</Label>
                  <Input
                    id="imagesLimit"
                    type="number"
                    value={budgetLimits.images}
                    onChange={(e) => setBudgetLimits({ ...budgetLimits, images: Number(e.target.value) })}
                  />
                </div>
              </div>

              <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-600">
                <Shield className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-xs font-bold">
                  AUTOPILOT SAFETY: Once these thresholds are met, the platform will automatically pause AI generation to prevent debt accumulation.
                </AlertDescription>
              </Alert>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white font-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "SAVING..." : "SAVE BUDGET CONSTRAINTS"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
