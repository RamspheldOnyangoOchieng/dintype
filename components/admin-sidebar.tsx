"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, CreditCard, Home, Settings, Users, Image, MessageSquare, DollarSign, FileText, Package, Gem, Activity, Search, FileEdit, Upload, Shield } from "lucide-react"
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
  { name: "Image Suggestions", href: "/admin/dashboard/image-suggestions", icon: Image },
  { name: "Banners", href: "/admin/dashboard/banners", icon: BarChart },
  { name: "Token Packages", href: "/admin/dashboard/token-packages", icon: Package },
  { name: "Premium Content", href: "/admin/dashboard/premium-content", icon: Gem },
  { name: "Premium Management", href: "/admin/premium", icon: CreditCard },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Legal", href: "/admin/dashboard/documents", icon: FileText },
]

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-[#0a0a0a] border-r border-white/10 text-white shadow-2xl">
      <div className="flex h-16 items-center px-6 border-b border-white/5 bg-gradient-to-r from-purple-900/20 to-transparent">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Admin<span className="text-primary font-light">Panel</span></span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="mb-2 px-3 text-xs font-semibold text-white/30 uppercase tracking-widest">
          Overview
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/20 text-primary border-l-2 border-primary"
                  : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-gray-500 group-hover:text-white",
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/5 p-4 bg-black/20">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          onClick={onNavigate}
        >
          <Home className="h-4 w-4" />
          Back to Main Site
        </Link>
      </div>
    </div>
  )
}
