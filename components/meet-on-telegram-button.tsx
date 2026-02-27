"use client"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-context"
import { generateTelegramLinkCode } from "@/lib/telegram-actions"
import { useTranslations } from "@/lib/use-translations"

interface MeetOnTelegramButtonProps {
  characterId: string
  characterName: string
  isStoryMode?: boolean
  chapter?: number
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function MeetOnTelegramButton({
  characterId,
  characterName,
  isStoryMode,
  chapter,
  variant = "outline",
  className
}: MeetOnTelegramButtonProps) {
  const { user } = useAuth()
  const { t } = useTranslations()
  const [isLoading, setIsLoading] = useState(false)

  const handleMeetOnTelegram = async () => {
    setIsLoading(true)
    try {
      // If user is logged in, use the secure link generator (Server Action)
      if (user?.id) {
        const result = await generateTelegramLinkCode(user.id, characterId, characterName, { isStoryMode, chapter })

        if (result.success && result.linkUrl) {
          window.open(result.linkUrl, "_blank")
          toast.success(t("chat.openingTelegramConnect", { name: characterName }))
        } else {
          toast.error(t("chat.couldNotGenerateLink"))
        }
      } else {
        // For guest users, use a simple character deep link (fallback)
        // We can generate this directly on the client
        const guestLink = `https://t.me/dintypebot?start=char_${characterId}`
        window.open(guestLink, "_blank")
        toast.info(t("chat.openingTelegramGuest"))
      }
    } catch (error) {
      console.error("Telegram link error:", error)
      toast.error(t("status.failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleMeetOnTelegram}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Send className="mr-2 h-5 w-5" />
      )}
      {t("chat.meetOnTelegram")}
    </Button>
  )
}
