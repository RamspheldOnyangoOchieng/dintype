"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TelegramCharactersRedirect() {
    const router = useRouter()

    useEffect(() => {
        // Redesign consolidated everything into the root /telegram page
        // to prevent "navigation" feeling and maintain transparency.
        router.replace('/telegram')
    }, [router])

    return null
}
