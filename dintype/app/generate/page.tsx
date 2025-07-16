"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  Wand2,
  Loader2,
  Download,
  Share2,
  AlertCircle,
  ChevronLeft,
  FolderOpen,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { ImageModal } from "@/components/image-modal"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import {
  getImageSuggestions,
  getImageSuggestionsByCategory,
  type ImageSuggestion,
} from "@/app/actions/image-suggestions"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/components/language-context"

// Category translations (English to Swedish)
const categoryTranslations: Record<string, string> = {
  animals: "Djur",
  nature: "Natur",
  people: "Människor",
  fantasy: "Fantasi",
  architecture: "Arkitektur",
  art: "Konst",
  food: "Mat",
  travel: "Resor",
  technology: "Teknik",
  abstract: "Abstrakt",
  fashion: "Mode",
  sports: "Sport",
  vehicles: "Fordon",
  space: "Rymden",
  underwater: "Undervattens",
  "sci-fi": "Science Fiction",
  portraits: "Porträtt",
  landscapes: "Landskap",
  characters: "Karaktärer",
  clothing: "Kläder",
  bikini: "Bikini",
  skirt: "Kjol",
  lingerie: "Underkläder",
  "crop top": "Magtröja",
  leather: "Läder",
  "mini-skirt": "Minikjol",
  "satin robe": "Satinrock",
  jeans: "Jeans",
  // Add more translations as needed
}

