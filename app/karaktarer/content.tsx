"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { useTranslations } from "@/lib/use-translations"
import { useCharacters } from "@/components/character-context"
import { CharacterGrid } from "@/components/character-grid"

export function CharactersContent() {
  const { t } = useTranslations()
  const { characters, isLoading } = useCharacters()
  
  // Only show public characters in the discovery feed
  const publicCharacters = characters.filter(char => char.isPublic)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("characters.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("characters.description")}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all">
          <Link href="/skapa-karaktar">
            <Plus className="mr-2 h-5 w-5" />
            {t("characters.createCharacter")}
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">{t("db.loading") || "Laddar karaktärer..."}</p>
        </div>
      ) : publicCharacters.length > 0 ? (
        <CharacterGrid characters={publicCharacters} />
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10">
          <p className="text-muted-foreground">{t("characterList.noCharacters") || "Inga karaktärer hittades."}</p>
        </div>
      )}
    </div>
  )
}
