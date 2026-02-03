"use client"

import { useState, useEffect } from "react"
import { X, Sparkles, Heart, Zap, Camera, MessageCircle, Crown, Star, Wand2 } from "lucide-react"

interface WelcomeModalProps {
    pageType: "home" | "chat" | "generate"
    onClose?: () => void
}

const pageContent = {
    home: {
        title: "Welcome to PocketLove",
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
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? "opacity-0" : "opacity-100"
                }`}
        >
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={handleClose}
            />

            {/* Glittering particles background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                            opacity: 0.3 + Math.random() * 0.7,
                        }}
                    />
                ))}
            </div>

            {/* Modal */}
            <div
                className={`relative w-full max-w-md transform transition-all duration-500 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                    }`}
            >
                {/* Outer glow effect */}
                <div
                    className={`absolute -inset-4 bg-gradient-to-r ${content.gradient} rounded-[3rem] blur-2xl opacity-40 animate-pulse`}
                />
                <div
                    className={`absolute -inset-2 bg-gradient-to-r ${content.gradient} rounded-[2.5rem] blur-xl opacity-30`}
                />

                {/* Main card */}
                <div className="relative bg-gradient-to-b from-gray-900/95 via-gray-900/98 to-black/95 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                    {/* Animated border gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${content.gradient} opacity-20`} />
                    <div className="absolute inset-[1px] bg-gradient-to-b from-gray-900 to-black rounded-[2rem]" />

                    {/* Sparkle decorations */}
                    <div className="absolute top-4 left-8 text-sky-400/60 animate-pulse">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="absolute top-12 right-6 text-cyan-400/60 animate-pulse" style={{ animationDelay: "0.5s" }}>
                        <Star className="w-3 h-3" />
                    </div>
                    <div className="absolute bottom-20 left-6 text-sky-400/60 animate-pulse" style={{ animationDelay: "1s" }}>
                        <Star className="w-2 h-2" />
                    </div>
                    <div className="absolute bottom-12 right-10 text-cyan-400/60 animate-pulse" style={{ animationDelay: "1.5s" }}>
                        <Sparkles className="w-3 h-3" />
                    </div>

                    {/* Content */}
                    <div className="relative p-8 text-center">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white/80 transition-colors rounded-full hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon with glow */}
                        <div className="relative inline-flex items-center justify-center mb-6">
                            <div
                                className={`absolute w-24 h-24 bg-gradient-to-r ${content.gradient} rounded-full blur-2xl opacity-50 animate-pulse`}
                            />
                            <div
                                className={`relative w-20 h-20 bg-gradient-to-br ${content.gradient} rounded-full flex items-center justify-center shadow-lg`}
                                style={{ boxShadow: `0 0 40px ${content.glowColor}` }}
                            >
                                <IconComponent className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className={`text-3xl font-black bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent mb-2`}>
                            {content.title}
                        </h2>
                        <p className="text-white/60 text-sm font-medium tracking-wide uppercase mb-8">
                            {content.subtitle}
                        </p>

                        {/* Features */}
                        <div className="space-y-4 mb-8">
                            {content.features.map((feature, index) => {
                                const FeatureIcon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <div className={`p-2 rounded-lg bg-white/10 ${feature.color} group-hover:scale-110 transition-transform`}>
                                            <FeatureIcon className="w-5 h-5" />
                                        </div>
                                        <span className="text-white/90 font-medium text-left">{feature.text}</span>
                                    </div>
                                )
                            })}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={handleClose}
                            className={`w-full py-4 px-8 bg-gradient-to-r ${content.gradient} text-white font-bold text-lg rounded-2xl 
                shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                relative overflow-hidden group`}
                            style={{ boxShadow: `0 10px 40px ${content.glowColor}` }}
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {content.cta}
                            </span>
                        </button>

                        {/* Footer */}
                        <p className="mt-6 text-white/40 text-sm">
                            {content.footerText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
