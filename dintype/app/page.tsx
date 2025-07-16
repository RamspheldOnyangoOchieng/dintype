"use client"

import { Button } from "@/components/ui/button"
import PromotionalBanner from "@/components/promotional-banner"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/sidebar-context"
import { useAuth } from "@/components/auth-context"
import { useCharacters } from "@/components/character-context"
import { useSite } from "@/components/site-context"
import { useLanguage } from "@/components/language-context"
import Link from "next/link"
import { useState } from "react"
import { CharacterGrid } from "@/components/character-grid"
import { ThemeToggle } from "@/components/theme-toggle"
import { CompanionExperienceSection } from "@/components/companion-experience-section"
import { SiteFooter } from "@/components/site-footer"
import { FAQSection } from "@/components/faq-section"

export default function Home() {
  const { toggle } = useSidebar()
  const { user, logout } = useAuth()
  const { characters } = useCharacters()
  const { settings } = useSite()
  const { t } = useLanguage()

  // Use character types from site settings or fall back to defaults
  const [activeType, setActiveType] = useState<string>(settings.characterTypes?.[0] || "Girls")
  // Get character types from site settings or use defaults
  const characterTypes = settings.characterTypes || ["Girls", "Anime", "Guys"]

  // Filter characters based on the active type (case-insensitive)
  const filteredCharacters = characters.filter((char) => {
    if (activeType === "All") return true
    // Convert both to lowercase for case-insensitive comparison
    const charCategory = (char.category || "").toLowerCase()
    const activeTypeLC = activeType.toLowerCase()
    return charCategory === activeTypeLC
  })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={toggle} aria-label="Toggle menu">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">{t("general.explore")}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <>
                <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">
                  {t("auth.greeting")}, {user.username}!
                </span>
                <Button variant="outline" className="text-xs sm:text-sm" onClick={logout}>
                  {t("auth.logout")}
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant="default" className="text-xs sm:text-sm whitespace-nowrap">
                    {t("auth.createAccount")}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="text-xs sm:text-sm">
                    {t("auth.login")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1">
        {/* Featured Promotional Banner */}
        <PromotionalBanner />

        <div className="mt-6 mb-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold">
            <span className="text-primary">{t("general.explore")}</span> {t("home.exploreAIGirlfriends")}
          </h2>
        </div>

        <CharacterGrid characters={filteredCharacters} />

        {/* Add the FAQ Section */}
        <FAQSection />

        {/* Add the Companion Experience Section */}
        <CompanionExperienceSection />
      </main>

      {/* Add the Site Footer */}
      <SiteFooter />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center py-2 md:hidden z-20">
        <Link href="/" className="flex flex-col items-center p-2 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-xs mt-1">{t("general.explore")}</span>
        </Link>
        <Link href="/generate" className="flex flex-col items-center p-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-xs mt-1">{t("general.generate")}</span>
        </Link>
        <Link href="/create" className="flex flex-col items-center p-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs mt-1">{t("general.create")}</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center p-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="text-xs mt-1">{t("general.chat")}</span>
        </Link>
        <Link href="/premium" className="flex flex-col items-center p-2 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <span className="text-xs mt-1">{t("general.premium")}</span>
        </Link>
      </nav>
    </div>
  )
}
