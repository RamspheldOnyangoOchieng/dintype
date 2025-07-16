"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search, RefreshCw, MessageSquare, Sparkles, Bot, Frown, Lightbulb } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const [robotMood, setRobotMood] = useState<"neutral" | "happy" | "sad">("neutral")
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    // Create particles on mount
    if (particlesRef.current) {
      createParticles()
    }

    // Show particles after a delay
    const timer = setTimeout(() => {
      setShowParticles(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const createParticles = () => {
    if (!particlesRef.current) return

    const container = particlesRef.current
    container.innerHTML = ""

    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute rounded-full opacity-0 transition-opacity duration-1000"

      // Random size
      const size = Math.random() * 6 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Random position
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`

      // Random color
      const colors = ["bg-primary/30", "bg-secondary/30", "bg-accent/30", "bg-muted/50"]
      particle.classList.add(colors[Math.floor(Math.random() * colors.length)])

      // Random animation
      const duration = Math.random() * 20 + 10
      particle.style.animation = `float ${duration}s ease-in-out infinite`
      particle.style.animationDelay = `${Math.random() * 5}s`

      container.appendChild(particle)
    }
  }

  const handleRobotClick = () => {
    setClickCount((prev) => prev + 1)

    // Change robot mood on clicks
    if (clickCount % 3 === 0) {
      setRobotMood("happy")
    } else if (clickCount % 3 === 1) {
      setRobotMood("sad")
    } else {
      setRobotMood("neutral")
    }

    // Show easter egg after 5 clicks
    if (clickCount >= 4) {
      setShowEasterEgg(true)
    }

    // Add a little bounce animation
    if (containerRef.current) {
      containerRef.current.classList.add("animate-bounce-small")
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove("animate-bounce-small")
        }
      }, 300)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background/95 to-primary/10 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles container */}
      <div
        ref={particlesRef}
        className={cn(
          "fixed inset-0 pointer-events-none transition-opacity duration-1000",
          showParticles ? "opacity-100" : "opacity-0",
        )}
      ></div>

      <div
        ref={containerRef}
        className="max-w-3xl w-full text-center space-y-8 backdrop-blur-sm bg-card/80 rounded-xl shadow-xl p-8 border border-border relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/30"
        style={{
          transform: isHovering ? "translateY(-5px)" : "translateY(0)",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"></div>

        {/* Parallax effect on mouse move */}
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary), 0.15) 0%, transparent 60%)`,
          }}
        ></div>

        <div className="relative z-10 space-y-4">
          <div className="inline-block relative">
            <h1
              className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-shimmer"
              aria-label="404 Error"
            >
              404
            </h1>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive animate-ping opacity-75"></div>
          </div>

          <h2 className="text-3xl font-semibold text-foreground">Character Not Found</h2>

          <div className="max-w-md mx-auto">
            <p className="text-muted-foreground text-lg">
              Oops! It seems this AI character has wandered off into the digital void.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Perhaps they're exploring another dimension or just taking a break from the digital world.
            </p>
          </div>
        </div>

        <div className="relative w-full h-64 my-8">
          {/* AI Character silhouette - interactive */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={handleRobotClick}
            aria-label="Interactive robot character - click to interact"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleRobotClick()}
          >
            <div className="relative w-48 h-48">
              {/* Robot/AI head */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center animate-float group">
                <div className="w-24 h-12 flex justify-around items-center">
                  {/* Eyes - interactive and change based on mood */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full transition-all duration-300",
                      robotMood === "happy" && "bg-green-400 animate-pulse",
                      robotMood === "sad" && "bg-blue-400 h-2 rounded-full",
                      robotMood === "neutral" && "bg-primary animate-pulse",
                    )}
                  ></div>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full transition-all duration-300 delay-100",
                      robotMood === "happy" && "bg-green-400 animate-pulse",
                      robotMood === "sad" && "bg-blue-400 h-2 rounded-full",
                      robotMood === "neutral" && "bg-primary animate-pulse",
                    )}
                  ></div>
                </div>

                {/* Mouth - interactive and changes based on mood */}
                <div
                  className={cn(
                    "absolute bottom-6 rounded-full transition-all duration-300",
                    robotMood === "happy" && "w-16 h-4 bg-green-400/70 rounded-b-xl",
                    robotMood === "sad" && "w-16 h-4 bg-blue-400/70 rounded-t-xl translate-y-2",
                    robotMood === "neutral" && "w-16 h-2 bg-primary/50",
                  )}
                ></div>

                {/* Antenna */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-2 h-8 bg-primary/30 flex justify-center">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full animate-pulse",
                      robotMood === "happy" && "bg-green-400/70",
                      robotMood === "sad" && "bg-blue-400/70",
                      robotMood === "neutral" && "bg-primary/50",
                    )}
                  ></div>
                </div>
              </div>

              {/* Body - appears on hover with animation */}
              <div className="absolute top-32 left-1/2 -translate-x-1/2 w-24 h-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-b from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center">
                  {/* Robot control panel */}
                  <div className="grid grid-cols-2 gap-1 p-1">
                    <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-400/70"></div>
                  </div>
                </div>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-16 flex justify-between">
                  <div className="w-6 h-12 rounded-b-lg bg-primary/20 border-2 border-primary/30 animate-leg-left"></div>
                  <div className="w-6 h-12 rounded-b-lg bg-primary/20 border-2 border-primary/30 animate-leg-right"></div>
                </div>
              </div>

              {/* Question marks floating around with different animations */}
              <div className="absolute top-5 right-5 text-3xl text-primary/60 animate-float-slow">?</div>
              <div className="absolute bottom-10 left-0 text-4xl text-secondary/60 animate-float-slow delay-150">?</div>
              <div className="absolute top-20 left-0 text-2xl text-accent/60 animate-float-slow delay-300">?</div>
              <div className="absolute bottom-0 right-10 text-5xl text-primary/60 animate-float-slow delay-450">?</div>
            </div>
          </div>

          {/* Scanning effect */}
          <div className="absolute inset-x-0 top-1/2 h-1 bg-primary/30 animate-scan"></div>

          {/* Easter egg that appears after clicking the robot 5 times */}
          {showEasterEgg && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full animate-slide-down">
              <div className="bg-card p-3 rounded-lg shadow-lg border border-primary flex items-center gap-2">
                <Sparkles className="text-yellow-500 h-4 w-4" />
                <span className="text-sm font-medium">You found me! I was hiding all along.</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10">
          <p className="text-muted-foreground mb-6 flex items-center justify-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span>Don't worry! You can try one of these paths instead:</span>
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="default" className="group relative overflow-hidden">
              <Link href="/">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <Home className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                <span className="relative z-10">Return Home</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="group relative overflow-hidden">
              <Link href="/collections">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <Search className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Browse Collections</span>
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary" className="group relative overflow-hidden">
              <Link href="/chat">
                <span className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <MessageSquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Start a Chat</span>
              </Link>
            </Button>

            <Button variant="ghost" size="lg" onClick={() => window.history.back()} className="group">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>

            <Button variant="link" onClick={() => window.location.reload()} className="group">
              <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
              Refresh Page
            </Button>
          </div>
        </div>

        {/* Enhanced footer with more information */}
        <div className="mt-12 text-xs text-muted-foreground/60 space-y-2">
          <p className="flex items-center justify-center gap-1">
            <Bot className="h-3 w-3" />
            <span>Lost in the digital realm? Try searching for another character.</span>
          </p>
          <p className="flex items-center justify-center gap-1">
            <Frown className="h-3 w-3" />
            <span>If you believe this is an error, please contact support.</span>
          </p>
        </div>
      </div>

      {/* Add these animations to globals.css */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-small {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes leg-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-5deg); }
        }
        
        @keyframes leg-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        
        .animate-bounce-small {
          animation: bounce-small 0.3s ease-in-out;
        }
        
        .animate-leg-left {
          animation: leg-left 1s ease-in-out infinite;
          transform-origin: top center;
        }
        
        .animate-leg-right {
          animation: leg-right 1s ease-in-out infinite;
          animation-delay: 0.5s;
          transform-origin: top center;
        }
        
        .animation-delay-150 {
          animation-delay: 0.15s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-450 {
          animation-delay: 0.45s;
        }
      `}</style>
    </div>
  )
}
