"use client"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-context"
import { generateTelegramLinkCode } from "@/lib/telegram-actions"

interface MeetOnTelegramButtonProps {
  characterId: string
  characterName: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function MeetOnTelegramButton({
  characterId,
  characterName,
  variant = "outline",
  className
}: MeetOnTelegramButtonProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleMeetOnTelegram = async () => {
    setIsLoading(true)
    try {
      // If user is logged in, use the secure link generator (Server Action)
      if (user?.id) {
        const result = await generateTelegramLinkCode(user.id, characterId, characterName)
        
        if (result.success && result.linkUrl) {
          window.open(result.linkUrl, "_blank")
          toast.success("Opening Telegram... Connect with " + characterName)
        } else {
          toast.error(result.error || "Could not generate Telegram link")
        }
      } else {
        // For guest users, use a simple character deep link (fallback)
        // We can generate this directly on the client
        const guestLink = `https://t.me/pocketloveaibot?start=char_${characterId}`
        window.open(guestLink, "_blank")
        toast.info("Opening Telegram as guest...")
      }
    } catch (error) {
      console.error("Telegram link error:", error)
      toast.error("Something went wrong. Try again.")
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
      Meet on Telegram
    </Button>
  )
}
