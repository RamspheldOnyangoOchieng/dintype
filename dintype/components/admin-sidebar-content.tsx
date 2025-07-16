"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ImageIcon,
  Database,
  Bell,
  Settings,
  CreditCard,
  FileText,
  MessageSquare,
  FileTerminal,
  DollarSign,
  Search,
  BarChart3,
} from "lucide-react"

export default function AdminSidebarContent() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Översikt",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      title: "Karaktärer",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/admin/dashboard/characters",
    },
    {
      title: "Användare",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/dashboard/users",
    },
    {
      title: "Bildförslag",
      icon: <ImageIcon className="h-5 w-5" />,
      href: "/admin/dashboard/image-suggestions",
    },
    {
      title: "Banners",
      icon: <Bell className="h-5 w-5" />,
      href: "/admin/dashboard/banners",
    },
    {
      title: "Prenumerationer",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/admin/dashboard/subscriptions",
    },
    {
      title: "Transaktioner",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/admin/dashboard/transactions",
    },
    {
      title: "Databas",
      icon: <Database className="h-5 w-5" />,
      href: "/admin/dashboard/database",
    },
    {
      title: "API-nycklar",
      icon: <FileTerminal className="h-5 w-5" />,
      href: "/admin/dashboard/api-keys",
    },
    {
      title: "Användarvillkor",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/dashboard/terms",
    },
    {
      title: "SEO",
      icon: <Search className="h-5 w-5" />,
      href: "/admin/seo",
    },
    {
      title: "Inställningar",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
    {
      title: "Payment Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/payment-analytics",
    },
  ]

  return (
    <div className="flex flex-col gap-1 p-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center px-3 py-2 rounded-md transition-colors
              ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
            `}
          >
            <span className="flex items-center justify-center mr-3">
              {React.cloneElement(item.icon, {
                className: `h-5 w-5 ${isActive ? "text-gray-900" : "text-gray-500"}`,
              })}
            </span>
            <span className="font-medium">{item.title}</span>
          </Link>
        )
      })}
    </div>
  )
}
