import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { StorageService } from "@/lib/storage-service"
import { CharacterForm } from "@/components/character-form"
import { Button } from "@/components/ui/button"

interface EditCharacterPageProps {
  params: Promise<{
    id: string
  }>
}

async function EditCharacterContent({ id }: { id: string }) {
  try {
    const character = await StorageService.getCharacter(id)
    if (!character) {
      console.error("Character not found for ID:", id)
      notFound()
    }
    return <CharacterForm character={character} isEditing />
  } catch (error) {
    console.error("Error loading character in EditCharacterContent:", error)
    notFound()
  }
}

export default async function EditCharacterPage({ params }: EditCharacterPageProps) {
  const { id } = await params;

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/10">
          <Link href={`/chatt/${id}`}>
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-white">Edit Character</h1>
      </div>
      <Suspense fallback={<div className="text-white font-medium">Loading character profile...</div>}>
        <EditCharacterContent id={id} />
      </Suspense>
    </div>
  )
}
