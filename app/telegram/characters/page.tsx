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
    const [viewportHeight, setViewportHeight] = useState<number | null>(null)

    const supabase = createClient()

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch REAL character data from Supabase
                const { data: charData } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('is_public', true)

                if (charData) setCharacters(charData as Character[])

                // Initialize Telegram WebApp
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    const tg = window.Telegram.WebApp
                    tg.ready()
                    tg.setHeaderColor('#000000')

                    const user = tg.initDataUnsafe?.user
                    if (user) setUserName(user.first_name || "Player")

                    // Update viewport
                    setViewportHeight(tg.viewportHeight)
                    tg.onEvent('viewportChanged', () => {
                        setViewportHeight(tg.viewportHeight)
                    })

                    // Fetch actual user data from backend
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
            console.error("Selection error:", err)
            setSelectingId(null)
            if (window.Telegram?.WebApp) window.Telegram.WebApp.close()
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
            {/* The Bottom Sheet Panel with Reference Design */}
            <div className="bg-[#0b0b0b] rounded-t-[1.5rem] border-t border-white/5 overflow-hidden flex flex-col shadow-2xl"
                style={{ height: '80vh' }}>

                {/* Header Navigation */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <button
                        onClick={() => window.Telegram?.WebApp?.close()}
                        className="text-white text-md font-medium px-1 hover:opacity-70 transition-opacity"
                    >
                        Close
                    </button>

                    <div className="text-center">
                        <h2 className="text-white font-bold text-[14px] leading-tight">PocketLove</h2>
                        <p className="text-white/30 text-[10px] font-medium leading-tight lowercase">mini app</p>
                    </div>

                    <button className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 active:bg-white/5">
                        <MoreVertical className="w-4 h-4 text-white/70" />
                    </button>
                </div>

                {/* English Greeting & LIVE User Data */}
                <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="text-white font-bold text-sm">Hello,</span>
                            <span className="text-white font-bold text-sm tracking-tight">{userName}</span>
                        </div>
                        <p className="text-white/30 text-[10px] font-medium mt-0.5 lowercase tracking-wider">Start a dialogue!</p>
                    </div>

                    {/* Backend Linked Status Pill */}
                    <div className="bg-[#151515] rounded-xl flex items-center overflow-hidden border border-white/5">
                        <div className="flex items-center gap-1.5 px-3 py-1.5">
                            <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                            <span className="text-white text-xs font-bold">{diamonds}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 border-l border-white/5">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-white text-xs font-bold">{tokens}</span>
                        </div>
                        <button className="bg-[#ff0080] p-1.5 px-2.5 active:opacity-80 transition-opacity">
                            <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* English Header */}
                <div className="px-5 py-2 flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white tracking-tight">Characters</h2>
                    <Users className="w-5 h-5 text-white/50" />
                </div>

                {/* Gender Tabs with English Labels */}
                <div className="px-5 py-3 flex gap-3">
                    <button
                        onClick={() => setFilter('female')}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black tracking-widest flex items-center justify-center gap-2 transition-all ${filter === 'female' ? 'bg-gradient-to-r from-[#ff0080] to-[#7928ca] text-white' : 'bg-[#151515] text-white/30'}`}
                    >
                        ♀ FEMALE
                    </button>
                    <button
                        onClick={() => setFilter('male')}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-black tracking-widest flex items-center justify-center gap-2 transition-all ${filter === 'male' ? 'bg-white/40 text-black' : 'bg-[#151515] text-white/30'}`}
                    >
                        ♂ MALE
                    </button>
                </div>

                {/* Characters Grid with REAL database content */}
                <div className="flex-1 overflow-y-auto px-5 pt-2 pb-10 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                onClick={() => handleSelect(char)}
                                className={`group relative aspect-[3/4.5] rounded-[2rem] overflow-hidden border-2 transition-all active:scale-95 ${selectingId === char.id ? 'border-[#ff0080]' : 'border-white/5'}`}
                            >
                                <Image
                                    src={char.image_url || char.image || "/placeholder.svg"}
                                    alt={char.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                        <Loader2 className="w-7 h-7 text-[#ff0080] animate-spin" />
                                    </div>
                                )}

                                <div className="absolute bottom-5 left-6 right-6">
                                    <h3 className="text-lg font-bold text-white leading-tight truncate">{char.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                }
            `}</style>
        </div>
    )
}
