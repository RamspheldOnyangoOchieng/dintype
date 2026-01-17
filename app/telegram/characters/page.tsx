"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import { Loader2, Users, Search, CheckCircle2 } from "lucide-react"

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
    image_url: string
    description: string
    category: string
    gender?: string
}

export default function TelegramCharactersPage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [selectingId, setSelectingId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const { data, error } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('is_public', true)

                if (data) {
                    setCharacters(data as any)
                }
            } catch (err) {
                console.error("Error fetching characters:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchCharacters()

        // Expand the webapp to full screen
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready()
            window.Telegram.WebApp.expand()
            // Set header color to match dark theme
            window.Telegram.WebApp.setHeaderColor('#000000')
        }
    }, [])

    const handleSelect = async (character: Character) => {
        if (selectingId) return
        setSelectingId(character.id)

        try {
            const initData = window.Telegram?.WebApp?.initData || ""

            const response = await fetch('/api/telegram/select', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId: character.id,
                    initData
                })
            })

            if (response.ok) {
                // Flash success state then close
                setTimeout(() => {
                    window.Telegram?.WebApp?.close()
                }, 800)
            }
        } catch (err) {
            console.error("Selection error:", err)
            setSelectingId(null)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black">
                <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
                <p className="mt-4 text-gray-400 font-medium tracking-tight">Cargando...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black flex flex-col pt-6 overflow-x-hidden select-none pb-20">
            {/* Minimal Telegram header style */}
            <div className="px-6 flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-[#ff0080] text-[10px] font-black uppercase tracking-[0.2em] mb-1">POCKETLOVE AI</h2>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none">Personajes</h1>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 mb-8">
                <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5 shadow-2xl">
                    <button
                        onClick={() => setFilter("all")}
                        className={`flex-1 py-3.5 px-4 rounded-xl text-[11px] font-black transition-all duration-300 ${filter === 'all' ? 'bg-gradient-to-r from-[#ff0080] to-[#7928ca] text-white shadow-[0_0_20px_rgba(255,0,128,0.4)]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        ♀ FEMENINO
                    </button>
                    <button
                        onClick={() => setFilter("masculino")}
                        className={`flex-1 py-3.5 px-4 rounded-xl text-[11px] font-black transition-all duration-300 ${filter === 'masculino' ? 'bg-[#222] text-white border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        ♂ MASCULINO
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="px-4 grid grid-cols-2 gap-4">
                {characters.map((char) => (
                    <div
                        key={char.id}
                        onClick={() => handleSelect(char)}
                        className={`group relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden bg-[#0a0a0a] border-2 transition-all duration-500 active:scale-95 ${selectingId === char.id ? 'border-[#ff0080]' : 'border-white/5'}`}
                    >
                        <Image
                            src={char.image_url || char.image || "/placeholder.svg"}
                            alt={char.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            unoptimized
                        />

                        {/* Shadow Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        {/* Selection status */}
                        {selectingId === char.id && (
                            <div className="absolute inset-0 bg-[#ff0080]/20 flex items-center justify-center z-20 backdrop-blur-[2px]">
                                <div className="bg-white rounded-full p-3 shadow-2xl animate-in zoom-in duration-300">
                                    <CheckCircle2 className="w-8 h-8 text-[#ff0080]" />
                                </div>
                            </div>
                        )}

                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 px-6">
                            <h3 className="text-[22px] font-black text-white leading-none mb-1">{char.name}</h3>
                            <p className="text-gray-300 text-[10px] font-bold opacity-90 uppercase tracking-widest truncate">
                                {char.description || 'Companion'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
