"use client"

import React from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Crown, MessageCircle, CheckCircle2 } from "lucide-react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTranslations } from "@/lib/use-translations"

interface PremiumUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  description: string
  imageSrc?: string
  buttonText?: string
  mode?: 'upgrade' | 'expired' | 'tokens-depleted' | 'message-limit'
}

export function PremiumUpgradeModal({
  isOpen,
  onClose,
  feature = "Unlimited Creation",
  description,
  imageSrc,
  buttonText,
  mode = 'upgrade'
}: PremiumUpgradeModalProps) {
  const router = useRouter()
  const { t } = useTranslations()

  const handleUpgrade = () => {
    onClose()
    router.push("/premium")
  }

  // Set defaults based on mode if not provided
  let displayImage = imageSrc
  let displayDescription = description
  let displayButtonText = buttonText || t("premium.modal.displayButton.upgrade")
  let displayBadge = t("premium.modal.displayBadge.premium")

  if (mode === 'expired') {
    displayImage = displayImage || "https://res.cloudinary.com/ddg02aqiw/image/upload/v1766963043/premium-modals/premium_expired.jpg"
    displayDescription = displayDescription || t("premium.modal.displayDescription.expired")
    displayBadge = t("premium.modal.displayBadge.expired")
  } else if (mode === 'tokens-depleted') {
    displayImage = displayImage || "https://res.cloudinary.com/ddg02aqiw/image/upload/v1766963046/premium-modals/tokens_depleted.jpg"
    displayDescription = displayDescription || t("premium.modal.displayDescription.tokensDepleted")
    displayButtonText = buttonText || t("premium.modal.displayButton.buyTokens")
    displayBadge = t("premium.modal.displayBadge.tokens")
  } else if (mode === 'message-limit') {
    displayImage = displayImage || "https://res.cloudinary.com/ddg02aqiw/image/upload/v1767043020/daily_limit_reached.jpg"
    displayDescription = displayDescription || t("premium.modal.displayDescription.messageLimit")
    displayBadge = t("premium.modal.displayBadge.limitReached")
  } else {
    displayImage = displayImage || "https://res.cloudinary.com/ddg02aqiw/image/upload/v1766963040/premium-modals/premium_upgrade.jpg"
    displayDescription = displayDescription || t("premium.modal.displayDescription.default")
  }

  const benefits = mode === 'tokens-depleted' || mode === 'message-limit'
    ? [
      t("premium.modal.benefit.createAI"),
      t("premium.modal.benefit.highQualityImages"),
      t("premium.modal.benefit.exclusiveVoice"),
      t("premium.modal.benefit.chatFree"),
      t("premium.modal.benefit.easyTopUp")
    ]
    : [
      t("premium.modal.benefit.createVideos"),
      t("premium.modal.benefit.createOwnAI"),
      t("premium.modal.benefit.unlimitedMessaging"),
      t("premium.modal.benefit.removeBlur"),
      t("premium.modal.benefit.freeTokens")
    ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] p-0 gap-0 bg-[#0a0a0a] border-zinc-800/50 overflow-hidden text-white shadow-2xl rounded-3xl">
        <VisuallyHidden.Root>
          <DialogTitle>{displayBadge}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </VisuallyHidden.Root>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-black/40 p-2 opacity-70 transition-all hover:opacity-100 hover:bg-black/60"
        >
          <X className="h-4 w-4 text-white" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left side - Image */}
          <div className="md:w-1/2 relative h-64 md:h-auto group">
            <Image
              src={displayImage}
              alt="Premium Feature"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            {/* Artistic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] hidden md:block opacity-60" />

            {/* Premium Badge */}
            <div className={`absolute top-4 left-4 ${mode === 'expired' ? 'bg-red-500' : 'bg-[#ff4b7d]'} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg`}>
              {displayBadge}
            </div>
          </div>

          {/* Right side - Content */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-[#0a0a0a] relative overflow-hidden">
            {/* Subtle background glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 ${mode === 'expired' ? 'bg-red-500/10' : 'bg-[#ff4b7d]/10'} rounded-full blur-3xl`} />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Crown className={`h-5 w-5 ${mode === 'expired' ? 'text-red-500' : 'text-[#ff4b7d]'}`} />
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                  {mode === 'expired' ? t("premium.modal.title.expired") : mode === 'tokens-depleted' ? t("premium.modal.title.tokens") : t("premium.modal.title.membership")}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white mb-6 leading-tight tracking-tight transition-all duration-500">
                {displayDescription}
              </h2>

              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="bg-[#ccff00]/10 rounded-full p-1 transition-transform group-hover:scale-110">
                      <CheckCircle2 className="h-3 w-3 text-[#ccff00]" />
                    </div>
                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleUpgrade}
                className={`w-full py-6 text-sm font-bold ${mode === 'expired' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#ff4b7d] hover:bg-[#ff4b7d]/90'} text-white rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider`}
              >
                {displayButtonText}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

