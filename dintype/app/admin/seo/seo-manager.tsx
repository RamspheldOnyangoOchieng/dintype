"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/components/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import SeoPreview from "@/components/seo-preview"
import {
  getGlobalSeoFromLocalStorage,
  getPageSeoFromLocalStorage,
  saveGlobalSeoToLocalStorage,
  saveSpecificPageSeoToLocalStorage,
  deletePageSeoFromLocalStorage,
  getDefaultSeoData,
} from "@/lib/local-storage-seo"

export default function SeoManager() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const [globalSeo, setGlobalSeo] = useState({
    siteName: "AI Character Explorer",
    siteUrl: "https://ai-character-explorer.vercel.app",
    titleTemplate: "%s | AI Character Explorer",
    description: "Explore and chat with AI characters in a fun and interactive way.",
    keywords: "AI, characters, chat, virtual companions, artificial intelligence",
    ogImage: "/og-image.jpg",
    twitterHandle: "@aicharacterexplorer",
  })

  const [pageSeo, setPageSeo] = useState<Record<string, any>>({
    "/": {
      title: "AI Character Explorer",
      description: "Explore and chat with AI characters in a fun and interactive way.",
      keywords: "AI, characters, chat, virtual companions, artificial intelligence",
      ogImage: "/og-image.jpg",
    },
  })

  const [selectedPage, setSelectedPage] = useState("/")
  const [newPagePath, setNewPagePath] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveCount, setSaveCount] = useState(0) // Add a counter to force refreshes

  // Log language for debugging
  useEffect(() => {
    console.log("[SEO Manager] Current language:", language)
  }, [language])

  // Load SEO data function
  const loadSeoData = useCallback(async () => {
    try {
      setIsInitialLoading(true)
      console.log("[SEO Manager] Loading SEO data...")

      // Get data from localStorage
      const globalSeoData = getGlobalSeoFromLocalStorage()
      const pageSeoData = getPageSeoFromLocalStorage()

      // If localStorage has data, use it
      if (globalSeoData) {
        console.log("[SEO Manager] Using global SEO data from localStorage:", globalSeoData)
        setGlobalSeo(globalSeoData)
      } else {
        // Otherwise use default data
        console.log("[SEO Manager] Using default global SEO data")
        setGlobalSeo(getDefaultSeoData().global)
      }

      // If localStorage has page data, use it
      if (pageSeoData) {
        console.log("[SEO Manager] Using page SEO data from localStorage:", pageSeoData)
        setPageSeo(pageSeoData)
      } else {
        // Otherwise use default data
        console.log("[SEO Manager] Using default page SEO data")
        setPageSeo(getDefaultSeoData().pages)
      }

      // Set selected page to first page if it exists
      const pages = pageSeoData || getDefaultSeoData().pages
      if (Object.keys(pages).length > 0) {
        setSelectedPage(Object.keys(pages)[0])
      }
    } catch (error) {
      console.error("[SEO Manager] Error loading SEO data:", error)
      toast({
        title: t("admin.seoLoadError"),
        description: t("admin.seoLoadErrorDescription") || "Failed to load SEO data",
        variant: "destructive",
      })
    } finally {
      setIsInitialLoading(false)
    }
  }, [t, toast])

  // Load SEO data on component mount
  useEffect(() => {
    loadSeoData()
  }, [loadSeoData, saveCount]) // Add saveCount to dependencies to force refresh after save

  const handleGlobalSeoChange = (field: string, value: string) => {
    setGlobalSeo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePageSeoChange = (field: string, value: string) => {
    setPageSeo((prev) => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [field]: value,
      },
    }))
  }

  const handleGlobalSeoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("[SEO Manager] Submitting global SEO data:", globalSeo)

      // Save to localStorage
      saveGlobalSeoToLocalStorage(globalSeo)

      // Set last saved timestamp
      setLastSaved(new Date())

      // Increment save count to force a refresh
      setSaveCount((prev) => prev + 1)

      toast({
        title: t("admin.seoSaveSuccess"),
        description: t("admin.seoSaveSuccessDescription") || "SEO settings saved successfully",
      })
    } catch (error) {
      console.error("[SEO Manager] Error saving global SEO settings:", error)
      toast({
        title: t("admin.seoSaveError"),
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageSeoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("[SEO Manager] Submitting page SEO data:", pageSeo[selectedPage])

      // Save to localStorage
      saveSpecificPageSeoToLocalStorage(selectedPage, pageSeo[selectedPage])

      // Set last saved timestamp
      setLastSaved(new Date())

      // Increment save count to force a refresh
      setSaveCount((prev) => prev + 1)

      toast({
        title: t("admin.seoSaveSuccess"),
        description: t("admin.seoSaveSuccessDescription") || "SEO settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving page SEO settings:", error)
      toast({
        title: t("admin.seoSaveError"),
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newPagePath) {
      toast({
        title: t("admin.seoPagePathRequired") || "Page path required",
        variant: "destructive",
      })
      return
    }

    // Ensure path starts with /
    const path = newPagePath.startsWith("/") ? newPagePath : `/${newPagePath}`

    setIsLoading(true)

    try {
      // Create new page SEO data
      const newPageSeo = {
        title: path.split("/").pop() || "New Page",
        description: "",
        keywords: "",
        ogImage: globalSeo.ogImage,
      }

      // Save to localStorage
      saveSpecificPageSeoToLocalStorage(path, newPageSeo)

      // Add to local state
      setPageSeo((prev) => ({
        ...prev,
        [path]: newPageSeo,
      }))

      // Select the new page
      setSelectedPage(path)

      // Clear the input
      setNewPagePath("")

      // Set last saved timestamp
      setLastSaved(new Date())

      // Increment save count to force a refresh
      setSaveCount((prev) => prev + 1)

      toast({
        title: t("admin.seoPageAdded") || "Page added",
        description: t("admin.seoPageAddedDescription") || "Page SEO settings added successfully",
      })
    } catch (error) {
      console.error("Error adding page SEO settings:", error)
      toast({
        title: t("admin.seoAddPageError") || "Error adding page",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePage = async () => {
    if (!confirm(t("admin.seoDeletePageConfirm") || "Are you sure you want to delete this page?")) {
      return
    }

    setIsLoading(true)

    try {
      // Delete from localStorage
      deletePageSeoFromLocalStorage(selectedPage)

      // Remove from local state
      const newPageSeo = { ...pageSeo }
      delete newPageSeo[selectedPage]
      setPageSeo(newPageSeo)

      // Select another page if available
      if (Object.keys(newPageSeo).length > 0) {
        setSelectedPage(Object.keys(newPageSeo)[0])
      } else {
        setSelectedPage("/")
      }

      // Set last saved timestamp
      setLastSaved(new Date())

      // Increment save count to force a refresh
      setSaveCount((prev) => prev + 1)

      toast({
        title: t("admin.seoPageDeleted") || "Page deleted",
        description: t("admin.seoPageDeletedDescription") || "Page SEO settings deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting page SEO settings:", error)
      toast({
        title: t("admin.seoDeletePageError") || "Error deleting page",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">SEO-inställningar</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">SEO-inställningar</h1>

      {lastSaved && (
        <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-sm">
          Senast sparad: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="global">Globala SEO-inställningar</TabsTrigger>
          <TabsTrigger value="pages">Sidinställningar</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Globala SEO-inställningar</CardTitle>
                <CardDescription>Konfigurera globala SEO-inställningar för din webbplats</CardDescription>
              </CardHeader>
              <form onSubmit={handleGlobalSeoSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Webbplatsnamn</Label>
                    <Input
                      id="siteName"
                      value={globalSeo.siteName}
                      onChange={(e) => handleGlobalSeoChange("siteName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Webbplats-URL</Label>
                    <Input
                      id="siteUrl"
                      value={globalSeo.siteUrl}
                      onChange={(e) => handleGlobalSeoChange("siteUrl", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titleTemplate">Titelmall</Label>
                    <Input
                      id="titleTemplate"
                      value={globalSeo.titleTemplate}
                      onChange={(e) => handleGlobalSeoChange("titleTemplate", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Använd %s för att infoga sidtiteln</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Beskrivning</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={globalSeo.description}
                      onChange={(e) => handleGlobalSeoChange("description", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Nyckelord</Label>
                    <Input
                      id="keywords"
                      value={globalSeo.keywords}
                      onChange={(e) => handleGlobalSeoChange("keywords", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Kommaseparerade nyckelord</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ogImage">OG-bild</Label>
                    <Input
                      id="ogImage"
                      value={globalSeo.ogImage}
                      onChange={(e) => handleGlobalSeoChange("ogImage", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      URL till bilden som används för delning på sociala medier
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterHandle">Twitter-konto</Label>
                    <Input
                      id="twitterHandle"
                      value={globalSeo.twitterHandle}
                      onChange={(e) => handleGlobalSeoChange("twitterHandle", e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Laddar..." : "Spara"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO-förhandsgranskning</CardTitle>
                <CardDescription>Förhandsgranska hur din webbplats kommer att visas i sökresultat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-white dark:bg-gray-900">
                  <SeoPreview
                    title={globalSeo.siteName}
                    url={globalSeo.siteUrl}
                    description={globalSeo.description}
                    titleTemplate={globalSeo.titleTemplate}
                    siteName={globalSeo.siteName}
                    ogImage={globalSeo.ogImage}
                  />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>
                    Detta är en förhandsgranskning av hur din webbplats kan visas i sökresultat och delningar på sociala
                    medier.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Sidor</CardTitle>
                <CardDescription>Hantera SEO-inställningar för enskilda sidor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <form onSubmit={handleAddPage} className="space-y-2">
                    <Label htmlFor="newPagePath">Ny sidsökväg</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="newPagePath"
                        value={newPagePath}
                        onChange={(e) => setNewPagePath(e.target.value)}
                        placeholder="/om-oss"
                      />
                      <Button type="submit" disabled={isLoading || !newPagePath}>
                        Lägg till
                      </Button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    <Label>Befintliga sidor</Label>
                    <div className="space-y-1">
                      {Object.keys(pageSeo).length === 0 ? (
                        <p className="text-sm text-muted-foreground">Inga sidor ännu</p>
                      ) : (
                        Object.keys(pageSeo).map((page) => (
                          <Button
                            key={page}
                            variant={selectedPage === page ? "default" : "outline"}
                            className="w-full justify-start text-left"
                            onClick={() => setSelectedPage(page)}
                          >
                            {page}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {Object.keys(pageSeo).length > 0 && (
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Redigera sida: {selectedPage}</CardTitle>
                  <CardDescription>Redigera SEO-inställningar för denna sida</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <form onSubmit={handlePageSeoSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Sidtitel</Label>
                          <Input
                            id="title"
                            value={pageSeo[selectedPage]?.title || ""}
                            onChange={(e) => handlePageSeoChange("title", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="page-description">Sidbeskrivning</Label>
                          <Textarea
                            id="page-description"
                            rows={3}
                            value={pageSeo[selectedPage]?.description || ""}
                            onChange={(e) => handlePageSeoChange("description", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="page-keywords">Sidnyckelord</Label>
                          <Input
                            id="page-keywords"
                            value={pageSeo[selectedPage]?.keywords || ""}
                            onChange={(e) => handlePageSeoChange("keywords", e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">Kommaseparerade nyckelord</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="page-ogImage">Sid-OG-bild</Label>
                          <Input
                            id="page-ogImage"
                            value={pageSeo[selectedPage]?.ogImage || ""}
                            onChange={(e) => handlePageSeoChange("ogImage", e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            URL till bilden som används för delning på sociala medier
                          </p>
                        </div>

                        <div className="flex justify-between">
                          <Button type="button" variant="destructive" onClick={handleDeletePage} disabled={isLoading}>
                            Ta bort
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Laddar..." : "Spara"}
                          </Button>
                        </div>
                      </form>
                    </div>

                    <div>
                      <div className="mb-2">
                        <h3 className="text-lg font-medium">SEO-förhandsgranskning</h3>
                        <p className="text-sm text-muted-foreground">
                          Förhandsgranska hur denna sida kommer att visas i sökresultat
                        </p>
                      </div>
                      <div className="p-4 border rounded-md bg-white dark:bg-gray-900">
                        <SeoPreview
                          title={pageSeo[selectedPage]?.title || ""}
                          url={`${globalSeo.siteUrl}${selectedPage}`}
                          description={pageSeo[selectedPage]?.description || ""}
                          titleTemplate={globalSeo.titleTemplate}
                          siteName={globalSeo.siteName}
                          ogImage={pageSeo[selectedPage]?.ogImage || ""}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
