"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-context"
import { useImageSuggestions, type ImageSuggestion } from "@/components/image-suggestions-context"
import { Home, Plus, Search, Trash2, Edit, Save, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ImageSuggestionsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const {
    suggestions,
    isLoading: suggestionsLoading,
    addSuggestion,
    updateSuggestion,
    deleteSuggestion,
  } = useImageSuggestions()
  const { toast } = useToast()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    image: "",
  })
  const [isAdding, setIsAdding] = useState(false)
  const [newSuggestion, setNewSuggestion] = useState({
    name: "",
    category: "outfit",
    image: "/placeholder.svg?height=80&width=80",
    isActive: true,
  })

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  // Filter suggestions based on search term and category
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === "all" || suggestion.category === activeCategory),
  )

  // Handle toggling a suggestion's active state
  const toggleActive = async (id: string) => {
    const suggestion = suggestions.find((s) => s.id === id)
    if (!suggestion) return

    try {
      await updateSuggestion(id, { isActive: !suggestion.isActive })
      toast({
        title: "Klart",
        description: `Förslag ${suggestion.isActive ? "inaktiverat" : "aktiverat"} framgångsrikt`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Okänt fel uppstod"
      toast({
        title: "Fel",
        description: `Kunde inte uppdatera förslagets status: ${errorMessage}`,
        variant: "destructive",
      })
      console.error("Toggle error:", error)
    }
  }

  // Start editing a suggestion
  const startEditing = (suggestion: ImageSuggestion) => {
    setEditingId(suggestion.id)
    setEditForm({
      name: suggestion.name,
      category: suggestion.category,
      image: suggestion.image,
    })
  }

  // Save edited suggestion
  const saveEdit = async () => {
    if (!editingId) return

    try {
      await updateSuggestion(editingId, {
        name: editForm.name,
        category: editForm.category,
        image: editForm.image,
      })

      setEditingId(null)
      toast({
        title: "Klart",
        description: "Förslaget uppdaterades framgångsrikt",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Okänt fel uppstod"
      toast({
        title: "Fel",
        description: `Kunde inte uppdatera förslaget: ${errorMessage}`,
        variant: "destructive",
      })
      console.error("Update error:", error)
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
  }

  // Delete a suggestion
  const handleDeleteSuggestion = async (id: string) => {
    try {
      await deleteSuggestion(id)
      toast({
        title: "Klart",
        description: "Förslaget raderades framgångsrikt",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Okänt fel uppstod"
      toast({
        title: "Fel",
        description: `Kunde inte radera förslaget: ${errorMessage}`,
        variant: "destructive",
      })
      console.error("Delete error:", error)
    }
  }

  // Add a new suggestion
  const handleAddSuggestion = async () => {
    if (!newSuggestion.name.trim()) return

    try {
      await addSuggestion({
        name: newSuggestion.name,
        category: newSuggestion.category,
        image: newSuggestion.image,
        isActive: true,
      })

      setNewSuggestion({
        name: "",
        category: "outfit",
        image: "/placeholder.svg?height=80&width=80",
        isActive: true,
      })
      setIsAdding(false)

      toast({
        title: "Klart",
        description: "Förslaget lades till framgångsrikt",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Okänt fel uppstod"
      toast({
        title: "Fel",
        description: `Kunde inte lägga till förslaget: ${errorMessage}`,
        variant: "destructive",
      })
      console.error("Add error:", error)
    }
  }

  if (authLoading || suggestionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-800">Laddar...</div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Bildgenereringsförslag</h2>
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
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Förslag ({suggestions.length})</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Sök förslag..."
                      className="pl-9 bg-white border-gray-300 text-gray-800 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                    onClick={() => setIsAdding(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Lägg till förslag
                  </Button>
                </div>
              </div>

              {/* Category Tabs */}
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">Alla</TabsTrigger>
                  <TabsTrigger value="outfit">Kläder</TabsTrigger>
                  <TabsTrigger value="pose">Pose</TabsTrigger>
                  <TabsTrigger value="action">Handling</TabsTrigger>
                  <TabsTrigger value="accessories">Tillbehör</TabsTrigger>
                  <TabsTrigger value="scene">Scen</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Add New Suggestion Form */}
              {isAdding && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Lägg till nytt förslag</h4>
                    <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="new-name">Namn</Label>
                      <Input
                        id="new-name"
                        value={newSuggestion.name}
                        onChange={(e) => setNewSuggestion({ ...newSuggestion, name: e.target.value })}
                        className="bg-white border-gray-300 text-gray-800 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-category">Kategori</Label>
                      <Select
                        value={newSuggestion.category}
                        onValueChange={(value) => setNewSuggestion({ ...newSuggestion, category: value })}
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800 mt-1">
                          <SelectValue placeholder="Välj kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outfit">Kläder</SelectItem>
                          <SelectItem value="pose">Pose</SelectItem>
                          <SelectItem value="action">Handling</SelectItem>
                          <SelectItem value="accessories">Tillbehör</SelectItem>
                          <SelectItem value="scene">Scen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="new-image">Bild URL</Label>
                      <Input
                        id="new-image"
                        value={newSuggestion.image}
                        onChange={(e) => setNewSuggestion({ ...newSuggestion, image: e.target.value })}
                        className="bg-white border-gray-300 text-gray-800 mt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={handleAddSuggestion}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                      disabled={!newSuggestion.name.trim()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Lägg till förslag
                    </Button>
                  </div>
                </div>
              )}

              {/* Suggestions Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Namn</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Kategori</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Förhandsvisning</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">Aktiv</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-medium">Åtgärder</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuggestions.map((suggestion) => (
                      <tr key={suggestion.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {editingId === suggestion.id ? (
                            <Input
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="bg-white border-gray-300 text-gray-800"
                            />
                          ) : (
                            suggestion.name
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingId === suggestion.id ? (
                            <Select
                              value={editForm.category}
                              onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                            >
                              <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                                <SelectValue placeholder="Välj kategori" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="outfit">Kläder</SelectItem>
                                <SelectItem value="pose">Pose</SelectItem>
                                <SelectItem value="action">Handling</SelectItem>
                                <SelectItem value="accessories">Tillbehör</SelectItem>
                                <SelectItem value="scene">Scen</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                suggestion.category === "outfit"
                                  ? "bg-blue-100 text-blue-800"
                                  : suggestion.category === "pose"
                                    ? "bg-green-100 text-green-800"
                                    : suggestion.category === "action"
                                      ? "bg-purple-100 text-purple-800"
                                      : suggestion.category === "accessories"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                              }`}
                            >
                              {suggestion.category === "outfit"
                                ? "Kläder"
                                : suggestion.category === "pose"
                                  ? "Pose"
                                  : suggestion.category === "action"
                                    ? "Handling"
                                    : suggestion.category === "accessories"
                                      ? "Tillbehör"
                                      : "Scen"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingId === suggestion.id ? (
                            <Input
                              value={editForm.image}
                              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                              className="bg-white border-gray-300 text-gray-800"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
                              <img
                                src={suggestion.image || "/placeholder.svg"}
                                alt={suggestion.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Switch checked={suggestion.isActive} onCheckedChange={() => toggleActive(suggestion.id)} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          {editingId === suggestion.id ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 min-h-[2rem]"
                                onClick={saveEdit}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[2rem]"
                                onClick={cancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 min-h-[2rem]"
                                onClick={() => startEditing(suggestion)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[2rem]"
                                onClick={() => handleDeleteSuggestion(suggestion.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredSuggestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">Inga förslag hittades som matchar din sökning.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
