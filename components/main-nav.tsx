"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ImageIcon, Users, MessageSquare, Star, FolderOpen, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { TokenBalanceDisplay } from "@/components/token-balance-display"
import { useAuth } from "@/components/auth-context"

const navItems = [
  {
    name: "Hem",
    href: "/",
    icon: Home,
  },
  {
    name: "Generera",
    href: "/generera",
    icon: ImageIcon,
  },
  {
    name: "Karaktärer",
    href: "/karaktarer",
    icon: Users,
  },
  {
    name: "Prompter",
    href: "/prompter",
    icon: MessageSquare,
  },
  {
    name: "Favoriter",
    href: "/favoriter",
    icon: Star,
  },
  {
    name: "Mina bilder",
    href: "/samlingar",
    icon: FolderOpen,
  },
  {
    name: "Affiliate",
    href: "/partner",
    icon: Users,
  },
]

export function MainNav() {
  const pathname = usePathname()
  const { user } = useAuth()

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
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          )
        })}

        {user && (
          <Link
            href="/profil"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/profil" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <User className="mr-2 h-4 w-4" />
            Profil
          </Link>
        )}
      </nav>

      <div className="flex items-center space-x-4">
        {user && <TokenBalanceDisplay className="mr-2" />}
        <ThemeToggle />
      </div>
    </div>
  )
}
