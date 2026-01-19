"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { ArrowLeft, Image as ImageIcon, Loader2, Link as LinkIcon, Trash2, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

type GalleryImage = {
    id: string
    characterId: string
    imageUrl: string
    thumbnailUrl: string
    isLocked: boolean
    isNsfw: boolean
    isPrimary?: boolean
    createdAt: string
}

type GalleryStats = {
    total: number
    unlocked: number
    locked: number
}

export default function CharacterImagesPage() {
    const params = useParams()
    const router = useRouter()
    const characterId = params.id as string
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [characterName, setCharacterName] = useState("")
    const [images, setImages] = useState<GalleryImage[]>([])
    const [stats, setStats] = useState<GalleryStats | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const supabase = createClient()

    useEffect(() => {
        fetchCharacterDetails()
        fetchGallery()
    }, [characterId])

    const fetchCharacterDetails = async () => {
        try {
            const { data, error } = await supabase
                .from("characters")
                .select("name")
                .eq("id", characterId)
                .single()

            if (data && (data as any).name) {
                setCharacterName((data as any).name)
            }
        } catch (error) {
            console.error("Error fetching character:", error)
        }
    }

    const fetchGallery = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/gallery?characterId=${characterId}`)
            const data = await response.json()

            if (data.error) {
                toast.error(data.error)
                return
            }

            setImages(data.images || [])
            setStats(data.stats)
        } catch (error) {
            console.error("Error fetching gallery:", error)
            toast.error("Failed to load images")
        } finally {
            setLoading(false)
        }
    }

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setUploading(true)
            const toastId = toast.loading(`Uploading image for ${characterName}...`)

            // 1. Upload to Cloudinary
            const base64 = await convertFileToBase64(file)
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: (() => {
                    const fd = new FormData()
                    fd.append("file", base64)
                    fd.append("folder", "character-galleries")
                    return fd
                })()
            })

            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed")

            // 2. Add to Gallery DB
            const galleryRes = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    characterId,
                    imageUrl: uploadData.secure_url,
                    isLocked: false,
                    isNsfw: false,
                    isPrimary: images.length === 0 // Make primary if it's the first one
                })
            })

            if (!galleryRes.ok) throw new Error("Failed to update gallery records")

            toast.success("Image added to gallery!", { id: toastId })
            fetchGallery() // Refresh list

        } catch (error) {
            console.error("Upload error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to upload image")
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleDelete = async (imageId: string) => {
        // Prevent deleting the synthetic profile image
        if (imageId && imageId.toString().endsWith('_profile')) {
            toast.error("Main profile image cannot be deleted from here.")
            return
        }

        if (!confirm("Are you sure you want to delete this photo?")) return

        try {
            const toastId = toast.loading("Deleting image...")
            const response = await fetch(`/api/gallery?id=${imageId}`, {
                method: "DELETE"
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to delete")
            }

            toast.success("Image deleted", { id: toastId })
            setImages(prev => prev.filter(img => img.id !== imageId))
        } catch (error) {
            console.error("Delete error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete image")
        }
    }

    const handleSetPrimary = async (img: GalleryImage) => {
        if (img.isPrimary || img.id.endsWith('_profile')) {
            toast.info("This is already the primary image.")
            return
        }

        try {
            const toastId = toast.loading("Setting as primary profile photo...")
            const response = await fetch(`/api/gallery`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: img.id,
                    characterId: characterId,
                    isPrimary: true
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to set primary")
            }

            toast.success("Primary profile photo updated!", { id: toastId })

            // Update local state
            setImages(prev => prev.map(item => ({
                ...item,
                isPrimary: item.id === img.id
            })))

        } catch (error) {
            console.error("Set primary error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to update primary image")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
            />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 py-4 border-b border-white/10 bg-[#0f0f0f] gap-4 shrink-0">
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-hidden">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="flex text-gray-400 hover:text-white shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="min-w-0 flex-1 lg:flex-none">
                        <h1 className="text-lg font-bold flex items-center gap-2 truncate">
                            <ImageIcon className="h-5 w-5 text-primary shrink-0" />
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-md">{characterName}</span>
                            <span className="text-gray-500 shrink-0">/</span>
                            <span className="shrink-0">Profile Photos</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        {uploading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add Photo
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 flex-1 overflow-y-auto w-full max-w-[100vw]">
                {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-white/5 text-gray-400">
                        <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                        <p>No profile photos found for {characterName}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className={`group relative aspect-[2/3] bg-[#1a1a1a] rounded-lg overflow-hidden border transition-colors ${img.isPrimary ? 'border-primary ring-1 ring-primary/50' : 'border-white/5 hover:border-primary/50'}`}>
                                <Image
                                    src={img.imageUrl}
                                    alt="Character Photo"
                                    fill
                                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${img.isLocked ? 'blur-sm grayscale opacity-50' : ''}`}
                                />

                                {img.isPrimary && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <Badge className="bg-primary text-white border-none shadow-lg">Primary</Badge>
                                    </div>
                                )}

                                {img.isLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <span className="px-2 py-1 bg-black/70 rounded text-xs font-bold text-white">LOCKED</span>
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
                                        onClick={() => window.open(img.imageUrl, '_blank')}
                                        title="Open in new tab"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                    </Button>

                                    {!img.isPrimary && (
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 bg-primary/60 hover:bg-primary/80 text-white backdrop-blur-sm"
                                            onClick={() => handleSetPrimary(img)}
                                            title="Set as Primary"
                                        >
                                            <Star className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {!img.id.toString().endsWith('_profile') && (
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 bg-red-500/60 hover:bg-red-500/80 text-white backdrop-blur-sm"
                                            onClick={() => handleDelete(img.id)}
                                            title="Delete Photo"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
