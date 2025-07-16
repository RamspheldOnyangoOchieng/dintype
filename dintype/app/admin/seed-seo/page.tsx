"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { seedPageSeo } from "@/lib/seed-page-seo"

export default function SeedSeoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleSeedPageSeo = async () => {
    setIsLoading(true)
    try {
      const result = await seedPageSeo()
      setResult(result)
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Seed SEO Data</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seed Page SEO Data</CardTitle>
          <CardDescription>
            This will seed the page_seo table with default data for common pages. This is only needed once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This action will add default SEO data for the following pages:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Home page (/)</li>
            <li>Characters page (/characters)</li>
            <li>Chat page (/chat)</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Note: This will only add data if the page_seo table is empty. It will not overwrite existing data.
          </p>

          {result && (
            <div
              className={`mt-4 p-3 rounded-md ${result.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {result.success ? (
                <p>{result.message}</p>
              ) : (
                <div>
                  <p className="font-semibold">Error:</p>
                  <p>{result.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedPageSeo} disabled={isLoading}>
            {isLoading ? "Seeding..." : "Seed Page SEO Data"}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6">
        <Button variant="outline" onClick={() => (window.location.href = "/admin/seo")}>
          Back to SEO Settings
        </Button>
      </div>
    </div>
  )
}
