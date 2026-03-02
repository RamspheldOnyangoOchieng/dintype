"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Share2, X, Save, Loader2, MessageSquare, ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

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
  const [isZoomed, setIsZoomed] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const isMobile = useIsMobile()

  // Reset current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
    setIsImageLoaded(false)
  }, [initialIndex])

  // Reset zoom when changing images
  useEffect(() => {
    setIsZoomed(false)
    setIsImageLoaded(false)
  }, [currentIndex])

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
        case " ":
          e.preventDefault()
          setIsZoomed(!isZoomed)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange, isZoomed])

  if (!images.length) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] lg:max-w-5xl h-[95vh] md:h-[90vh] p-0 bg-black/95 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden [&>button]:hidden">
        <DialogTitle className="sr-only">Image View</DialogTitle>
        <DialogDescription className="sr-only">View and manage your generated images</DialogDescription>
        
        <div className="relative flex flex-col h-full">
          {/* Top Bar - Glassmorphism */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            {/* Image Counter - Left */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-xs md:text-sm font-medium text-white/90 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            
            {/* Top Actions - Right */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:h-10 md:w-10 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all duration-200"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {isZoomed ? <ZoomOut className="h-4 w-4 md:h-5 md:w-5" /> : <ZoomIn className="h-4 w-4 md:h-5 md:w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:h-10 md:w-10 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md border border-white/10 transition-all duration-200"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </div>

          {/* Main Image Area */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => !isMobile && setIsZoomed(!isZoomed)}
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 opacity-30">
              <Image
                src={images[currentIndex] || "/placeholder.svg"}
                alt=""
                fill
                className="object-cover blur-3xl scale-110"
                unoptimized
              />
            </div>
            
            {/* Main Image */}
            <div className={cn(
              "relative w-full h-full transition-transform duration-500 ease-out",
              isZoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"
            )}>
              <Image
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Image ${currentIndex + 1}`}
                fill
                className={cn(
                  "object-contain transition-all duration-500",
                  isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
                unoptimized
                priority
                onLoad={() => setIsImageLoaded(true)}
              />
              
              {/* Loading Skeleton */}
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Navigation Arrows - Elegant Design */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 group"
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                >
                  <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 transition-all duration-200 group-hover:scale-110 group-hover:border-white/30">
                    <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white/80 group-hover:text-white" />
                  </div>
                </button>
                <button
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 group"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                >
                  <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full border border-white/10 transition-all duration-200 group-hover:scale-110 group-hover:border-white/30">
                    <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white/80 group-hover:text-white" />
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Bottom Section - Modern Glass Panel */}
          <div className="relative z-40 bg-gradient-to-t from-black via-black/95 to-transparent">
            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="px-4 py-3 overflow-x-auto scrollbar-none">
                <div className="flex justify-center gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "relative shrink-0 rounded-lg overflow-hidden transition-all duration-300",
                        isMobile ? "w-12 h-16" : "w-14 h-20",
                        currentIndex === index
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-105 opacity-100"
                          : "opacity-40 hover:opacity-80 hover:scale-105"
                      )}
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

            {/* Action Buttons - Modern Pill Style */}
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => onDownload(images[currentIndex], currentIndex)}
                  className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-full px-4 md:px-5 backdrop-blur-md transition-all duration-200 hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => onShare(images[currentIndex])}
                  className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-full px-4 md:px-5 backdrop-blur-md transition-all duration-200 hover:scale-105"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                
                {onSave && (
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "default"}
                    onClick={() => onSave(currentIndex)}
                    disabled={savingIndex === currentIndex}
                    className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-full px-4 md:px-5 backdrop-blur-md transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  >
                    {savingIndex === currentIndex ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                )}
                
                {onChat && (
                  <Button
                    size={isMobile ? "sm" : "default"}
                    onClick={() => onChat(images[currentIndex])}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold rounded-full px-5 md:px-6 shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-105 hover:shadow-primary/40"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

