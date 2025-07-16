"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ImageIcon, FolderOpen, MessageSquare, Crown } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useTheme } from "@/components/theme-provider"

// Add translation import
// import { useTranslations } from "@/lib/use-translations"

// Inside the MobileNav component:
export function MobileNav() {
  // const { t } = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Don't show the mobile nav on chat pages
  if (pathname?.startsWith("/chat/")) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-card border-t border-border p-2">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center p-2">
            <Home className={`h-6 w-6 ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${pathname === "/" ? "text-primary" : "text-muted-foreground"} mt-1`}>Hem</span>
          </Link>
          <Link href="/generate" className="flex flex-col items-center p-2">
            <ImageIcon className={`h-6 w-6 ${pathname === "/generate" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${pathname === "/generate" ? "text-primary" : "text-muted-foreground"} mt-1`}>
              Generera
            </span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center p-2">
            <MessageSquare className={`h-6 w-6 ${pathname === "/chat" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${pathname === "/chat" ? "text-primary" : "text-muted-foreground"} mt-1`}>
              Chatta
            </span>
          </Link>
          <Link href="/collections" className="flex flex-col items-center p-2">
            <FolderOpen
              className={`h-6 w-6 ${pathname?.startsWith("/collections") ? "text-primary" : "text-muted-foreground"}`}
            />
            <span
              className={`text-xs ${pathname?.startsWith("/collections") ? "text-primary" : "text-muted-foreground"} mt-1`}
            >
              Samlingar
            </span>
          </Link>
          <Link href="/premium" className="flex flex-col items-center p-2">
            <Crown className={`h-6 w-6 ${pathname === "/premium" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${pathname === "/premium" ? "text-primary" : "text-muted-foreground"} mt-1`}>
              Premium
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
