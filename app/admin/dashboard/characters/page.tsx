"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { useCharacters } from "@/components/character-context"
import { Home, Search, Trash2, Edit, Plus, Video, BookOpen } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { CharacterHoverVideoModal } from "@/components/character-hover-video-modal"

// Add export const dynamic = 'force-dynamic' at the top of the file to prevent static prerendering
export const dynamic = "force-dynamic"

export default function AdminCharactersPage() {
  const { user, isLoading } = useAuth()
  const { characters, deleteCharacter, refreshCharacters } = useCharacters()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

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

  const handleOpenVideoModal = (character: any) => {
    setSelectedCharacter(character)
    setIsVideoModalOpen(true)
  }

  const handleVideoSuccess = () => {
    refreshCharacters()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto min-w-0">
          <header className="bg-[#1A1A1A] border-b border-[#252525] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h2 className="text-xl font-bold">Character Management</h2>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              View Site
            </Button>
          </header>

          <div className="p-2 md:p-6">
            <div className="bg-[#1A1A1A] rounded-xl p-4 md:p-6 mb-6 overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-lg font-medium">Characters ({characters.length})</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search characters..."
                      className="pl-9 bg-[#252525] border-[#333] text-white w-full h-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Link href="/admin/dashboard/characters/create" className="w-full sm:w-auto block">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto h-10 px-6 whitespace-nowrap">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Character
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="w-full overflow-x-auto pb-4 max-w-[calc(100vw-32px)] md:max-w-full">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#252525]">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Age</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Occupation</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Hover Video</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Created</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCharacters.map((character) => (
                      <tr key={character.id} className="border-b border-[#252525] hover:bg-[#252525]/50 group">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#252525] mr-3 overflow-hidden shrink-0">
                              <img
                                src={character.image || "/placeholder.svg"}
                                alt={character.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="truncate max-w-[120px] sm:max-w-none font-medium">{character.name}</span>
                            {character.isNew && (
                              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full shrink-0">
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{character.age}</td>
                        <td className="py-3 px-4">{character.occupation}</td>
                        <td className="py-3 px-4">
                          {character.videoUrl ? (
                            <span className="text-green-400 text-sm">✅ Has Video</span>
                          ) : (
                            <span className="text-gray-500 text-sm">❌ No Video</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {format(new Date(character.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={character.videoUrl
                                ? "text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                                : "text-gray-400 hover:text-gray-300 hover:bg-gray-900/20"
                              }
                              onClick={() => handleOpenVideoModal(character)}
                              title={character.videoUrl ? "Regenerate hover video" : "Generate hover video"}
                            >
                              <Video className="h-4 w-4" />
                            </Button>
                            <Link href={`/admin/dashboard/characters/${character.id}/storyline`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                                title="Manage Storyline"
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/dashboard/characters/edit/${character.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => handleDeleteCharacter(character.id)}
                              disabled={isDeleting === character.id}
                            >
                              {isDeleting === character.id ? "Deleting..." : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCharacters.length === 0 && (
                <div className="text-center py-8 text-gray-400">No characters found matching your search.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Video Modal */}
      <CharacterHoverVideoModal
        character={selectedCharacter}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSuccess={handleVideoSuccess}
      />
    </div>
  )
}
