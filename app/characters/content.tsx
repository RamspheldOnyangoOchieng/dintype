"use client"

import Link from "next/link"
import { CharacterFeed } from "@/components/character-feed"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useTranslations } from "@/lib/use-translations"

export function CharactersContent() {
  const { t } = useTranslations()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("characters.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("characters.description")}</p>
        </div>
        <Button asChild>
          <Link href="/create-character">
            <Plus className="mr-2 h-4 w-4" />
            {t("characters.createCharacter")}
          </Link>
        </Button>
      </div>
      <CharacterFeed />
    </div>
  )
}
