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

    const supabase = createClient()

    useEffect(() => {
        // Initialize Telegram WebApp IMMEDIATELY
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            tg.ready()
            // NEVER call expand() - this is what "takes you outside" the modal feel
            tg.setHeaderColor('#000000')
        }

        const fetchInitialData = async () => {
            try {
                // Fetch REAL character data
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

            const response = await fetch('/api/telegram/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId: character.id,
                    initData
                })
            })

            // Close modal instantly on success to return to chat logic
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
            <div className="flex flex-col items-center justify-center bg-transparent" style={{ height: '55vh' }}>
                <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
            </div>
        )
    }

    const filteredCharacters = characters.filter(char => {
        if (filter === 'female') return !char.gender || char.gender === 'female' || char.category === 'girls'
        return char.gender === 'male' || char.category === 'boys'
    })

    return (
        <div className="bg-transparent text-white select-none overflow-hidden flex flex-col justify-end min-h-[55vh]">
            {/* 
                THE MODAL:
                We force 55vh height and bottom justification.
                This leaves the top of the Telegram chat window completely clear.
            */}
            <div className="bg-[#0b0b0b] rounded-t-[2.5rem] border-t border-white/10 flex flex-col shadow-2xl overflow-hidden"
                style={{ height: '55vh' }}>

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-2">
                    <button onClick={() => window.Telegram?.WebApp?.close()} className="text-white text-base font-medium">
                        Close
                    </button>
                    <div className="text-center">
                        <h2 className="text-white font-bold text-sm leading-tight">PocketLove</h2>
                        <p className="text-white/30 text-[10px] font-medium leading-tight">companion modal</p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                    </div>
                </div>

                {/* Greeting & Real Data */}
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-white font-bold text-base">Hello,</span>
                            <span className="text-[#ff0080] font-black text-base italic tracking-tight">{userName}</span>
                        </div>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">Start a dialogue!</p>
                    </div>

                    <div className="bg-[#151515] rounded-2xl flex items-center overflow-hidden border border-white/5">
                        <div className="flex items-center gap-2 px-4 py-2">
                            <Heart className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                            <span className="text-white text-sm font-bold">{diamonds}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 border-l border-white/5">
                            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-white text-sm font-bold">{tokens}</span>
                        </div>
                        <button className="bg-[#ff0080] py-2 px-3 active:scale-95 transition-transform">
                            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-1 flex items-center gap-2.5">
                    <h2 className="text-2xl font-black text-white tracking-tighter">Companion</h2>
                    <Users className="w-5 h-5 text-white/20" />
                </div>

                {/* Filter Tabs */}
                <div className="px-6 py-3 flex gap-3">
                    <button
                        onClick={() => setFilter('female')}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all ${filter === 'female' ? 'bg-gradient-to-br from-[#ff0080] to-[#7928ca] text-white shadow-[0_10px_30px_rgba(255,0,128,0.4)]' : 'bg-[#151515] text-white/20'}`}
                    >
                        ♀ FEMALE
                    </button>
                    <button
                        onClick={() => setFilter('male')}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] transition-all ${filter === 'male' ? 'bg-white/40 text-black' : 'bg-[#151515] text-white/20'}`}
                    >
                        ♂ MALE
                    </button>
                </div>

                {/* Real Character Selection Grid */}
                <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        {filteredCharacters.map((char) => (
                            <div
                                key={char.id}
                                onClick={() => handleSelect(char)}
                                className={`group relative aspect-[3/4.2] rounded-[2rem] overflow-hidden border-2 transition-all active:scale-95 ${selectingId === char.id ? 'border-[#ff0080]' : 'border-white/5'}`}
                            >
                                <Image src={char.image_url || char.image || "/placeholder.svg"} alt={char.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
                                    </div>
                                )}
                                <div className="absolute bottom-5 left-6 right-6">
                                    <h3 className="text-lg font-black text-white truncate leading-tight">{char.name}</h3>
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
