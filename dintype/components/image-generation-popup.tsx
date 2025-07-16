"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "@/lib/use-translations"

interface ImageGenerationPopupProps {
  isOpen: boolean
  onClose: () => void
  characterName: string
}

export function ImageGenerationPopup({ isOpen, onClose, characterName }: ImageGenerationPopupProps) {
  const { t, language } = useTranslations()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      // In a real implementation, this would call an API to generate the image
      // Include the language in the API request
      // const response = await fetch('/api/generate-image', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt, language })
      // });

      // Simulate image generation
      setTimeout(() => {
        setGeneratedImage("/placeholder.svg?height=512&width=512&query=" + encodeURIComponent(prompt))
        setIsGenerating(false)
      }, 2000)
    } catch (error) {
      console.error("Error generating image:", error)
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-[#1A1A1A] border-[#252525] text-white">
        <DialogHeader>
          <DialogTitle>
            {t("imageGeneration.generateWith", `Generate an image with ${characterName}`).replace(
              "{{name}}",
              characterName,
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              {t("imageGeneration.describePrompt", "Describe what you want to see")}
            </label>
            <Textarea
              id="prompt"
              placeholder={t("imageGeneration.promptPlaceholder", "Describe the image you want to generate...")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24 bg-[#252525] border-[#333333]"
            />
          </div>

          {generatedImage ? (
            <div className="aspect-square relative bg-[#252525] rounded-md overflow-hidden">
              <Image src={generatedImage || "/placeholder.svg"} alt="Generated image" fill className="object-contain" />
            </div>
          ) : (
            <div className="aspect-square flex items-center justify-center bg-[#252525] rounded-md">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-[#FF4D8D]" />
                  <p className="text-gray-400">{t("imageGeneration.generatingMessage", "Generating your image...")}</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400">
                    {t("imageGeneration.emptyStateTitle", "Your generated image will appear here")}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="bg-[#252525] border-[#333333] hover:bg-[#353535]">
              {t("imageGeneration.cancelButton", "Cancel")}
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-[#FF4D8D] hover:bg-[#FF3D7D]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("imageGeneration.generating", "Generating...")}
                </>
              ) : (
                t("imageGeneration.generateButton", "Generate Image")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
