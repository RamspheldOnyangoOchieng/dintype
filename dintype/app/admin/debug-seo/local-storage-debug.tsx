"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getGlobalSeoFromLocalStorage, getPageSeoFromLocalStorage } from "@/lib/local-storage-seo"

export default function LocalStorageDebug() {
  const [globalSeo, setGlobalSeo] = useState<any>(null)
  const [pageSeo, setPageSeo] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Get data from localStorage
    const globalSeoData = getGlobalSeoFromLocalStorage()
    const pageSeoData = getPageSeoFromLocalStorage()

    setGlobalSeo(globalSeoData)
    setPageSeo(pageSeoData)
  }, [refreshKey])

  const handleClearGlobalSeo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai-character-explorer-global-seo")
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleClearPageSeo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai-character-explorer-page-seo")
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleClearAll = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai-character-explorer-global-seo")
      localStorage.removeItem("ai-character-explorer-page-seo")
      setRefreshKey((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LocalStorage Debug</CardTitle>
          <CardDescription>View and manage SEO data stored in localStorage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Global SEO Data</h3>
              {globalSeo ? (
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
                  {JSON.stringify(globalSeo, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground">No global SEO data found in localStorage</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Page SEO Data</h3>
              {pageSeo ? (
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
                  {JSON.stringify(pageSeo, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground">No page SEO data found in localStorage</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setRefreshKey((prev) => prev + 1)}>
              Refresh
            </Button>
            <Button variant="outline" onClick={handleClearGlobalSeo}>
              Clear Global SEO
            </Button>
            <Button variant="outline" onClick={handleClearPageSeo}>
              Clear Page SEO
            </Button>
          </div>
          <Button variant="destructive" onClick={handleClearAll}>
            Clear All
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
