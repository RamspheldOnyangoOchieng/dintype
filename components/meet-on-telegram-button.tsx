"use client"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
  const [isLoading, setIsLoading] = useState(false)

  const handleMeetOnTelegram = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/telegram/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, characterName }),
      })

      if (!response.ok) throw new Error("Failed to generate link")

      const data = await response.json()
      if (data.url) {
        window.open(data.url, "_blank")
      } else {
        toast.error("Could not generate Telegram link")
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
