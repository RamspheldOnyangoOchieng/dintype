"use client"

import { useState, useEffect } from "react"
import { ArrowRight, X, ChevronLeft, Heart, MessageCircle, Wand2, PlusSquare, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
}

const TOUR_STEPS: TourStep[] = [
    {
        id: "welcome",
        title: "Welcome to PocketLove!",
        description: "Your safe space for deep connections and creative expression. Let's take a quick 1-minute tour.",
        icon: Heart,
    },
    {
        id: "explore",
        title: "Discover Companions",
        description: "Explore a world of diverse AI personalities, each with their own unique soul and story.",
        icon: Heart,
    },
    {
        id: "chat",
        title: "Deep Conversations",
        description: "Engage in immersive chats where AI remembers your history and builds a real bond with you.",
        icon: MessageCircle,
    },
    {
        id: "generate",
        title: "AI Image Studio",
        description: "Bring your imagination to life. Generate ultra-realistic photos of your companions in any setting.",
        icon: Wand2,
    },
    {
        id: "create",
        title: "Create Your Own",
        description: "Craft your perfect match from scratch. Define their looks, personality, and secret desires.",
        icon: PlusSquare,
    },
    {
        id: "premium",
        title: "Unlock Everything",
        description: "Get HD images, unlimited messaging, and priority access to new AI models with Premium.",
        icon: Crown,
    }
]

export function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState(-1)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("pocketlove_tour_completed")
        if (!hasSeenTour) {
            const timer = setTimeout(() => {
                setIsVisible(true)
                setCurrentStep(0)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [])

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
        setCurrentStep(-1)
        localStorage.setItem("pocketlove_tour_completed", "true")
    }

    if (!isVisible || currentStep === -1) return null

    const step = TOUR_STEPS[currentStep]
    const Icon = step.icon

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Dark backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleComplete}
            />
            
            {/* Tour Card - centered modal */}
            <div className="relative w-full max-w-[380px] bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 w-full bg-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                    />
                </div>

                <div className="p-6">
                    {/* Header with icon and close button */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 shadow-lg">
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <button
                            type="button"
                            onClick={handleComplete}
                            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-8">
                        {step.description}
                    </p>

                    {/* Footer with dots and buttons */}
                    <div className="flex items-center justify-between">
                        {/* Step indicators */}
                        <div className="flex gap-1.5">
                            {TOUR_STEPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-300",
                                        i === currentStep 
                                            ? "w-4 bg-gradient-to-r from-sky-400 to-cyan-500" 
                                            : "w-1.5 bg-white/20"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex gap-2">
                            {currentStep > 0 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky-400 to-cyan-500 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            >
                                {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                                {currentStep < TOUR_STEPS.length - 1 && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative gradient */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-sky-400 to-cyan-500 blur-3xl opacity-20 pointer-events-none" />
            </div>
        </div>
    )
}
