"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CreditCard,
  Home,
  Settings,
  Users,
  ImageIcon,
  MessageSquare,
  DollarSign,
  FileText,
  Database,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdminSidebar } from "./admin-sidebar-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Översikt", href: "/admin/dashboard", icon: Home },
  { name: "Karaktärer", href: "/admin/dashboard/characters", icon: MessageSquare },
  { name: "Användare", href: "/admin/dashboard/users", icon: Users },
  { name: "Bildförslag", href: "/admin/dashboard/image-suggestions", icon: ImageIcon },
  { name: "Banners", href: "/admin/dashboard/banners", icon: Bell },
  { name: "Prenumerationer", href: "/admin/dashboard/subscriptions", icon: CreditCard },
  { name: "Transaktioner", href: "/admin/dashboard/transactions", icon: DollarSign },
  { name: "API-nycklar", href: "/admin/dashboard/api-keys", icon: FileText },
  { name: "Användarvillkor", href: "/admin/dashboard/terms", icon: FileText },
  { name: "SEO", href: "/admin/seo", icon: Search },
  { name: "Databas", href: "/admin/dashboard/database", icon: Database },
  { name: "Inställningar", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { collapsed, toggleSidebar } = useAdminSidebar()

  return (
    <div className={cn("admin-sidebar", collapsed && "collapsed")}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-semibold text-xl">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          aria-label={collapsed ? "Expandera sidofält" : "Minimera sidofält"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  collapsed && "justify-center",
                )}
              >
                {item.icon === ImageIcon ? (
                  <ImageIcon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      isActive ? "text-gray-900" : "text-gray-500",
                      !collapsed && "mr-3",
                    )}
                    aria-hidden="true"
                  />
                ) : (
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      isActive ? "text-gray-900" : "text-gray-500",
                      !collapsed && "mr-3",
                    )}
                    aria-hidden="true"
                  />
                )}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-gray-100 p-4 mt-auto">
        <Link
          href="/"
          className={cn("flex items-center text-sm text-gray-600 hover:text-gray-900", collapsed && "justify-center")}
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Tillbaka till webbplatsen</span>}
        </Link>
      </div>
    </div>
  )
}
