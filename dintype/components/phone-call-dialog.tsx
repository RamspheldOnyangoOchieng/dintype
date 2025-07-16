"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Phone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useTranslations } from "@/lib/use-translations"
// Import our custom Button component
import { Button } from "@/components/ui/custom-button"

type PhoneCallDialogProps = {
  character:
    | {
        id: string
        name: string
        image: string
        systemPrompt?: string
        gender?: string
        characterType?: string
      }
    | null
    | undefined
}

// Update the component to use our improved button styling
export function PhoneCallDialog({ character }: PhoneCallDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const [isMuted, setIsMuted] = useState(false)
  const { t } = useTranslations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber.trim()) {
      toast({
        title: t("Phone number required"),
        description: t("Please enter a valid phone number"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const systemPrompt =
        character?.systemPrompt || `You are ${character?.name}, an AI character. Be friendly and engaging.`

      const response = await fetch("/api/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          characterName: character?.name,
          systemPrompt,
          characterType: character?.characterType || (character?.gender === "female" ? "female" : "male"),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Bland AI API error:", data)
        toast({
          title: t("Call failed"),
          description: data.error || t("Failed to initiate call"),
          variant: "destructive",
        })
        return
      }

      toast({
        title: t("Call initiated!"),
        description: t("Character will call you shortly", { name: character?.name, phoneNumber }),
      })

      setIsOpen(false)
      setPhoneNumber("")
    } catch (error) {
      console.error("Error initiating call:", error)
      toast({
        title: t("Call failed"),
        description: error instanceof Error ? error.message : t("Failed to initiate call"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-gray-700"
          title="Call this character"
          aria-label="Call this character"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-[#252525] text-white">
        <DialogHeader>{/* DialogTitle removed as requested */}</DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
            <Image
              src={character?.image || "/placeholder.svg"}
              alt={character?.name || "Character"}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-lg font-medium">{character?.name}</p>
          <p className="text-sm text-muted-foreground">{t("Calling...")}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              {t("Enter your phone number")}
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder={t("+1 (555) 123-4567")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("Enter your phone number with country code (e.g., +1 for US)")}
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#FF4D8D] hover:bg-[#FF3D7D] text-white"
            isLoading={isLoading}
            loadingText={t("Initiating call...")}
            fullWidth
          >
            {t("Call me")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
