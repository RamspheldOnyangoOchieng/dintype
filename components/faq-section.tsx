"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Trash2, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-context"
import { useTranslations } from "@/lib/use-translations"
import { useSite } from "@/components/site-context"

type LangContent = { question: string; answer: string }

type FAQ = {
  id: string
  question: string   // English (default) question
  answer: string     // English (default) answer
  created_at: string
  translations?: Record<string, LangContent>
}

/** Pick the best localized text for a FAQ item, falling back to the English default. */
function getLocalized(item: FAQ, field: keyof LangContent, lang: string): string {
  return item.translations?.[lang]?.[field] || item[field] || ""
}

export function FAQSection() {
  const { t, language } = useTranslations()
  const { settings } = useSite()
  const siteName = settings.siteName || settings.logoText || "Dintype"

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingFAQ, setIsAddingFAQ] = useState(false)
  const [isDeletingFAQ, setIsDeletingFAQ] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Admin form: per-language inputs
  const [activeLangTab, setActiveLangTab] = useState<"en" | "sv">("en")
  const [enQuestion, setEnQuestion] = useState("")
  const [enAnswer, setEnAnswer] = useState("")
  const [svQuestion, setSvQuestion] = useState("")
  const [svAnswer, setSvAnswer] = useState("")

  // Get user and admin status from auth context
  const { user } = useAuth()
  const isAdmin = user?.isAdmin || false

  // Default fallback FAQs when DB is empty — dynamic brand name, no hardcoded strings
  const defaultFaqs: FAQ[] = [
    {
      id: "1",
      question: `What is ${siteName}?`,
      answer: `${siteName} is a platform for immersive experiences with AI companions. Create, customize, and interact with AI characters that can chat, generate images, and offer companionship.`,
      created_at: new Date().toISOString(),
      translations: {
        sv: {
          question: `Vad är ${siteName}?`,
          answer: `${siteName} är en plattform för uppslukande upplevelser med AI-sällskap. Skapa, anpassa och interagera med AI-karaktärer som kan chatta, generera bilder och erbjuda sällskap.`,
        },
      },
    },
    {
      id: "2",
      question: `Is ${siteName} legitimate and safe?`,
      answer: `Yes, ${siteName} prioritizes user safety and privacy. All conversations are protected with SSL encryption and we offer optional two-factor authentication to keep your account secure.`,
      created_at: new Date().toISOString(),
      translations: {
        sv: {
          question: `Är ${siteName} legitimt och säkert?`,
          answer: `Ja, ${siteName} prioriterar användarnas säkerhet och integritet. Alla konversationer skyddas med SSL-kryptering och vi erbjuder valfri tvåfaktorsautentisering.`,
        },
      },
    },
    {
      id: "3",
      question: "What is an AI companion and can I create my own?",
      answer:
        "An AI companion is a digital partner that can talk, react, flirt, and connect with you in real time. You can create your own companion from scratch or choose from many existing characters.",
      created_at: new Date().toISOString(),
      translations: {
        sv: {
          question: "Vad är ett AI-sällskap och kan jag skapa mitt eget?",
          answer:
            "Ett AI-sällskap är en digital partner som kan prata, reagera, flirta och koppla ihop med dig i realtid. Skapa ditt eget sällskap från grunden eller välj bland många befintliga karaktärer.",
        },
      },
    },
    {
      id: "4",
      question: "Can I ask for images, videos, and voice?",
      answer:
        "Yes, your companion can send selfies, generate custom videos, or respond with their voice. Ask for specific outfits, unique poses, or playful scenarios.",
      created_at: new Date().toISOString(),
      translations: {
        sv: {
          question: "Kan jag be om bilder, videor och röst?",
          answer:
            "Ja, ditt sällskap kan skicka selfies, generera anpassade videor eller svara med sin röst. Be om specifika kläder, unika poser eller lekfulla scenarier.",
        },
      },
    },
    {
      id: "5",
      question: "How do payments appear on my bank statements?",
      answer: "We value your privacy. Payments are handled discretely so that nothing on your statement reveals your experience.",
      created_at: new Date().toISOString(),
      translations: {
        sv: {
          question: "Hur visas betalningar på mitt kontoutdrag?",
          answer: "Vi värnar om din integritet. Betalningar hanteras diskret så att ingenting på ditt kontoutdrag avslöjar din upplevelse.",
        },
      },
    },
  ]

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setIsLoading(true)

      // Use the API route to fetch FAQs
      const response = await fetch("/api/admin/faqs")
      const result = await response.json()

      if (response.ok && result.data) {
        setFaqs(result.data.length > 0 ? result.data : defaultFaqs)
      } else {
        console.error("Error fetching FAQs:", result.error)
        setFaqs(defaultFaqs)
      }
    } catch (error) {
      console.error("Error:", error)
      setFaqs(defaultFaqs)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddFAQ = async () => {
    if (!enQuestion.trim() || !enAnswer.trim()) return

    try {
      setIsAddingFAQ(true)

      // Include Swedish translation only if both fields are filled
      const translations: Record<string, LangContent> = {}
      if (svQuestion.trim() && svAnswer.trim()) {
        translations.sv = { question: svQuestion.trim(), answer: svAnswer.trim() }
      }

      const response = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: enQuestion.trim(),
          answer: enAnswer.trim(),
          translations,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          title: t("faq.errorGeneric"),
          description: result.error || "Failed to add FAQ",
          variant: "destructive",
        })
        return
      }

      toast({ title: t("faq.addSuccess") })
      setEnQuestion("")
      setEnAnswer("")
      setSvQuestion("")
      setSvAnswer("")
      setShowAddForm(false)
      setActiveLangTab("en")
      fetchFAQs()
    } catch (error) {
      console.error("Error:", error)
      toast({ title: t("faq.errorGeneric"), variant: "destructive" } as any)
    } finally {
      setIsAddingFAQ(false)
    }
  }

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm(t("faq.deleteConfirm"))) return

    try {
      setIsDeletingFAQ(true)

      // Use the API route to delete FAQ
      const response = await fetch(`/api/admin/faqs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        toast({
          title: t("faq.errorGeneric"),
          description: result.error || "Failed to delete FAQ",
          variant: "destructive",
        })
        return
      }

      toast({
        title: t("faq.deleteSuccess"),
        description: "FAQ has been deleted",
      })
      fetchFAQs() // Refresh the list
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: t("faq.errorGeneric"),
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeletingFAQ(false)
    }
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-zinc-900 py-8 sm:py-12 md:py-16 px-4 border-t border-b border-gray-200 dark:border-zinc-800 rounded-[2px]">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 dark:text-white">
            <span className="text-zinc-800 dark:text-white">{siteName}</span>{" "}
            <span className="text-orange">{t("faq.title")}</span>
          </h2>

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? t("faq.cancel") : t("faq.addFaq")}
            </button>
          )}
        </div>

        {/* Admin Add FAQ Form — EN primary + optional SV translation */}
        {isAdmin && showAddForm && (
          <div className="mb-6 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-lg font-medium mb-3 text-zinc-800 dark:text-white">{t("faq.addNewFaqTitle")}</h3>

            {/* Language tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-700 mb-4">
              {(["en", "sv"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeLangTab === lang
                      ? "border-primary text-primary"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 English" : "🇸🇪 Svenska"}
                  {lang === "en" && <span className="ml-1 text-xs text-red-500">*</span>}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {activeLangTab === "en" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {t("faq.questionLabel")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={enQuestion}
                      onChange={(e) => setEnQuestion(e.target.value)}
                      className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white"
                      placeholder={t("faq.questionPlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {t("faq.answerLabel")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={enAnswer}
                      onChange={(e) => setEnAnswer(e.target.value)}
                      className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white min-h-[100px]"
                      placeholder={t("faq.answerPlaceholder")}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                    Optional — if left blank, Swedish users will see the English version.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {t("faq.questionLabel")}
                    </label>
                    <input
                      type="text"
                      value={svQuestion}
                      onChange={(e) => setSvQuestion(e.target.value)}
                      className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white"
                      placeholder="Fråga på svenska..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {t("faq.answerLabel")}
                    </label>
                    <textarea
                      value={svAnswer}
                      onChange={(e) => setSvAnswer(e.target.value)}
                      className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white min-h-[100px]"
                      placeholder="Svar på svenska..."
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setActiveLangTab("en") }}
                  className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  {t("faq.cancel")}
                </button>
                <button
                  onClick={handleAddFAQ}
                  disabled={!enQuestion.trim() || !enAnswer.trim() || isAddingFAQ}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAddingFAQ ? (
                    <>
                      {t("faq.adding")}
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    </>
                  ) : (
                    t("faq.addFaq")
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">{t("faq.noFaqs")}</div>
        ) : (
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={item.id}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950"
              >
                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex-1 flex justify-between items-center p-4 text-left focus:outline-none"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-base sm:text-lg font-medium text-zinc-800 dark:text-white">
                      {getLocalized(item, "question", language)}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${openIndex === index ? "transform rotate-180" : ""
                        }`}
                    />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteFAQ(item.id)}
                      className="p-4 text-red-500 hover:text-red-600 focus:outline-none"
                      aria-label="Delete FAQ"
                      disabled={isDeletingFAQ}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="p-4 pt-0 text-sm sm:text-base text-zinc-600 dark:text-zinc-300">{getLocalized(item, "answer", language)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