// Function to get Swedish translation for a category
const getSwedishCategory = (category: string): string => {
  const lowerCategory = category.toLowerCase()
  // First try exact match
  if (categoryTranslations[category]) {
    return categoryTranslations[category]
  }
  // Then try lowercase match
  if (categoryTranslations[lowerCategory]) {
    return categoryTranslations[lowerCategory]
  }
  // If no translation is found, capitalize the first letter and return the original
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const imageOptions = [
  { value: "1", label: "1" },
  { value: "4", label: "4", premium: true },
  { value: "6", label: "6", premium: true },
  { value: "8", label: "8", premium: true },
]

export default function GenerateImagePage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const { t, language } = useLanguage() // Get both translation function and current language
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [showNegativePrompt, setShowNegativePrompt] = useState(false)
  const [selectedCount, setSelectedCount] = useState("1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<ImageSuggestion[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("")
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [savingImageIndex, setSavingImageIndex] = useState<number | null>(null)
  const [autoSaving, setAutoSaving] = useState(false)

  // Refs and state for scroll navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check scroll position to update arrow visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    // Can scroll left if not at the beginning
    setCanScrollLeft(scrollLeft > 0)
    // Can scroll right if not at the end
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  // Handle scroll navigation
  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300 // Adjust scroll amount as needed
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  // Fetch suggestions on component mount
  useEffect(() => {
    async function loadSuggestions() {
      setIsLoadingSuggestions(true)
      try {
        const data = await getImageSuggestions()
        setSuggestions(data)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((item) => item.category)))
        setCategories(uniqueCategories)

        // Set default active category if available
        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0])
        }
      } catch (error) {
        console.error("Error loading suggestions:", error)
        toast({
          title: "Error",
          description: "Det gick inte att läsa in förslag. Försök igen.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingSuggestions(false)
      }
    }

    loadSuggestions()
  }, [toast])

  // Check scroll position when suggestions change
  useEffect(() => {
    if (!isLoadingSuggestions) {
      // Reset scroll position when category changes
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0
      }

      // Initial check for scroll buttons
      checkScrollPosition()

      // Add event listener for scroll
      const scrollContainer = scrollContainerRef.current
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", checkScrollPosition)
        return () => scrollContainer.removeEventListener("scroll", checkScrollPosition)
      }
    }
  }, [isLoadingSuggestions, activeCategory])

  // Handle category change
  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category)
    setIsLoadingSuggestions(true)

    try {
      const data = await getImageSuggestionsByCategory(category)
      setSuggestions(data)
    } catch (error) {
      console.error("Error loading suggestions for category:", error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current)
      }
    }
  }, [])

  // Auto-save generated images when they're ready
  useEffect(() => {
    // Only run this effect when new images are generated and we're not already saving
    if (generatedImages.length > 0 && !autoSaving && user) {
      const saveAllImages = async () => {
        setAutoSaving(true)
        try {
          // Show toast that we're saving images
          toast({
            title: t("generate.savingImages"),
            description: t("generate.savingImages"),
          })

          // Save all images in parallel
          const savePromises = generatedImages.map(
            (imageUrl) => saveImageToCollection(imageUrl, -1, false), // -1 means don't show individual saving indicators
          )

          await Promise.all(savePromises)

          // Show success toast when all images are saved
          toast({
            title: t("generate.allImagesSaved"),
            description: (
              <div className="flex flex-col gap-2">
                <span>{t("generate.allImagesSavedDescription")}</span>
                <Button variant="outline" size="sm" className="mt-1" onClick={() => router.push("/collection")}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  {t("generate.collection")}
                </Button>
              </div>
            ),
          })
        } catch (error) {
          console.error("Error auto-saving images:", error)
          toast({
            title: t("general.error"),
            description: t("generate.downloadFailedDescription"),
            variant: "destructive",
          })
        } finally {
          setAutoSaving(false)
        }
      }

      saveAllImages()
    }
  }, [generatedImages, user, autoSaving, toast, router, t])

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: t("generate.promptRequired"),
        description: t("generate.promptRequiredDescription"),
        variant: "destructive",
      })
      return
    }

    // Check if user is logged in
    if (!user) {
      toast({
        title: t("generate.loginRequired"),
        description: t("generate.loginRequiredDescription"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImages([])

    try {
      // Start image generation
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          negativePrompt,
          imageCount: Number.parseInt(selectedCount),
          width: 1024,
          height: 1024,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Det gick inte att starta bildgenerering")
      }

      const data = await response.json()
      const taskId = data.taskId
      setCurrentTaskId(taskId)

      // Start polling for results
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current)
      }

      statusCheckInterval.current = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/check-generation?taskId=${taskId}`)

          if (!statusResponse.ok) {
            const errorData = await statusResponse.json()
            throw new Error(errorData.error || "Failed to check generation status")
          }

          const statusData = await statusResponse.json()

          if (statusData.status === "TASK_STATUS_SUCCEED") {
            // Generation completed successfully
            setGeneratedImages(statusData.images || [])
            setIsGenerating(false)

            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current)
              statusCheckInterval.current = null
            }
          } else if (statusData.status === "TASK_STATUS_FAILED") {
            // Generation failed
            setError(`Generation failed: ${statusData.reason || "Unknown error"}`)
            setIsGenerating(false)

            if (statusCheckInterval.current) {
              clearInterval(statusCheckInterval.current)
              statusCheckInterval.current = null
            }
          }
          // For other statuses (TASK_STATUS_PENDING, TASK_STATUS_RUNNING), continue polling
        } catch (error) {
          console.error("Error checking generation status:", error)
          // Fix: Ensure we're extracting the error message as a string
          setError(
            typeof error === "object" && error !== null && "message" in error
              ? String(error.message)
              : "Failed to check generation status. Please try again.",
          )
          setIsGenerating(false)

          if (statusCheckInterval.current) {
            clearInterval(statusCheckInterval.current)
            statusCheckInterval.current = null
          }
        }
      }, 2000) // Check every 2 seconds
    } catch (error) {
      console.error("Error generating image:", error)
      // Fix: Ensure we're extracting the error message as a string
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "An unexpected error occurred",
      )
      setIsGenerating(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt((prev) => {
      const newPrompt = prev ? `${prev}, ${suggestion}` : suggestion
      return newPrompt
    })
  }

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `generated-image-${index + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: t("generate.downloadFailed"),
        description: t("generate.downloadFailedDescription"),
        variant: "destructive",
      })
    }
  }

  const handleShare = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl)
    toast({ title: t("generate.imageUrlCopied") })
  }

  const handleDownloadAll = async () => {
    try {
      for (let i = 0; i < generatedImages.length; i++) {
        await handleDownload(generatedImages[i], i)
        // Add a small delay between downloads to prevent browser issues
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error("Error downloading all images:", error)
      toast({
        title: "Download failed",
        description: "Det gick inte att ladda ner alla bilder. Försök igen.",
        variant: "destructive",
      })
    }
  }

  const saveImageToCollection = async (imageUrl: string, index: number, showToast = true) => {
    // Check if user is logged in
    if (!user) {
      if (showToast) {
        toast({
          title: t("generate.loginRequired"),
          description: t("generate.loginRequiredDescription"),
          variant: "destructive",
        })
        router.push("/login")
      }
      return false
    }

    try {
      if (index >= 0) {
        setSavingImageIndex(index)
      }

      const response = await fetch("/api/save-generated-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          imageUrl: imageUrl,
          modelUsed: "sd_xl_base_1.0",
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save image")
      }

      if (showToast) {
        toast({
          title: t("generate.imageSaved"),
          description: t("generate.imageSavedDescription"),
        })
      }

      return true
    } catch (error) {
      console.error("Error saving image:", error)
      if (showToast) {
        toast({
          title: t("general.error"),
          description: error instanceof Error ? error.message : t("generate.downloadFailedDescription"),
          variant: "destructive",
        })
      }
      return false
    } finally {
      if (index >= 0) {
        setSavingImageIndex(null)
      }
    }
  }

  const viewCollection = () => {
    router.push("/collection")
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground">
      {/* Left Column - Generation Controls (Generera Bild) */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:border-r border-border overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="mr-1 p-0" onClick={() => router.back()} aria-label="Go back">
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Wand2 className="h-5 w-5 sm:h-6 sm:w-6" />
            <h1 className="text-xl sm:text-2xl font-bold">{t("generate.title")}</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Rest of the generation controls remain the same */}
        {/* Prompt Input */}
        <div className="relative mb-4 sm:mb-6">
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <Copy
              className="h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(prompt)
                toast({ title: t("generate.copiedToClipboard") })
              }}
            />
            <Button
              size="sm"
              variant="outline"
              className="h-7 sm:h-8 text-xs sm:text-sm"
              onClick={() => {
                navigator.clipboard.readText().then((text) => {
                  setPrompt(text)
                  toast({ title: t("generate.pastedFromClipboard") })
                })
              }}
            >
              {t("generate.paste")}
            </Button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 sm:h-32 bg-card rounded-xl p-3 sm:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary border border-border text-sm sm:text-base"
            placeholder={t("generate.promptPlaceholder")}
          />
        </div>

        {/* Negative Prompt Toggle */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNegativePrompt(!showNegativePrompt)}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
          >
            {showNegativePrompt ? t("generate.hideNegativePrompt") : t("generate.showNegativePrompt")}
          </Button>

          {/* Negative Prompt Input - Only shown when toggled */}
          {showNegativePrompt && (
            <div className="mt-3">
              <label
                htmlFor="negative-prompt"
                className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2"
              >
                {t("generate.negativePromptLabel")}
              </label>
              <textarea
                id="negative-prompt"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full h-16 sm:h-20 bg-card rounded-xl p-3 sm:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary border border-border text-xs sm:text-sm"
                placeholder={t("generate.negativePromptPlaceholder")}
              />
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t("generate.suggestions")}</h3>
          {categories.length > 0 ? (
            <Tabs defaultValue={categories[0]} value={activeCategory} onValueChange={handleCategoryChange}>
              <TabsList className="mb-3 sm:mb-4 bg-card border border-border p-1 rounded-lg overflow-x-auto flex justify-start w-full no-scrollbar">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize text-xs sm:text-sm text-foreground whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1c79ab] data-[state=active]:to-[#00ccff] data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    {/* Display Swedish translation if language is Swedish, otherwise show original */}
                    {language === "sv" ? getSwedishCategory(category) : category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Suggestions with navigation arrows */}
              <div className="relative">
                {/* Left navigation arrow */}
                <button
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-1 shadow-md transition-opacity ${
                    canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Scrollable container */}
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto pb-4 hide-scrollbar px-8"
                  onScroll={checkScrollPosition}
                >
                  <div className="flex gap-4 justify-start">
                    {isLoadingSuggestions
                      ? // Show loading placeholders
                        Array.from({ length: 8 }).map((_, index) => (
                          <div key={index} className="flex flex-col items-start">
                            <div className="w-[80px] h-[80px] rounded-2xl bg-muted animate-pulse" />
                            <div className="h-4 w-16 bg-muted animate-pulse mt-2 rounded" />
                          </div>
                        ))
                      : // Show filtered suggestions
                        suggestions
                          .filter((suggestion) => suggestion.category === activeCategory && suggestion.is_active)
                          .map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="flex flex-col items-start cursor-pointer"
                              onClick={() => handleSuggestionClick(suggestion.name)}
                            >
                              <div className="relative w-[80px] h-[80px] rounded-2xl overflow-hidden group hover:ring-2 hover:ring-primary transition-all">
                                <Image
                                  src={suggestion.image || "/placeholder.svg"}
                                  alt={suggestion.name}
                                  width={80}
                                  height={80}
                                  className="w-[80px] h-[80px] object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-white font-medium text-sm px-2 py-1 bg-black/50 rounded-md">
                                    {language === "sv" ? "Lägg till" : "Add"}
                                  </span>
                                </div>
                              </div>
                              <span className="mt-2 text-sm text-center text-muted-foreground">
                                {/* Also translate suggestion names if they match known categories */}
                                {language === "sv" && categoryTranslations[suggestion.name.toLowerCase()]
                                  ? categoryTranslations[suggestion.name.toLowerCase()]
                                  : suggestion.name}
                              </span>
                            </div>
                          ))}
                  </div>
                </div>

                {/* Right navigation arrow */}
                <button
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-1 shadow-md transition-opacity ${
                    canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar,
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .hide-scrollbar,
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No suggestion categories available.</div>
          )}
        </div>

        {/* Number of Images */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t("generate.numberOfImages")}</h3>
          <div className="flex flex-wrap gap-2">
            {imageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedCount(option.value)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${
                  selectedCount === option.value
                    ? "bg-primary text-primary-foreground border border-black shadow-md font-medium"
                    : "bg-card text-foreground hover:bg-muted border-border hover:border-primary/50 transition-colors"
                }`}
              >
                <span className="text-sm sm:text-base">{option.label}</span>
                {option.premium && (
                  <div className="bg-black dark:bg-pink-600 text-white text-xs px-1 py-0.5 rounded font-medium">
                    {t("generate.premium")}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/20 border border-destructive text-destructive-foreground rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <div className="relative">
          <Button
            className="w-full py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-[#6C47FF] to-[#FF4D8D] hover:opacity-90 text-white"
            disabled={!prompt.trim() || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                {t("generate.generating")}
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t("generate.generateButton")}
              </>
            )}
          </Button>
        </div>

        {/* View Collection Button */}
        {generatedImages.length > 0 && (
          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={viewCollection}>
              <FolderOpen className="h-5 w-5 mr-2" />
              {t("generate.viewCollection")}
            </Button>
          </div>
        )}
      </div>

      {/* Right Column - Generated Images (Genererade Bilder) */}
      <div className="w-full lg:w-1/2 p-4 sm:p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">{t("generate.generatedImages")}</h2>
          {generatedImages.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={handleDownloadAll}>
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t("generate.downloadAll")}</span>
                <span className="sm:hidden">Ladda ner</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={viewCollection}>
                <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t("generate.collection")}</span>
                <span className="sm:hidden">Samling</span>
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center h-[40vh] lg:h-[80vh] text-center">
            <div className="bg-card p-6 sm:p-8 rounded-xl mb-3 sm:mb-4">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-primary animate-spin" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("generate.generating")}</h3>
          </div>
        )}

        {!isGenerating && generatedImages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-[40vh] lg:h-[80vh] text-center">
            <div className="bg-card p-6 sm:p-8 rounded-xl mb-3 sm:mb-4">
              <Wand2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t("generate.noImagesYet")}</h3>
            <p className="text-sm text-muted-foreground max-w-md">{t("generate.noImagesDescription")}</p>
          </div>
        )}

        {!isGenerating && generatedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {generatedImages.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer transform transition-transform hover:scale-[1.02]"
                onClick={() => handleImageClick(index)}
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-card">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${t("generate.image")} ${index + 1}`}
                    width={512}
                    height={512}
                    className="w-full h-full object-cover object-top"
                    unoptimized // Important for external URLs
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent opening modal
                      handleDownload(image, index)
                    }}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {t("generate.download")}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent opening modal
                      handleShare(image)
                    }}
                  >
                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {t("generate.share")}
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
                  {t("generate.image")} {index + 1}
                </div>
                {/* Show saved indicator */}
                <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded-full">
                  {t("generate.saved")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        images={generatedImages}
        initialIndex={selectedImageIndex}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onDownload={handleDownload}
        onShare={handleShare}
        onSave={(index) => saveImageToCollection(generatedImages[index], index)}
        savingIndex={savingImageIndex}
      />
    </div>
  )
}
