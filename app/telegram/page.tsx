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

export default function TelegramMiniAppPage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'female' | 'male'>("female")
    const [selectingId, setSelectingId] = useState<string | null>(null)
    const [tokens, setTokens] = useState(0)
    const [diamonds, setDiamonds] = useState(0)
    const [userName, setUserName] = useState("Player")

    const supabase = createClient()

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch REAL character data
                const { data: charData } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('is_public', true)

                if (charData) setCharacters(charData as Character[])

                // Initialize Telegram WebApp
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    const tg = window.Telegram.WebApp
                    tg.ready()

                    // CRITICAL: We DO NOT call expand()
                    // This forces Telegram to keep us in "Mini" (bottom sheet) mode
                    // so the chat stays visible above the panel.

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

            const response = await fetch('/api/telegram/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId: character.id,
                    initData
                })
            })

            if (response.ok) {
                if (tg) tg.close()
            }
            setSelectingId(null)
        } catch (err) {
            setSelectingId(null)
            if (window.Telegram?.WebApp) window.Telegram.WebApp.close()
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[55vh] bg-transparent">
                <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
            </div>
        )
    }

    const filteredCharacters = characters.filter(char => {
        if (filter === 'female') return !char.gender || char.gender === 'female' || char.category === 'girls'
        return char.gender === 'male' || char.category === 'boys'
    })

    return (
        <div className="bg-transparent text-white select-none overflow-hidden">
            {/* 
                By setting height to 55vh and avoiding any min-h-screen, 
                Telegram renders the webview as a partial bottom sheet.
                The area above this div IS the real Telegram chat.
            */}
            <div className="bg-[#0b0b0b] rounded-t-[1.5rem] border-t border-white/5 overflow-hidden flex flex-col shadow-2xl"
                style={{ height: '55vh' }}>

                {/* Header Navigation */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <button
                        onClick={() => window.Telegram?.WebApp?.close()}
                        className="text-white text-sm font-medium px-1"
                    >
                        Close
                    </button>

                    <div className="text-center">
                        <h2 className="text-white font-bold text-[13px] leading-tight">PocketLove</h2>
                        <p className="text-white/30 text-[9px] font-medium leading-tight">mini app</p>
                    </div>

                    <button className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10">
                        <MoreVertical className="w-4 h-4 text-white/70" />
                    </button>
                </div>

                {/* Greeting & Balance */}
                <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="text-white font-bold text-sm">Hello,</span>
                            <span className="text-white font-bold text-sm">{userName}</span>
                        </div>
                        <p className="text-white/30 text-[9px] font-medium uppercase tracking-widest">Start a dialogue!</p>
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
                            <Plus className="w-3 h-3 text-white" />
                        </button>
                    </div>
                </div>

                <div className="px-5 py-1 flex items-center gap-2">
                    <h2 className="text-xl font-black text-white">Characters</h2>
                    <Users className="w-4 h-4 text-white/40" />
                </div>

                <div className="px-5 py-2 flex gap-2">
                    <button
                        onClick={() => setFilter('female')}
                        className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${filter === 'female' ? 'bg-gradient-to-r from-[#ff0080] to-[#7928ca]' : 'bg-[#151515] text-white/30'}`}
                    >
                        ♀ FEMALE
                    </button>
                    <button
                        onClick={() => setFilter('male')}
                        className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${filter === 'male' ? 'bg-white/40 text-black' : 'bg-[#151515] text-white/30'}`}
                    >
                        ♂ MALE
                    </button>
                </div>

                {/* Scrollable Characters */}
                <div className="flex-1 overflow-y-auto px-5 pt-1 pb-10 no-scrollbar">
                    <div className="grid grid-cols-2 gap-3">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                onClick={() => handleSelect(char)}
                                className={`group relative aspect-[3/4.2] rounded-[1.5rem] overflow-hidden border-2 transition-all ${selectingId === char.id ? 'border-[#ff0080]' : 'border-white/5'}`}
                            >
                                <Image src={char.image_url || char.image || "/placeholder.svg"} alt={char.name} fill className="object-cover" unoptimized />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-[#ff0080] animate-spin" />
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-base font-bold text-white truncate">{char.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    )
}
