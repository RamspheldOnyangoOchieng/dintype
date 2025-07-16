"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-context"

export default function RobotsEditor() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [robotsContent, setRobotsContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadRobotsContent() {
      try {
        setIsLoading(true)
        const response = await fetch("/robots.txt")
        if (response.ok) {
          const text = await response.text()
          setRobotsContent(text)
        } else {
          // If robots.txt doesn't exist, provide a default template
          setRobotsContent(`User-agent: *
Allow: /

# Disallow admin pages
Disallow: /admin/

# Sitemap location
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || "https://ai-character-explorer.vercel.app"}/sitemap.xml`)
        }
      } catch (error) {
        console.error("Error loading robots.txt:", error)
        toast({
          title: "Error loading robots.txt",
          description: "Could not load the robots.txt file.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadRobotsContent()
  }, [toast])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await fetch("/api/admin/robots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: robotsContent }),
      })

      if (response.ok) {
        toast({
          title: "Robots.txt saved",
          description: "The robots.txt file has been updated successfully.",
        })
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to save robots.txt")
      }
    } catch (error) {
      console.error("Error saving robots.txt:", error)
      toast({
        title: "Error saving robots.txt",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.robotsEditor")}</CardTitle>
        <CardDescription>{t("admin.robotsEditorDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={robotsContent}
          onChange={(e) => setRobotsContent(e.target.value)}
          rows={15}
          className="font-mono text-sm"
          placeholder="User-agent: *
Allow: /"
          disabled={isLoading}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isLoading || isSaving}>
          {isSaving ? t("general.saving") : t("general.save")}
        </Button>
      </CardFooter>
    </Card>
  )
}
