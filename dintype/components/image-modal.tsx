"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Share2, X, Save, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageModalProps {
  images: string[]
  initialIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: (imageUrl: string, index: number) => void
  onShare: (imageUrl: string) => void
  onSave?: (index: number) => void
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
  savingIndex,
}: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

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
      <DialogContent className="max-w-4xl p-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white shadow-md rounded-full border border-gray-100 text-gray-700 transition-all duration-200 hover:scale-110"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Image container */}
          <div className="relative aspect-square max-h-[80vh] overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              unoptimized // Important for external URLs
            />
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full border border-gray-100 text-gray-700 transition-all duration-200 hover:scale-110 hover:shadow-xl"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full border border-gray-100 text-gray-700 transition-all duration-200 hover:scale-110 hover:shadow-xl"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 text-gray-700 text-sm px-3 py-1.5 rounded-full shadow-md border border-gray-100">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 p-5 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onDownload(images[currentIndex], currentIndex)}
            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-4 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4 mr-2" />
            Ladda ner
          </Button>
          <Button
            variant="outline"
            onClick={() => onShare(images[currentIndex])}
            className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-4 hover:-translate-y-0.5"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Dela
          </Button>
          {onSave && (
            <Button
              variant="outline"
              onClick={() => onSave(currentIndex)}
              disabled={savingIndex === currentIndex}
              className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-4 hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {savingIndex === currentIndex ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Spara
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
