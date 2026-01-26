"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Image as ImageIcon, Download } from "lucide-react"
import Image from "next/image"

interface SimpleImageGeneratorProps {
    isOpen: boolean
    onClose: () => void
    onImageSelect: (imageUrl: string) => void
    settings?: {
        width?: number
        height?: number
        size?: string
        aspectRatioLabel?: string // e.g. "Portrait (3:4)"
        title?: string
    }
}

export function SimpleImageGenerator({ isOpen, onClose, onImageSelect, settings }: SimpleImageGeneratorProps) {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)
    const [error, setError] = useState("")

    // Default settings (fallback to banner defaults if not provided)
    const config = {
        width: settings?.width || 1600,
        height: settings?.height || 320,
        size: settings?.size || "1600x320",
        aspectRatioLabel: settings?.aspectRatioLabel || "Wide Banner",
        title: settings?.title || "Generate Asset"
    }

    const handleGenerate = async () => {
        if (!prompt) return

        setIsGenerating(true)
        setError("")
        setGeneratedImage(null)

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
                    image_num: 1,
                    size: config.size,
                    steps: 30,
                    guidance_scale: 7.5,
                    autoSave: true // Ensure we get a persistent URL
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate image")
            }

            // Handle task-based response (async) or direct response
            if (data.task_id) {
                // Poll for result
                await pollForTask(data.task_id)
            } else if (data.images && data.images.length > 0) {
                setGeneratedImage(data.images[0])
            } else {
                throw new Error("No image returned")
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
                    setGeneratedImage(data.images[0])
                    setIsGenerating(false)
                } else if (data.status === "TASK_STATUS_FAILED") {
                    setError("Generation failed")
                    setIsGenerating(false)
                } else {
                    // Continue polling
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
        if (generatedImage) {
            onImageSelect(generatedImage)
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-[#1A1A1A] border-[#333] text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#00A3FF]" />
                        {config.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Create a custom image using AI.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-300">Prompt Description</Label>
                        <Textarea
                            placeholder={`Describe the image you want (Aspect Ratio: ${config.aspectRatioLabel})`}
                            className="bg-[#252525] border-[#333] text-white min-h-[100px] focus:border-[#00A3FF]"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div className="border border-[#333] rounded-xl bg-[#0F0F0F] aspect-[5/1] flex items-center justify-center overflow-hidden relative">
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 text-[#00A3FF] animate-spin" />
                                <span className="text-xs text-gray-400 font-medium animate-pulse">Creating masterpiece...</span>
                            </div>
                        ) : generatedImage ? (
                            <div className="relative w-full h-full group">
                                <Image
                                    src={generatedImage}
                                    alt="Generated"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-600">
                                <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                                <span className="text-xs">Preview will appear here</span>
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
                    {generatedImage ? (
                        <Button onClick={handleUseImage} className="bg-[#00A3FF] hover:bg-[#0082CC] text-white font-bold">
                            Use This Image
                        </Button>
                    ) : (
                        <Button
                            onClick={handleGenerate}
                            disabled={!prompt || isGenerating}
                            className="bg-[#00A3FF] hover:bg-[#0082CC] text-white font-bold"
                        >
                            {isGenerating ? "Generating..." : "Generate Image"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
