"use client"

import { useState, useEffect } from "react"

interface CuteLoaderProps {
  message?: string
  size?: "small" | "medium" | "large"
  showTips?: boolean
  language?: "en" | "sv"
}

export function CuteLoader({ message, size = "medium", showTips = true, language = "en" }: CuteLoaderProps) {
  const [tipIndex, setTipIndex] = useState(0)

  // Default loading message based on provided language prop
  const loadingMessage = message || (language === "sv" ? "Laddar..." : "Loading...")

  const swedishTips = [
    "Vänta lite, magin händer...",
    "AI:n tänker djupa tankar...",
    "Skapar något fantastiskt åt dig...",
    "Nästan klar, bara lite till...",
    "Våra AI-karaktärer jobbar för dig...",
    "Håll i hatten, vi är snart klara!",
    "Samlar stjärnstoft och kreativitet...",
    "Lite mer tålamod, det blir bra!",
  ]

  const englishTips = [
    "Wait a bit, magic is happening...",
    "AI is thinking deep thoughts...",
    "Creating something amazing for you...",
    "Almost done, just a little more...",
    "Our AI characters are working for you...",
    "Hold on tight, we're almost there!",
    "Gathering stardust and creativity...",
    "A little more patience, it'll be great!",
  ]

  const tips = language === "sv" ? swedishTips : englishTips

  // Rotate through tips every 3 seconds
  useEffect(() => {
    if (!showTips) return

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [showTips, tips.length])

  // Size classes
  const sizeClasses = {
    small: {
      container: "max-w-xs p-4",
      spinner: "w-12 h-12",
      title: "text-lg",
      tip: "text-xs",
    },
    medium: {
      container: "max-w-md p-6",
      spinner: "w-20 h-20",
      title: "text-2xl",
      tip: "text-sm",
    },
    large: {
      container: "max-w-lg p-8",
      spinner: "w-28 h-28",
      title: "text-3xl",
      tip: "text-base",
    },
  }

  const classes = sizeClasses[size]

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/10">
      <div
        className={`${classes.container} w-full text-center space-y-6 backdrop-blur-sm bg-card/80 rounded-xl shadow-xl p-8 border border-border relative overflow-hidden`}
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"></div>

        <div className="relative z-10 space-y-6">
          {/* Cute animated character */}
          <div className="inline-block relative">
            <div className={`${classes.spinner} mx-auto`}>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-secondary border-b-transparent animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-bounce">🌟</span>
              </div>
            </div>
          </div>

          <h2 className={`${classes.title} font-semibold text-foreground`}>{loadingMessage}</h2>

          {showTips && (
            <div className="max-w-md mx-auto overflow-hidden h-12">
              <p className={`${classes.tip} text-muted-foreground animate-fade-in`}>{tips[tipIndex]}</p>
            </div>
          )}
        </div>

        <div className="relative w-full h-3 mt-8 bg-muted rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary animate-progress"></div>
        </div>

        {/* Cute Swedish footer */}
        <div className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2">
          <span className="animate-pulse">❤️</span>
          <span>{language === "sv" ? "Tack för ditt tålamod" : "Thanks for your patience"}</span>
          <span className="animate-pulse">❤️</span>
        </div>
      </div>
    </div>
  )
}
