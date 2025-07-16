"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  Download,
  Trash2,
  ImageIcon,
  Plus,
  X,
  RefreshCw,
  Heart,
  MoreVertical,
  FolderPlus,
  Folder,
} from "lucide-react"
import { getAllImages, deleteExistingImage, toggleImageFavorite } from "@/lib/image-actions"
import { getAllCollections, createNewCollection } from "@/lib/collection-actions"
import { addImageToExistingCollection } from "@/lib/image-actions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Add translation import
import { useTranslations } from "@/lib/use-translations"

interface GeneratedImage {
  id: string
  prompt: string
  image_url: string
  created_at: string
  model_used: string
  tags?: string[]
  favorite?: boolean
  collection_id?: string
}

interface Collection {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
  image_count: number
}

// Inside the CollectionPage component:
export default function CollectionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isFavoriting, setIsFavoriting] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAddToCollectionDialog, setShowAddToCollectionDialog] = useState(false)
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] = useState(false)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const [isAddingToCollection, setIsAddingToCollection] = useState(false)
  const [selectedImageForCollection, setSelectedImageForCollection] = useState<string | null>(null)
  const { t } = useTranslations()

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const result = await getAllImages()
      if (result.success) {
        setImages(result.images)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error fetching images:", error)
      toast({
        title: "Error",
        description: "Failed to load your collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCollections = async () => {
    setIsLoadingCollections(true)
    try {
      const result = await getAllCollections()
      if (result.success) {
        setCollections(result.collections)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error fetching collections:", error)
      toast({
        title: "Error",
        description: "Failed to load collections. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCollections(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [toast])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchImages()
    setIsRefreshing(false)
    toast({
      title: t("collection.collectionRefreshed"),
      description: t("collection.collectionUpdated"),
    })
  }

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${prompt.substring(0, 20).replace(/[^a-z0-9]/gi, "_")}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("collection.confirmDelete"))) {
      return
    }

    setIsDeleting(id)
    try {
      const result = await deleteExistingImage(id)

      if (result.success) {
        setImages((prev) => prev.filter((img) => img.id !== id))
        toast({
          title: t("collection.success"),
          description: t("collection.imageDeleted"),
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: t("collection.error"),
        description: t("collection.deleteError"),
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    setIsFavoriting(id)
    try {
      const result = await toggleImageFavorite(id, !isFavorite)

      if (result.success) {
        toast({
          title: t("collection.success"),
          description: !isFavorite ? t("collection.addedToFavorites") : t("collection.removedFromFavorites"),
        })
        setImages(images.map((img) => (img.id === id ? { ...img, favorite: !isFavorite } : img)))
        if (selectedImage?.id === id) {
          setSelectedImage({ ...selectedImage, favorite: !isFavorite })
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: t("collection.error"),
        description: t("collection.favoriteError"),
        variant: "destructive",
      })
    } finally {
      setIsFavoriting(null)
    }
  }

  const handleOpenAddToCollection = async (imageId: string) => {
    setSelectedImageForCollection(imageId)
    await fetchCollections()
    setShowAddToCollectionDialog(true)
  }

  const handleAddToCollection = async (collectionId: string) => {
    if (!selectedImageForCollection) return

    setIsAddingToCollection(true)
    try {
      const result = await addImageToExistingCollection(selectedImageForCollection, collectionId)

      if (result.success) {
        toast({
          title: t("collection.success"),
          description: t("collection.addedToCollection"),
        })
        setShowAddToCollectionDialog(false)
        setSelectedImageForCollection(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error adding to collection:", error)
      toast({
        title: t("collection.error"),
        description: t("collection.addToCollectionError"),
        variant: "destructive",
      })
    } finally {
      setIsAddingToCollection(false)
    }
  }

  const handleCreateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreatingCollection(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await createNewCollection(formData)

      if (result.success) {
        toast({
          title: t("collection.success"),
          description: t("collection.collectionCreated"),
        })
        setShowCreateCollectionDialog(false)

        // Refresh collections and add image to the new collection if we're in that flow
        await fetchCollections()

        if (selectedImageForCollection && result.collection) {
          await handleAddToCollection(result.collection.id)
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error creating collection:", error)
      toast({
        title: t("collection.error"),
        description: error instanceof Error ? error.message : t("collection.createCollectionError"),
        variant: "destructive",
      })
    } finally {
      setIsCreatingCollection(false)
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 pb-20 md:pb-8 md:py-8">
      {/* Header Section - Improved for mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{t("collection.yourImageCollection")}</h1>

        {/* Action buttons - Stack vertically on mobile */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 px-3 text-sm flex-1 sm:flex-none"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            {t("collection.refresh")}
          </Button>
          <Button
            onClick={() => router.push("/collections")}
            variant="outline"
            size="sm"
            className="h-10 px-3 text-sm bg-gray-100 border-gray-300 flex-1 sm:flex-none"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            {t("collection.collections")}
          </Button>
          <Button
            onClick={() => router.push("/generate")}
            className="h-10 px-3 text-sm bg-[#FF4D8D] hover:bg-[#FF3D7D] flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("collection.generateNewImages")}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF4D8D]" />
        </div>
      ) : images.length === 0 ? (
        <Card className="bg-white border-gray-200">
          <CardContent className="flex flex-col items-center justify-center p-6 sm:p-12 text-center">
            <div className="bg-gray-100 p-4 sm:p-6 rounded-full mb-4">
              <ImageIcon className="h-8 sm:h-12 w-8 sm:w-12 text-gray-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{t("collection.noImagesYet")}</h2>
            <p className="text-gray-500 mb-6 max-w-md text-sm sm:text-base">
              Du har inte sparat några bilder än. Generera nya bilder och spara dem till din samling.
            </p>
            <Button onClick={() => router.push("/generate")} className="bg-[#FF4D8D] hover:bg-[#FF3D7D]">
              {t("collection.generateImages")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Image Grid - Improved for mobile
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {images.map((image) => (
            <Card key={image.id} className="bg-white border-gray-200 overflow-hidden">
              <div className="relative aspect-square cursor-pointer" onClick={() => setSelectedImage(image)}>
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.prompt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-2 sm:p-3 text-gray-900">
                <p className="text-xs line-clamp-2 mb-2 sm:mb-3">{image.prompt}</p>
                <div className="flex justify-between">
                  {/* Favorite Button - Larger touch target */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFavorite(image.id, !!image.favorite)
                    }}
                    disabled={isFavoriting === image.id}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 bg-gray-100 border-gray-300"
                  >
                    {isFavoriting === image.id ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${image.favorite ? "fill-red-500 text-red-500" : ""}`} />
                    )}
                  </Button>
                  <div className="flex gap-1 sm:gap-2">
                    {/* Download Button - Larger touch target */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(image.image_url, image.prompt)
                      }}
                      className="h-8 w-8 sm:h-9 sm:w-9 p-0 bg-gray-100 border-gray-300"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    {/* More Options Dropdown - Larger touch target */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 sm:h-9 sm:w-9 p-0 bg-gray-100 border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white border-gray-200 min-w-[160px]">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenAddToCollection(image.id)
                          }}
                          className="py-2.5 text-sm"
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          {t("collection.addToCollection")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(image.id)
                          }}
                          disabled={isDeleting === image.id}
                          className="text-red-500 py-2.5 text-sm"
                        >
                          {isDeleting === image.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          {t("collection.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Modal - Improved for mobile */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-white/90 flex items-center justify-center z-50 p-1 sm:p-2 md:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-lg sm:max-w-2xl md:max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - Larger for touch */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 bg-gray-200/70 hover:bg-gray-300/70 text-gray-900 h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Image container with better mobile sizing */}
            <div className="relative aspect-square max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh]">
              <Image
                src={selectedImage.image_url || "/placeholder.svg"}
                alt={selectedImage.prompt}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Image details and actions - Improved for mobile */}
            <div className="p-2 sm:p-3 md:p-4 bg-white">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 md:mb-4">{selectedImage.prompt}</p>

              {/* Action buttons - Wrap on mobile */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleToggleFavorite(selectedImage.id, !!selectedImage.favorite)}
                  disabled={isFavoriting === selectedImage.id}
                  className="bg-gray-100 border-gray-300 text-xs h-9 px-2 sm:px-3 flex-1 sm:flex-none"
                >
                  {isFavoriting === selectedImage.id ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1 sm:mr-2" />
                  ) : (
                    <Heart
                      className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${selectedImage.favorite ? "fill-red-500 text-red-500" : ""}`}
                    />
                  )}
                  {selectedImage.favorite ? t("collection.removeFromFavorites") : t("collection.addToFavorites")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOpenAddToCollection(selectedImage.id)}
                  className="bg-gray-100 border-gray-300 text-xs h-9 px-2 sm:px-3 flex-1 sm:flex-none"
                >
                  <FolderPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t("collection.addToCollection")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedImage.image_url, selectedImage.prompt)}
                  className="bg-gray-100 border-gray-300 text-xs h-9 px-2 sm:px-3 flex-1 sm:flex-none"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {t("collection.download")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDelete(selectedImage.id)
                    setSelectedImage(null)
                  }}
                  disabled={isDeleting === selectedImage.id}
                  className="bg-gray-100 border-gray-300 text-xs h-9 px-2 sm:px-3 flex-1 sm:flex-none"
                >
                  {isDeleting === selectedImage.id ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1 sm:mr-2" />
                  ) : (
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  {t("collection.delete")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to Collection Dialog - Mobile optimized */}
      <Dialog open={showAddToCollectionDialog} onOpenChange={setShowAddToCollectionDialog}>
        <DialogContent className="bg-white border-gray-200 sm:max-w-md w-[calc(100%-2rem)] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{t("collection.addToCollection")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isLoadingCollections ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-[#FF4D8D]" />
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4 text-sm sm:text-base">{t("collection.noCollectionsYet")}</p>
                <Button
                  onClick={() => {
                    setShowAddToCollectionDialog(false)
                    setShowCreateCollectionDialog(true)
                  }}
                  className="bg-[#FF4D8D] hover:bg-[#FF3D7D] h-10"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  {t("collection.createCollection")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {collections.map((collection) => (
                  <Button
                    key={collection.id}
                    variant="outline"
                    className="w-full justify-start bg-gray-100 border-gray-300 hover:bg-gray-300 h-12 text-sm"
                    onClick={() => handleAddToCollection(collection.id)}
                    disabled={isAddingToCollection}
                  >
                    <Folder className="h-4 w-4 mr-2 text-[#FF4D8D]" />
                    <span className="truncate">{collection.name}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {collection.image_count} {collection.image_count === 1 ? "image" : "images"}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddToCollectionDialog(false)
                setShowCreateCollectionDialog(true)
              }}
              className="bg-gray-100 border-gray-300 w-full sm:w-auto h-10"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              {t("collection.newCollection")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddToCollectionDialog(false)}
              className="bg-gray-100 border-gray-300 w-full sm:w-auto h-10"
            >
              <X className="h-4 w-4 mr-2" />
              {t("collection.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Collection Dialog - Mobile optimized */}
      <Dialog open={showCreateCollectionDialog} onOpenChange={setShowCreateCollectionDialog}>
        <DialogContent className="bg-white border-gray-200 sm:max-w-md w-[calc(100%-2rem)] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{t("collection.createNewCollection")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCollection}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t("collection.name")}
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t("collection.myCollection")}
                  required
                  className="bg-gray-100 border-gray-300 h-10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  {t("collection.descriptionOptional")}
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t("collection.collectionDescription")}
                  className="bg-gray-100 border-gray-300 min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateCollectionDialog(false)
                  if (selectedImageForCollection) {
                    setShowAddToCollectionDialog(true)
                  }
                }}
                className="bg-gray-100 border-gray-300 w-full sm:w-auto h-10"
              >
                <X className="h-4 w-4 mr-2" />
                {t("collection.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isCreatingCollection}
                className="bg-[#FF4D8D] hover:bg-[#FF3D7D] w-full sm:w-auto h-10"
              >
                {isCreatingCollection ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FolderPlus className="h-4 w-4 mr-2" />
                )}
                {t("collection.createCollection")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
