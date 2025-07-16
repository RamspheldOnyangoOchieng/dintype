"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type SchemaData = {
  website: any
  organization: any
  breadcrumb: any
}

export default function SchemaMarkup() {
  const pathname = usePathname()
  const [schemaData, setSchemaData] = useState<SchemaData | null>(null)

  useEffect(() => {
    async function loadSchemaData() {
      try {
        const response = await fetch(`/api/schema?path=${pathname}`)
        if (response.ok) {
          const data = await response.json()
          setSchemaData(data)
        }
      } catch (error) {
        console.error("Error loading schema data:", error)
      }
    }

    loadSchemaData()
  }, [pathname])

  if (!schemaData) return null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.website) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.organization) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData.breadcrumb) }} />
    </>
  )
}
