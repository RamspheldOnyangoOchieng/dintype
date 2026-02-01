"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ArrowRight, 
    X, 
    ChevronLeft, 
    Heart, 
    MessageCircle, 
    Wand2, 
    PlusSquare, 
    Crown,
    Sparkles,
    Image as ImageIcon,
    Users,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TourStep {
    id: string
    title: string
    subtitle: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    features: string[]
    gradient: string
}

const TOUR_STEPS: TourStep[] = [
    {
        id: "welcome",
        title: "Welcome to PocketLove",
        subtitle: "Your AI Companion Experience",
        description: "Discover a world of meaningful connections with AI companions designed just for you.",
        icon: Heart,
        features: ["Deep conversations", "Personalized interactions", "Safe & private"],
        gradient: "from-sky-400 via-cyan-400 to-teal-400"
    },
    {
        id: "companions",
        title: "Meet Your Companions",
        subtitle: "Unique AI Personalities",
        description: "Browse and connect with diverse AI companions, each with their own personality, interests, and story.",
        icon: Users,
        features: ["100+ unique characters", "Multiple personalities", "Custom preferences"],
        gradient: "from-cyan-400 via-sky-400 to-blue-400"
    },
    {
        id: "chat",
        title: "Deep Conversations",
        subtitle: "Chat That Remembers",
        description: "Engage in immersive conversations where your AI remembers everything and builds a real connection with you.",
        icon: MessageCircle,
        features: ["Memory & context", "Emotional intelligence", "24/7 availability"],
        gradient: "from-sky-400 via-cyan-500 to-sky-500"
    },
    {
        id: "generate",
        title: "AI Image Studio",
        subtitle: "Create Beautiful Moments",
        description: "Generate stunning, ultra-realistic photos of your companions in any setting you can imagine.",
        icon: ImageIcon,
        features: ["HD quality images", "Unlimited creativity", "Fast generation"],
        gradient: "from-teal-400 via-cyan-400 to-sky-400"
    },
    {
        id: "create",
        title: "Create Your Own",
        subtitle: "Design Your Perfect Match",
        description: "Build your ideal companion from scratch. Customize their looks, personality, and everything in between.",
        icon: PlusSquare,
        features: ["Full customization", "Unique creations", "Save & share"],
        gradient: "from-cyan-400 via-teal-400 to-emerald-400"
    },
    {
        id: "premium",
        title: "Unlock Premium",
        subtitle: "The Ultimate Experience",
        description: "Get unlimited access to HD images, priority chat, exclusive companions, and much more.",
        icon: Crown,
        features: ["Unlimited messages", "HD image generation", "Exclusive content"],
        gradient: "from-amber-400 via-orange-400 to-rose-400"
    }
]

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.9
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.3
        }
    })
}

const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3 + i * 0.1,
            duration: 0.4
        }
    })
}

export function OnboardingTour() {
    const [[currentStep, direction], setStep] = useState<[number, number]>([-1, 0])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("pocketlove_tour_completed")
        if (!hasSeenTour) {
            const timer = setTimeout(() => {
                setIsVisible(true)
                setStep([0, 1])
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setStep([currentStep + 1, 1])
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setStep([currentStep - 1, -1])
        }
    }

    const handleComplete = () => {
        setIsVisible(false)
        localStorage.setItem("pocketlove_tour_completed", "true")
    }

    const goToStep = (index: number) => {
        setStep([index, index > currentStep ? 1 : -1])
    }

    if (!isVisible || currentStep === -1) return null

    const step = TOUR_STEPS[currentStep]
    const Icon = step.icon

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        >
            {/* Animated gradient backdrop */}
            <motion.div 
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={handleComplete}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />
            
            {/* Floating decorative orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className={cn("absolute w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br", step.gradient)}
                    animate={{ 
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ top: '10%', right: '10%' }}
                />
                <motion.div 
                    className="absolute w-64 h-64 rounded-full blur-3xl opacity-15 bg-gradient-to-br from-sky-400 to-cyan-400"
                    animate={{ 
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    style={{ bottom: '20%', left: '5%' }}
                />
            </div>
            
            {/* Main Tour Card */}
            <motion.div 
                className="relative w-full max-w-lg bg-gradient-to-b from-gray-900/95 to-black/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Animated border glow */}
                <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-r rounded-3xl", step.gradient)} />
                <div className="absolute inset-[1px] bg-gradient-to-b from-gray-900 to-black rounded-3xl" />
                
                {/* Skip button */}
                <button
                    type="button"
                    onClick={handleComplete}
                    className="absolute top-4 right-4 z-10 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content Container */}
                <div className="relative">
                    {/* Progress bar */}
                    <div className="h-1 bg-white/5">
                        <motion.div 
                            className={cn("h-full bg-gradient-to-r", step.gradient)}
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>

                    {/* Animated Step Content */}
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="p-8"
                        >
                            {/* Icon with animated glow */}
                            <div className="flex justify-center mb-6">
                                <motion.div 
                                    className="relative"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                                >
                                    <div className={cn("absolute inset-0 blur-2xl opacity-50 bg-gradient-to-br rounded-full scale-150", step.gradient)} />
                                    <div className={cn("relative p-5 rounded-2xl bg-gradient-to-br shadow-2xl", step.gradient)}>
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>
                                    {/* Sparkle decorations */}
                                    <motion.div
                                        className="absolute -top-2 -right-2"
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <Sparkles className="w-5 h-5 text-sky-300" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Text content */}
                            <div className="text-center mb-6">
                                <motion.p 
                                    className={cn("text-sm font-semibold uppercase tracking-wider mb-2 bg-gradient-to-r bg-clip-text text-transparent", step.gradient)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {step.subtitle}
                                </motion.p>
                                <motion.h2 
                                    className="text-2xl sm:text-3xl font-bold text-white mb-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    {step.title}
                                </motion.h2>
                                <motion.p 
                                    className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {step.description}
                                </motion.p>
                            </div>

                            {/* Feature pills */}
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {step.features.map((feature, i) => (
                                    <motion.div
                                        key={feature}
                                        custom={i}
                                        variants={featureVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/80"
                                    >
                                        <Zap className="w-3 h-3 text-sky-400" />
                                        {feature}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer with navigation */}
                    <div className="relative px-8 pb-8">
                        <div className="flex items-center justify-between">
                            {/* Step indicators */}
                            <div className="flex gap-2">
                                {TOUR_STEPS.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => goToStep(i)}
                                        className={cn(
                                            "h-2 rounded-full transition-all duration-300 cursor-pointer",
                                            i === currentStep 
                                                ? cn("w-6 bg-gradient-to-r", step.gradient)
                                                : "w-2 bg-white/20 hover:bg-white/40"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Navigation buttons */}
                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <motion.button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Back
                                    </motion.button>
                                )}
                                <motion.button
                                    type="button"
                                    onClick={handleNext}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all cursor-pointer bg-gradient-to-r",
                                        step.gradient
                                    )}
                                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(56, 189, 248, 0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {currentStep === TOUR_STEPS.length - 1 ? (
                                        <>
                                            Get Started
                                            <Sparkles className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            Next
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
