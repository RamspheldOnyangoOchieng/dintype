"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import { Loader2, Zap, Heart, Plus, MoreVertical, Users } from "lucide-react"

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

export default function TelegramRootPage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'female' | 'male'>("female")
    const [selectingId, setSelectingId] = useState<string | null>(null)
    const [tokens, setTokens] = useState(0)
    const [diamonds, setDiamonds] = useState(0)
    const [userName, setUserName] = useState("Player")
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        // Initialize Telegram WebApp IMMEDIATELY
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            tg.ready()
            tg.setHeaderColor('#000000')
            tg.setBackgroundColor('#0b0b0b')
        }

        const fetchInitialData = async () => {
            try {
                // 1. Fetch ALL public characters from the database
                const { data: charData, error: charError } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('is_public', true)
                    .order('name', { ascending: true })

                if (charError) {
                    console.error("Error fetching characters:", charError)
                } else if (charData) {
                    setCharacters(charData as Character[])
                }

                // 2. Fetch user data via Telegram initData
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    const tg = window.Telegram.WebApp

                    // Get Telegram user info
                    const user = tg.initDataUnsafe?.user
                    if (user) {
                        setUserName(user.first_name || "Player")
                    }

                    // Fetch user's tokens, diamonds, and active character from our backend
                    if (tg.initData) {
                        const response = await fetch('/api/telegram/user-data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ initData: tg.initData })
                        })

                        if (response.ok) {
                            const data = await response.json()
                            if (data.user) {
                                setTokens(data.user.tokens || 0)
                                setDiamonds(data.user.diamonds || 0)
                                setActiveCharacterId(data.user.activeCharacterId || null)
                            }
                        } else {
                            console.error("Failed to fetch user data:", response.status)
                        }
                    }
                }
            } catch (err) {
                console.error("Error in fetchInitialData:", err)
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
                body: JSON.stringify({ characterId: character.id, initData })
            })

            // Close the mini app to return to chat
            if (response.ok && tg) {
                tg.close()
            } else {
                setSelectingId(null)
            }
        } catch (err) {
            console.error("Selection error:", err)
            setSelectingId(null)
            if (window.Telegram?.WebApp) window.Telegram.WebApp.close()
        }
    }

    // Filter characters based on gender selection
    const filteredCharacters = characters.filter(char => {
        if (filter === 'female') {
            return !char.gender || char.gender === 'female' || char.category === 'girls'
        }
        return char.gender === 'male' || char.category === 'boys'
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0b]">
                <Loader2 className="w-10 h-10 text-[#ff0080] animate-spin" />
                <p className="text-white/40 text-sm mt-4">Loading characters...</p>
            </div>
        )
    }

    return (
        <div className="bg-[#0b0b0b] text-white select-none min-h-screen flex flex-col">
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3">
                <button
                    onClick={() => window.Telegram?.WebApp?.close()}
                    className="text-white text-base font-medium hover:text-white/70 transition-colors"
                >
                    Close
                </button>
                <div className="text-center">
                    <h2 className="text-white font-bold text-base leading-tight">PocketLove</h2>
                    <p className="text-white/30 text-[10px] font-medium">mini app</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors">
                    <MoreVertical className="w-5 h-5 text-white/50" />
                </div>
            </div>

            {/* User Greeting & Balance */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-lg">Hello,</span>
                        <span className="text-[#ff0080] font-black text-lg">{userName}</span>
                    </div>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Start a dialogue!</p>
                </div>

                {/* Token & Diamond Display */}
                <div className="bg-[#151515] rounded-2xl flex items-center overflow-hidden border border-white/5">
                    <div className="flex items-center gap-2 px-4 py-2.5">
                        <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                        <span className="text-white text-sm font-bold">{diamonds}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 border-l border-white/5">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-white text-sm font-bold">{tokens}</span>
                    </div>
                    <button className="bg-[#ff0080] py-2.5 px-3 hover:bg-[#ff0080]/90 active:scale-95 transition-all">
                        <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Section Title */}
            <div className="px-6 py-2 flex items-center gap-3">
                <h2 className="text-2xl font-black text-white tracking-tight">Characters</h2>
                <Users className="w-5 h-5 text-white/30" />
                <span className="text-white/20 text-sm">({filteredCharacters.length})</span>
            </div>

            {/* Gender Filter Tabs */}
            <div className="px-6 py-3 flex gap-3">
                <button
                    onClick={() => setFilter('female')}
                    className={`flex-1 py-4 rounded-2xl text-[11px] font-black tracking-widest transition-all ${filter === 'female'
                            ? 'bg-gradient-to-br from-[#ff0080] to-[#7928ca] text-white shadow-lg shadow-[#ff0080]/30'
                            : 'bg-[#151515] text-white/30 hover:bg-[#1a1a1a]'
                        }`}
                >
                    ♀ FEMALE
                </button>
                <button
                    onClick={() => setFilter('male')}
                    className={`flex-1 py-4 rounded-2xl text-[11px] font-black tracking-widest transition-all ${filter === 'male'
                            ? 'bg-white/90 text-black shadow-lg'
                            : 'bg-[#151515] text-white/30 hover:bg-[#1a1a1a]'
                        }`}
                >
                    ♂ MALE
                </button>
            </div>

            {/* Character Grid - ALL CHARACTERS */}
            <div className="flex-1 overflow-y-auto px-6 pb-10">
                {filteredCharacters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-white/30 text-sm">No characters found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                onClick={() => handleSelect(char)}
                                className={`group relative aspect-[3/4] rounded-[1.5rem] overflow-hidden border-2 transition-all duration-200 active:scale-95 cursor-pointer ${selectingId === char.id
                                        ? 'border-[#ff0080] ring-4 ring-[#ff0080]/30'
                                        : activeCharacterId === char.id
                                            ? 'border-[#ff0080]/50'
                                            : 'border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <Image
                                    src={char.image_url || char.image || "/placeholder.svg"}
                                    alt={char.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                {/* Active indicator */}
                                {activeCharacterId === char.id && (
                                    <div className="absolute top-3 right-3 bg-[#ff0080] text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-wide">
                                        Active
                                    </div>
                                )}

                                {/* Loading overlay */}
                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
                                    </div>
                                )}

                                {/* Character info */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-lg font-bold text-white truncate leading-tight">{char.name}</h3>
                                    {char.relationship && (
                                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider mt-0.5 truncate">
                                            {char.relationship}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
