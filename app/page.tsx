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

  // Handle Supabase Auth redirects (code exchange or OTP)
  useEffect(() => {
    const code = searchParams.get("code")
    const token_hash = searchParams.get("token_hash")
    const type = searchParams.get("type")

    if (code) {
      // If code is present on home page, redirect to callback handler
      router.replace(`/auth/callback?code=${code}`)
      return
    }

    if (token_hash && type) {
      // If token_hash is present on home page, redirect to confirm handler
      router.replace(`/auth/confirm?token_hash=${token_hash}&type=${type}`)
      return
    }

    if (searchParams.get("login") === "true") {
      // Remove query param immediately to clean up URL
      const url = new URL(window.location.href)
      url.searchParams.delete("login")
      window.history.replaceState({}, "", url.toString())

      // Only open login modal if user is not already authenticated
      if (!user) {
        openLoginModal()
      } else {
        toast.success(t("auth.loginSuccess") || "Logged in successfully!")
      }
    }
  }, [searchParams, openLoginModal, user, t, router])

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
            <Link href="/karaktarer" className="text-primary hover:underline">
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

      {/* Mobile Bottom Navigation is provided by the global MobileNav component */}

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
