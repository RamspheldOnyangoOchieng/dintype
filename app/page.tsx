"use client"

import { Button } from "@/components/ui/button"
import PromotionalBanner from "@/components/promotional-banner"
import { useCharacters } from "@/components/character-context"
import { useState, useEffect, Suspense } from "react"
import { ArrowRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { CharacterGrid } from "@/components/character-grid"
import { CompanionExperienceSection } from "@/components/companion-experience-section"
import { FAQSection } from "@/components/faq-section"
import Link from "next/link"
import { useTranslations } from "@/lib/use-translations"
import LandingDisclaimerModal from "@/components/landing-disclaimer-modal"
import { CONSENT_VERSION, POLICY_VERSION, CONSENT_STORAGE_KEY } from "@/lib/consent-config"
import { useConsent } from "@/components/use-consent"
import { useAuth } from "@/components/auth-context"
import { useAuthModal } from "@/components/auth-modal-context"
import { useRouter, useSearchParams } from "next/navigation"
import { WelcomeModal } from "@/components/welcome-modal"
import { toast } from "sonner"

export default function Home() {
  const { characters, isLoading } = useCharacters()
  const { t } = useTranslations()
  const { consent, isLoaded, updateConsent } = useConsent()
  const { user } = useAuth()
  const { openLoginModal } = useAuthModal()
  const router = useRouter()

  // Filter characters based on the active type (case-insensitive)
  const { activeType } = useCharacters()
  const filteredCharacters = characters.filter((char) => {
    // Only show public characters on the Home page grid
    if (!char.isPublic) return false

    if (activeType === "All") return true
    // Convert both to lowercase for case-insensitive comparison
    const charCategory = (char.category || "").toLowerCase()
    const activeTypeLC = activeType.toLowerCase()
    return charCategory.includes(activeTypeLC)
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [lang, setLang] = useState("en") // or "en" based on user preference

  const searchParams = useSearchParams()

  // Check if consent modal should be shown based on centralized consent state
  useEffect(() => {
    if (!isLoaded) return

    const consentVersion = consent?.version
    const consentPolicyVersion = consent?.policyVersion

    if (!consent || consentVersion !== CONSENT_VERSION || consentPolicyVersion !== POLICY_VERSION) {
      // No consent or outdated version -> show modal
      setModalOpen(true)
    } else {
      // Valid consent exists -> hide modal
      setModalOpen(false)
    }
  }, [isLoaded, consent?.version, consent?.policyVersion, consent?.timestamp])

  // Split effect for login modal to avoid conflicts with consent modal
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      // Remove query param immediately to clean up URL
      const url = new URL(window.location.href)
      url.searchParams.delete("login")
      window.history.replaceState({}, "", url.toString())

      // Only open login modal if user is not already authenticated
      // This handles the case where the callback route successfully signed them in
      if (!user) {
        openLoginModal()
      } else {
        toast.success(t("auth.loginSuccess") || "Logged in successfully!")
      }
    }
  }, [searchParams, openLoginModal, user, t])

  const handleConfirm = (prefs: { analytics: boolean; marketing: boolean }) => {
    updateConsent(prefs)
    setModalOpen(false)
  }
  const handleCookieSettings = () => { setModalOpen(true) }

  return (
    <div className="bg-background">
      {/* Content Area */}
      <main>
        {/* Featured Promotional Banner */}
        <PromotionalBanner />

        <div className="mt-6 mb-4 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold">
            <Link href="/characters" className="text-primary hover:underline">
              {t("general.explore")}
            </Link>
          </h2>
        </div>

        <div className="space-y-4">
          <Suspense fallback={<div>{t("general.loading")}</div>}>
            <CharacterGrid characters={filteredCharacters || []} />
          </Suspense>
        </div>

        {/* Add the FAQ Section */}
        <FAQSection />

        {/* Add the Companion Experience Section */}
        <CompanionExperienceSection />

        {/* Anchor sections moved to bottom just before footer for better layout */}
        <section id="how-it-works" className="mx-auto max-w-5xl px-4 md:px-6 py-20 border-t border-border scroll-mt-24">
          <h2 className="text-3xl font-bold mb-4">{t("home.howItWorks.title")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("home.howItWorks.description")}</p>
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base">
            <li>{t("home.howItWorks.step1")}</li>
            <li>{t("home.howItWorks.step2")}</li>
            <li>{t("home.howItWorks.step3")}</li>
            <li>{t("home.howItWorks.step4")}</li>
            <li>{t("home.howItWorks.step5")}</li>
          </ol>
        </section>
        <section id="roadmap" className="mx-auto max-w-5xl px-4 md:px-6 py-20 border-t border-border scroll-mt-24">
          <h2 className="text-3xl font-bold mb-4">{t("home.roadmap.title")}</h2>
          <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
            <li><span className="font-medium text-foreground">Q1:</span> {t("home.roadmap.q1")}</li>
            <li><span className="font-medium text-foreground">Q2:</span> {t("home.roadmap.q2")}</li>
            <li><span className="font-medium text-foreground">Q3:</span> {t("home.roadmap.q3")}</li>
            <li><span className="font-medium text-foreground">Q4:</span> {t("home.roadmap.q4")}</li>
          </ul>
        </section>
        <section id="guide" className="mx-auto max-w-5xl px-4 md:px-6 py-20 border-t border-border scroll-mt-24">
          <h2 className="text-3xl font-bold mb-4">{t("home.guide.title")}</h2>
          <p className="text-muted-foreground mb-4">{t("home.guide.description")}</p>
          <div className="grid md:grid-cols-2 gap-6 text-sm md:text-base">
            <div>
              <h3 className="font-semibold mb-2">{t("home.guide.chat.title")}</h3>
              <p>{t("home.guide.chat.description")}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("home.guide.safety.title")}</h3>
              <p>{t("home.guide.safety.description")}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("home.guide.generate.title")}</h3>
              <p>{t("home.guide.generate.description")}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t("home.guide.personalize.title")}</h3>
              <p>{t("home.guide.personalize.description")}</p>
            </div>
          </div>
        </section>
        <section id="complaints" className="mx-auto max-w-5xl px-4 md:px-6 py-20 border-t border-border scroll-mt-24">
          <h2 className="text-3xl font-bold mb-4">{t("home.complaints.title")}</h2>
          <p className="text-muted-foreground mb-6">{t("home.complaints.description")}</p>
          <div className="space-y-2 text-sm md:text-base">
            <p>{t("home.complaints.email")}: <a href="mailto:support@dintype.se" className="text-primary hover:underline">support@dintype.se</a></p>
            <p>{t("home.complaints.note1")}</p>
            <p>{t("home.complaints.note2")}</p>
          </div>
        </section>
      </main>

      {/* Site footer is rendered globally in ClientRootLayout */}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center h-16 z-40 safe-area-inset-bottom">
        <Link href="/characters" className="flex flex-col items-center p-2 text-muted-foreground hover:text-primary transition-colors">
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
        <button
          onClick={() => {
            if (!user) {
              openLoginModal()
            } else {
              router.push('/generate')
            }
          }}
          className="flex flex-col items-center p-2 text-muted-foreground"
        >
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
        </button>
        <button
          onClick={() => {
            if (!user) {
              openLoginModal()
            } else {
              router.push('/create-character')
            }
          }}
          className="flex flex-col items-center p-2 text-muted-foreground"
        >
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
        </button>
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

      <LandingDisclaimerModal
        open={modalOpen}
        onConfirm={handleConfirm}
        onCookieSettings={handleCookieSettings}
        initialPreferences={consent?.preferences}
      />

      {/* Welcome Marketing Modal - only shown after consent is confirmed */}
      {!modalOpen && <WelcomeModal pageType="home" />}
    </div>
  )
}
