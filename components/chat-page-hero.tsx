"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, MessageCircle, Users } from "lucide-react"
import { useTranslations } from "@/lib/use-translations"

interface ChatPageHeroProps {
  characterCount: number
}

export function ChatPageHero({ characterCount }: ChatPageHeroProps) {
  const { t } = useTranslations()

  return (
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
            <Sparkles className="w-4 h-4" />
            {t("chat.pocketUniverse")}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {t("chat.conversationsTitle")}
          </h1>
          <p className="text-gray-400 max-w-md">
            {t("chat.reconnectDesc")}
          </p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-white/70">
              {t("chat.personalitiesOnline").replace("{{count}}", String(characterCount))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ChatPageRecentHeader() {
  const { t } = useTranslations()
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-primary/20 rounded-xl">
        <MessageCircle className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-white">{t("chat.recentChatsTitle")}</h2>
    </div>
  )
}

export function ChatPageDirectoryHeader() {
  const { t } = useTranslations()

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-xl">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t("chat.discoverAll")}</h2>
      </div>

      <Link
        href="/characters"
        className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-all"
      >
        {t("chat.browseCategory")}
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}
