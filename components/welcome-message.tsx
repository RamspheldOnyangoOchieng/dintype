'use client'

import { Button } from '@/components/ui/button'
import { Send, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { MeetOnTelegramButton } from './meet-on-telegram-button'
import { useTranslations } from '@/lib/use-translations'
import { FEATURES } from '@/lib/features'

interface WelcomeMessageProps {
    characterName: string
    characterId: string
    onStartChat: () => void
}

export function WelcomeMessage({ characterName, characterId, onStartChat }: WelcomeMessageProps) {
    const { t } = useTranslations()
    const telegramLink = `https://t.me/dintypebot?start=char_${characterId.substring(0, 8)}`

    return (
        <div className="space-y-4">
            <div className="text-white leading-relaxed">
                {t("chat.welcomeGreeting", { name: characterName })}
            </div>
            <p className="text-white/80 text-sm italic">
                {t("chat.welcomeAction")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                    onClick={onStartChat}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-black gap-2 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                    <Sparkles className="h-5 w-5" />
                    {t("chat.chatOnWeb")}
                </Button>

                {FEATURES.ENABLE_TELEGRAM && (
                    <MeetOnTelegramButton
                        characterId={characterId}
                        characterName={characterName}
                        variant="outline"
                        className="flex-1 border-white/20 hover:bg-white/10 text-white font-bold h-auto py-4 rounded-xl backdrop-blur-sm transition-all hover:scale-[1.02]"
                    />
                )}
            </div>

            {FEATURES.ENABLE_TELEGRAM && (
                <p className="text-white/40 text-xs text-center pt-2">
                    {t("chat.syncMessage")}
                </p>
            )}
        </div>
    )
}
