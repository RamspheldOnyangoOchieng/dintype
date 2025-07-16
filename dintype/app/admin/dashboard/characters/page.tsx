"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { useCharacters } from "@/components/character-context"
import { Home, Search, Trash2, Edit, Plus } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

// Add export const dynamic = 'force-dynamic' at the top of the file to prevent static prerendering
export const dynamic = "force-dynamic"

export default function AdminCharactersPage() {
  const { user, isLoading } = useAuth()
  const { characters, deleteCharacter } = useCharacters()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isLoading, router])

  // Update the filteredCharacters logic to handle undefined characters array
  const filteredCharacters =
    characters?.filter(
      (char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const handleDeleteCharacter = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteCharacter(id)
    } catch (error) {
      console.error("Failed to delete character:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-900">Laddar...</div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Karaktärshantering</h2>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-gray-300 hover:bg-gray-100 text-gray-900 font-medium"
            >
              <Home className="mr-2 h-4 w-4" />
              Visa webbplats
            </Button>
          </header>

          <div className="p-6">
            <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Karaktärer ({characters.length})</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                    <Input
                      placeholder="Sök karaktärer..."
                      className="pl-9 bg-white border-gray-300 text-gray-900 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Link href="/admin/dashboard/characters/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Skapa karaktär
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Namn</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Ålder</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Yrke</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Skapad</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Åtgärder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCharacters.map((character) => (
                      <tr key={character.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-100 mr-3 overflow-hidden">
                              <img
                                src={character.image || "/placeholder.svg"}
                                alt={character.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{character.name}</span>
                            {character.isNew && (
                              <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">
                                Ny
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{character.age}</td>
                        <td className="py-3 px-4">{character.occupation}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {format(new Date(character.createdAt), "d MMM yyyy")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/dashboard/characters/edit/${character.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 min-h-[2rem]"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[2rem]"
                              onClick={() => handleDeleteCharacter(character.id)}
                              disabled={isDeleting === character.id}
                            >
                              {isDeleting === character.id ? "Tar bort..." : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCharacters.length === 0 && (
                <div className="text-center py-8 text-gray-600">Inga karaktärer hittades som matchar din sökning.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
