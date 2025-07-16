"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ImageIcon, Settings, MessageSquare } from "lucide-react"

export default function AdminMobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/admin/dashboard/characters",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Characters",
    },
    {
      href: "/admin/dashboard/users",
      icon: <Users className="h-5 w-5" />,
      label: "Users",
    },
    {
      href: "/admin/dashboard/image-suggestions",
      icon: <ImageIcon className="h-5 w-5" />,
      label: "Images",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ]

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center p-2 ${
              isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {React.cloneElement(item.icon, {
              className: `h-5 w-5 ${isActive ? "text-gray-900" : "text-gray-500"}`,
            })}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}
