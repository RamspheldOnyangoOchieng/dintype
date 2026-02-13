"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, CreditCard, Home, Settings, Users, Image, MessageSquare, DollarSign, FileText, Package, Gem, Activity, Search, FileEdit, Upload, Shield, PanelLeft, Smartphone, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Make sure the Settings link is pointing to the correct path
const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Cost Monitor", href: "/admin/dashboard/monitor", icon: Activity },
  { name: "Restrictions", href: "/admin/dashboard/restrictions", icon: DollarSign },
  { name: "SEO Meta Tags", href: "/admin/dashboard/seo", icon: Search },
  { name: "Content Editor", href: "/admin/dashboard/content", icon: FileEdit },
  { name: "Media Library", href: "/admin/dashboard/media", icon: Upload },
  { name: "Blog Posts", href: "/admin/dashboard/blog", icon: FileText },
  { name: "Characters", href: "/admin/dashboard/characters", icon: MessageSquare },
  { name: "Users", href: "/admin/dashboard/users", icon: Users },
  { name: "Telegram Profiles", href: "/admin/dashboard/telegram-profiles", icon: UserCircle },
  { name: "Mini App Management", href: "/admin/dashboard/mini-app", icon: Smartphone },
  { name: "Image Suggestions", href: "/admin/dashboard/image-suggestions", icon: Image },
  { name: "Banners", href: "/admin/dashboard/banners", icon: BarChart },
  { name: "Token Packages", href: "/admin/dashboard/token-packages", icon: Package },
  { name: "Premium Content", href: "/admin/dashboard/premium-content", icon: Gem },
  { name: "Premium Management", href: "/admin/premium", icon: CreditCard },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Legal", href: "/admin/dashboard/documents", icon: FileText },
]


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
          {!isCollapsed && "Overview"}
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
          {!isCollapsed && <span>Main Site</span>}
        </Link>
      </div>
    </div>
  )
}
