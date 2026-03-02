"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { initiatePhoneCall } from "@/app/actions/phone-call"

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

export function PhoneCallDialog({ character }: PhoneCallDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Using the server action to keep API keys secure
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await initiatePhoneCall(phoneNumber, character?.name || "AI")

      if (!result.success) {
        throw new Error(result.error || "Failed to initiate call")
      }

      toast({
        title: "Call initiated!",
        description: `${character?.name || "AI"} will call you shortly at ${phoneNumber}`,
      })
      setIsOpen(false)
    } catch (error) {
      console.error("Error initiating call:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to initiate call"

      toast({
        title: "Call failed",
        description: errorMsg,
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
          className="text-muted-foreground hover:text-foreground"
          title="Call this character"
        >
          <Phone className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Calling {character?.name || "AI Character"}...</DialogTitle>
        </DialogHeader>
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
          <p className="text-lg font-medium">{character?.name || "AI Character"}</p>
          <p className="text-sm text-muted-foreground">Calling...</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Enter your phone number
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">Enter your phone number with country code (e.g., +1 for US)</p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initiating call...
              </>
            ) : (
              "Call me"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
