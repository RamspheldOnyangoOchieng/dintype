"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import {
    Loader2, Zap, Heart, Plus, MoreVertical, Users,
    Home, Sparkles, UserPlus, User, Search, Filter,
    ChevronRight, LogOut, Wallet
} from "lucide-react"
import { useRouter } from "next/navigation"

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

type Tab = 'home' | 'generate' | 'create' | 'profile'

export default function TelegramRootPage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'female' | 'male'>("female")
    const [selectingId, setSelectingId] = useState<string | null>(null)
    const [tokens, setTokens] = useState(0)
    const [diamonds, setDiamonds] = useState(0)
    const [userName, setUserName] = useState("Player")
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null)
    const [likedCharacters, setLikedCharacters] = useState<string[]>([])
    const [totalLikes, setTotalLikes] = useState(0)
    const [activeTab, setActiveTab] = useState<Tab>('home')
    const [isPremium, setIsPremium] = useState(false)

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Initial state recovery (Warm Start)
        const cached = localStorage.getItem('tg_user_root_cache')
        if (cached) {
            try {
                const parsed = JSON.parse(cached)
                setUserName(parsed.userName || "Player")
                setTokens(parsed.tokens || 0)
                setDiamonds(parsed.diamonds || 0)
                setTotalLikes(parsed.totalLikes || 0)
                setLikedCharacters(parsed.likedCharacters || [])
                setIsPremium(parsed.isPremium || false)
            } catch (e) { }
        }

        // Initialize Telegram WebApp IMMEDIATELY
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            tg.ready()
            tg.expand()
            tg.setHeaderColor('#000000')
            tg.setBackgroundColor('#0b0b0b')

            if (tg.initData) {
                sessionStorage.setItem('tg_init_data', tg.initData)
            }
        }

        const fetchInitialData = async () => {
            try {
                // 1. Fetch ALL public characters
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
                                setDiamonds(data.user.diamonds || 0) // totalLikes in characters/page.tsx
                                setLikedCharacters(data.user.likedCharacters || [])
                                setTotalLikes(data.user.totalLikes || data.user.likedCharacters?.length || 0)
                                setActiveCharacterId(data.user.activeCharacterId || null)
                                setIsPremium(data.user.isPremium || false)

                                localStorage.setItem('tg_user_root_cache', JSON.stringify({
                                    userName: user?.first_name || "Player",
                                    tokens: data.user.tokens,
                                    diamonds: data.user.diamonds,
                                    totalLikes: data.user.totalLikes || data.user.likedCharacters?.length || 0,
                                    likedCharacters: data.user.likedCharacters,
                                    isPremium: data.user.isPremium
                                }))
                            }
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
            const initData = tg?.initData || sessionStorage.getItem('tg_init_data') || ""

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
            const initData = tg?.initData || sessionStorage.getItem('tg_init_data') || ""

            await fetch(`/api/characters/${charId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData, source: 'telegram' })
            })
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
                <p className="text-white/40 text-sm mt-4 font-black tracking-widest uppercase">PocketLove</p>
            </div>
        )
    }

    const renderHeader = () => (
        <div className="flex-none">
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 bg-white/10 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
                <button
                    onClick={() => window.Telegram?.WebApp?.close()}
                    className="text-white/50 text-sm font-bold hover:text-white transition-colors"
                >
                    Close
                </button>
                <div className="text-center">
                    <h2 className="text-white font-black text-lg tracking-tighter uppercase leading-none">PocketLove</h2>
                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">mini app</p>
                </div>
                <div className="w-10" />
            </div>

            {/* User Greeting & Balance */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div onClick={() => setActiveTab('profile')} className="cursor-pointer active:opacity-70 transition-opacity">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-black text-3xl">Hello,</span>
                        <span className="text-[#ff0080] font-black text-3xl">{userName}</span>
                    </div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Start a dialogue!</p>
                </div>

                {/* Token & Balance Display */}
                <div className="bg-white/[0.03] rounded-2xl flex items-center overflow-hidden border border-white/5 p-1 gap-1">
                    <div
                        onClick={() => setActiveTab('profile')}
                        className="flex items-center gap-1.5 px-3 py-2 border-r border-white/5 cursor-pointer active:bg-white/5 transition-colors"
                    >
                        <Heart className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                        <span className="text-white text-sm font-black">{totalLikes}</span>
                    </div>
                    <div
                        onClick={() => setActiveTab('profile')}
                        className="flex items-center gap-1.5 px-3 py-2 cursor-pointer active:bg-white/5 transition-colors"
                    >
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-white text-sm font-black">{tokens}</span>
                    </div>
                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            setActiveTab('profile')
                        }}
                        className="bg-[#ff0080] w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all"
                    >
                        <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    )

    const renderHome = () => (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Section Title */}
            <div className="px-6 py-2 flex items-center gap-3">
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Characters</h2>
                <Users className="w-5 h-5 text-white/30" />
                <span className="text-white/20 text-sm font-mono font-bold">({filteredCharacters.length})</span>
            </div>

            {/* Gender Filter Tabs */}
            <div className="px-6 py-3 flex gap-3">
                <button
                    onClick={() => {
                        if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                        setFilter('female')
                    }}
                    className={`flex-1 py-4 rounded-2xl text-[11px] font-black tracking-[0.2em] transition-all duration-300 ${filter === 'female'
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
                    className={`flex-1 py-4 rounded-2xl text-[11px] font-black tracking-[0.2em] transition-all duration-300 ${filter === 'male'
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/30 border border-white/5'
                        }`}
                >
                    ♂ MALE
                </button>
            </div>

            {/* Character Grid */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-32 pt-2 -webkit-overflow-scrolling-touch no-scrollbar">
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
                                className={`group relative aspect-[3/4.5] rounded-[2rem] overflow-hidden border-2 transition-all duration-500 transform active:scale-[0.97] ${selectingId === char.id
                                    ? 'border-[#ff0080] shadow-[0_0_20px_rgba(255,0,128,0.4)]'
                                    : activeCharacterId === char.id
                                        ? 'border-[#ff0080]/50'
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

                                {/* Active indicator */}
                                {activeCharacterId === char.id && (
                                    <div className="absolute top-4 left-4 bg-[#ff0080] text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter flex items-center gap-1">
                                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                        Active
                                    </div>
                                )}

                                {/* Loading overlay */}
                                {selectingId === char.id && (
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-md z-30">
                                        <Loader2 className="w-10 h-10 text-[#ff0080] animate-spin" />
                                    </div>
                                )}

                                {/* Character info */}
                                <div className="absolute bottom-6 left-5 right-5 space-y-1">
                                    <h3 className="text-xl font-black text-white truncate drop-shadow-xl leading-none">{char.name}</h3>
                                    {char.relationship && (
                                        <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.1em] truncate">
                                            {char.relationship || 'Single'}
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

    const renderGenerate = () => (
        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
            <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Generate ✨</h2>
                <p className="text-white/40 text-sm font-medium">Create your own visual masterpieces with AI.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#ff0080]/10 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-[#ff0080]" />
                </div>
                <h3 className="text-xl font-black">Coming to Mobile!</h3>
                <p className="text-white/30 text-sm leading-relaxed">
                    We're optimizing the image generator for your phone. High-speed, high-quality generation is arriving in the next update.
                </p>
                <button
                    onClick={() => router.push('/generate')}
                    className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase active:scale-95 transition-all"
                >
                    Try Web Version
                </button>
            </div>
        </div>
    )

    const renderCreate = () => (
        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
            <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Create AI 🤖</h2>
                <p className="text-white/40 text-sm font-medium">Bring your own companion to life.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-cyan-400/10 flex items-center justify-center">
                    <UserPlus className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-black">Build Your Own</h3>
                <p className="text-white/30 text-sm leading-relaxed">
                    Design the personality, looks, and voice of your perfect AI companion. Character studio is coming soon.
                </p>
                <button
                    onClick={() => router.push('/create-character')}
                    className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl font-black text-sm tracking-widest uppercase active:scale-95 transition-all"
                >
                    Create on Web
                </button>
            </div>
        </div>
    )

    const renderProfile = () => (
        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
            <div className="space-y-2">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Profile</h2>
                <p className="text-white/40 text-sm font-medium">Manage your identity and assets.</p>
            </div>

            <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff0080] to-[#7928ca] flex items-center justify-center text-2xl font-black">
                            {userName.charAt(0)}
                        </div>
                        <div>
                            <h4 className="text-xl font-black">{userName}</h4>
                            <div className="flex items-center gap-1">
                                {isPremium ? (
                                    <span className="text-amber-400 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Premium Citizen
                                    </span>
                                ) : (
                                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">PocketLove Citizen</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                            <Zap className="w-5 h-5 text-amber-500 mb-2" />
                            <p className="text-2xl font-black leading-none">{tokens}</p>
                            <p className="text-[10px] font-black text-white/30 uppercase mt-1">Tokens</p>
                        </div>
                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                            <Heart className="w-5 h-5 text-cyan-400 mb-2 fill-cyan-400" />
                            <p className="text-2xl font-black leading-none">{totalLikes}</p>
                            <p className="text-[10px] font-black text-white/30 uppercase mt-1">Likes Given</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <button
                        onClick={() => router.push('/premium')}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="font-bold">Billing & Subscription</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20" />
                    </button>

                    <button
                        onClick={() => router.push('/settings')}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Filter className="w-5 h-5 text-white/50" />
                            </div>
                            <span className="font-bold">Preferences</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/20" />
                    </button>

                    <button
                        onClick={() => window.Telegram?.WebApp?.close()}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4 text-red-400">
                            <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <span className="font-bold">Exit Mini App</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="bg-[#050505] text-white flex flex-col h-[100dvh] overflow-hidden relative select-none">
            {/* Cinematic Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff0080]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#7928ca]/10 rounded-full blur-[100px] pointer-events-none" />

            {renderHeader()}

            <div className="flex-1 overflow-hidden relative flex flex-col">
                {activeTab === 'home' && renderHome()}
                {activeTab === 'generate' && renderGenerate()}
                {activeTab === 'create' && renderCreate()}
                {activeTab === 'profile' && renderProfile()}
            </div>

            {/* BOTTOM NAVIGATION BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8">
                <div className="bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl">
                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            setActiveTab('home')
                        }}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === 'home' ? 'bg-[#ff0080] text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Explore</span>
                    </button>

                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            setActiveTab('generate')
                        }}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === 'generate' ? 'bg-[#ff0080] text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <Sparkles className="w-6 h-6" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Imagine</span>
                    </button>

                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            setActiveTab('create')
                        }}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === 'create' ? 'bg-[#ff0080] text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <UserPlus className="w-6 h-6" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Create</span>
                    </button>

                    <button
                        onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                            setActiveTab('profile')
                        }}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-[2rem] transition-all duration-300 ${activeTab === 'profile' ? 'bg-[#ff0080] text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                        <User className="w-6 h-6" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
                    </button>
                </div>
            </div>

            {/* Bottom Glow Fade */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
        </div>
    )
}
