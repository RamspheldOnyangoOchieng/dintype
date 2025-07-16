"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-context"

export default function SchemaSettings() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("website")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.schemaMarkup")}</CardTitle>
          <CardDescription>{t("admin.schemaMarkupDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Schema markup helps search engines understand your website content better. The following schema types are
            automatically generated for your site:
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="website">Website</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="breadcrumb">Breadcrumb</TabsTrigger>
            </TabsList>

            <TabsContent value="website">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-xs overflow-auto">
                  {`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AI Character Explorer",
  "url": "https://ai-character-explorer.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ai-character-explorer.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`}
                </pre>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                This schema tells search engines that your site has search functionality and helps with sitelinks search
                box.
              </p>
            </TabsContent>

            <TabsContent value="organization">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-xs overflow-auto">
                  {`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AI Character Explorer",
  "url": "https://ai-character-explorer.vercel.app",
  "logo": "https://ai-character-explorer.vercel.app/logo.png",
  "description": "Explore and chat with AI characters in a fun and interactive way.",
  "sameAs": [
    "https://twitter.com/aicharacterexplorer",
    "https://facebook.com/aicharacterexplorer"
  ]
}`}
                </pre>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                This schema helps search engines understand your organization and can enhance your Knowledge Graph
                entry.
              </p>
            </TabsContent>

            <TabsContent value="breadcrumb">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <pre className="text-xs overflow-auto">
                  {`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://ai-character-explorer.vercel.app"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Characters",
      "item": "https://ai-character-explorer.vercel.app/characters"
    }
  ]
}`}
                </pre>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                This schema helps search engines understand your site structure and can enhance the breadcrumb display
                in search results.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            These schema markups are automatically generated based on your SEO settings and page structure. No manual
            configuration is needed.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
