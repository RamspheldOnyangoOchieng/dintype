"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

declare global {
    interface Window {
        Telegram: {
            WebApp: any
        }
    }
}

export default function TelegramRootPage() {
    const router = useRouter()

    useEffect(() => {
        // Initialize Telegram WebApp
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            tg.ready()
            // Removed tg.expand() to allow app to start as a "halfway" bottom sheet
            tg.setHeaderColor('#000000')
        }

        // Redirect to characters page
        router.replace('/telegram/characters')
    }, [router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff0080] to-[#7928ca] animate-pulse" />
            <p className="mt-4 text-white/60 text-sm font-medium">Loading PocketLove AI...</p>
        </div>
    )
}
