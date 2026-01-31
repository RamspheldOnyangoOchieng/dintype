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
                    steps: 25,
                    guidance_scale: 4.5, // Slightly increased for better prompt adherence balanced with realism
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
            <DialogContent className="w-[95vw] sm:max-w-[800px] max-h-[92vh] flex flex-col bg-[#0F0F0F] border-[#222] text-white p-0 overflow-hidden shadow-2xl rounded-2xl">
                <DialogHeader className="p-6 pb-2 border-b border-[#222]">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#00A3FF]" />
                        {config.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Generate 4 options using the Multi-Reference Twinning Engine.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
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
                            <div className="grid grid-cols-2 gap-4 w-full h-full p-2">
                                {generatedImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "relative rounded-xl overflow-hidden cursor-pointer transition-all border-2",
                                            "aspect-[2/3] w-full bg-[#111]", // Fixed aspect ratio for portrait references
                                            selectedImage === img ? "border-[#00A3FF] ring-4 ring-[#00A3FF]/20 shadow-2xl scale-[1.02] z-10" : "border-[#333] opacity-90 hover:opacity-100 hover:scale-[1.01]"
                                        )}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Generated ${idx + 1}`}
                                            fill
                                            className="object-contain" // Contain instead of cover to show full frame
                                        />
                                        {selectedImage === img && (
                                            <div className="absolute top-3 right-3 bg-[#00A3FF] rounded-full p-1.5 shadow-lg animate-in zoom-in">
                                                <Check className="h-5 w-5 text-white" />
                                            </div>
                                        )}
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

                <div className="flex justify-end gap-3 p-6 border-t border-[#222] bg-[#0F0F0F]">
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

