"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, X, ChevronLeft, Heart, MessageCircle, Wand2, PlusSquare, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TourStep {
    id: string
    targetId: string
    title: string
    description: string
    icon: any
    color: string
}

const TOUR_STEPS: TourStep[] = [
    {
        id: "welcome",
        targetId: "sidebar-link-home",
        title: "Welcome to PocketLove!",
        description: "Your safe space for deep connections and creative expression. Let's take a quick 1-minute tour.",
        icon: Heart,
        color: "from-pink-500 to-rose-500"
    },
    {
        id: "explore",
        targetId: "sidebar-link-home",
        title: "Discover Companions",
        description: "Explore a world of diverse AI personalities, each with their own unique soul and story.",
        icon: Heart,
        color: "from-pink-500 to-rose-500"
    },
    {
        id: "chat",
        targetId: "sidebar-link-chat",
        title: "Deep Conversations",
        description: "Engage in immersive chats where AI remembers your history and builds a real bond with you.",
        icon: MessageCircle,
        color: "from-cyan-500 to-blue-500"
    },
    {
        id: "generate",
        targetId: "sidebar-link-generate",
        title: "AI Image Studio",
        description: "Bring your imagination to life. Generate ultra-realistic photos of your companions in any setting.",
        icon: Wand2,
        color: "from-purple-500 to-fuchsia-500"
    },
    {
        id: "create",
        targetId: "sidebar-link-create-character",
        title: "Create Your Own",
        description: "Craft your perfect match from scratch. Define their looks, personality, and secret desires.",
        icon: PlusSquare,
        color: "from-emerald-500 to-teal-500"
    },
    {
        id: "premium",
        targetId: "sidebar-link-premium",
        title: "Unlock Everything",
        description: "Get HD images, unlimited messaging, and priority access to new AI models with Premium.",
        icon: Crown,
        color: "from-amber-400 to-orange-500"
    }
]

export function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState(-1)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    const updateTargetRect = useCallback(() => {
        if (currentStep >= 0 && currentStep < TOUR_STEPS.length) {
            const step = TOUR_STEPS[currentStep]
            const element = document.getElementById(step.targetId)
            if (element) {
                setTargetRect(element.getBoundingClientRect())
            }
        }
    }, [currentStep])

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("pocketlove_tour_completed")
        if (!hasSeenTour) {
            const timer = setTimeout(() => {
                setIsVisible(true)
                setCurrentStep(0)
            }, 3000) // Show after 3 seconds
            return () => clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        updateTargetRect()
        window.addEventListener("resize", updateTargetRect)
        window.addEventListener("scroll", updateTargetRect)
        return () => {
            window.removeEventListener("resize", updateTargetRect)
            window.removeEventListener("scroll", updateTargetRect)
        }
    }, [updateTargetRect])

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleComplete = () => {
        setIsVisible(false)
        localStorage.setItem("pocketlove_tour_completed", "true")
    }

    if (!isVisible || currentStep === -1) return null

    const step = TOUR_STEPS[currentStep]
    const Icon = step.icon

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Backdrop with Hole */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" onClick={handleComplete} />

            {/* Highlight Hole Effect */}
            {targetRect && (
                <motion.div
                    initial={false}
                    animate={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                    }}
                    className="absolute bg-white/20 border-2 border-white/50 rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.3)] z-[101]"
                />
            )}

            {/* Tour Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        top: targetRect ? Math.min(window.innerHeight - 350, targetRect.top + targetRect.height + 24) : window.innerHeight / 2 - 150,
                        left: targetRect ? Math.max(20, Math.min(window.innerWidth - 380, targetRect.left)) : window.innerWidth / 2 - 175
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute w-[350px] bg-[#0F0F0F]/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl pointer-events-auto z-[102] overflow-hidden"
                >
                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-white/5">
                        <motion.div
                            className={cn("h-full bg-gradient-to-r", step.color)}
                            initial={{ width: `${(currentStep / TOUR_STEPS.length) * 100}%` }}
                            animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                        />
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", step.color)}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <button
                                onClick={handleComplete}
                                className="p-1 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-white/60 text-sm leading-relaxed mb-8">
                            {step.description}
                        </p>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                                {TOUR_STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                            i === currentStep ? "w-4 bg-white" : "bg-white/20"
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleBack}
                                        className="text-white/60 hover:text-white hover:bg-white/5"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={handleNext}
                                    className={cn("bg-gradient-to-r text-white font-bold border-none", step.color)}
                                >
                                    {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                                    {currentStep < TOUR_STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className={cn("absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br blur-3xl opacity-20", step.color)} />
                </motion.div>
            </AnimatePresence>

            {/* Sparkle Decoration that follows the highlight */}
            {targetRect && (
                <motion.div
                    animate={{
                        top: targetRect.top - 20,
                        left: targetRect.left + targetRect.width / 2,
                    }}
                    className="absolute z-[103] pointer-events-none"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-amber-400"
                    >
                        <Sparkles className="w-6 h-6 fill-amber-400/20" />
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
