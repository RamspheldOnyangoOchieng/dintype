"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TelegramRootRedirect() {
    const router = useRouter()

    useEffect(() => {
        // Redirecting to /characters since that's what the bot's 
        // menu button and keyboard are configured to hit.
        router.replace('/telegram/characters')
    }, [router])

    return null
}
