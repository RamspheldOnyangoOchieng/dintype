"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  MessageSquare,
  Sparkles,
  Crown,
  Search,
  ChevronLeft,
  Menu,
  LogOut,
  User,
  FolderHeart,
  Heart,
  PlusSquare,
  Users,
  DollarSign,
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useAuthModal } from "@/components/auth-modal-context"
import { useSidebar } from "@/components/sidebar-context"
import { cn } from "@/lib/utils"
import { useSite } from "@/components/site-context"
import { useEffect, useState } from "react"
import { UserAvatar } from "./user-avatar"
import { useTranslations } from "@/lib/use-translations"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CharacterPreviewModal } from "@/components/character-preview-modal"

export default function AppSidebar() {
  const pathname = usePathname()
  const { isOpen, toggle, close, setIsOpen } = useSidebar()
  const { user, logout } = useAuth()
  const { openLoginModal, openLogoutModal } = useAuthModal()
  const { settings } = useSite()
  const { t } = useTranslations()

  // Modal state for character preview
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewModalPath, setPreviewModalPath] = useState("")

  const isAdminPage = pathname?.startsWith("/admin")
  if (isAdminPage) {
    return null
  }

  const menuItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: t("general.home"),
      href: "/",
      active: pathname === "/",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: t("general.chat"),
      href: "/chatt",
      active: pathname?.startsWith("/chatt"),
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      label: t("nav.generateImage"),
      href: "/generera",
      active: pathname?.startsWith("/generera"),
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: t("nav.createCharacter"),
      href: "/skapa-karaktar",
      active: pathname?.startsWith("/skapa-karaktar"),
    },
    {
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      label: t("nav.myAI"),
      href: "/min-ai",
      active: pathname?.startsWith("/min-ai"),
    },
    {
      icon: <FolderHeart className="h-5 w-5" />,
      label: t("nav.myImages"),
      href: "/samlingar",
      active: pathname?.startsWith("/samlingar"),
    },
    {
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      label: t("nav.premium"),
      href: "/premium",
      active: pathname?.startsWith("/premium"),
    },
    {
      icon: <Crown className="h-5 w-5 text-yellow-500" />,
      label: t("nav.adminPanel"),
      href: "/admin/dashboard",
      active: pathname?.startsWith("/admin"),
      adminOnly: true,
    },
  ]

  const supportLinks: { icon: React.ReactNode; label: string; href: string; active: boolean }[] = []

  // Filter menu items - only show adminOnly items to admin users
  const visibleMenuItems = menuItems.filter(item => {
    if ('adminOnly' in item && item.adminOnly) {
      return user?.isAdmin === true
    }
    return true
  })

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={close} />}
      <div
        className={cn(
          "fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out [border-top-right-radius:8px] [border-bottom-right-radius:8px]",
          "bg-card text-card-foreground shadow-lg border-r border-border",
          isOpen ? "w-64" : "w-20",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center ${isOpen ? "px-6" : "justify-center"} h-16 border-b border-border`}>
            {isOpen ? (
              <div className="flex items-center justify-between w-full">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-2xl font-bold tracking-tight">
                    {settings.logoText
                      ? <span className="text-primary">{settings.logoText.toUpperCase()}</span>
                      : <><span className="text-foreground">POCKET</span><span className="text-primary">LOVE</span></>}
                  </span>
                </Link>
                <button
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label={t("sidebar.toggleSidebar")}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                onClick={() => setIsOpen(true)}
                aria-label={t("sidebar.toggleSidebar")}
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>

          <TooltipProvider delayDuration={0}>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <nav>
                <ul className="space-y-2">
                  {visibleMenuItems.map(item => (
                    <li key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            id={`sidebar-link-${item.href.replace("/", "") || "home"}`}
                            data-tour={
                              item.href === "/" ? "home"
                                : item.href === "/chatt" ? "chat"
                                  : item.href === "/generera" ? "generate"
                                    : item.href === "/skapa-karaktar" ? "createcharacter"
                                      : item.href === "/premium" ? "premium"
                                        : item.href.replace(/\//g, "").replace(/-/g, "")
                            }
                            onClick={(e) => {
                              if ((item.href === "/min-ai" || item.href === "/samlingar") && !user) {
                                e.preventDefault()
                                setPreviewModalPath(item.href)
                                setShowPreviewModal(true)
                                return
                              }

                              const otherProtectedRoutes = ["/generera", "/skapa-karaktar"]
                              if (otherProtectedRoutes.includes(item.href) && !user) {
                                e.preventDefault()
                                if (typeof window !== 'undefined') {
                                  sessionStorage.setItem('postLoginRedirect', item.href)
                                }
                                openLoginModal()
                              }
                            }}
                            className={cn(
                              "flex items-center gap-4 rounded-full transition-all duration-200",
                              isOpen ? "px-4 py-2" : "h-12 w-12 justify-center",
                              item.active
                                ? "bg-primary/10 text-primary shadow-[0_0_15px_-3px_rgba(var(--primary-rgb),0.4)]"
                                : "hover:bg-secondary",
                            )}
                          >
                            {item.icon}
                            {isOpen && <span className="font-medium">{item.label}</span>}
                          </Link>
                        </TooltipTrigger>
                        {!isOpen && (
                          <TooltipContent side="right" className="font-medium">
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              </nav>

              {isOpen && (
                <div className="px-4">
                  <div className="h-px bg-border" />
                </div>
              )}

              {supportLinks.length > 0 && (
                <nav>
                  <ul className="space-y-2">
                    {supportLinks.map(item => (
                      <li key={item.href}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-4 rounded-full transition-all duration-200",
                                isOpen ? "px-4 py-2" : "h-12 w-12 justify-center",
                                item.active ? "bg-secondary" : "hover:bg-secondary",
                              )}
                            >
                              {item.icon}
                              {isOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                          </TooltipTrigger>
                          {!isOpen && (
                            <TooltipContent side="right">
                              {item.label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </TooltipProvider>

          {isOpen && (
            <div className="p-4 space-y-4">
              <Link href="/premium">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary/10 transition-all duration-300"
                >
                  {t("premium.addTokens")}
                </Button>
              </Link>
            </div>
          )}

          <div className={`border-t border-border ${isOpen ? "p-4" : "p-2"}`}>
            <TooltipProvider delayDuration={0}>
              {user ? (
                <div className={cn("flex items-center gap-3", !isOpen && "flex-col items-center")}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/profil" className="flex-shrink-0">
                        <UserAvatar />
                      </Link>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right">
                        {t("sidebar.profile")}
                      </TooltipContent>
                    )}
                  </Tooltip>
                  {isOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.username}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.isAdmin ? t("general.admin") : t("general.user")}</p>
                    </div>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={openLogoutModal} className="p-2 rounded-full hover:bg-secondary transition-colors">
                        <LogOut className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right">
                        {t("auth.logout")}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              ) : (
                <div className={cn("flex", isOpen ? "flex-col space-y-2" : "flex-col items-center space-y-2")}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full rounded-full", !isOpen && "w-12 h-12 p-0")}
                        onClick={openLoginModal}
                      >
                        {isOpen ? t("auth.login") : <User className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right">
                        {t("auth.login")}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              )}
            </TooltipProvider>
          </div>

          {isOpen && (
            <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
              <div className="flex justify-between">
                <Link href="/integritetspolicy" className="hover:text-foreground">{t("legal.privacyNotice")}</Link>
                <Link href="/villkor" className="hover:text-foreground">{t("legal.termsOfService")}</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <CharacterPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        redirectPath={previewModalPath}
      />
    </>
  )
}
