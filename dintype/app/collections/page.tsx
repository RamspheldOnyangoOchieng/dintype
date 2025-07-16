"use client"

import { useEffect, useState } from "react"
import { getAnonymousId } from "@/lib/anonymous-id"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GeneratedImage {
  id: string
  image_url: string
  prompt: string
  created_at: string
  language?: string
  model_used?: string
}

export default function CollectionsPage() {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError(null)
      const anonymousId = getAnonymousId()
      console.log("[Collections] Using anonymous ID:", anonymousId)

      const response = await fetch(`/api/user-images?anonymous_id=${anonymousId}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[Collections] API response not OK:", response.status, errorData)
        throw new Error(`Failed to fetch images: ${errorData.error || response.statusText}`)
      }

      const data = await response.json()
      console.log(`[Collections] Received ${data.images?.length || 0} images from API`)

      // Sort images by creation date (newest first)
      const sortedImages = (data.images || []).sort(
        (a: GeneratedImage, b: GeneratedImage) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      setImages(sortedImages)
    } catch (err) {
      console.error("[Collections] Error fetching images:", err)
      setError(err instanceof Error ? err.message : "Failed to load your image collection")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleImageError = (imageId: string) => {
    console.error("[Collections] Image failed to load:", imageId)
    setBrokenImages((prev) => new Set(prev).add(imageId))
  }

  const handleImageLoad = (imageId: string) => {
    console.log("[Collections] Image loaded successfully:", imageId)
    setBrokenImages((prev) => {
      const newSet = new Set(prev)
      newSet.delete(imageId)
      return newSet
    })
  }

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) throw new Error("Failed to fetch image")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Bild nedladdad",
        description: "Bilden har laddats ner till din enhet",
      })
    } catch (error) {
      console.error("[Collections] Download error:", error)
      toast({
        title: "Nedladdning misslyckades",
        description: "Det gick inte att ladda ner bilden",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/user-images/${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete image")
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId))
      toast({
        title: "Bild borttagen",
        description: "Bilden har tagits bort från din samling",
      })
    } catch (error) {
      console.error("[Collections] Delete error:", error)
      toast({
        title: "Borttagning misslyckades",
        description: "Det gick inte att ta bort bilden",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Din bildsamling</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Din bildsamling</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
        <Button onClick={fetchImages} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Försök igen
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Din bildsamling</h1>
        <Button onClick={fetchImages} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Uppdatera
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300">Inga bilder sparade än</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Generera några bilder och spara dem för att se dem här!
          </p>
          <Button className="mt-4" onClick={() => (window.location.href = "/generate")}>
            Generera bilder
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md group">
              <div className="relative h-48">
                {brokenImages.has(image.id) ? (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Bilden kunde inte laddas</p>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.prompt}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(image.id)}
                    onLoad={() => handleImageLoad(image.id)}
                    unoptimized // Important for external URLs
                  />
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDownload(image.image_url, image.prompt)}
                    disabled={brokenImages.has(image.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(image.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{image.prompt}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{new Date(image.created_at).toLocaleDateString("sv-SE")}</span>
                  {image.language && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {image.language.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
