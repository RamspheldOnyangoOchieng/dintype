"use client"

import { useCharacters } from "@/components/character-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserTokenBalance } from "@/components/user-token-balance"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "./auth-context"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"
import { useSite } from "@/components/site-context"

export function SiteHeader() {
  const { user } = useAuth()
  const { settings } = useSite()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-x-hidden">
      <div className="container flex h-16 items-center justify-between px-4 max-w-full">
        <div className="flex items-center gap-6">
          <span className="font-bold text-xl text-primary">{settings.logoText || "Dintype"}</span>
          {/* Character Type Tabs - Removed for future implementation */}
        </div>

        <div className="flex items-center justify-end space-x-2 flex-nowrap">
          {user && <UserTokenBalance userId={user.id} className="hidden md:flex" />}
          {/* Language indicator — shows active language, link to switch via admin */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border border-border text-xs text-muted-foreground select-none"
            title={settings.language === "sv" ? "Språk: Svenska" : "Language: English"}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-medium">{settings.language === "sv" ? "SV" : "EN"}</span>
          </div>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/90 hidden lg:inline">Hello, {user.username || ""}!</span>
              {user.isPremium && (
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-[10px] h-5 px-1.5 uppercase font-bold">
                  Pro
                </Badge>
              )}
              <UserNav />
            </div>
          ) : (
            <UserNav />
          )}
        </div>
      </div>
    </header>
  )
}
