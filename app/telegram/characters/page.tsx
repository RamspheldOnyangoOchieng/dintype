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
    const [vpHeight, setVpHeight] = useState(400)

    const supabase = createClient()

    useEffect(() => {
        // Initialize Telegram WebApp IMMEDIATELY
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            tg.ready()

            // CRITICAL: NEVER call tg.expand() 
            // This keeps the Mini App in "compact" bottom-sheet mode

            tg.setHeaderColor('#000000')
            tg.setBackgroundColor('#0b0b0b')

            // Use Telegram's provided viewport height
            setVpHeight(tg.viewportStableHeight || tg.viewportHeight || 400)

            tg.onEvent('viewportChanged', () => {
                setVpHeight(tg.viewportStableHeight || tg.viewportHeight || 400)
            })
        }

        const fetchInitialData = async () => {
            try {
                const { data: charData } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('is_public', true)

                if (charData) setCharacters(charData as Character[])

                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    const tg = window.Telegram.WebApp
                    const user = tg.initDataUnsafe?.user
                    if (user) setUserName(user.first_name || "Player")

                    const response = await fetch('/api/telegram/user-data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ initData: tg.initData })
                    })

                    if (response.ok) {
                        const data = await response.json()
                        if (data.user) {
                            setTokens(data.user.tokens)
                            setDiamonds(data.user.diamonds)
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

            await fetch('/api/telegram/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterId: character.id, initData })
            })

            // Close instantly to return to chat
            if (tg) tg.close()
        } catch (err) {
            if (window.Telegram?.WebApp) window.Telegram.WebApp.close()
        }
    }

    if (loading) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-[#0b0b0b]"
                style={{ height: vpHeight }}
            >
                <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
            </div>
        )
    }

    const filteredCharacters = characters.filter(char => {
        if (filter === 'female') return !char.gender || char.gender === 'female' || char.category === 'girls'
        return char.gender === 'male' || char.category === 'boys'
    })

    // Use Telegram's viewport height directly - this respects the "compact" mode
    return (
        <div
            className="bg-[#0b0b0b] text-white select-none overflow-hidden flex flex-col"
            style={{ height: vpHeight }}
        >
            {/* Drag Handle to show this is a modal */}
            <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3">
                <button onClick={() => window.Telegram?.WebApp?.close()} className="text-white text-sm font-medium">
                    Close
                </button>
                <div className="text-center">
                    <h2 className="text-white font-bold text-sm leading-tight">PocketLove</h2>
                    <p className="text-white/30 text-[9px] font-medium">mini app</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10">
                    <MoreVertical className="w-4 h-4 text-white/40" />
                </div>
            </div>

            {/* Greeting & Balance */}
            <div className="px-5 py-3 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1">
                        <span className="text-white font-bold text-sm">Hello,</span>
                        <span className="text-[#ff0080] font-bold text-sm">{userName}</span>
                    </div>
                    <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Start a dialogue!</p>
                </div>

                <div className="bg-[#151515] rounded-xl flex items-center overflow-hidden border border-white/5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5">
                        <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                        <span className="text-white text-xs font-bold">{diamonds}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border-l border-white/5">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-white text-xs font-bold">{tokens}</span>
                    </div>
                    <button className="bg-[#ff0080] p-1.5 px-2">
                        <Plus className="w-3 h-3 text-white" strokeWidth={3} />
                    </button>
                </div>
            </div>

            <div className="px-5 py-1 flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Companion</h2>
                <Users className="w-4 h-4 text-white/20" />
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-2 flex gap-2">
                <button
                    onClick={() => setFilter('female')}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${filter === 'female' ? 'bg-gradient-to-br from-[#ff0080] to-[#7928ca] text-white' : 'bg-[#151515] text-white/20'}`}
                >
                    ♀ FEMALE
                </button>
                <button
                    onClick={() => setFilter('male')}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${filter === 'male' ? 'bg-white/40 text-black' : 'bg-[#151515] text-white/20'}`}
                >
                    ♂ MALE
                </button>
            </div>

            {/* Character Grid - Uses remaining space */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
                <div className="grid grid-cols-2 gap-3">
                    {filteredCharacters.slice(0, 4).map((char) => (
                        <div
                            key={char.id}
                            onClick={() => handleSelect(char)}
                            className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${selectingId === char.id ? 'border-[#ff0080]' : 'border-white/5'}`}
                        >
                            <Image src={char.image_url || char.image || "/placeholder.svg"} alt={char.name} fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                            {selectingId === char.id && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-[#ff0080] animate-spin" />
                                </div>
                            )}
                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-sm font-bold text-white truncate">{char.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
