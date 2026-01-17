"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import { Loader2, Zap } from "lucide-react"

declare global {
    interface Window {
        Telegram: {
            WebApp: any
        }
    }
}

type Character = {
    id: string
    name: string
    image_url?: string
    image?: string
    description: string
    category: string
    gender?: string
    relationship?: string
}

export default function TelegramMiniAppPage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'female' | 'male'>("female")
    const [selectingId, setSelectingId] = useState<string | null>(null)
    const [tokens, setTokens] = useState(0)
    const [userName, setUserName] = useState("Player")
    const [viewportHeight, setViewportHeight] = useState<number | null>(null)

    const supabase = createClient()

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch characters
                const { data: charData } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('is_public', true)

                if (charData) setCharacters(charData as Character[])

                // Initialize Telegram WebApp
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    const tg = window.Telegram.WebApp
                    tg.ready()

                    // DO NOT tg.expand() - we want the halfway "mini" state
                    tg.setHeaderColor('#000000')

                    const user = tg.initDataUnsafe?.user
                    if (user) setUserName(user.first_name || "Player")

                    setViewportHeight(tg.viewportHeight)
                    tg.onEvent('viewportChanged', () => setViewportHeight(tg.viewportHeight))

                    const response = await fetch('/api/telegram/user-data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ initData: tg.initData })
                    })

                    if (response.ok) {
                        const data = await response.json()
                        if (data.user) {
                            setTokens(data.user.tokens)
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [])

    const handleSelect = async (character: Character) => {
        if (selectingId) return
        setSelectingId(character.id)

        try {
            const tg = window.Telegram?.WebApp
            const initData = tg?.initData || ""

            if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium')

            const response = await fetch('/api/telegram/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId: character.id,
                    initData
                })
            })

            if (response.ok) {
                // Stay open in mini mode so the user can see the chat above
                setSelectingId(null)
            }
        } catch (err) {
            console.error("Selection error:", err)
            setSelectingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
                <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
            </div>
        )
    }

    const filteredCharacters = characters.filter(char => {
        if (filter === 'female') return !char.gender || char.gender === 'female' || char.category === 'girls'
        return char.gender === 'male' || char.category === 'boys'
    })

    return (
        <div className="bg-transparent min-h-screen flex flex-col justify-end text-white select-none">
            {/* Dark Panel Area (Bottom part of the halfway screen) */}
            <div className="bg-[#0c0c0c] rounded-t-[2.5rem] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                {/* Drag Handle */}
                <div className="flex justify-center py-3">
                    <div className="w-10 h-1 bg-white/20 rounded-full" />
                </div>

                {/* User Info */}
                <div className="px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{userName}</h1>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">Select Partner</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-xl font-black leading-none">{tokens}</span>
                    </div>
                </div>

                {/* Filter */}
                <div className="px-6 mb-6 flex gap-3">
                    <button
                        onClick={() => setFilter('female')}
                        className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black tracking-widest transition-all ${filter === 'female' ? 'bg-[#ff0080] text-white shadow-[0_4px_15px_rgba(255,0,128,0.4)]' : 'bg-[#1a1a1a] text-white/30'}`}
                    >
                        ♀ FEMALE
                    </button>
                    <button
                        onClick={() => setFilter('male')}
                        className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black tracking-widest transition-all ${filter === 'male' ? 'bg-white/40 text-black' : 'bg-[#1a1a1a] text-white/30'}`}
                    >
                        ♂ MALE
                    </button>
                </div>

                {/* Horizontal Character Grid */}
                <div className="flex-1 px-6 pb-20 overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                onClick={() => handleSelect(char)}
                                className={`relative aspect-[3/4.2] rounded-[2rem] overflow-hidden border-2 transition-all active:scale-95 ${selectingId === char.id ? 'border-[#ff0080] ring-4 ring-[#ff0080]/20' : 'border-white/5'}`}
                            >
                                <Image src={char.image_url || char.image || "/placeholder.svg"} alt={char.name} fill className="object-cover" unoptimized />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
                                    </div>
                                )}

                                <div className="absolute bottom-4 left-5 right-5">
                                    <h3 className="text-lg font-black leading-tight truncate">{char.name}</h3>
                                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest truncate">{char.relationship || char.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
