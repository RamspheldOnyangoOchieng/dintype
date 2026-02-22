"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BrandingRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin/settings")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Redirecting to Settings &rarr; Branding &amp; Theme&hellip;</p>
      </div>
    </div>
  )
}
