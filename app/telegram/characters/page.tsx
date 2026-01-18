"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
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
    const [likedCharacters, setLikedCharacters] = useState<string[]>([])
    const [totalLikes, setTotalLikes] = useState(0)
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // 1. Initial State Recovery (Warm Start)
        // This prevents the "0" flickering when reopening the app
        const cachedData = localStorage.getItem('tg_user_cache')
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData)
                setUserName(parsed.userName || "Player")
                setTokens(parsed.tokens || 0)
                setTotalLikes(parsed.totalLikes || 0)
                setActiveCharacterId(parsed.activeCharacterId || null)
                setLikedCharacters(parsed.likedCharacters || [])
            } catch (e) {
                console.error("Cache recovery error:", e)
            }
        }

        // 2. Initialize Telegram WebApp IMMEDIATELY
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            tg.ready()
            tg.expand()
            tg.setHeaderColor('#000000')
            tg.setBackgroundColor('#0b0b0b')

            // Cache initData in sessionStorage for session recovery across internal navigations
            if (tg.initData) {
                sessionStorage.setItem('tg_init_data', tg.initData)
            }
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

                // 2. Fetch user data via Telegram
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    const tg = window.Telegram.WebApp

                    // Get Telegram user info
                    const user = tg.initDataUnsafe?.user
                    if (user) {
                        setUserName(user.first_name || "Player")
                    }

                    // Try to get initData from either the TG object or our session cache
                    const initData = tg.initData || sessionStorage.getItem('tg_init_data')

                    if (initData) {
                        const response = await fetch('/api/telegram/user-data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ initData })
                        })

                        if (response.ok) {
                            const data = await response.json()
                            if (data.user) {
                                setTokens(data.user.tokens || 0)
                                setTotalLikes(data.user.totalLikes || 0)
                                setLikedCharacters(data.user.likedCharacters || [])
                                setActiveCharacterId(data.user.activeCharacterId || null)

                                // Update Warm Start Cache
                                localStorage.setItem('tg_user_cache', JSON.stringify({
                                    userName: user?.first_name || "Player",
                                    tokens: data.user.tokens,
                                    totalLikes: data.user.totalLikes,
                                    activeCharacterId: data.user.activeCharacterId,
                                    likedCharacters: data.user.likedCharacters
                                }))
                            }
                        } else {
                            console.error("Failed to fetch user data:", response.status)
                        }
                    } else {
                        console.warn("No Telegram initData found, skipping user data fetch")
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

    const handleLike = async (e: React.MouseEvent, charId: string) => {
        e.stopPropagation()
        const isLiked = likedCharacters.includes(charId)

        // Haptic feedback
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }

        // Optimistic UI update
        if (isLiked) {
            setLikedCharacters(prev => prev.filter(id => id !== charId))
            setTotalLikes(prev => Math.max(0, prev - 1))
        } else {
            setLikedCharacters(prev => [...prev, charId])
            setTotalLikes(prev => prev + 1)
        }

        try {
            const tg = window.Telegram?.WebApp
            const initData = tg?.initData || ""

            const response = await fetch(`/api/characters/${charId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData, source: 'telegram' })
            })

            if (!response.ok) {
                // Rollback on error
                if (isLiked) {
                    setLikedCharacters(prev => [...prev, charId])
                    setTotalLikes(prev => prev + 1)
                } else {
                    setLikedCharacters(prev => prev.filter(id => id !== charId))
                    setTotalLikes(prev => Math.max(0, prev - 1))
                }
            }
        } catch (err) {
            console.error("Like error:", err)
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
                <p className="text-white/40 text-sm mt-4 tracking-widest font-black">POCKETLOVE</p>
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
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                            window.Telegram?.WebApp?.close()
                        }}
                        className="text-white/60 text-sm font-bold hover:text-white transition-colors"
                    >
                        Close
                    </button>
                    <div className="text-center">
                        <h2 className="text-white font-black text-lg tracking-tighter uppercase leading-none">PocketLove</h2>
                        <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">mini app</span>
                    </div>
                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            router.push('/settings')
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 active:bg-white/5 transition-all"
                    >
                        <MoreVertical className="w-4 h-4 text-white/40" />
                    </button>
                </div>

                {/* User Stats Box - MATCH SCREENSHOT */}
                <div className="px-6 pb-6">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tight leading-none">Hello, <span className="text-[#ff0080]">{userName}</span></h1>
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">START A DIALOGUE!</p>
                        </div>

                        <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden p-1 gap-1">
                            <div className="px-3 flex items-center gap-1.5 border-r border-white/5">
                                <Heart className={`w-4 h-4 ${totalLikes > 0 ? "text-[#00c2ff] fill-[#00c2ff]" : "text-white/20"}`} />
                                <span className="text-sm font-black text-white/80">{totalLikes}</span>
                            </div>
                            <div className="px-3 flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-black text-white/80">{tokens}</span>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                                    router.push('/premium')
                                }}
                                className="w-9 h-9 bg-[#ff0080] rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <Plus className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-5 pb-4 flex gap-2">
                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            setFilter('female')
                        }}
                        className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black tracking-[0.2em] transition-all duration-300 ${filter === 'female'
                            ? 'bg-gradient-to-r from-[#ff0080] to-[#7928ca] text-white shadow-[0_0_25px_rgba(255,0,128,0.3)]'
                            : 'bg-white/5 text-white/30 border border-white/5'
                            }`}
                    >
                        ♀ FEMALE
                    </button>
                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            setFilter('male')
                        }}
                        className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black tracking-[0.2em] transition-all duration-300 ${filter === 'male'
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-white/30 border border-white/5'
                            }`}
                    >
                        ♂ MALE
                    </button>
                </div>
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32 no-scrollbar scroll-smooth">
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Characters</h3>
                        <div className="flex items-center gap-1 text-white/20">
                            <Users className="w-3 h-3" />
                            <span className="text-[10px] font-black font-mono">({filteredCharacters.length})</span>
                        </div>
                    </div>
                </div>

                {filteredCharacters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p className="font-bold text-sm tracking-widest uppercase">Fetching Souls...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                onClick={() => handleSelect(char)}
                                className={`group relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 transform active:scale-[0.97] ${selectingId === char.id
                                    ? 'border-[#ff0080] shadow-[0_0_25px_rgba(255,0,128,0.4)]'
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

                                {/* Like Button */}
                                <button
                                    onClick={(e) => handleLike(e, char.id)}
                                    className="absolute top-4 right-4 z-20 active:scale-125 transition-transform"
                                >
                                    <Heart
                                        className={`w-5 h-5 drop-shadow-lg ${likedCharacters.includes(char.id)
                                            ? "text-[#ff0080] fill-[#ff0080]"
                                            : "text-white/60 hover:text-white"
                                            }`}
                                    />
                                </button>

                                {/* Status Badge */}
                                {activeCharacterId === char.id && (
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#ff0080] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter z-10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        ACTIVE
                                    </div>
                                )}

                                {/* Loading Overlay */}
                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md z-30">
                                        <div className="relative">
                                            <Loader2 className="w-12 h-12 text-[#ff0080] animate-spin" />
                                            <div className="absolute inset-0 blur-xl bg-[#ff0080]/20 animate-pulse" />
                                        </div>
                                    </div>
                                )}

                                {/* Character Info Block */}
                                <div className="absolute bottom-6 left-6 right-6 space-y-1">
                                    <h3 className="text-2xl font-black text-white truncate drop-shadow-xl leading-none">{char.name}</h3>
                                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest truncate">
                                        {char.relationship || 'Single'}
                                    </p>
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
