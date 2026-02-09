"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Image as ImageIcon, Check } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner" // Assuming sonner is used for toasts based on previous file views

interface SimpleImageGeneratorProps {
    isOpen: boolean
    onClose: () => void
    onImageSelect: (imageUrl: string) => void
    characterId?: string
    characterData?: any
    settings?: {
        width?: number
        height?: number
        size?: string
        aspectRatioLabel?: string // e.g. "Portrait (3:4)"
        title?: string
    }
    useSourceImage?: boolean // Whether to use the current character image as a base
    type?: 'character' | 'banner' // Add type parameter
}

export function SimpleImageGenerator({ isOpen, onClose, onImageSelect, characterId, characterData, settings, useSourceImage, type = 'character' }: SimpleImageGeneratorProps) {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImages, setGeneratedImages] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [savedImages, setSavedImages] = useState<Set<string>>(new Set()) // Track which ones are saved
    const [isSavingAll, setIsSavingAll] = useState(false)
    const [error, setError] = useState("")

    const config = {
        width: settings?.width || 1024,
        height: settings?.height || 1024,
        size: settings?.size || "1024x1024",
        aspectRatioLabel: settings?.aspectRatioLabel || "Square (1:1)",
        title: settings?.title || "Generate Asset"
    }

    const handleGenerate = async () => {
        if (!prompt) return

        setIsGenerating(true)
        setError("")
        setGeneratedImages([])
        setSelectedImage(null)

        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    prompt: prompt,
                    width: config.width,
                    height: config.height,
                    image_num: 4, // Always generate 4 as requested
                    size: config.size,
                    steps: 25,
                    guidance_scale: 4.5, // Slightly increased for better prompt adherence balanced with realism
                    characterId: characterId, // Enable Twinning/Reference Engine
                    character: characterData, // Pass live form data for instant feedback
                    imageBase64: useSourceImage && characterData?.image ? characterData.image : undefined, // THE IMAGE TO EDIT
                    autoSave: true,
                    type: type
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image")
            }

            if (data.task_id) {
                await pollForTask(data.task_id)
            } else if (data.images && data.images.length > 0) {
                setGeneratedImages(data.images)
                setIsGenerating(false)
            } else {
                throw new Error("No images returned")
            }
        } catch (err) {
            console.error("Generation error:", err)
            setError(err instanceof Error ? err.message : "Failed to generate image")
            setIsGenerating(false)
        }
    }

    const pollForTask = async (taskId: string) => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/check-generation?taskId=${taskId}`, {
                    credentials: "include"
                })
                const data = await res.json()

                if (data.status === "TASK_STATUS_SUCCEED" && data.images && data.images.length > 0) {
                    setGeneratedImages(data.images)
                    setIsGenerating(false)
                } else if (data.status === "TASK_STATUS_FAILED") {
                    setError("Generation failed")
                    setIsGenerating(false)
                } else {
                    setTimeout(checkStatus, 2000)
                }
            } catch (e) {
                setError("Failed to check status")
                setIsGenerating(false)
            }
        }
        checkStatus()
    }

    const handleUseImage = () => {
        if (selectedImage) {
            onImageSelect(selectedImage)
            setGeneratedImages([])
            setSelectedImage(null)
            setSavedImages(new Set())
            onClose()
        }
    }

    const handleSaveToGallery = async (imageUrl: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!characterId) return;

        try {
            const response = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    characterId: characterId,
                    imageUrl: imageUrl,
                    isLocked: false,
                    isNsfw: false,
                    isPrimary: false
                })
            })

            if (response.ok) {
                setSavedImages(prev => new Set([...prev, imageUrl]))
                toast.success("Saved to gallery!")
            } else {
                throw new Error("Failed to save")
            }
        } catch (err) {
            console.error("Save error:", err)
            toast.error("Failed to save image")
        }
    }

    const handleSaveAll = async () => {
        if (!characterId || generatedImages.length === 0) return;

        setIsSavingAll(true);
        let successCount = 0;

        try {
            for (const imgUrl of generatedImages) {
                if (savedImages.has(imgUrl)) continue;

                const response = await fetch("/api/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        characterId: characterId,
                        imageUrl: imgUrl,
                        isLocked: false,
                        isNsfw: false,
                        isPrimary: false
                    })
                })
                if (response.ok) successCount++;
            }

            setSavedImages(new Set([...savedImages, ...generatedImages]));
            toast.success(`Saved ${successCount} new images to gallery!`);
        } catch (err) {
            console.error("Save all error:", err);
            toast.error("Error saving some images");
        } finally {
            setIsSavingAll(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-[800px] max-h-[92vh] flex flex-col bg-[#0F0F0F] border-[#222] text-white p-0 overflow-hidden shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 border-b border-[#222]">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#00A3FF]" />
                        {config.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {type === 'banner'
                            ? "Generate high-impact promotional assets for your campaigns."
                            : "Generate 4 options using the Multi-Reference Twinning Engine."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-300">Prompt Description</Label>
                        <Textarea
                            placeholder={type === 'banner'
                                ? "Describe the promotional banner you want..."
                                : `Describe the image you want. Explicitly mention "full body" if needed.`}
                            className="bg-[#252525] border-[#333] text-white min-h-[100px] focus:border-[#00A3FF]"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div className={cn(
                        "border border-[#333] rounded-xl bg-[#0F0F0F] min-h-[300px] flex items-center justify-center overflow-hidden relative",
                        generatedImages.length > 0 && "p-2"
                    )}>
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-10 w-10 text-[#00A3FF] animate-spin" />
                                <span className="text-xs text-gray-400 font-medium animate-pulse">
                                    {type === 'banner' ? "Generating promotional assets..." : "DNA Twinning in progress..."}
                                </span>
                            </div>
                        ) : generatedImages.length > 0 ? (
                            <div className={cn(
                                "grid gap-4 w-full h-full p-2 outline-none",
                                type === 'banner' ? "grid-cols-1" : "grid-cols-2"
                            )}>
                                {generatedImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "relative rounded-xl overflow-hidden cursor-pointer transition-all border-2",
                                            type === 'banner' ? "aspect-[1222/244] w-full bg-[#111]" : "aspect-[2/3] w-full bg-[#111]",
                                            selectedImage === img ? "border-[#00A3FF] ring-4 ring-[#00A3FF]/20 shadow-2xl scale-[1.02] z-10" : "border-[#333] opacity-90 hover:opacity-100 hover:scale-[1.01]"
                                        )}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Generated ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        {selectedImage === img && (
                                            <div className="absolute top-3 right-3 bg-[#00A3FF] rounded-full p-1.5 shadow-lg animate-in zoom-in">
                                                <Check className="h-5 w-5 text-white" />
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => handleSaveToGallery(img, e)}
                                            disabled={savedImages.has(img)}
                                            className={cn(
                                                "absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all",
                                                savedImages.has(img)
                                                    ? "bg-green-500/80 text-white"
                                                    : "bg-black/40 text-white hover:bg-black/60"
                                            )}
                                            title="Save to Gallery"
                                        >
                                            {savedImages.has(img) ? <Check className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                                            Option {idx + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-600">
                                <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                                <span className="text-sm">Batch results will appear here</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3 p-6 border-t border-[#222] bg-[#0F0F0F]">
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
                            Cancel
                        </Button>
                        {generatedImages.length > 0 && (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setGeneratedImages([])
                                        setSelectedImage(null)
                                        setSavedImages(new Set())
                                    }}
                                    className="text-gray-400 hover:text-red-400 hover:bg-red-900/10"
                                >
                                    Clear
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleSaveAll}
                                    disabled={isSavingAll || savedImages.size === generatedImages.length}
                                    className="border-[#333] text-gray-300 hover:bg-[#252525]"
                                >
                                    {isSavingAll ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2 text-amber-500" />}
                                    Save All to Gallery
                                </Button>
                            </>
                        )}
                    </div>
                    {selectedImage ? (
                        <Button onClick={handleUseImage} className="bg-[#00A3FF] hover:bg-[#0082CC] text-white font-bold h-11 px-8 rounded-xl shadow-[0_0_20px_rgba(0,163,255,0.3)]">
                            Use Selected Image
                        </Button>
                    ) : (
                        <Button
                            onClick={handleGenerate}
                            disabled={!prompt || isGenerating}
                            className="bg-[#00A3FF] hover:bg-[#0082CC] text-white font-bold h-11 px-8 rounded-xl shadow-[0_0_20px_rgba(0,163,255,0.3)]"
                        >
                            {isGenerating ? "Generating..." : "Generate Batch (4)"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

