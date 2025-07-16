"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, MessageSquare, Users, Star, FolderOpen } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslations } from "@/lib/use-translations"
import { Image } from "lucide-react"

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Generate",
    href: "/generate",
    icon: Image,
  },
  {
    name: "Characters",
    href: "/characters",
    icon: Users,
  },
  {
    name: "Prompts",
    href: "/prompts",
    icon: MessageSquare,
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: Star,
  },
  {
    name: "Collections",
    href: "/collections",
    icon: FolderOpen,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const { t } = useTranslations()

  return (
    <div className="flex items-center">
      <nav className="flex items-center space-x-4 lg:space-x-6 mr-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.name}
            </Link>
          )
        })}
        <Link
          key={"premium"}
          href={"/premium"}
          className="flex items-center text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
        >
          {t("general.premium")}
        </Link>
      </nav>
      <ThemeToggle />
    </div>
  )
}
