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
import { SimpleImageGenerator } from "@/components/simple-image-generator"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { generateCharacterDescription, generateSystemPrompt, type GenerateCharacterParams } from "@/lib/openai"

import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area" // Assume scroll-area exists or use div
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { X, Plus, BookOpen as StoryIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"

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
  const { characters, getCharacter, updateCharacter, uploadImage } = useCharacters()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const faceInputRef = useRef<HTMLInputElement>(null)
  const anatomyInputRef = useRef<HTMLInputElement>(null)
  const multiFileInputRef = useRef<HTMLInputElement>(null)

  // Add video URL to the form state
  const [formData, setFormData] = useState<any>({
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
    // Character appearance traits from image generation
    characterGender: "female",
    characterAge: "young_adult",
    bodyType: "average",
    characterStyle: "realistic",
    artStyle: "digital_art",
    hairColor: "brown",
    eyeColor: "brown",
    skinTone: "fair",
    clothing: "casual",
    pose: "portrait",
    background: "simple",
    mood: "neutral",
    // Other fields
    language: "English",
    relationship: "Single",
    systemPrompt: "",
    isNew: false,
    category: "girls", // Add this field
    images: [] as string[], // Add this for multi-image support
    // NEW ADVANCED METADATA FIELDS
    face_reference_url: "",
    anatomy_reference_url: "",
    preferred_poses: "",
    preferred_environments: "",
    preferred_moods: "",
    negative_prompt_restrictions: "",
    default_prompt: "",
    negative_prompt: "",
    isStorylineActive: false,
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

  const hasLoadedRef = useRef(false)

  // Load character data
  useEffect(() => {
    // Only load data if we haven't loaded it yet or if the ID changed
    if (hasLoadedRef.current && id === params.id) return

    const character = getCharacter(id)
    if (character) {
      console.log(`📡 Character ${id} found in context, loading into form...`)
      setFormData({
        // Start with traits from character metadata (lowest priority)
        ...(character.metadata?.characterDetails || {}),
        // Then add top-level character record fields (highest priority)
        name: character.name,
        age: character.age,
        image: character.image,
        videoUrl: character.videoUrl || "",
        description: character.description,
        personality: character.personality || "",
        occupation: character.occupation || "",
        hobbies: character.hobbies || "",
        body: character.body || "Average",
        ethnicity: character.ethnicity || "Mixed",
        // Appearance traits (defaults if not in characterDetails)
        characterGender: character.characterGender || (character.metadata?.characterDetails?.characterGender) || "female",
        characterAge: character.characterAge || (character.metadata?.characterDetails?.characterAge) || "young_adult",
        bodyType: character.bodyType || (character.metadata?.characterDetails?.bodyType) || "average",
        characterStyle: character.characterStyle || (character.metadata?.characterDetails?.characterStyle) || "realistic",
        artStyle: character.artStyle || (character.metadata?.characterDetails?.artStyle) || "digital_art",
        hairColor: character.hairColor || (character.metadata?.characterDetails?.hairColor) || "brown",
        eyeColor: character.eyeColor || (character.metadata?.characterDetails?.eyeColor) || "brown",
        skinTone: character.skinTone || (character.metadata?.characterDetails?.skinTone) || "fair",
        clothing: character.clothing || (character.metadata?.characterDetails?.clothing) || "casual",
        pose: character.pose || (character.metadata?.characterDetails?.pose) || "portrait",
        background: character.background || (character.metadata?.characterDetails?.background) || "simple",
        mood: character.mood || (character.metadata?.characterDetails?.mood) || "neutral",
        language: character.language || "English",
        relationship: character.relationship || "Single",
        systemPrompt: (character as any).systemPrompt || (character as any).system_prompt || "",
        isNew: !!((character as any).isNew || (character as any).is_new),
        isPublic: !!((character as any).isPublic || (character as any).is_public),
        isStorylineActive: !!((character as any).isStorylineActive || (character as any).is_storyline_active),
        category: (character as any).category || "girls",
        images: character.images || [],
        // Advanced metadata fields (direct mapping)
        face_reference_url: character.metadata?.face_reference_url || "",
        anatomy_reference_url: character.metadata?.anatomy_reference_url || "",
        preferred_poses: character.metadata?.preferred_poses || "",
        preferred_environments: character.metadata?.preferred_environments || "",
        preferred_moods: character.metadata?.preferred_moods || "",
        negative_prompt_restrictions: character.metadata?.negative_prompt_restrictions || "",
        default_prompt: character.metadata?.default_prompt || "",
        negative_prompt: character.metadata?.negative_prompt || "",
      })

      // Set image preview if character has an image
      if (character.image && !character.image.includes("placeholder")) {
        setImagePreview(character.image)
      }

      hasLoadedRef.current = true
    } else if (!isLoading && characters.length > 0) {
      console.warn(`⚠️ Character ${id} not found in characters array of length ${characters.length}`)
      setNotFound(true)
    }
  }, [id, characters, isLoading, getCharacter, params.id])

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : Number.parseInt(value)) : value,
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
      setFormData((prev: any) => ({ ...prev, image: result.secure_url }))
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
        setFormData((prev: any) => ({ ...prev, image: character.image }))
      }
    } finally {
      setIsUploading(false)
    }
  }

  const appendSuggestion = (text: string) => {
    setRegenPrompt((prev: any) => {
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

      // Check if images were returned directly (Seedream sync success) - skip polling
      if (result.images && result.images.length > 0 && result.status === "TASK_STATUS_SUCCEED") {
        console.log("✅ Images returned directly, skipping polling")
        const newImageUrl = result.images[0]

        // Save to gallery and update character
        try {
          // Ensure ORIGINAL image is in gallery first
          const currentGalleryRes = await fetch(`/api/gallery?characterId=${id}`)
          const currentGalleryData = await currentGalleryRes.json()
          const isAlreadyInGallery = currentGalleryData.images?.some((img: any) => img.imageUrl === formData.image)

          if (!isAlreadyInGallery && formData.image && !formData.image.includes("placeholder")) {
            await fetch("/api/gallery", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                characterId: id,
                imageUrl: formData.image,
                isLocked: false,
                isNsfw: false,
                isPrimary: false
              })
            })
          }

          // Add NEW image to Gallery
          await fetch("/api/gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              characterId: id,
              imageUrl: newImageUrl,
              isLocked: false,
              isNsfw: false,
              isPrimary: true
            })
          })

          await refreshSession()
          await updateCharacter(id, { image: newImageUrl })
          setFormData((prev: any) => ({ ...prev, image: newImageUrl }))
          setImagePreview(newImageUrl)
          toast.success("Character face regenerated and saved!")
        } catch (saveErr) {
          console.warn("Failed to save to gallery", saveErr)
          setFormData((prev: any) => ({ ...prev, image: newImageUrl }))
          setImagePreview(newImageUrl)
          toast.success("Character face regenerated!")
        }

        setIsRegenerating(false)
        return
      }

      const taskId = result.taskId || result.id

      if (!taskId) throw new Error("No task ID returned")

      // Poll for completion (fallback for async generation)
      let attempts = 0
      const maxAttempts = 45 // 90 seconds

      while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000))

        const checkRes = await fetch(`/api/check-generation?taskId=${taskId}`)
        const checkData = await checkRes.json()

        if (checkData.status === "TASK_STATUS_SUCCEED") {
          if (checkData.images && checkData.images.length > 0) {
            const newImageUrl = checkData.images[0]
            // 0. Ensure ORIGINAL image is in gallery if it's not already there
            try {
              const currentGalleryRes = await fetch(`/api/gallery?characterId=${id}`)
              const currentGalleryData = await currentGalleryRes.json()
              const isAlreadyInGallery = currentGalleryData.images?.some((img: any) => img.imageUrl === formData.image)

              if (!isAlreadyInGallery && formData.image && !formData.image.includes("placeholder")) {
                console.log("Saving original image to gallery before replacement...")
                await fetch("/api/gallery", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    characterId: id,
                    imageUrl: formData.image,
                    isLocked: false,
                    isNsfw: false,
                    isPrimary: false
                  })
                })
              }
            } catch (err) {
              console.warn("Failed to save original image to gallery", err)
            }

            // 1. Add NEW image to Gallery and set as Primary
            try {
              const galleryRes = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  characterId: id,
                  imageUrl: newImageUrl,
                  isLocked: false,
                  isNsfw: false,
                  isPrimary: true
                })
              })

              if (!galleryRes.ok) throw new Error("Failed to add to gallery")

              // 2. EXPLICITLY update the character record in database and context
              // Refresh session first since polling might have taken a while
              await refreshSession()
              await updateCharacter(id, { image: newImageUrl })

              setFormData((prev: any) => ({ ...prev, image: newImageUrl }))
              setImagePreview(newImageUrl)

              toast.success("Character face regenerated, saved to gallery, and set as primary!")
            } catch (saveErr) {
              console.warn("Failed to save to gallery or update character", saveErr)
              // Fallback
              try {
                await refreshSession()
                await updateCharacter(id, { image: newImageUrl })
                toast.success("Character face regenerated and saved!")
              } catch (fallbackErr) {
                console.error("Fallback update failed:", fallbackErr)
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

  // Helper to filter formData for save
  const getUpdateData = (data: any) => {
    // Only include fields that exist in the database schema
    const {
      name, age, image, videoUrl, description,
      personality, occupation, hobbies, body,
      ethnicity, language, relationship,
      systemPrompt, isNew, category, images,
      hairColor, eyeColor, skinTone, characterStyle,
      story_conflict, story_setting, story_plot
    } = data

    // 1. Build the fresh sub-metadata object for appearance/story traits
    const characterDetails = {
      characterGender: data.characterGender,
      characterAge: data.characterAge,
      bodyType: data.bodyType,
      characterStyle: data.characterStyle,
      artStyle: data.artStyle,
      hairColor: data.hairColor,
      eyeColor: data.eyeColor,
      skinTone: data.skinTone,
      clothing: data.clothing,
      pose: data.pose,
      background: data.background,
      mood: data.mood,
      story_conflict: data.story_conflict || data.storyConflict,
      story_setting: data.story_setting || data.storySetting,
      story_plot: data.story_plot || data.storyPlot,
    }

    // 2. Return ONLY verified database columns at the top level
    // We update BOTH snake_case and camelCase variants because the DB 
    // unfortunately contains duplicate columns (a mix of both styles).
    const updatePayload: any = {
      name: data.name,
      age: Number(data.age),
      image: data.image,
      video_url: data.videoUrl,
      description: data.description,
      personality: data.personality,
      occupation: data.occupation,
      hobbies: data.hobbies,
      body: data.body,
      ethnicity: data.ethnicity,
      language: data.language,
      relationship: data.relationship,
      system_prompt: data.systemPrompt,
      systemPrompt: data.systemPrompt, // Duplicate column variant
      is_new: !!data.isNew,
      is_public: !!data.isPublic,
      isPublic: !!data.isPublic, // Duplicate column variant
      category: data.category || "girls",
      images: data.images || [],
      user_id: data.user_id || data.userId,
      userId: data.user_id || data.userId, // Duplicate column variant
      is_storyline_active: !!data.isStorylineActive,
      isStorylineActive: !!data.isStorylineActive,
      metadata: {
        ...(data.metadata || {}),
        characterDetails,
        face_reference_url: data.face_reference_url,
        anatomy_reference_url: data.anatomy_reference_url,
        preferred_poses: data.preferred_poses,
        preferred_environments: data.preferred_environments,
        preferred_moods: data.preferred_moods,
        negative_prompt_restrictions: data.negative_prompt_restrictions,
        default_prompt: data.default_prompt,
        negative_prompt: data.negative_prompt,
      }
    }

    // Include appearance traits at top level if columns exist
    const topLevelTraits = [
      'hairColor', 'eyeColor', 'skinTone', 'characterStyle',
      'artStyle', 'clothing', 'pose', 'background', 'mood',
      'characterGender', 'characterAge', 'bodyType'
    ]

    topLevelTraits.forEach(trait => {
      if (data[trait] !== undefined) {
        updatePayload[trait] = data[trait]
      }
    })

    return updatePayload
  }

  const handleReferenceImagesClick = () => {
    multiFileInputRef.current?.click()
  }

  const handleReferenceImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError("")

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file))
      const uploadedUrls = await Promise.all(uploadPromises)

      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }))

      toast.success(`Successfully uploaded ${uploadedUrls.length} reference images`)
    } catch (err) {
      console.error("Error uploading reference images:", err)
      setError(`Failed to upload some images: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsUploading(false)
      if (multiFileInputRef.current) multiFileInputRef.current.value = ""
    }
  }

  const removeReferenceImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }))
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
        relationship: formData.relationship,
      }

      const description = await generateCharacterDescription(params)
      setFormData((prev: any) => ({ ...prev, description }))
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
        relationship: formData.relationship,
      })

      setFormData((prev: any) => ({ ...prev, systemPrompt }))
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

    if (!formData.age || Number(formData.age) < 18) {
      setError("Age must be 18 or older")
      return
    }

    setIsSaving(true)

    try {
      const updateData = getUpdateData(formData)

      try {
        // Try to refresh the session before updating
        await refreshSession()

        // Update the character
        const updated = await updateCharacter(id, updateData)

        if (updated) {
          // Sync local formData with the returned data to ensure UI is fresh
          const reloadedFormData = {
            ...(updated.metadata?.characterDetails || {}),
            ...updated,
            // Re-map a few key fields that might be snake_case in 'updated'
            systemPrompt: (updated as any).systemPrompt || (updated as any).system_prompt || formData.systemPrompt,
            isNew: !!((updated as any).isNew || (updated as any).is_new),
            isPublic: !!((updated as any).isPublic || (updated as any).is_public),
            videoUrl: (updated as any).videoUrl || (updated as any).video_url || "",
          }
          setFormData((prev: any) => ({ ...prev, ...reloadedFormData }))
        }
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
          await updateCharacter(id, updateData)
        } else {
          throw updateErr
        }
      }

      toast.success("Character updated successfully!")
      // REMOVED: router.push("/admin/dashboard/characters")
      // Instead of redirecting, we stay on the page so the user can continue editing.
    } catch (err) {
      console.error("Error updating character:", err)

      if (err instanceof Error && err.message.includes("Authentication")) {
        setError("Authentication session expired. Please log out and log in again.")
      } else {
        setError(err instanceof Error ? err.message : "Failed to update character. Please try again.")
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
                          value={formData.age === "" ? "" : formData.age.toString()}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          min="18"
                          max="100"
                          placeholder="18"
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
                        <label htmlFor="hairColor" className="block text-sm font-medium text-gray-300">
                          Hair Color
                        </label>
                        <Input
                          id="hairColor"
                          name="hairColor"
                          value={formData.hairColor}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., Brown, Blue, Blonde"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="eyeColor" className="block text-sm font-medium text-gray-300">
                          Eye Color
                        </label>
                        <Input
                          id="eyeColor"
                          name="eyeColor"
                          value={formData.eyeColor}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., Brown, Blue, Green"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="characterStyle" className="block text-sm font-medium text-gray-300">
                          Visual Style
                        </label>
                        <Input
                          id="characterStyle"
                          name="characterStyle"
                          value={formData.characterStyle}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white"
                          placeholder="e.g., realistic, anime, semi_realistic"
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
                          {(isUploading || isRegenerating) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                              <Loader2 className="animate-spin h-8 w-8 text-white" />
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

                      {/* Reference Assets Gallery */}
                      <div className="space-y-4 pt-4 border-t border-[#333]">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-300">
                            Reference Assets / Training Set
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleReferenceImagesClick}
                            disabled={isUploading}
                            className="text-primary border-primary hover:bg-primary/10"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add More
                          </Button>
                        </div>
                        <input
                          type="file"
                          ref={multiFileInputRef}
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleReferenceImagesChange}
                        />

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                          {formData.images && formData.images.map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-[#333]">
                              <Image
                                src={img}
                                alt={`Reference ${idx}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeReferenceImage(idx)}
                                className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}

                          {formData.images?.length === 0 && (
                            <div
                              className="col-span-full border-2 border-dashed border-[#333] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                              onClick={handleReferenceImagesClick}
                            >
                              <ImageIcon className="h-8 w-8 text-gray-500 mb-2" />
                              <p className="text-xs text-gray-500">Upload multiple reference photos for better AI twinning</p>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 italic">
                          Upload 5-10 clear photos from different angles for the best results in AI likeness preservation.
                        </p>
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

                      {/* Character Category */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Category</label>
                        <RadioGroup
                          value={formData.category}
                          onValueChange={(val: any) => setFormData((prev: any) => ({ ...prev, category: val }))}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="girls" id="girls" />
                            <Label htmlFor="girls" className="text-white cursor-pointer">Girls</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="anime" id="anime" />
                            <Label htmlFor="anime" className="text-white cursor-pointer">Anime</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="guys" id="guys" />
                            <Label htmlFor="guys" className="text-white cursor-pointer">Guys</Label>
                          </div>
                        </RadioGroup>
                      </div>


                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="isNew"
                            name="isNew"
                            type="checkbox"
                            checked={formData.isNew}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, isNew: e.target.checked }))}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="isNew" className="ml-2 block text-sm text-gray-300">
                            Mark as New
                          </label>
                        </div>
                        <p className="text-xs text-gray-400">Characters marked as new will display a "New" badge.</p>
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-[#333] bg-[#252525]/30">
                          <div className="flex items-center gap-3">
                            <StoryIcon className="h-5 w-5 text-amber-400" />
                            <div>
                              <Label htmlFor="isStorylineActive" className="text-sm font-medium text-white cursor-pointer">
                                Storyline Active
                              </Label>
                              <p className="text-[10px] text-gray-400">Enable advanced storyline image/narrative flow</p>
                            </div>
                          </div>
                          <Switch
                            id="isStorylineActive"
                            checked={formData.isStorylineActive}
                            onCheckedChange={(checked) => setFormData((prev: any) => ({ ...prev, isStorylineActive: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Generation Settings */}
                  <div className="space-y-4 pt-4 border-t border-[#252525]">
                    <h3 className="text-lg font-medium text-primary">Advanced AI Generation Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Face Reference */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Face Reference Photo</label>
                        <div
                          className="relative aspect-video w-full bg-[#252525] rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-[#333] hover:border-primary/50 transition-colors"
                          onClick={() => faceInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={faceInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  setIsUploading(true);
                                  const url = await uploadImage(file);
                                  setFormData((prev: any) => ({ ...prev, face_reference_url: url }));
                                  toast.success("Face reference updated!");
                                } catch (err) {
                                  toast.error("Face reference upload failed");
                                } finally {
                                  setIsUploading(false);
                                }
                              }
                            }}
                          />
                          {formData.face_reference_url ? (
                            <div className="relative w-full h-full group">
                              <Image
                                src={formData.face_reference_url}
                                alt="Face reference"
                                fill
                                className="object-contain"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setFormData((prev: any) => ({ ...prev, face_reference_url: null }))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4">
                              <Upload className="h-6 w-6 mb-1 text-gray-400" />
                              <p className="text-xs text-gray-500">Upload high-res face reference</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Anatomy/Genitals Reference */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Anatomy / Details Reference</label>
                        <div
                          className="relative aspect-video w-full bg-[#252525] rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-[#333] hover:border-primary/50 transition-colors"
                          onClick={() => anatomyInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={anatomyInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  setIsUploading(true);
                                  const url = await uploadImage(file);
                                  setFormData((prev: any) => ({ ...prev, anatomy_reference_url: url }));
                                  toast.success("Anatomy reference updated!");
                                } catch (err) {
                                  toast.error("Anatomy reference upload failed");
                                } finally {
                                  setIsUploading(false);
                                }
                              }
                            }}
                          />
                          {formData.anatomy_reference_url ? (
                            <div className="relative w-full h-full group">
                              <Image
                                src={formData.anatomy_reference_url}
                                alt="Anatomy reference"
                                fill
                                className="object-contain"
                              />
                              <button
                                type="button"
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setFormData((prev: any) => ({ ...prev, anatomy_reference_url: null }))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                              <Upload className="h-6 w-6 mb-1 text-gray-400" />
                              <p className="text-xs text-gray-500">Upload anatomy/genital details</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="preferred_poses" className="block text-sm font-medium text-gray-300">Preferred Poses</label>
                        <Input
                          id="preferred_poses"
                          name="preferred_poses"
                          value={formData.preferred_poses}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white h-9"
                          placeholder="standing, sitting, spread legs, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="preferred_environments" className="block text-sm font-medium text-gray-300">Preferred Environments</label>
                        <Input
                          id="preferred_environments"
                          name="preferred_environments"
                          value={formData.preferred_environments}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white h-9"
                          placeholder="bedroom, beach, shower, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="preferred_moods" className="block text-sm font-medium text-gray-300">Preferred Moods</label>
                        <Input
                          id="preferred_moods"
                          name="preferred_moods"
                          value={formData.preferred_moods}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white h-9"
                          placeholder="seductive, happy, moaning, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="negative_prompt_restrictions" className="block text-sm font-medium text-gray-300">Strict Restrictions</label>
                        <Input
                          id="negative_prompt_restrictions"
                          name="negative_prompt_restrictions"
                          value={formData.negative_prompt_restrictions}
                          onChange={handleChange}
                          className="bg-[#252525] border-[#333] text-white h-9"
                          placeholder="no tattoos, no piercings, no glasses, etc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="default_prompt" className="block text-sm font-medium text-gray-300">Character Default Prompt Hook (Applied to all gens)</label>
                      <Textarea
                        id="default_prompt"
                        name="default_prompt"
                        value={formData.default_prompt}
                        onChange={handleChange}
                        className="bg-[#252525] border-[#333] text-white min-h-[60px]"
                        placeholder="Masterpiece, 8k, photorealistic, cinematic lighting..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="negative_prompt" className="block text-sm font-medium text-gray-300">Character Negative Prompt Hook</label>
                      <Textarea
                        id="negative_prompt"
                        name="negative_prompt"
                        value={formData.negative_prompt}
                        onChange={handleChange}
                        className="bg-[#252525] border-[#333] text-white min-h-[60px]"
                        placeholder="cartoon, anime, sketches, bad anatomy, flat chest, etc."
                      />
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
      <SimpleImageGenerator
        isOpen={isRegenModalOpen}
        onClose={() => setIsRegenModalOpen(false)}
        characterId={id}
        characterData={formData}
        onImageSelect={(url) => {
          setFormData((prev: any) => ({ ...prev, image: url }))
          setImagePreview(url)
          toast.success("Character image updated!")
        }}
        settings={{
          width: 800,
          height: 1200,
          size: "800x1200",
          aspectRatioLabel: "Portrait (Full Body)",
          title: "Generate Character Image"
        }}
      />
    </>
  )
}
