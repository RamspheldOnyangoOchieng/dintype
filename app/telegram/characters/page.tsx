"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import {
    Loader2,
    Users,
    CheckCircle2,
    X,
    ChevronDown,
    ChevronUp,
    MessageCircle,
    Compass,
    ShoppingBag,
    ListTodo,
    User,
    Plus,
    Zap,
    Heart,
    MoreHorizontal
} from "lucide-react"

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

type ViewMode = 'full' | 'mini' | 'collapsed'

export default function TelegramMiniAppPage() {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'female' | 'male'>("female")
    const [selectingId, setSelectingId] = useState<string | null>(null)
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
    const [viewMode, setViewMode] = useState<ViewMode>('full')
    const [tokens, setTokens] = useState(12)
    const [diamonds, setDiamonds] = useState(0)
    const [activeTab, setActiveTab] = useState<'explore' | 'chats' | 'shop' | 'tasks' | 'profile'>('explore')
    const [telegramUser, setTelegramUser] = useState<any>(null)
    const [viewportHeight, setViewportHeight] = useState<number | null>(null)

    const supabase = createClient()

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const { data, error } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('is_public', true)

                if (data) {
                    setCharacters(data as Character[])
                }
            } catch (err) {
                console.error("Error fetching characters:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchCharacters()

        // Initialize Telegram WebApp - DON'T fully expand to leave Telegram header visible
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp
            tg.ready()
            // Don't call tg.expand() - this leaves the Telegram header visible!
            // tg.expand() <- removed on purpose

            // Match the dark theme
            tg.setHeaderColor('#000000')
            tg.setBackgroundColor('#000000')

            // Get the available viewport height from Telegram
            const updateViewport = () => {
                if (tg.viewportStableHeight) {
                    setViewportHeight(tg.viewportStableHeight)
                } else if (tg.viewportHeight) {
                    setViewportHeight(tg.viewportHeight)
                }
            }

            updateViewport()
            tg.onEvent('viewportChanged', updateViewport)

            // Get telegram user data
            if (tg.initDataUnsafe?.user) {
                setTelegramUser(tg.initDataUnsafe.user)
            }

            // Handle back button
            tg.BackButton.onClick(() => {
                if (viewMode === 'full') {
                    setViewMode('collapsed')
                } else {
                    tg.close()
                }
            })
        }
    }, [])

    // Filter characters by gender
    const filteredCharacters = characters.filter(char => {
        if (filter === 'female') {
            return !char.gender || char.gender === 'female' || char.category === 'girls'
        }
        return char.gender === 'male' || char.category === 'boys'
    })

    const handleSelect = async (character: Character) => {
        if (selectingId) return
        setSelectingId(character.id)
        setSelectedCharacter(character)

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
                // Flash success state then collapse
                setTimeout(() => {
                    setViewMode('collapsed')
                    setSelectingId(null)
                }, 800)
            }
        } catch (err) {
            console.error("Selection error:", err)
            setSelectingId(null)
        }
    }

    const handleExpandApp = () => {
        // Note: We intentionally don't call expand() here to keep the Telegram header visible
        // The app appears as a panel within Telegram rather than fullscreen
        setViewMode('full')
    }

    const handleCollapseApp = () => {
        setViewMode('collapsed')
    }

    const handleMiniMode = () => {
        setViewMode('mini')
    }

    // Get username for display
    const userName = telegramUser?.first_name || "Player"

    // Loading State
    if (loading) {
        return (
            <div
                className="flex flex-col items-center justify-center bg-black"
                style={{ height: viewportHeight ? `${viewportHeight}px` : 'calc(100vh - 60px)' }}
            >
                <Loader2 className="w-8 h-8 text-[#ff0080] animate-spin" />
                <p className="mt-4 text-gray-400 font-medium tracking-tight">Loading...</p>
            </div>
        )
    }

    // Collapsed View - Just profile picture bubble
    if (viewMode === 'collapsed' && selectedCharacter) {
        return (
            <div
                className="fixed bottom-4 right-4 z-50 cursor-pointer"
                onClick={handleExpandApp}
            >
                <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-[#ff0080] shadow-[0_0_20px_rgba(255,0,128,0.5)] animate-pulse">
                        <Image
                            src={selectedCharacter.image_url || selectedCharacter.image || "/placeholder.svg"}
                            alt={selectedCharacter.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff0080] rounded-full flex items-center justify-center">
                        <ChevronUp className="w-3 h-3 text-white" />
                    </div>
                </div>
            </div>
        )
    }

    // Mini View - Show partial character list
    if (viewMode === 'mini') {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-black rounded-t-[2rem] shadow-[0_-10px_50px_rgba(0,0,0,0.8)] z-50 max-h-[60vh] overflow-hidden">
                {/* Header with drag handle */}
                <div
                    className="flex items-center justify-between px-6 py-4 border-b border-white/10 cursor-pointer"
                    onClick={handleExpandApp}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-white/80">Close</span>
                    </div>

                    <div className="text-center">
                        <h2 className="text-white font-bold">PocketLove AI</h2>
                        <span className="text-xs text-white/50">mini app</span>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleCollapseApp(); }}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                    >
                        <ChevronDown className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* User & Tokens */}
                <div className="flex justify-between items-center px-6 py-3">
                    <div>
                        <span className="text-[#ff0080] text-xs uppercase font-bold">Hello</span>
                        <span className="text-white/50 mx-1">|</span>
                        <span className="text-white text-xs font-bold">{userName}</span>
                        <p className="text-white/40 text-[10px]">Let's chat!</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#1a1a1a] rounded-full px-3 py-1.5 gap-1">
                            <Heart className="w-3 h-3 text-cyan-400" />
                            <span className="text-white text-xs font-bold">{diamonds}</span>
                        </div>
                        <div className="flex items-center bg-[#1a1a1a] rounded-full px-3 py-1.5 gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span className="text-white text-xs font-bold">{tokens}</span>
                        </div>
                        <button className="w-7 h-7 rounded-full bg-[#ff0080] flex items-center justify-center">
                            <Plus className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Characters Title */}
                <div className="px-6 py-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-black text-white">Characters</h1>
                        <Users className="w-5 h-5 text-white/50" />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-6 py-2">
                    <div className="flex bg-[#111] p-1 rounded-xl">
                        <button
                            onClick={() => setFilter('female')}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${filter === 'female'
                                ? 'bg-gradient-to-r from-[#ff0080] to-[#7928ca] text-white'
                                : 'text-gray-500'
                                }`}
                        >
                            ♀ FEMALE
                        </button>
                        <button
                            onClick={() => setFilter('male')}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${filter === 'male'
                                ? 'bg-[#222] text-white'
                                : 'text-gray-500'
                                }`}
                        >
                            ♂ MALE
                        </button>
                    </div>
                </div>

                {/* Characters Grid - Limited in mini mode */}
                <div className="px-4 py-4 grid grid-cols-2 gap-3 overflow-y-auto max-h-[35vh]">
                    {filteredCharacters.slice(0, 4).map((char) => (
                        <div
                            key={char.id}
                            onClick={() => handleSelect(char)}
                            className={`group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0a0a0a] border-2 transition-all duration-300 active:scale-95 ${selectingId === char.id ? 'border-[#ff0080]' : 'border-white/5'
                                }`}
                        >
                            <Image
                                src={char.image_url || char.image || "/placeholder.svg"}
                                alt={char.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                            {selectingId === char.id && (
                                <div className="absolute inset-0 bg-[#ff0080]/30 flex items-center justify-center z-20">
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h3 className="text-lg font-black text-white leading-none">{char.name}</h3>
                                <p className="text-gray-400 text-[9px] font-medium mt-0.5 truncate">
                                    {char.relationship || char.description?.slice(0, 30) || 'Companion'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const [showMoreMenu, setShowMoreMenu] = useState(false)

    // Full View - Complete app experience (covers most of screen but leaves Telegram header visible)
    return (
        <div
            className="bg-black flex flex-col overflow-x-hidden select-none relative"
            style={{
                height: viewportHeight ? `${viewportHeight}px` : 'calc(100vh - 60px)',
                maxHeight: viewportHeight ? `${viewportHeight}px` : 'calc(100vh - 60px)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/95 backdrop-blur z-30 flex-shrink-0">
                <button
                    onClick={handleCollapseApp}
                    className="text-white hex-primary-text font-medium text-sm hover:opacity-70 transition-opacity"
                >
                    Close
                </button>

                <div className="text-center">
                    <h2 className="text-white font-bold text-sm tracking-tight">PocketLove AI</h2>
                    <p className="text-[10px] text-white/30 font-medium">mini app</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${showMoreMenu ? 'bg-white/20' : 'bg-white/5'}`}
                    >
                        <MoreHorizontal className="w-5 h-5 text-white/80" />
                    </button>

                    {showMoreMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {[
                                { label: 'Settings', icon: User },
                                { label: 'Support', icon: MessageCircle },
                                { label: 'Dark Mode', icon: Zap },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                    onClick={() => setShowMoreMenu(false)}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* User greeting & tokens */}
            <div className="flex justify-between items-center px-6 py-4 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[#ff0080] text-sm font-black uppercase tracking-widest">Hello</span>
                        <span className="text-white/20 mx-0.5">|</span>
                        <span className="text-white text-sm font-black">{userName}</span>
                    </div>
                    <p className="text-white/30 text-[11px] font-medium mt-0.5">Let's chat!</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#111] border border-white/5 rounded-full px-4 py-2 gap-2 shadow-inner">
                        <Heart className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-black">{diamonds}</span>
                    </div>
                    <div className="flex items-center bg-[#111] border border-white/5 rounded-full px-4 py-2 gap-2 shadow-inner">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-black">{tokens}</span>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-[#ff0080] flex items-center justify-center shadow-[0_4px_15px_rgba(255,0,128,0.4)] active:scale-90 transition-transform">
                        <Plus className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pb-24 px-4 overflow-x-hidden">
                {activeTab === 'explore' && (
                    <>
                        <div className="px-2 mb-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-black text-white tracking-tight">Characters</h1>
                                <Users className="w-6 h-6 text-white/40" />
                            </div>
                        </div>

                        <div className="px-2 mb-6">
                            <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5">
                                <button
                                    onClick={() => setFilter('female')}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 ${filter === 'female'
                                        ? 'bg-gradient-to-r from-[#ff0080] to-[#7928ca] text-white shadow-[0_0_20px_rgba(255,0,128,0.4)]'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    ♀ FEMALE
                                </button>
                                <button
                                    onClick={() => setFilter('male')}
                                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all duration-300 ${filter === 'male'
                                        ? 'bg-[#222] text-white border border-white/10'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    ♂ MALE
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {filteredCharacters.map((char) => (
                                <div
                                    key={char.id}
                                    onClick={() => handleSelect(char)}
                                    className={`group relative aspect-[3/4.5] rounded-[2rem] overflow-hidden bg-[#0a0a0a] border-2 transition-all duration-500 active:scale-95 ${selectingId === char.id ? 'border-[#ff0080] shadow-[0_0_30px_rgba(255,0,128,0.3)]' : 'border-white/5'
                                        }`}
                                >
                                    <Image
                                        src={char.image_url || char.image || "/placeholder.svg"}
                                        alt={char.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    {selectingId === char.id && (
                                        <div className="absolute inset-0 bg-[#ff0080]/20 flex items-center justify-center z-20 backdrop-blur-[2px]">
                                            <div className="bg-white rounded-full p-3 shadow-2xl animate-in zoom-in duration-300">
                                                <CheckCircle2 className="w-8 h-8 text-[#ff0080]" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-xl font-black text-white leading-none mb-1">{char.name}</h3>
                                        <p className="text-gray-300 text-[10px] font-bold opacity-90 uppercase tracking-widest truncate">
                                            {char.relationship || char.description?.slice(0, 25) || 'Companion'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'chats' && (
                    <div className="py-10 text-center">
                        <MessageCircle className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">My Conversations</h2>
                        <p className="text-white/40 text-sm px-10">You'll see your active chats here. Select a character to start a new one!</p>
                        <button
                            onClick={() => setActiveTab('explore')}
                            className="mt-6 px-6 py-3 bg-[#ff0080] rounded-full text-white font-bold text-sm"
                        >
                            Explore Characters
                        </button>
                    </div>
                )}

                {activeTab === 'shop' && (
                    <div className="py-6">
                        <h2 className="text-2xl font-black text-white mb-6">Token Store</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: "Basic Pack", tokens: 100, price: "$4.99", color: "from-cyan-500 to-blue-600" },
                                { title: "Value Pack", tokens: 250, price: "$9.99", color: "from-[#ff0080] to-[#7928ca]" },
                                { title: "Pro Pack", tokens: 600, price: "$19.99", color: "from-amber-400 to-orange-600" },
                            ].map((pack, i) => (
                                <div key={i} className={`p-6 rounded-3xl bg-gradient-to-br ${pack.color} relative overflow-hidden`}>
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <h3 className="text-white/80 font-bold uppercase text-xs tracking-widest">{pack.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Zap className="w-6 h-6 text-white" />
                                                <span className="text-3xl font-black text-white">{pack.tokens}</span>
                                            </div>
                                        </div>
                                        <button className="bg-white text-black px-6 py-2 rounded-full font-black text-sm">
                                            {pack.price}
                                        </button>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 opacity-10">
                                        <ShoppingBag className="w-32 h-32 text-white rotate-12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="py-6">
                        <h2 className="text-2xl font-black text-white mb-6">Daily Rewards</h2>
                        <div className="space-y-3">
                            {[
                                { title: "Daily Login", reward: "5 Tokens", done: true },
                                { title: "Talk to 3 characters", reward: "15 Tokens", done: false },
                                { title: "Generate 2 images", reward: "20 Tokens", done: false },
                                { title: "Complete chapter 1", reward: "50 Tokens", done: false },
                            ].map((task, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-[#111] rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.done ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-white/40'}`}>
                                            {task.done ? <CheckCircle2 className="w-5 h-5" /> : <ListTodo className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${task.done ? 'text-white/50' : 'text-white'}`}>{task.title}</h3>
                                            <p className="text-[#ff0080] text-xs font-bold">+{task.reward}</p>
                                        </div>
                                    </div>
                                    {!task.done && (
                                        <button className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white">
                                            GO
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="py-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#ff0080] to-[#7928ca] mx-auto mb-4 border-4 border-white/10 flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-white">{userName}</h2>
                        <p className="text-white/40 mb-8 lowercase">@{telegramUser?.username || 'pocketlove_user'}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                                <Zap className="w-6 h-6 text-[#ff0080] mb-2" />
                                <span className="text-2xl font-black text-white">{tokens}</span>
                                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Tokens</span>
                            </div>
                            <div className="bg-[#111] p-6 rounded-3xl border border-white/5 flex flex-col items-center">
                                <Heart className="w-6 h-6 text-cyan-400 mb-2" />
                                <span className="text-2xl font-black text-white">{diamonds}</span>
                                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Diamonds</span>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-white font-bold transition-all">
                            Account Settings
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-2 pb-8 flex-shrink-0 z-50">
                <div className="flex justify-around items-center">
                    <button
                        onClick={() => setActiveTab('explore')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${activeTab === 'explore' ? 'text-[#ff0080] scale-110' : 'text-white/40'}`}
                    >
                        <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'drop-shadow-[0_0_8px_rgba(255,0,128,0.6)]' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Explore</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('chats')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${activeTab === 'chats' ? 'text-[#ff0080] scale-110' : 'text-white/40'}`}
                    >
                        <MessageCircle className={`w-6 h-6 ${activeTab === 'chats' ? 'drop-shadow-[0_0_8px_rgba(255,0,128,0.6)]' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Chats</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${activeTab === 'shop' ? 'text-[#ff0080] scale-110' : 'text-white/40'}`}
                    >
                        <ShoppingBag className={`w-6 h-6 ${activeTab === 'shop' ? 'drop-shadow-[0_0_8px_rgba(255,0,128,0.6)]' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Shop</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${activeTab === 'tasks' ? 'text-[#ff0080] scale-110' : 'text-white/40'}`}
                    >
                        <ListTodo className={`w-6 h-6 ${activeTab === 'tasks' ? 'drop-shadow-[0_0_8px_rgba(255,0,128,0.6)]' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Tasks</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 ${activeTab === 'profile' ? 'text-[#ff0080] scale-110' : 'text-white/40'}`}
                    >
                        <User className={`w-6 h-6 ${activeTab === 'profile' ? 'drop-shadow-[0_0_8px_rgba(255,0,128,0.6)]' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
