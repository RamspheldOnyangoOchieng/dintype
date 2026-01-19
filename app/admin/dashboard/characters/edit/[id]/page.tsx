"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-context"
import { useCharacters } from "@/components/character-context"
import {
  LogOut,
  Settings,
  Home,
  Users,
  ImageIcon,
  MessageSquare,
  BarChart,
  ArrowLeft,
  Wand2,
  Upload,
  AlertTriangle,
  BookOpen,
  RefreshCw,
  Menu,
  Loader2,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { generateCharacterDescription, generateSystemPrompt, type GenerateCharacterParams } from "@/lib/openai"
import { toast } from "sonner"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area" // Assume scroll-area exists or use div

// Add this helper function at the top of the file, outside the component
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error converting URL to base64:", error)
    throw error
  }
}

export default function EditCharacterPage() {
  const params = useParams()
  const id = params.id as string
  const { user, isLoading, refreshSession } = useAuth()
  const { getCharacter, updateCharacter, uploadImage } = useCharacters()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add video URL to the form state
  const [formData, setFormData] = useState({
    name: "",
    age: 25,
    image: "/placeholder.svg?height=400&width=300",
    videoUrl: "", // Add this field
    description: "",
    personality: "",
    occupation: "",
    hobbies: "",
    body: "Average",
    ethnicity: "Mixed",
    language: "English",
    relationship: "Single",
    systemPrompt: "",
    isNew: false,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState("")
  const [notFound, setNotFound] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // New states for regeneration modal
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false)
  const [regenPrompt, setRegenPrompt] = useState("portrait, looking at camera, high quality, photorealistic, masterpiece, 8k")
  const [suggestions, setSuggestions] = useState<Record<string, any[]>>({})
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true)
        const res = await fetch("/api/prompts/suggestions")
        const data = await res.json()
        if (data.suggestions) {
          setSuggestions(data.suggestions)
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err)
      } finally {
        setLoadingSuggestions(false)
      }
    }
    fetchSuggestions()
  }, [])

  // Load character data
  useEffect(() => {
    const character = getCharacter(id)
    if (character) {
      setFormData({
        name: character.name,
        age: character.age,
        image: character.image,
        videoUrl: character.videoUrl || "", // Add this field
        description: character.description,
        personality: character.personality || "",
        occupation: character.occupation || "",
        hobbies: character.hobbies || "",
        body: character.body || "Average",
        ethnicity: character.ethnicity || "Mixed",
        language: character.language || "English",
        relationship: character.relationship || "Single",
        systemPrompt: character.systemPrompt || "",
        isNew: character.isNew,
      })

      // Set image preview if character has an image
      if (character.image && !character.image.includes("placeholder")) {
        setImagePreview(character.image)
      }
    } else {
      setNotFound(true)
    }
  }, [id, getCharacter])

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number.parseInt(value) || 18 : value,
    }))
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  // Update the handleImageChange function to use direct upload

  // Replace the existing handleImageChange function with this one
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setError("Image file is too large. Please choose a smaller image (max 10MB).")
      return
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Unsupported image format. Please use JPG, PNG, WebP, or GIF images.")
      return
    }

    // Preview the image
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload the image
    try {
      setIsUploading(true)
      setError("")
      const toastId = toast.loading("Uploading image...")

      // Create a FormData object for the upload
      const uploadFormData = new FormData()
      uploadFormData.append("file", await convertFileToBase64(file))
      uploadFormData.append("folder", "ai-characters")

      // Use internal API route for secure server-side upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image")
      }

      if (!result.secure_url) {
        throw new Error("Failed to upload image to Cloudinary (no URL returned)")
      }

      // Update local state
      setFormData((prev) => ({ ...prev, image: result.secure_url }))
      setImagePreview(result.secure_url)

      // Auto-save the image to the database immediately for better UX
      try {
        await updateCharacter(id, { image: result.secure_url })
        toast.success("Profile image updated and saved!", { id: toastId })
      } catch (saveErr) {
        console.warn("Failed to auto-save image, but upload succeeded", saveErr)
        toast.success("Image uploaded (click Update to save permanently)", { id: toastId })
      }

    } catch (err) {
      console.error("Error uploading image:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image"
      setError(errorMessage)
      toast.error(errorMessage)

      // Revert to current character image if upload failed
      const character = getCharacter(id)
      if (character) {
        setImagePreview(character.image)
        setFormData((prev) => ({ ...prev, image: character.image }))
      }
    } finally {
      setIsUploading(false)
    }
  }

  const appendSuggestion = (text: string) => {
    setRegenPrompt((prev) => {
      if (prev.includes(text)) return prev
      return `${prev}, ${text}`
    })
  }

  const handleRegenerateImage = async (customPrompt?: string) => {
    setIsRegenerating(true)
    setError("")
    setIsRegenModalOpen(false) // Close modal when starting

    const finalPrompt = customPrompt || regenPrompt

    try {
      let base64Image = null

      // Attempt to load current image for twinning if it exists and isn't a placeholder
      if (formData.image && !formData.image.includes("placeholder")) {
        try {
          base64Image = await urlToBase64(formData.image)
        } catch (e) {
          console.warn("Could not load current image for twinning, strictly using description.", e)
        }
      }

      // API Call
      const response = await fetch("/api/img2img", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPrompt,
          character: formData,
          imageBase64: base64Image
        }),
      })

      if (!response.ok) throw new Error("Failed to start image generation")
      const result = await response.json()
      const taskId = result.taskId || result.id

      if (!taskId) throw new Error("No task ID returned")

      // Poll for completion
      let attempts = 0
      const maxAttempts = 45 // 90 seconds

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000))

        const checkRes = await fetch(`/api/check-generation?taskId=${taskId}`)
        const checkData = await checkRes.json()

        if (checkData.status === "TASK_STATUS_SUCCEED") {
          if (checkData.images && checkData.images.length > 0) {
            const newImageUrl = checkData.images[0]
            setFormData(prev => ({ ...prev, image: newImageUrl }))
            setImagePreview(newImageUrl)

            // 1. Add to Gallery and set as Primary
            try {
              const galleryRes = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  characterId: id,
                  imageUrl: newImageUrl,
                  isLocked: false,
                  isNsfw: false,
                  isPrimary: true // This will auto-update the character's main image too
                })
              })

              if (!galleryRes.ok) throw new Error("Failed to add to gallery")

              toast.success("Character face regenerated, saved to gallery, and set as primary!")
            } catch (saveErr) {
              console.warn("Failed to save to gallery", saveErr)
              // Fallback to updating just the character image if gallery fails
              try {
                await updateCharacter(id, { image: newImageUrl })
                toast.success("Character face regenerated and saved!")
              } catch (fallbackErr) {
                toast.error("Image regenerated but failed to save.")
              }
            }
          }
          break
        } else if (checkData.status === "TASK_STATUS_FAILED") {
          throw new Error(checkData.reason || "Image generation failed")
        }

        attempts++
      }

      if (attempts >= maxAttempts) throw new Error("Generation timed out")

    } catch (err) {
      console.error("Error regenerating image:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to regenerate image"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      setError("Please enter a name before generating a description")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const params: GenerateCharacterParams = {
        name: formData.name,
        age: formData.age,
        occupation: formData.occupation,
        personality: formData.personality,
        interests: formData.hobbies,
      }

      const description = await generateCharacterDescription(params)
      setFormData((prev) => ({ ...prev, description }))
    } catch (err) {
      console.error("Error generating description:", err)
      setError("Failed to generate description. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateSystemPrompt = async () => {
    if (!formData.name || !formData.description) {
      setError("Please enter a name and description before generating a system prompt")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const systemPrompt = await generateSystemPrompt({
        name: formData.name,
        age: formData.age,
        description: formData.description,
        personality: formData.personality,
        occupation: formData.occupation,
        hobbies: formData.hobbies,
      })

      setFormData((prev) => ({ ...prev, systemPrompt }))
    } catch (err) {
      console.error("Error generating system prompt:", err)
      setError("Failed to generate system prompt. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Update the handleSubmit function to handle auth errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.description || !formData.systemPrompt) {
      setError("Name, description, and system prompt are required")
      return
    }

    setIsSaving(true)

    try {
      try {
        // Try to refresh the session before updating
        await refreshSession()

        // Update the character
        await updateCharacter(id, formData)
      } catch (updateErr) {
        // Check if it's an auth error
        if (
          updateErr instanceof Error &&
          (updateErr.message.includes("Authentication") ||
            updateErr.message.includes("auth") ||
            updateErr.message.includes("token"))
        ) {
          // Try to refresh auth and retry
          const refreshSuccess = await refreshSession()

          if (!refreshSuccess) {
            throw new Error("Authentication session expired. Please log out and log in again.")
          }

          // Try again
          await updateCharacter(id, formData)
        } else {
          throw updateErr
        }
      }

      router.push("/admin/dashboard/characters")
    } catch (err) {
      console.error("Error updating character:", err)

      if (err instanceof Error && err.message.includes("Authentication")) {
        setError("Authentication session expired. Please log out and log in again.")
      } else {
        setError("Failed to update character. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null // Will redirect in useEffect
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Character Not Found</h2>
          <p className="mb-6">The character you're looking for doesn't exist or has been deleted.</p>
          <Button
            onClick={() => router.push("/admin/dashboard/characters")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Back to Characters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#141414] text-white">
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
          {/* Admin Sidebar - Desktop */}
          <div className="hidden lg:flex w-64 bg-[#1A1A1A] border-r border-[#252525] flex-col">
            <div className="p-4 border-b border-[#252525]">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Character Editor
              </h1>
              <p className="text-xs text-gray-400 mt-1 truncate">{formData.name || "New Character"}</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                Character Menu
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start bg-[#252525] text-primary"
                onClick={() => { }}
              >
                <Users className="mr-2 h-4 w-4" />
                Profile Details
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#252525]"
                onClick={() => router.push(`/admin/dashboard/characters/${id}/storyline`)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Storyline
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#252525]"
                onClick={() => router.push(`/admin/dashboard/characters/${id}/images`)}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Profile Photos
              </Button>

              <div className="pt-4 mt-4 border-t border-[#252525]">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-400 hover:text-white"
                  onClick={() => router.push("/admin/dashboard/characters")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Button>
              </div>
            </nav>

            <div className="p-4 border-t border-[#252525]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <header className="bg-[#1A1A1A] border-b border-[#252525] p-4 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center">
                <div className="lg:hidden mr-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 bg-[#1A1A1A] border-r border-[#252525] text-white">
                      <SheetTitle className="sr-only">Character Editor Menu</SheetTitle>
                      <div className="p-4 border-b border-[#252525]">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                          Character Editor
                        </h1>
                        <p className="text-xs text-gray-400 mt-1 truncate">{formData.name || "New Character"}</p>
                      </div>

                      <nav className="flex-1 p-4 space-y-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
                          Character Menu
                        </div>

                        <Button
                          variant="ghost"
                          className="w-full justify-start bg-[#252525] text-primary"
                          onClick={() => { }}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Profile Details
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#252525]"
                          onClick={() => router.push(`/admin/dashboard/characters/${id}/storyline`)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Storyline
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#252525]"
                          onClick={() => router.push(`/admin/dashboard/characters/${id}/images`)}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Profile Photos
                        </Button>

                        <div className="pt-4 mt-4 border-t border-[#252525]">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-400 hover:text-white"
                            onClick={() => router.push("/admin/dashboard/characters")}
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to List
                          </Button>
                        </div>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex mr-2"
                  onClick={() => router.push("/admin/dashboard/characters")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg sm:text-xl font-bold truncate max-w-[150px] sm:max-w-none">
                  Edit: {formData.name}
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/")} className="ml-2">
                <Home className="mr-2 h-4 w-4 hidden sm:block" />
                <span className="hidden sm:inline">View Site</span>
                <span className="sm:hidden">Site</span>
              </Button>
            </header>

            <div className="p-4 sm:p-6">
              <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-6 mb-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Basic Information</h3>

                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="Character name"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                          Age
                        </label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age.toString()}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          min="18"
                          max="100"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-300">
                          Occupation
                        </label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="Character occupation"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="personality" className="block text-sm font-medium text-gray-300">
                          Personality
                        </label>
                        <Input
                          id="personality"
                          name="personality"
                          value={formData.personality}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., Friendly, Outgoing, Shy"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="hobbies" className="block text-sm font-medium text-gray-300">
                          Hobbies
                        </label>
                        <Input
                          id="hobbies"
                          name="hobbies"
                          value={formData.hobbies}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., Reading, Hiking, Photography"
                        />
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Additional Details</h3>

                      {/* Image Upload */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Character Image</label>
                        <div
                          className="relative aspect-square w-full max-w-[200px] bg-[#252525] rounded-lg overflow-hidden cursor-pointer"
                          onClick={handleImageClick}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {imagePreview ? (
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Character preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <Upload className="h-8 w-8 mb-2 text-gray-400" />
                              <p className="text-sm text-gray-400 text-center">
                                {isUploading ? "Uploading..." : "Click to upload image"}
                              </p>
                            </div>
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsRegenModalOpen(true)}
                            disabled={isRegenerating || isUploading}
                            className="w-full max-w-[200px]"
                          >
                            <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
                            {isRegenerating ? "Generating..." : "Regenerate Face"}
                          </Button>
                        </div>
                      </div>

                      {/* Add a video upload field after the image upload section */}
                      {/* Add this after the image upload section in the form */}
                      <div className="space-y-2">
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-300">
                          Character Video URL (Optional)
                        </label>
                        <Input
                          id="videoUrl"
                          name="videoUrl"
                          value={formData.videoUrl}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="https://example.com/character-video.mp4"
                        />
                        <p className="text-xs text-gray-400">
                          Add a URL to a short video that will play when users hover over this character.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="body" className="block text-sm font-medium text-gray-300">
                          Body Type
                        </label>
                        <Input
                          id="body"
                          name="body"
                          value={formData.body}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., Athletic, Slim, Average"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-300">
                          Ethnicity
                        </label>
                        <Input
                          id="ethnicity"
                          name="ethnicity"
                          value={formData.ethnicity}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="Character ethnicity"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="language" className="block text-sm font-medium text-gray-300">
                          Language
                        </label>
                        <Input
                          id="language"
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., English, Spanish, Mandarin"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="relationship" className="block text-sm font-medium text-gray-300">
                          Relationship Status
                        </label>
                        <Input
                          id="relationship"
                          name="relationship"
                          value={formData.relationship}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., Single, Married, Complicated"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="isNew"
                            name="isNew"
                            type="checkbox"
                            checked={formData.isNew}
                            onChange={(e) => setFormData((prev) => ({ ...prev, isNew: e.target.checked }))}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="isNew" className="ml-2 block text-sm text-gray-300">
                            Mark as New
                          </label>
                        </div>
                        <p className="text-xs text-gray-400">Characters marked as new will display a "New" badge.</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Generated Content */}
                  <div className="space-y-4 pt-4 border-t border-[#252525]">
                    <h3 className="text-lg font-medium">AI Generated Content</h3>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                          Character Description
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateDescription}
                          disabled={isGenerating}
                          className="text-primary border-primary hover:bg-primary/10"
                        >
                          <Wand2 className="mr-2 h-4 w-4" />
                          {isGenerating ? "Generating..." : "Regenerate Description"}
                        </Button>
                      </div>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="bg-[#252525] border-[#333] text-white min-h-[100px]"
                        placeholder="A brief description of the character"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-300">
                          System Prompt
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateSystemPrompt}
                          disabled={isGenerating}
                          className="text-primary border-primary hover:bg-primary/10"
                        >
                          <Wand2 className="mr-2 h-4 w-4" />
                          {isGenerating ? "Generating..." : "Regenerate System Prompt"}
                        </Button>
                      </div>
                      <Textarea
                        id="systemPrompt"
                        name="systemPrompt"
                        value={formData.systemPrompt}
                        onChange={handleChange}
                        className="bg-[#252525] border-[#333] text-white min-h-[150px]"
                        placeholder="The system prompt that will guide the AI's responses as this character"
                      />
                      <p className="text-xs text-gray-400">
                        This prompt will instruct the AI on how to behave and respond as this character.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2"
                      onClick={() => router.push("/admin/dashboard/characters")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Update Character"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regeneration Modal */}
      <Dialog open={isRegenModalOpen} onOpenChange={setIsRegenModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Regenerate Character Face
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Current Prompt</label>
              <Textarea
                value={regenPrompt}
                onChange={(e) => setRegenPrompt(e.target.value)}
                className="bg-[#252525] border-[#333] text-white min-h-[100px]"
                placeholder="Enter generation prompt..."
              />
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-6">
                {Object.entries(suggestions).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-semibold text-primary capitalize flex items-center justify-between">
                      {category}
                      <span className="text-[10px] text-gray-500 font-normal">Click to add to prompt</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item: any) => (
                        <Badge
                          key={item.id}
                          variant="secondary"
                          className="bg-[#333] hover:bg-primary/20 text-gray-300 hover:text-primary cursor-pointer border-[#444] py-1 px-2 text-xs transition-colors"
                          onClick={() => appendSuggestion(item.prompt_text)}
                        >
                          {item.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                {loadingSuggestions && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsRegenModalOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleRegenerateImage()}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              Start Generation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
