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

export default function TelegramCharactersPage() {
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
        <div className="bg-[#050505] text-white flex flex-col h-[100dvh] overflow-hidden relative">
            {/* Cinematic Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff0080]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7928ca]/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Navigation Bar - FIXED */}
            <div className="flex-none z-30 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex justify-center pt-2 pb-1">
                    <div className="w-10 h-1 bg-white/10 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                    <button
                        onClick={() => window.Telegram?.WebApp?.close()}
                        className="text-white/60 text-sm font-bold hover:text-white transition-colors"
                    >
                        CLOSE
                    </button>
                    <div className="text-center">
                        <h2 className="text-white font-black text-lg tracking-tighter uppercase leading-none">PocketLove</h2>
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Discovery</span>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                    </div>
                </div>

                {/* User Stats Bar */}
                <div className="px-6 py-2 flex items-center justify-between border-t border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">{userName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                            <span className="text-xs font-black">{diamonds}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black">{tokens}</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-5 py-4 flex gap-2">
                    <button
                        onClick={() => setFilter('female')}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${filter === 'female'
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                            : 'bg-white/5 text-white/30 border border-white/5'
                            }`}
                    >
                        ♀ FEMALE
                    </button>
                    <button
                        onClick={() => setFilter('male')}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${filter === 'male'
                            ? 'bg-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
                            : 'bg-white/5 text-white/30 border border-white/5'
                            }`}
                    >
                        ♂ MALE
                    </button>
                </div>
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto px-5 pt-2 pb-32 no-scrollbar scroll-smooth">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-2xl font-black text-white italic">COMPANIONS</h3>
                    <div className="flex items-center gap-2 text-white/20">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold font-mono">{filteredCharacters.length}</span>
                    </div>
                </div>

                {filteredCharacters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="font-bold text-sm tracking-widest">FETCHING SOULS...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                onClick={() => handleSelect(char)}
                                className={`group relative aspect-[3/4.2] rounded-[2rem] overflow-hidden border-2 transition-all duration-500 transform active:scale-[0.98] ${selectingId === char.id
                                    ? 'border-primary shadow-[0_0_25px_rgba(var(--primary-rgb),0.5)]'
                                    : activeCharacterId === char.id
                                        ? 'border-pink-500/50'
                                        : 'border-white/5 bg-white/5'
                                    }`}
                            >
                                <Image
                                    src={char.image_url || char.image || "/placeholder.svg"}
                                    alt={char.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    unoptimized
                                />

                                {/* Identity Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                                {/* Status Badge */}
                                {activeCharacterId === char.id && (
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-pink-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
                                        <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                        CONNECTED
                                    </div>
                                )}

                                {/* Loading Overlay */}
                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md">
                                        <div className="relative">
                                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                            <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                                        </div>
                                    </div>
                                )}

                                {/* Character Info Block */}
                                <div className="absolute bottom-5 left-5 right-5 space-y-1">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{char.category || 'Companion'}</span>
                                    <h3 className="text-xl font-black text-white truncate drop-shadow-lg leading-none">{char.name}</h3>
                                    {char.relationship && (
                                        <div className="flex items-center gap-1 pb-1">
                                            <div className="w-1 h-1 rounded-full bg-white/30" />
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest truncate">
                                                {char.relationship}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Glow Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
        </div>
    )
}
