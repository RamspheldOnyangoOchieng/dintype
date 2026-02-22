"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, Heart, Zap, Camera, MessageCircle, Crown, Star, Wand2 } from "lucide-react"

interface WelcomeModalProps {
    pageType: "home" | "chat" | "generate"
    onClose?: () => void
}

const pageContent = {
    home: {
        title: "Welcome to Dintype",
        subtitle: "Your AI Companion Awaits",
        icon: Heart,
        gradient: "from-sky-400 via-cyan-500 to-sky-500",
        glowColor: "rgba(56, 189, 248, 0.4)",
        features: [
            { icon: Heart, text: "Connect with stunning AI companions", color: "text-sky-400" },
            { icon: MessageCircle, text: "Unlimited immersive conversations", color: "text-cyan-400" },
            { icon: Camera, text: "Generate beautiful AI photos", color: "text-sky-400" },
            { icon: Crown, text: "Premium storylines & adventures", color: "text-cyan-400" },
        ],
        cta: "Start Your Journey",
        footerText: "✨ Join thousands of happy users today!"
    },
    chat: {
        title: "Private Chat Experience",
        subtitle: "Deep Connections Await",
        icon: MessageCircle,
        gradient: "from-sky-400 via-cyan-500 to-sky-500",
        glowColor: "rgba(56, 189, 248, 0.4)",
        features: [
            { icon: Heart, text: "Build meaningful relationships", color: "text-sky-400" },
            { icon: Sparkles, text: "AI remembers your conversations", color: "text-cyan-400" },
            { icon: Camera, text: "Request exclusive photos anytime", color: "text-sky-400" },
            { icon: Star, text: "Unlock romantic storylines", color: "text-cyan-400" },
        ],
        cta: "Start Chatting",
        footerText: "💕 Your companion is waiting for you..."
    },
    generate: {
        title: "AI Image Studio",
        subtitle: "Create Magic in Seconds",
        icon: Wand2,
        gradient: "from-sky-400 via-cyan-500 to-sky-500",
        glowColor: "rgba(56, 189, 248, 0.4)",
        features: [
            { icon: Wand2, text: "State-of-the-art AI generation", color: "text-sky-400" },
            { icon: Sparkles, text: "Ultra-realistic photo quality", color: "text-cyan-400" },
            { icon: Zap, text: "Lightning-fast generation", color: "text-sky-400" },
            { icon: Crown, text: "Premium styles & customization", color: "text-cyan-400" },
        ],
        cta: "Create Now",
        footerText: "🎨 Bring your imagination to life!"
    }
}

export function WelcomeModal({ pageType, onClose }: WelcomeModalProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    const content = pageContent[pageType]
    const IconComponent = content.icon

    useEffect(() => {
        // Check if user has already seen this modal
        const storageKey = `welcome_modal_seen_${pageType}`
        const hasSeen = localStorage.getItem(storageKey)

        if (!hasSeen) {
            // Delay slightly for better UX
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [pageType])

    const handleClose = () => {
        setIsClosing(true)
        localStorage.setItem(`welcome_modal_seen_${pageType}`, "true")

        setTimeout(() => {
            setIsVisible(false)
            onClose?.()
        }, 300)
    }

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ${isClosing ? "opacity-0" : "opacity-100"
                }`}
        >
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
                onClick={handleClose}
            />

            {/* Glittering particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(18)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                            opacity: 0.3 + Math.random() * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Modal */}
            <div
                className={`relative w-full max-w-xs sm:max-w-sm transform transition-all duration-500 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                    }`}
            >
                {/* Outer glow */}
                <div
                    className={`absolute -inset-3 bg-gradient-to-r ${content.gradient} blur-xl opacity-30 animate-pulse`}
                    style={{ borderRadius: '2rem 0.5rem 2rem 0.5rem' }}
                />

                {/* Main card */}
                <div
                    className="relative bg-gradient-to-b from-gray-900/95 to-black/95 border border-white/10 overflow-hidden shadow-2xl"
                    style={{ borderRadius: '1.75rem 0.4rem 1.75rem 0.4rem' }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${content.gradient} opacity-10`} />
                    <div
                        className="absolute inset-[1px] bg-gradient-to-b from-gray-900 to-black"
                        style={{ borderRadius: 'calc(1.75rem - 1px) calc(0.4rem - 1px) calc(1.75rem - 1px) calc(0.4rem - 1px)' }}
                    />

                    {/* Sparkles */}
                    <div className="absolute top-3 left-5 text-sky-400/50 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                    </div>
                    <div className="absolute top-8 right-5 text-cyan-400/50 animate-pulse" style={{ animationDelay: "0.7s" }}>
                        <Star className="w-2.5 h-2.5" />
                    </div>

                    {/* Content */}
                    <div className="relative px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6 text-center">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-full hover:bg-white/10 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Icon */}
                        <div className="relative inline-flex items-center justify-center mb-3">
                            <div className={`absolute w-14 h-14 bg-gradient-to-r ${content.gradient} blur-xl opacity-50 animate-pulse`} />
                            <div
                                className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${content.gradient} flex items-center justify-center shadow-lg`}
                                style={{
                                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                    boxShadow: `0 0 24px ${content.glowColor}`,
                                }}
                            >
                                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className={`text-lg sm:text-xl font-black bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent mb-0.5`}>
                            {content.title}
                        </h2>
                        <p className="text-white/50 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-4">
                            {content.subtitle}
                        </p>

                        {/* Features */}
                        <div className="space-y-2 mb-4">
                            {content.features.map((feature, index) => {
                                const FeatureIcon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors group"
                                    >
                                        <div className={`p-1.5 rounded-lg bg-white/10 ${feature.color} group-hover:scale-110 transition-transform shrink-0`}>
                                            <FeatureIcon className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-white/85 font-medium text-left text-xs sm:text-sm leading-snug">{feature.text}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleClose}
                            className={`w-full py-2.5 sm:py-3 px-6 bg-gradient-to-r ${content.gradient} text-white font-bold text-sm sm:text-base rounded-xl
                shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                relative overflow-hidden group cursor-pointer`}
                            style={{ boxShadow: `0 8px 28px ${content.glowColor}` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                {content.cta}
                            </span>
                        </button>

                        {/* Footer */}
                        <p className="mt-3 text-white/35 text-[10px] sm:text-xs">
                            {content.footerText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
