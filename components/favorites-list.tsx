"use client"

import { useState, useEffect } from "react"
import { getFavorites } from "@/app/actions/character-actions"
import { PromptList } from "@/components/prompt-list"
import type { SavedPrompt } from "@/lib/storage-service"
import { Loader2 } from "lucide-react"

export function FavoritesList() {
  const [favorites, setFavorites] = useState<SavedPrompt[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function loadFavorites() {
    try {
      const data = await getFavorites()
      setFavorites(data as SavedPrompt[])
    } catch (error) {
      console.error("Failed to load favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <PromptList prompts={favorites} showCharacterLink={true} />
}
