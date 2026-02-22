"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, CreditCard, Home, Settings, Users, Image, MessageSquare, DollarSign, FileText, Package, Gem, Activity, Search, FileEdit, Upload, Shield, PanelLeft, Smartphone, UserCircle, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/lib/use-translations"

export default function AdminSidebar({
  onNavigate,
  isCollapsed,
  onToggle
}: {
  onNavigate?: () => void,
  isCollapsed?: boolean,
  onToggle?: () => void
}) {
  const pathname = usePathname()
  const { t } = useTranslations()

  const navigation = [
    { name: t("admin.nav.dashboard"), href: "/admin/dashboard", icon: Home },
    { name: t("admin.nav.brandingTheme"), href: "/admin/settings", icon: Palette },
    { name: t("admin.nav.costMonitor"), href: "/admin/dashboard/monitor", icon: Activity },
    { name: t("admin.nav.restrictions"), href: "/admin/dashboard/restrictions", icon: DollarSign },
    { name: t("admin.nav.seoMetaTags"), href: "/admin/dashboard/seo", icon: Search },
    { name: t("admin.nav.contentEditor"), href: "/admin/dashboard/content", icon: FileEdit },
    { name: t("admin.nav.mediaLibrary"), href: "/admin/dashboard/media", icon: Upload },
    { name: t("admin.nav.blogPosts"), href: "/admin/dashboard/blog", icon: FileText },
    { name: t("admin.nav.characters"), href: "/admin/dashboard/characters", icon: MessageSquare },
    { name: t("admin.nav.users"), href: "/admin/dashboard/users", icon: Users },
    { name: t("admin.nav.telegramProfiles"), href: "/admin/dashboard/telegram-profiles", icon: UserCircle },
    { name: t("admin.nav.miniAppMgmt"), href: "/admin/dashboard/mini-app", icon: Smartphone },
    { name: t("admin.nav.imageSuggestions"), href: "/admin/dashboard/image-suggestions", icon: Image },
    { name: t("admin.nav.banners"), href: "/admin/dashboard/banners", icon: BarChart },
    { name: t("admin.nav.tokenPackages"), href: "/admin/dashboard/token-packages", icon: Package },
    { name: t("admin.nav.premiumContent"), href: "/admin/dashboard/premium-content", icon: Gem },
    { name: t("admin.nav.premiumManagement"), href: "/admin/premium", icon: CreditCard },
    { name: t("admin.nav.subscriptions"), href: "/admin/subscriptions", icon: CreditCard },
    { name: t("admin.nav.settings"), href: "/admin/settings", icon: Settings },
    { name: t("admin.nav.legal"), href: "/admin/dashboard/documents", icon: FileText },
  ]

  return (
    <div className={cn(
      "flex h-full flex-col bg-card border-r border-border text-foreground shadow-2xl transition-all duration-300",
      isCollapsed ? "w-20" : "w-[280px]"
    )}>
      <div className="flex h-16 items-center px-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent relative">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <span className={cn(
            "font-bold text-lg tracking-tight transition-all duration-300",
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            Admin<span className="text-primary font-light">Panel</span>
          </span>
        </Link>

        {/* The single, clear Sidebar Toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-2.5 transition-all duration-300 lg:flex hidden items-center justify-center",
            isCollapsed
              ? "bg-primary text-primary-foreground scale-110 shadow-xl shadow-primary/40 ring-4 ring-primary/20 border border-primary"
              : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent shadow-none"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <PanelLeft className={cn(
            "h-4 w-4 transition-transform duration-500",
            isCollapsed ? "rotate-180" : ""
          )} />
        </button>
      </div>
      <div className="flex-1 space-y-1 px-3 py-4 overflow-y-auto relative">
        <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest h-4 overflow-hidden">
          {!isCollapsed && t("admin.nav.overview")}
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              title={isCollapsed ? item.name : ""}
              className={cn(
                "group flex items-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isCollapsed ? "px-0 justify-center" : "px-3",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-transparent",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isCollapsed ? "" : "mr-3",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
                aria-hidden="true"
              />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </div>
      <div className="border-t border-border p-4 bg-muted/20">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted",
            isCollapsed ? "justify-center" : ""
          )}
          onClick={onNavigate}
        >
          <Home className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>{t("admin.nav.mainSite")}</span>}
        </Link>
      </div>
    </div>
  )
}
