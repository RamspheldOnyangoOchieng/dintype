"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useAuth } from "@/components/auth-context"
import { LogOut, User } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AuthModals } from "@/components/auth/auth-modals"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { toast } = useToast()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  // Don't show header on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  // Don't show header on logout page
  if (pathname === "/logout") {
    return null
  }

  // Update the handleLogout function to redirect to the logout page
  const handleLogout = () => {
    if (isLoggingOut) return // Prevent multiple clicks

    setIsLoggingOut(true)

    // Show toast notification
    toast({
      title: "Logging out",
      description: "Redirecting to logout page...",
      duration: 2000,
    })

    // Redirect to the logout page
    router.push("/logout")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />

            {isAdmin && (
              <Button asChild variant="outline" className="ml-4 bg-purple-100 hover:bg-purple-200 border-purple-300">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="icon" title="Profile">
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Logout"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsSignupModalOpen(true)} className="hidden sm:inline-flex">
                  Sign Up
                </Button>
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Login
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
      <AuthModals
        isLoginOpen={isLoginModalOpen}
        isSignupOpen={isSignupModalOpen}
        onCloseLogin={() => setIsLoginModalOpen(false)}
        onCloseSignup={() => setIsSignupModalOpen(false)}
      />
    </header>
  )
}
