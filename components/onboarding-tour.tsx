"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X, ChevronLeft, Heart, MessageCircle, Wand2, PlusSquare, Crown, Home, Image } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/lib/use-translations"
import { CONSENT_STORAGE_KEY, CONSENT_VERSION, POLICY_VERSION } from "@/lib/consent-config"
import { useSidebar } from "@/components/sidebar-context"

interface TourStep {
    id: string
    targetSelector: string
    mobileTargetSelector?: string // For mobile navigation
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    position: "right" | "bottom" | "left" | "top"
}



export function OnboardingTour() {
    const { t } = useTranslations()
    const { setIsOpen: setSidebarOpen } = useSidebar()
    const [currentStep, setCurrentStep] = useState(-1)
    const [isVisible, setIsVisible] = useState(false)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [isMobile, setIsMobile] = useState(false)
    const tooltipRef = useRef<HTMLDivElement>(null)

    const TOUR_STEPS: TourStep[] = useMemo(() => [
        {
            id: "home",
            targetSelector: "[data-tour='home']",
            mobileTargetSelector: "a[href='/']",
            title: t("tour.home.title"),
            description: t("tour.home.description"),
            icon: Home,
            position: "right"
        },
        {
            id: "chat",
            targetSelector: "[data-tour='chat']",
            mobileTargetSelector: "a[href='/chatt']",
            title: t("tour.chat.title"),
            description: t("tour.chat.description"),
            icon: MessageCircle,
            position: "right"
        },
        {
            id: "generate",
            targetSelector: "[data-tour='generate']",
            mobileTargetSelector: "a[href='/generera']",
            title: t("tour.generate.title"),
            description: t("tour.generate.description"),
            icon: Image,
            position: "right"
        },
        {
            id: "create",
            targetSelector: "[data-tour='createcharacter']",
            mobileTargetSelector: "a[href='/skapa-karaktar']",
            title: t("tour.create.title"),
            description: t("tour.create.description"),
            icon: PlusSquare,
            position: "right"
        },
        {
            id: "premium",
            targetSelector: "[data-tour='premium']",
            mobileTargetSelector: "a[href='/premium']",
            title: t("tour.premium.title"),
            description: t("tour.premium.description"),
            icon: Crown,
            position: "right"
        }
    ], [t])

    // Update window size and detect mobile
    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth
            setWindowSize({ width, height: window.innerHeight })
            setIsMobile(width < 768) // md breakpoint
        }
        updateSize()
        window.addEventListener("resize", updateSize)
        return () => window.removeEventListener("resize", updateSize)
    }, [])

    // Find and highlight target element — auto-skip if element not found
    const updateTargetPosition = useCallback(() => {
        if (currentStep >= 0 && currentStep < TOUR_STEPS.length) {
            const step = TOUR_STEPS[currentStep]
            // On mobile, use mobile selector if available, otherwise skip the step
            const selector = isMobile && step.mobileTargetSelector 
                ? step.mobileTargetSelector 
                : step.targetSelector
            const element = document.querySelector(selector)
            
            if (element) {
                const rect = element.getBoundingClientRect()
                setTargetRect(rect)
                if (!isMobile) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" })
                }
            } else {
                // Element not in DOM — skip to next step (or complete if at end)
                setTargetRect(null)
                const next = currentStep + 1
                if (next < TOUR_STEPS.length) {
                    setCurrentStep(next)
                } else {
                    handleComplete()
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep, TOUR_STEPS, isMobile])

    useEffect(() => {
        const hasSeenTour = localStorage.getItem("dintype_tour_completed")
        if (hasSeenTour) return

        const isConsentValid = () => {
            try {
                const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
                if (!raw) return false
                const parsed = JSON.parse(raw)
                return parsed?.version === CONSENT_VERSION && parsed?.policyVersion === POLICY_VERSION
            } catch {
                return false
            }
        }

        let timer: ReturnType<typeof setTimeout>

        const startTour = () => {
            // Only expand sidebar on desktop so all nav data-tour targets are in the DOM
            if (window.innerWidth >= 768) {
                setSidebarOpen(true)
            }
            timer = setTimeout(() => {
                setIsVisible(true)
                setCurrentStep(0)
            }, 1200)
        }

        if (isConsentValid()) {
            // Consent already given — start tour after short delay
            startTour()
        } else {
            // Wait for consent to be stored — listen on same tab (CustomEvent) and cross-tab (storage)
            const onConsent = () => {
                if (isConsentValid()) {
                    window.removeEventListener("consentGranted", onConsent)
                    window.removeEventListener("storage", onStorage)
                    startTour()
                }
            }
            const onStorage = (e: StorageEvent) => {
                if (e.key === CONSENT_STORAGE_KEY) onConsent()
            }
            window.addEventListener("consentGranted", onConsent)
            window.addEventListener("storage", onStorage)
            return () => {
                window.removeEventListener("consentGranted", onConsent)
                window.removeEventListener("storage", onStorage)
                clearTimeout(timer)
            }
        }

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        updateTargetPosition()

        // Update position on scroll/resize
        window.addEventListener("resize", updateTargetPosition)
        window.addEventListener("scroll", updateTargetPosition, true)

        return () => {
            window.removeEventListener("resize", updateTargetPosition)
            window.removeEventListener("scroll", updateTargetPosition, true)
        }
    }, [updateTargetPosition])

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
        localStorage.setItem("dintype_tour_completed", "true")
    }

    if (!isVisible || currentStep === -1) return null
    
    // On mobile, show bottom sheet even without targetRect
    if (isMobile) {
        const step = TOUR_STEPS[currentStep]
        const Icon = step.icon
        
        return (
            <div className="fixed inset-0 z-[9999]">
                {/* Dark overlay */}
                <motion.div 
                    className="absolute inset-0 bg-black/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleComplete}
                />
                
                {/* Highlight target if exists */}
                {targetRect && (
                    <motion.div
                        className="absolute border-2 border-sky-400 rounded-xl pointer-events-none"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            top: targetRect.top - 4,
                            left: targetRect.left - 4,
                            width: targetRect.width + 8,
                            height: targetRect.height + 8
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="absolute inset-0 border-2 border-sky-400 rounded-xl"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                )}
                
                {/* Mobile Bottom Sheet */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-[#111827] border-t border-sky-400/20 rounded-t-3xl overflow-hidden"
                    style={{
                        boxShadow: '0 -10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(56,189,248,0.1)',
                    }}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Progress bar */}
                    <div className="h-1.5 bg-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-sky-400 to-cyan-500"
                            animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 bg-white/20 rounded-full" />
                    </div>

                    <div className="px-5 pb-8 pt-2">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                                    <p className="text-xs text-white/40">{t("tour.stepXofY", { current: (currentStep + 1).toString(), total: TOUR_STEPS.length.toString() })}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleComplete}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            {step.description}
                        </p>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            {/* Dots */}
                            <div className="flex gap-1.5">
                                {TOUR_STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-2 rounded-full transition-all duration-300",
                                            i === currentStep
                                                ? "w-6 bg-gradient-to-r from-sky-400 to-cyan-500"
                                                : "w-2 bg-white/20"
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        {t("tour.back")}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-sky-400 to-cyan-500 rounded-xl shadow-lg"
                                >
                                    {currentStep === TOUR_STEPS.length - 1 ? t("tour.done") : t("tour.next")}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    // Desktop version - requires targetRect
    if (!targetRect) return null

    const step = TOUR_STEPS[currentStep]
    const Icon = step.icon

    // Calculate tooltip position based on target element and preferred position
    const getTooltipPosition = () => {
        const tooltipWidth = 280
        const tooltipHeight = 180
        const padding = 16
        const arrowSize = 12

        let top = 0
        let left = 0

        switch (step.position) {
            case "right":
                top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2)
                left = targetRect.right + padding + arrowSize
                break
            case "left":
                top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2)
                left = targetRect.left - tooltipWidth - padding - arrowSize
                break
            case "bottom":
                top = targetRect.bottom + padding + arrowSize
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)
                break
            case "top":
                top = targetRect.top - tooltipHeight - padding - arrowSize
                left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2)
                break
        }

        // Keep tooltip within viewport
        top = Math.max(padding, Math.min(top, windowSize.height - tooltipHeight - padding))
        left = Math.max(padding, Math.min(left, windowSize.width - tooltipWidth - padding))

        return { top, left }
    }

    const tooltipPos = getTooltipPosition()

    // Arrow position based on tooltip placement
    const getArrowStyles = () => {
        const arrowBase = "absolute w-3 h-3 bg-[#1a1a1a] border-white/10 transform rotate-45"

        switch (step.position) {
            case "right":
                return `${arrowBase} -left-1.5 top-1/2 -translate-y-1/2 border-l border-b`
            case "left":
                return `${arrowBase} -right-1.5 top-1/2 -translate-y-1/2 border-r border-t`
            case "bottom":
                return `${arrowBase} -top-1.5 left-1/2 -translate-x-1/2 border-l border-t`
            case "top":
                return `${arrowBase} -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b`
            default:
                return arrowBase
        }
    }

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Overlay with spotlight cut-out */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer" onClick={handleComplete}>
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect
                            x={targetRect.left - 6}
                            y={targetRect.top - 6}
                            width={targetRect.width + 12}
                            height={targetRect.height + 12}
                            rx="12"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.75)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Highlight ring around target */}
            <motion.div
                className="absolute border-2 border-sky-400 rounded-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    top: targetRect.top - 6,
                    left: targetRect.left - 6,
                    width: targetRect.width + 12,
                    height: targetRect.height + 12
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Pulsing ring */}
                <motion.div
                    className="absolute inset-0 border-2 border-sky-400 rounded-xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence mode="wait">
                <motion.div
                    ref={tooltipRef}
                    key={currentStep}
                    className="absolute w-[280px] bg-[#111827] border border-sky-400/20 shadow-2xl pointer-events-auto overflow-hidden"
                    style={{
                        borderRadius: '0.25rem 1.5rem 1.5rem 1.5rem',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(56,189,248,0.15), 0 0 30px rgba(56,189,248,0.1)',
                    }}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        top: tooltipPos.top,
                        left: tooltipPos.left
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {/* Arrow pointer */}
                    <div className={getArrowStyles()} />

                    {/* Progress bar */}
                    <div className="h-1 bg-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-sky-400 to-cyan-500"
                            animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500">
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                                    <p className="text-[10px] text-white/40">{t("tour.stepXofY", { current: (currentStep + 1).toString(), total: TOUR_STEPS.length.toString() })}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleComplete}
                                className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-white/60 text-xs leading-relaxed mb-4">
                            {step.description}
                        </p>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            {/* Dots */}
                            <div className="flex gap-1">
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

                            {/* Buttons */}
                            <div className="flex gap-1.5">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex items-center gap-0.5 px-2.5 py-1.5 text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                        {t("tour.back")}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-gradient-to-r from-sky-400 to-cyan-500 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    {currentStep === TOUR_STEPS.length - 1 ? t("tour.done") : t("tour.next")}
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
