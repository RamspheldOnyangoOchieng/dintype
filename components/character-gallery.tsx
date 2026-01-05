"use client"

import { useState, useEffect } from "react"
import { Lock, Unlock, Loader2, Image as ImageIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    onGalleryUpdate?: () => void
}

export function CharacterGallery({ characterId, onImageClick, onGalleryUpdate }: CharacterGalleryProps) {
    const { user, tokenBalance, refreshUser } = useAuth()
    const [activeView, setActiveView] = useState<"locked" | "unlocked">("locked")
    const [images, setImages] = useState<GalleryImage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [unlockingId, setUnlockingId] = useState<string | null>(null)
    const [isUnlockingAll, setIsUnlockingAll] = useState(false)

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
                
                // Notify parent that gallery has updated (unlocked image)
                onGalleryUpdate?.()
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

    const handleUnlockAllGallery = async () => {
        if (!user) {
            toast.error("Please login to unlock gallery")
            return
        }

        const lockedImages = images.filter(img => img.isLocked)
        if (lockedImages.length === 0) {
            toast.info("No locked images to unlock")
            return
        }

        const totalCost = lockedImages.reduce((sum, img) => sum + (img.unlockCost || 100), 0)

        if ((tokenBalance || 0) < totalCost) {
            toast.error(`Not enough tokens. Need ${totalCost} tokens.`)
            return
        }

        setIsUnlockingAll(true)

        try {
            // Unlock each image one by one
            for (const img of lockedImages) {
                const response = await fetch("/api/gallery/unlock", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageId: img.id })
                })

                const data = await response.json()

                if (response.ok && data.success) {
                    setImages(prev => prev.map(i =>
                        i.id === img.id
                            ? { ...i, isLocked: false, imageUrl: data.imageUrl, thumbnailUrl: data.imageUrl, isUnlockedByUser: true }
                            : i
                    ))
                }
            }

            toast.success(`Gallery unlocked! ${totalCost} tokens spent.`)
            refreshUser()
            onGalleryUpdate?.()
        } catch (error) {
            console.error("Error unlocking gallery:", error)
            toast.error("Failed to unlock gallery")
        } finally {
            setIsUnlockingAll(false)
        }
    }

    const lockedImages = images.filter(img => img.isLocked)
    const unlockedImages = images.filter(img => !img.isLocked)
    const displayImages = activeView === "locked" ? lockedImages : unlockedImages
    const totalUnlockCost = lockedImages.reduce((sum, img) => sum + (img.unlockCost || 100), 0)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
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
            {/* Locked / Unlocked Toggle Buttons */}
            <div className="flex gap-2">
                <Button
                    variant={activeView === "locked" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 h-9 text-xs font-bold ${activeView === "locked" ? "bg-primary text-primary-foreground" : "border-border/40"}`}
                    onClick={() => setActiveView("locked")}
                >
                    <Lock className="w-3 h-3 mr-1.5" />
                    LOCKED ({lockedImages.length})
                </Button>
                <Button
                    variant={activeView === "unlocked" ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 h-9 text-xs font-bold ${activeView === "unlocked" ? "bg-primary text-primary-foreground" : "border-border/40"}`}
                    onClick={() => setActiveView("unlocked")}
                >
                    <Unlock className="w-3 h-3 mr-1.5" />
                    UNLOCKED ({unlockedImages.length})
                </Button>
            </div>

            {/* Unlock All Gallery Button */}
            {lockedImages.length > 0 && activeView === "locked" && (
                <Button
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10 h-10 text-sm font-bold"
                    disabled={!user || isUnlockingAll || (tokenBalance || 0) < totalUnlockCost}
                    onClick={handleUnlockAllGallery}
                >
                    {isUnlockingAll ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <>
                            <ImageIcon className="w-4 h-4 mr-1" />
                            <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                        </>
                    )}
                    {totalUnlockCost} Unlock Gallery
                </Button>
            )}

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 gap-2">
                {displayImages.length === 0 ? (
                    <div className="col-span-2 text-center py-6 text-muted-foreground text-sm">
                        {activeView === "locked" ? (
                            <>
                                <Unlock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                <p>All images unlocked!</p>
                            </>
                        ) : (
                            <>
                                <Lock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                <p>No unlocked images yet</p>
                                <p className="text-xs mt-1">Tap locked images to unlock</p>
                            </>
                        )}
                    </div>
                ) : (
                    displayImages.map((image) => (
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
                                    <div className="absolute inset-0 backdrop-blur-xl bg-black/40" />
                                    {unlockingId === image.id ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-primary relative z-10" />
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center">
                                            <Lock className="w-8 h-8 text-yellow-500 drop-shadow-lg" />
                                            <span className="text-xs text-white/80 mt-1 font-medium">{image.unlockCost} 🪙</span>
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
                    ))
                )}
            </div>
        </div>
    )
}
