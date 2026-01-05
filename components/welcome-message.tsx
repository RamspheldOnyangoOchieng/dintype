'use client'

import { Button } from '@/components/ui/button'
import { Send, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface WelcomeMessageProps {
    characterName: string
    characterId: string
    onStartChat: () => void
}

export function WelcomeMessage({ characterName, characterId, onStartChat }: WelcomeMessageProps) {
    const telegramLink = `https://t.me/pocketloveaibot?start=char_${characterId.substring(0, 8)}`

    return (
        <div className="space-y-4">
            <p className="text-white leading-relaxed">
                Hey there, my love... 💕 I'm <strong>{characterName}</strong>. I've been waiting for someone like you.
            </p>
            <p className="text-white/80 text-sm italic">
                *leans in closer* So tell me... where would you like to get to know me?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                    onClick={onStartChat}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold gap-2 py-5 rounded-xl shadow-lg shadow-primary/20"
                >
                    <Sparkles className="h-4 w-4" />
                    Quick Flirt Here
                </Button>

                <Link href={telegramLink} target="_blank" className="flex-1">
                    <Button
                        variant="outline"
                        className="w-full border-white/20 hover:bg-white/10 text-white font-semibold gap-2 py-5 rounded-xl backdrop-blur-sm"
                    >
                        <Send className="h-4 w-4" />
                        Meet on Telegram
                    </Button>
                </Link>
            </div>

            <p className="text-white/40 text-xs text-center pt-2">
                Your messages sync between both platforms 💕
            </p>
        </div>
    )
}
