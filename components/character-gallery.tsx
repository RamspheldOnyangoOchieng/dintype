"use client"

import { useState, useEffect } from "react"
import { Lock, Unlock, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-context"

interface GalleryImage {
    id: string
    characterId: string
    imageUrl: string | null
    thumbnailUrl: string | null
    isLocked: boolean
    isNsfw: boolean
    unlockCost: number
    isFreePreview: boolean
    isUnlockedByUser: boolean
    isOwnImage: boolean
    createdAt: string
}

interface CharacterGalleryProps {
    characterId: string
    onImageClick?: (imageUrl: string) => void
}

export function CharacterGallery({ characterId, onImageClick }: CharacterGalleryProps) {
    const { user, tokenBalance, refreshUser } = useAuth()
    const [activeTab, setActiveTab] = useState<"gallery" | "unlocked">("gallery")
    const [images, setImages] = useState<GalleryImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [unlockingId, setUnlockingId] = useState<string | null>(null)

    const fetchGallery = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/gallery?characterId=${characterId}`)
            const data = await response.json()

            if (data.images) {
                setImages(data.images)
            }
        } catch (error) {
            console.error("Error fetching gallery:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (characterId) {
            fetchGallery()
        }
    }, [characterId])

    const handleUnlockImage = async (imageId: string) => {
        if (!user) {
            toast.error("Please login to unlock images")
            return
        }

        setUnlockingId(imageId)

        try {
            const response = await fetch("/api/gallery/unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageId })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                toast.success(`Image unlocked! ${data.tokensSpent} tokens spent.`)

                // Update the image in state
                setImages(prev => prev.map(img =>
                    img.id === imageId
                        ? { ...img, isLocked: false, imageUrl: data.imageUrl, thumbnailUrl: data.imageUrl, isUnlockedByUser: true }
                        : img
                ))

                // Refresh user to update token balance
                refreshUser()
            } else {
                toast.error(data.error || "Failed to unlock image")
            }
        } catch (error) {
            console.error("Error unlocking image:", error)
            toast.error("Failed to unlock image")
        } finally {
            setUnlockingId(null)
        }
    }

    const allImages = images
    const unlockedImages = images.filter(img => !img.isLocked)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    if (images.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground text-sm">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No gallery images yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "gallery" | "unlocked")}>
                <TabsList className="w-full bg-background/50 border border-border/40 h-9">
                    <TabsTrigger value="gallery" className="flex-1 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        GALLERY
                    </TabsTrigger>
                    <TabsTrigger value="unlocked" className="flex-1 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        UNLOCKED
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="gallery" className="mt-3 space-y-3">
                    {/* Unlock All Button */}
                    {allImages.some(img => img.isLocked) && (
                        <Button
                            variant="outline"
                            className="w-full border-primary/50 text-primary hover:bg-primary/10 h-10 text-sm font-bold"
                            disabled={!user}
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            ⚡ 100 Unlock Gallery
                        </Button>
                    )}

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        {allImages.map((image) => (
                            <div
                                key={image.id}
                                className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border/40"
                            >
                                {image.isLocked ? (
                                    // Locked Image
                                    <div
                                        className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-colors"
                                        onClick={() => handleUnlockImage(image.id)}
                                    >
                                        <div className="absolute inset-0 backdrop-blur-xl" />
                                        {unlockingId === image.id ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        ) : (
                                            <div className="relative z-10 flex flex-col items-center">
                                                <Lock className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
                                                <span className="text-xs text-white/70 mt-1">{image.unlockCost}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Unlocked Image
                                    <img
                                        src={image.imageUrl || image.thumbnailUrl || "/placeholder.svg"}
                                        alt="Gallery"
                                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => onImageClick?.(image.imageUrl || "")}
                                    />
                                )}

                                {/* NSFW Badge */}
                                {image.isNsfw && !image.isLocked && (
                                    <div className="absolute top-1 right-1 bg-red-500/80 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">
                                        18+
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="unlocked" className="mt-3">
                    {unlockedImages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            <Unlock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No unlocked images yet</p>
                            <p className="text-xs mt-1">Unlock images from the gallery tab</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {unlockedImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border/40"
                                >
                                    <img
                                        src={image.imageUrl || image.thumbnailUrl || "/placeholder.svg"}
                                        alt="Gallery"
                                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => onImageClick?.(image.imageUrl || "")}
                                    />

                                    {image.isNsfw && (
                                        <div className="absolute top-1 right-1 bg-red-500/80 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">
                                            18+
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
