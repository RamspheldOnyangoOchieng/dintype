"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { ArrowLeft, Image as ImageIcon, Loader2, Link as LinkIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

type GalleryImage = {
    id: string
    characterId: string
    imageUrl: string
    thumbnailUrl: string
    isLocked: boolean
    isNsfw: boolean
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
    const [characterName, setCharacterName] = useState("")
    const [images, setImages] = useState<GalleryImage[]>([])
    const [stats, setStats] = useState<GalleryStats | null>(null)

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

            if (data) {
                setCharacterName(data.name)
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
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
                            <div key={img.id} className="group relative aspect-[2/3] bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-primary/50 transition-colors">
                                <Image
                                    src={img.imageUrl}
                                    alt="Character Photo"
                                    fill
                                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${img.isLocked ? 'blur-sm grayscale opacity-50' : ''}`}
                                />
                                {img.isLocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                        <span className="px-2 py-1 bg-black/70 rounded text-xs font-bold text-white">LOCKED</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
                                        onClick={() => window.open(img.imageUrl, '_blank')}
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
