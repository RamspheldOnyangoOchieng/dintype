"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FEATURES } from "@/lib/features"
import { BarChart, CreditCard, Home, Settings, Users, Image, MessageSquare, DollarSign, FileText, Package, Gem, Activity, Search, FileEdit, Upload, Shield, PanelLeft, Smartphone, UserCircle, Palette, ChevronDown, Layout } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/lib/use-translations"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import * as React from "react"

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

  const sections = [
    {
      id: "overview",
      title: t("admin.nav.overview"),
      icon: Activity,
      items: [
        { name: t("admin.nav.dashboard"), href: "/admin/dashboard", icon: Home },
        { name: t("admin.nav.brandingTheme"), href: "/admin/settings", icon: Palette },
        { name: t("admin.nav.costMonitor"), href: "/admin/dashboard/monitor", icon: Activity },
        { name: t("admin.nav.restrictions"), href: "/admin/dashboard/restrictions", icon: DollarSign },
      ]
    },
    {
      id: "content",
      title: t("admin.nav.contentEditor"),
      icon: FileEdit,
      items: [
        { name: t("admin.nav.seoMetaTags"), href: "/admin/dashboard/seo", icon: Search },
        { name: t("admin.nav.contentEditor"), href: "/admin/dashboard/content", icon: FileEdit },
        { name: t("admin.nav.mediaLibrary"), href: "/admin/dashboard/media", icon: Upload },
        { name: t("admin.nav.blogPosts"), href: "/admin/dashboard/blog", icon: FileText },
        { name: t("admin.nav.banners"), href: "/admin/dashboard/banners", icon: BarChart },
      ]
    },
    {
      id: "users",
      title: t("admin.nav.users"),
      icon: Users,
      items: [
        { name: t("admin.nav.characters"), href: "/admin/dashboard/characters", icon: MessageSquare },
        { name: t("admin.nav.users"), href: "/admin/dashboard/users", icon: Users },
        ...(FEATURES.ENABLE_TELEGRAM ? [
          { name: t("admin.nav.telegramProfiles"), href: "/admin/dashboard/telegram-profiles", icon: UserCircle },
          { name: t("admin.nav.miniAppMgmt"), href: "/admin/dashboard/mini-app", icon: Smartphone },
        ] : []),
      ]
    },
    {
      id: "commerce",
      title: t("admin.nav.commerce"),
      icon: Package,
      items: [
        { name: t("admin.nav.tokenPackages"), href: "/admin/dashboard/token-packages", icon: Package },
        { name: t("admin.nav.premiumContent"), href: "/admin/dashboard/premium-content", icon: Gem },
        { name: t("admin.nav.subscriptions"), href: "/admin/subscriptions", icon: CreditCard },
        { name: t("admin.nav.imageSuggestions"), href: "/admin/dashboard/image-suggestions", icon: Image },
      ]
    },
    {
      id: "system",
      title: t("admin.nav.settings"),
      icon: Settings,
      items: [
        { name: t("admin.nav.settings"), href: "/admin/settings", icon: Settings },
        { name: t("admin.nav.legal"), href: "/admin/dashboard/documents", icon: FileText },
      ]
    }
  ]

  const NavItem = ({ item, isCollapsed, isActive }: { item: any, isCollapsed: boolean, isActive: boolean }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1",
              isCollapsed ? "px-0 justify-center h-10 w-10 mx-auto" : "px-3",
              isActive
                ? "bg-primary/20 text-primary border-l-4 border-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border-l-4 border-transparent",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-all duration-200",
                isCollapsed ? "" : "mr-3",
                isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground",
              )}
              aria-hidden="true"
            />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="bg-primary text-primary-foreground font-bold">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className={cn(
      "flex h-full flex-col bg-card border-r border-border text-foreground shadow-2xl transition-all duration-300 relative",
      isCollapsed ? "w-20" : "w-[280px]"
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none opacity-50" />

      <div className="flex h-16 items-center px-6 border-b border-border bg-white dark:bg-zinc-950/20 relative z-10">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="p-1.5 rounded-xl bg-primary shadow-lg shadow-primary/20 text-white shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <span className={cn(
            "font-black text-lg tracking-tighter transition-all duration-300 flex items-center",
            isCollapsed ? "opacity-0 w-0 translate-x-4" : "opacity-100"
          )}>
            ADMIN<span className="text-primary ml-0.5">.</span>
          </span>
        </Link>

        <button
          onClick={onToggle}
          className={cn(
            "absolute -right-4 top-1/2 -translate-y-1/2 z-50 rounded-full p-2.5 transition-all duration-300 lg:flex hidden items-center justify-center",
            isCollapsed
              ? "bg-primary text-primary-foreground scale-110 shadow-xl shadow-primary/40 ring-4 ring-primary/20 border border-primary"
              : "bg-white dark:bg-zinc-900 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border shadow-md"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <PanelLeft className={cn(
            "h-4 w-4 transition-transform duration-500",
            isCollapsed ? "rotate-180" : ""
          )} />
        </button>
      </div>

      <div className="flex-1 px-3 py-6 overflow-y-auto relative z-10 custom-scrollbar">
        {isCollapsed ? (
          <div className="space-y-4">
            {sections.map(section => (
              <div key={section.id} className="space-y-2">
                <div className="w-full h-px bg-border/50 my-4" />
                {section.items.map(item => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  return <NavItem key={item.name} item={item} isCollapsed={true} isActive={isActive} />
                })}
              </div>
            ))}
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={["overview", "content", "users"]} className="w-full space-y-2">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-lg hover:bg-muted/50 group transition-all">
                  <div className="flex items-center gap-3">
                    <section.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                      {section.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-2">
                  <div className="space-y-0 pb-2">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                      return <NavItem key={item.name} item={item} isCollapsed={false} isActive={isActive} />
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      <div className="border-t border-border p-4 bg-muted/20 relative z-10">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all p-3 rounded-xl hover:bg-primary/5",
            isCollapsed ? "justify-center" : ""
          )}
          onClick={onNavigate}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>{t("admin.nav.mainSite")}</span>}
        </Link>
      </div>
    </div>
  )
}
