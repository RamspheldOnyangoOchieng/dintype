"use client"

import { FavoritesList } from "@/components/favorites-list"
import { useTranslations } from "@/lib/use-translations"

export function FavoritesContent() {
  const { t } = useTranslations()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("favorites.title")}</h1>
      <FavoritesList />
    </div>
  )
}
