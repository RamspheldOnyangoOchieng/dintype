"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Share2, X, Save, Loader2, MessageSquare } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"

interface ImageModalProps {
  images: string[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: (imageUrl: string, index: number) => void
  onShare: (imageUrl: string) => void
  onSave?: (index: number) => void
  onChat?: (imageUrl: string) => void
  savingIndex?: number | null
}

export function ImageModal({
  images,
  initialIndex,
  open,
  onOpenChange,
  onDownload,
  onShare,
  onSave,
  onChat,
  savingIndex,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const isMobile = useIsMobile()

  // Reset current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "Escape":
          onOpenChange(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  if (!images.length) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-[#0A0A0A] border-[#252525] rounded-lg [&>button]:hidden">
        <DialogTitle className="sr-only">Image View</DialogTitle>
        <DialogDescription className="sr-only">View and manage your generated images</DialogDescription>
        <div className="relative flex flex-col h-full max-h-[90vh]">
          <div className="relative flex-1 min-h-0 bg-black/20 overflow-hidden flex items-center justify-center">
            {/* Close button - Top-left */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="relative w-full h-full max-h-[70vh] aspect-[2/3] mx-auto">
              <Image
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Image ${currentIndex + 1}`}
                fill
                className="object-contain shadow-2xl shadow-blue-500/20"
                unoptimized
                priority
              />
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white z-40 rounded-full"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white z-40 rounded-full"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full z-40 font-medium backdrop-blur-md border border-white/10">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Carousel - Compact for mobile */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 p-3 overflow-x-auto bg-black/60 border-t border-white/5 scrollbar-none">
              <div className="flex gap-2 mx-auto min-w-max">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-12 h-18 sm:w-16 sm:h-24 rounded-md overflow-hidden border-2 transition-all shrink-0 ${currentIndex === index
                      ? "border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons - RESPONSIVE WRAP */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-4 bg-[#111111] rounded-b-lg border-t border-white/5">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => onDownload(images[currentIndex], currentIndex)}
              className="bg-[#222222] border-white/10 hover:bg-[#333333] hover:border-white/20 text-white flex-1 min-w-[120px] sm:flex-none"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => onShare(images[currentIndex])}
              className="bg-[#222222] border-white/10 hover:bg-[#333333] hover:border-white/20 text-white flex-1 min-w-[120px] sm:flex-none"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {onSave && (
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => onSave(currentIndex)}
                disabled={savingIndex === currentIndex}
                className="bg-[#222222] border-white/10 hover:bg-[#333333] hover:border-white/20 text-white flex-1 min-w-[120px] sm:flex-none"
              >
                {savingIndex === currentIndex ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
            )}
            {onChat && (
              <Button
                size={isMobile ? "sm" : "default"}
                onClick={() => onChat(images[currentIndex])}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex-1 min-w-[120px] sm:flex-none"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
