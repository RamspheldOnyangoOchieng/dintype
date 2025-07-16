"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { verifySeoSettings, updateSeoSettingsDirect } from "@/lib/verify-seo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import RefreshButton from "./refresh-button"
import DirectSqlUpdate from "./direct-sql-update"
import LocalStorageDebug from "./local-storage-debug"

export default function DebugSeoPage() {
  const [seoData, setSeoData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updateFields, setUpdateFields] = useState<Record<string, string>>({
    site_name: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_title: "",
    og_description: "",
    og_image: "",
  })
  const [updateResult, setUpdateResult] = useState<any>(null)

  useEffect(() => {
    async function loadSeoData() {
      try {
        setIsLoading(true)
        setError(null)

        const result = await verifySeoSettings()

        if (result.success) {
          setSeoData(result.data)

          // Initialize update fields with current values
          setUpdateFields({
            site_name: result.data.site_name || "",
            meta_title: result.data.meta_title || "",
            meta_description: result.data.meta_description || "",
            meta_keywords: result.data.meta_keywords || "",
            og_title: result.data.og_title || "",
            og_description: result.data.og_description || "",
            og_image: result.data.og_image || "",
          })
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError(String(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadSeoData()
  }, [])

  const handleUpdateField = (field: string, value: string) => {
    setUpdateFields((prev) => ({ ...prev, [field]: value }))
  }

  const handleDirectUpdate = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setUpdateResult(null)

      const result = await updateSeoSettingsDirect(updateFields)

      setUpdateResult(result)

      if (result.success) {
        setSeoData(result.data)

        // Force reload after successful update
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !seoData) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">SEO Debug</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">SEO Debug</h1>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="localStorage">LocalStorage</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="localStorage">
          <LocalStorageDebug />
        </TabsContent>

        <TabsContent value="database">
          <RefreshButton />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <h2 className="text-lg font-semibold mb-2">Error</h2>
              <p>{error}</p>
            </div>
          )}

          {updateResult && updateResult.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              <h2 className="text-lg font-semibold mb-2">Update Successful</h2>
              <p>SEO settings were updated successfully.</p>
            </div>
          )}

          <DirectSqlUpdate />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current SEO Settings</CardTitle>
                <CardDescription>Raw data from the database</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
                  {JSON.stringify(seoData, null, 2)}
                </pre>
              </CardContent>
              <CardFooter>
                <Button onClick={() => window.location.reload()}>Refresh Data</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Direct Update</CardTitle>
                <CardDescription>Update SEO settings directly in the database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={updateFields.site_name}
                    onChange={(e) => handleUpdateField("site_name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={updateFields.meta_title}
                    onChange={(e) => handleUpdateField("meta_title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    rows={3}
                    value={updateFields.meta_description}
                    onChange={(e) => handleUpdateField("meta_description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={updateFields.meta_keywords}
                    onChange={(e) => handleUpdateField("meta_keywords", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_title">OG Title</Label>
                  <Input
                    id="og_title"
                    value={updateFields.og_title}
                    onChange={(e) => handleUpdateField("og_title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_description">OG Description</Label>
                  <Textarea
                    id="og_description"
                    rows={3}
                    value={updateFields.og_description}
                    onChange={(e) => handleUpdateField("og_description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_image">OG Image</Label>
                  <Input
                    id="og_image"
                    value={updateFields.og_image}
                    onChange={(e) => handleUpdateField("og_image", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleDirectUpdate} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Directly"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
