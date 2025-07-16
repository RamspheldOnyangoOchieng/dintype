"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-context"
import { useSidebar } from "@/components/sidebar-context"
import { cn } from "@/lib/utils"
import { useSite } from "@/components/site-context"
import { useEffect } from "react"
import { useTranslations } from "@/lib/use-translations"
import { LanguageSwitcher } from "@/components/language-switcher"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppSidebar() {
  const { t } = useTranslations()
  const pathname = usePathname()
  const { isOpen, toggle, close, setIsOpen } = useSidebar()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { settings } = useSite()

  // Handle route changes and responsive behavior
  useEffect(() => {
    const handleRouteChange = () => {
      // Auto-close sidebar on mobile after navigation
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsOpen(false)
      }
    }

    handleRouteChange()
  }, [pathname, setIsOpen])

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith("/admin")

  // Don't render the main sidebar on admin pages
  if (isAdminPage) {
    return null
  }

  // Handle link clicks to auto-close sidebar on mobile
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  const menuItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: t("sidebar.home"),
      href: "/",
      active: pathname === "/",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: t("sidebar.dashboard"),
      href: "/user/dashboard",
      active: pathname?.startsWith("/user/dashboard"),
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: t("sidebar.chat"),
      href: "/chat",
      active: pathname?.startsWith("/chat"),
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      label: t("sidebar.generate"),
      href: "/generate",
      active: pathname?.startsWith("/generate"),
    },
    {
      icon: <FolderHeart className="h-5 w-5" />,
      label: t("sidebar.collection"),
      href: "/collection",
      active: pathname?.startsWith("/collection"),
    },
    {
      icon: <Crown className="h-5 w-5" />,
      label: t("sidebar.premium"),
      href: "/premium",
      active: pathname?.startsWith("/premium"),
    },
  ]

  // Add admin dashboard link if user is admin
  if (user?.isAdmin) {
    menuItems.push({
      icon: <User className="h-5 w-5" />,
      label: t("sidebar.admin"),
      href: "/admin/dashboard",
      active: pathname?.startsWith("/admin"),
    })
  }

  return (
    <>
      <TooltipProvider>
        {/* Mobile overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300" onClick={close} />
        )}

        {/* Sidebar - Fixed positioning that doesn't affect document flow */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-screen z-50 bg-background text-foreground shadow-lg border-r border-border",
            "transition-all duration-300 ease-in-out",
            // Always visible on desktop, overlay on mobile
            "translate-x-0",
            // Width changes based on state
            isOpen ? "w-[251px]" : "w-[59px]",
          )}
        >
          {/* Mobile close button */}
          <button className="absolute right-4 top-4 md:hidden z-10" onClick={close} aria-label="Close sidebar">
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Logo and Toggle */}
          <div className={`flex items-center ${isOpen ? "px-6" : "justify-center"} h-16 border-b border-border`}>
            {isOpen ? (
              <div className="flex items-center justify-between w-full">
                <Link href="/" onClick={handleLinkClick}>
                  <span className="text-xl font-bold">
                    DINTYP<span className="text-primary">.SE</span>
                  </span>
                </Link>
                <button
                  className="w-8 h-8 rounded-md bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors ml-2"
                  onClick={toggle}
                  aria-label={t("sidebar.toggleSidebar")}
                >
                  <Menu className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>
            ) : (
              <button
                className="w-8 h-8 rounded-md bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={toggle}
                aria-label={t("sidebar.toggleSidebar")}
              >
                <Menu className="h-4 w-4 text-primary-foreground" />
              </button>
            )}
          </div>

          {/* Search placeholder */}
          <div className={`${isOpen ? "mx-4" : "mx-2"} relative mt-4`}>
            {isOpen ? (
              <div className="h-2"></div>
            ) : (
              <div className="w-12 h-9 bg-secondary rounded-md flex items-center justify-center">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className={`mt-6 ${isOpen ? "px-4" : "px-2"} flex-1 overflow-y-auto`}>
            <ul className="space-y-2" aria-label={t("sidebar.navigation")}>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center rounded-md transition-colors duration-200",
                      isOpen ? "px-3 py-2" : "justify-center py-2",
                      item.active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span>{item.icon}</span>
                    {isOpen && <span className="ml-3 text-sm whitespace-normal leading-tight">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className={`border-t border-border ${isOpen ? "p-4" : "p-2"} bg-background`}>
            {isOpen && (
              <div className="px-2 mb-2">
                <LanguageSwitcher />
              </div>
            )}
            {user ? (
              <div className={`flex ${isOpen ? "items-center" : "flex-col items-center"}`}>
                <div className={`${isOpen ? "mr-3" : "mb-2"} relative`}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        role="button"
                        tabIndex={0}
                        aria-label={t("sidebar.userMenu")}
                      >
                        {user.avatar ? (
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.username}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align={isOpen ? "start" : "end"}
                      side={isOpen ? "right" : "top"}
                      className="bg-background border border-border text-foreground w-56"
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.isAdmin ? t("general.admin") : t("general.user")}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("sidebar.profile")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          try {
                            await signOut()
                            router.push("/logout")
                            setTimeout(() => {
                              window.location.href = "/logout"
                            }, 500)
                          } catch (error) {
                            console.error("Logout error:", error)
                            window.location.href = "/logout"
                          }
                        }}
                        className="cursor-pointer text-red-500"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t("auth.logout")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {isOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.isAdmin ? t("general.admin") : t("general.user")}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className={`${isOpen ? "space-y-2" : "flex flex-col items-center space-y-2"}`}>
                <Link href="/login" className={`block ${!isOpen && "w-full flex justify-center"}`}>
                  <Button variant="outline" className={`${isOpen ? "w-full" : "w-10 h-8 p-0"}`}>
                    {isOpen ? t("auth.login") : <User className="h-4 w-4" />}
                  </Button>
                </Link>
                {isOpen && (
                  <Link href="/signup" className="block">
                    <Button className="w-full">{t("auth.createAccount")}</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </aside>
      </TooltipProvider>
    </>
  )
}
