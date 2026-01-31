"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Image as ImageIcon, Check } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SimpleImageGeneratorProps {
    isOpen: boolean
    onClose: () => void
    onImageSelect: (imageUrl: string) => void
    characterId?: string
    settings?: {
        width?: number
        height?: number
        size?: string
        aspectRatioLabel?: string // e.g. "Portrait (3:4)"
        title?: string
    }
}

export function SimpleImageGenerator({ isOpen, onClose, onImageSelect, characterId, settings }: SimpleImageGeneratorProps) {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImages, setGeneratedImages] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
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
                    steps: 30,
                    guidance_scale: 7.0,
                    characterId: characterId, // Enable Twinning/Reference Engine
                    autoSave: true
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
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-[#1A1A1A] border-[#333] text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#00A3FF]" />
                        {config.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Generate 4 options using the Multi-Reference Twinning Engine.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-300">Prompt Description</Label>
                        <Textarea
                            placeholder={`Describe the image you want. Explicitly mention "full body" if needed.`}
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
                                <span className="text-xs text-gray-400 font-medium animate-pulse">DNA Twinning in progress...</span>
                            </div>
                        ) : generatedImages.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 w-full h-full">
                                {generatedImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2",
                                            selectedImage === img ? "border-[#00A3FF] ring-2 ring-[#00A3FF]/50" : "border-transparent opacity-80 hover:opacity-100"
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
                                            <div className="absolute top-2 right-2 bg-[#00A3FF] rounded-full p-1 shadow-lg">
                                                <Check className="h-4 w-4 text-white" />
                                            </div>
                                        )}
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

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
                        Cancel
                    </Button>
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

