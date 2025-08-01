import { Suspense } from "react"
import Link from "next/link"
import { CharacterList } from "@/components/character-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getCharacters } from "@/app/actions/character-actions"
import { getPageSeo } from "@/lib/get-seo"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/characters")

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.split(",").map((k) => k.trim()),
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
    },
  }
}

async function CharactersContent() {
  const characters = await getCharacters()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Characters</h1>
        <Button asChild>
          <Link href="/characters/new">
            <Plus className="mr-2 h-4 w-4" />
            New Character
          </Link>
        </Button>
      </div>

      <CharacterList characters={characters} />
    </div>
  )
}

export default function CharactersPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={<div>Loading characters...</div>}>
        <CharactersContent />
      </Suspense>
    </div>
  )
}
