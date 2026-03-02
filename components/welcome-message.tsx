'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { MeetOnTelegramButton } from './meet-on-telegram-button'
import { useTranslations } from '@/lib/use-translations'
import { FEATURES } from '@/lib/features'

interface WelcomeMessageProps {
    characterName: string
    characterId: string
    galleryImages?: string[]
    onStartChat: () => void
}

export function WelcomeMessage({ characterName, characterId, galleryImages = [], onStartChat }: WelcomeMessageProps) {
    const { t } = useTranslations()
    const telegramLink = `https://t.me/dintypebot?start=char_${characterId.substring(0, 8)}`

    // Pick a random image from gallery, if empty use a placeholder
    const randomImage = useMemo(() => {
        if (galleryImages.length === 0) return "/placeholder.svg"
        return galleryImages[Math.floor(Math.random() * galleryImages.length)]
    }, [galleryImages])

    return (
        <div className="space-y-4">
            <div className="text-white leading-relaxed">
                {t("chat.welcomeGreeting", { name: characterName })}
            </div>
            <p className="text-white/80 text-sm italic">
                {t("chat.welcomeAction")}
            </p>

            <div className="pt-2 text-center group">
                <div
                    onClick={onStartChat}
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                    <img
                        src={randomImage}
                        alt={characterName}
                        className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <p className="text-white font-medium drop-shadow-lg flex items-center justify-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            {t("chat.loveCaption" as any)}
                        </p>
                    </div>
                </div>

                {FEATURES.ENABLE_TELEGRAM && (
                    <div className="mt-4 flex flex-col gap-3">
                        <MeetOnTelegramButton
                            characterId={characterId}
                            characterName={characterName}
                            variant="outline"
                            className="w-full border-white/20 hover:bg-white/10 text-white font-bold h-auto py-4 rounded-xl backdrop-blur-sm transition-all hover:scale-[1.02]"
                        />
                        <p className="text-white/40 text-xs">
                            {t("chat.syncMessage")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
