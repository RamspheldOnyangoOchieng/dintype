"use client"

import { motion } from "framer-motion"
import { ImageIcon, Sparkles, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface ImageGenerationLoadingProps {
  characterName?: string
}

export function ImageGenerationLoading({ characterName }: ImageGenerationLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  const messages = [
    `My love, I am always stunning... wait and see 💋`,
    `Capturing the perfect angle just for you... ✨`,
    `Almost ready... I hope this makes you smile 🌹`,
    `Sending it over now... stay close 💕`
  ]

  useEffect(() => {
    // Change message every 3.5 seconds
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-start my-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-150" key="image-generation-indicator">
      <div className="relative w-full max-w-[300px] aspect-square rounded-[2.5rem] overflow-hidden bg-[#111111] border border-white/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5),0_0_20px_rgba(14,165,233,0.1)] flex flex-col items-center justify-center p-8 group">

        {/* Glassmorphism Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Top Left Icon with Glow */}
        <div className="absolute top-7 left-7 opacity-20 group-hover:opacity-40 transition-opacity">
          <ImageIcon className="h-5 w-5 text-white" />
        </div>

        {/* Bottom Right Decoration */}
        <div className="absolute bottom-7 right-7 opacity-10 group-hover:opacity-30 transition-opacity">
          <Star className="h-5 w-5 text-primary" />
        </div>

        {/* Main Loading Stage */}
        <div className="relative flex items-center justify-center mb-6">
          {/* Outer Rotating Halo */}
          <motion.div
            className="absolute w-24 h-24 rounded-full border-[1px] border-primary/20 border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Main Animated Ring */}
          <motion.div
            className="w-20 h-20 rounded-full border-[4px] border-primary/10 border-t-primary shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />

          {/* Pulsing Core with Sparkles */}
          <motion.div
            className="absolute flex items-center justify-center"
            animate={{
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              <Sparkles className="h-9 w-9 text-primary drop-shadow-[0_0_10px_rgba(14,165,233,0.6)]" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <Star className="h-3 w-3 text-primary fill-primary" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Status Text Group */}
        <div className="text-center z-10 space-y-3 w-full px-2">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="h-12 flex items-center justify-center"
          >
            <h3 className="text-white/90 font-bold text-lg tracking-tight leading-tight">
              {messages[currentMessageIndex]}
            </h3>
          </motion.div>

          <div className="space-y-1">
            <h4 className="text-primary/80 font-semibold text-xs uppercase tracking-wider">
              {characterName ? `${characterName} is sending photo..` : 'Generating Image...'}
            </h4>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.25em]">
              Capturing Moments
            </p>
          </div>

          {/* Progress Indicator (Bouncing Dots) */}
          <div className="flex justify-center gap-2 pt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(14,165,233,0.4)]"
                animate={{
                  y: [0, -8, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
