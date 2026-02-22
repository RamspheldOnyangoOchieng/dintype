"use client"

import { useTranslations } from "@/lib/use-translations"

export function LoadingContent() {
  const { t } = useTranslations()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-semibold text-primary mb-2">{t("loading.title")}</h2>
      <p className="text-muted-foreground text-sm animate-pulse">{t("loading.description")}</p>
    </div>
  )
}
