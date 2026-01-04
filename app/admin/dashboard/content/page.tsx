"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Save, Search, Plus, Edit } from "lucide-react"

interface ContentBlock {
  id: string
  page: string
  block_key: string
  content_sv: string
  content_en: string
  content_type: string
  is_active: boolean
}

const PAGES = [
  { value: "homepage", label: "Homepage" },
  { value: "premium", label: "Premium" },
  { value: "faq", label: "FAQ" },
  { value: "create-character", label: "Create Character" },
  { value: "about", label: "About Us" },
]

const CONTENT_TYPES = [
  { value: "text", label: "Plain Text" },
  { value: "html", label: "HTML" },
  { value: "markdown", label: "Markdown" },
]

export default function ContentEditorPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [filteredBlocks, setFilteredBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState("homepage")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState({
    page: "homepage",
    block_key: "",
    content_sv: "",
    content_en: "",
    content_type: "text",
  })

  useEffect(() => {
    fetchBlocks()
  }, [])

  useEffect(() => {
    const filtered = blocks.filter(
      (block) =>
        block.page === selectedPage &&
        (block.block_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.content_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.content_sv.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    setFilteredBlocks(filtered)
  }, [blocks, selectedPage, searchQuery])

  const fetchBlocks = async () => {
    try {
      const res = await fetch("/api/admin/content")
      const data = await res.json()

      if (res.ok) {
        setBlocks(data)
      } else {
        toast.error(data.error || "Failed to load content blocks")
      }
    } catch (error) {
      toast.error("Failed to load content blocks")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock(block)
    setFormData({
      page: block.page,
      block_key: block.block_key,
      content_sv: block.content_sv,
      content_en: block.content_en,
      content_type: block.content_type,
    })
    setIsCreating(false)
  }

  const handleCreate = () => {
    setEditingBlock(null)
    setFormData({
      page: selectedPage,
      block_key: "",
      content_sv: "",
      content_en: "",
      content_type: "text",
    })
    setIsCreating(true)
  }

  const handleSave = async () => {
    if (!formData.block_key.trim()) {
      toast.error("Block key is required")
      return
    }

    setSaving(true)

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBlock?.id,
          ...formData,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(isCreating ? "Content block created!" : "Content block updated!")
        setEditingBlock(null)
        setIsCreating(false)
        fetchBlocks()
      } else {
        toast.error(data.error || "Save failed")
      }
    } catch (error) {
      toast.error("Save failed")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingBlock(null)
    setIsCreating(false)
    setFormData({
      page: selectedPage,
      block_key: "",
      content_sv: "",
      content_en: "",
      content_type: "text",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">Content Editor</h1>
          <p className="text-muted-foreground">Edit page content blocks in multiple languages</p>
        </div>
        <Button onClick={handleCreate} className="font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Create New Block
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <Card className="lg:col-span-1 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-400">Content Navigation</CardTitle>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-[10px] font-bold uppercase mb-1.5 block">Target Page</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGES.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  placeholder="Filter keys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto px-2">
            {loading ? (
              <div className="flex flex-col items-center py-12 gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-zinc-500 font-bold">Synchronizing...</p>
              </div>
            ) : filteredBlocks.length === 0 ? (
              <p className="text-center text-zinc-400 py-12 text-sm italic">Inventory empty</p>
            ) : (
              <div className="space-y-1">
                {filteredBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleEdit(block)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      editingBlock?.id === block.id 
                        ? "border-primary bg-primary/10 scale-[1.02] shadow-sm" 
                        : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="font-bold text-xs tracking-tight text-zinc-900 dark:text-zinc-100">{block.block_key}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 truncate italic">
                      {block.content_en || block.content_sv || "Empty block"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-zinc-800 dark:text-white flex items-center gap-2">
              {isCreating ? <Plus className="w-5 h-5 text-green-500" /> : <Edit className="w-5 h-5 text-primary" />}
              {isCreating ? "New Content Module" : editingBlock ? `Edit: ${editingBlock.block_key}` : "Select Module"}
            </CardTitle>
            <CardDescription>
              {editingBlock || isCreating ? "Define content translations and structure" : "Choose a component from the library to modify"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!editingBlock && !isCreating ? (
              <div className="text-center py-24 text-zinc-300 dark:text-zinc-700">
                <Edit className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest text-sm">Awaiting Selection</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold uppercase mb-1.5 block">Owner Page</Label>
                    <Select value={formData.page} onValueChange={(val) => setFormData({ ...formData, page: val })}>
                      <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGES.map((page) => (
                          <SelectItem key={page.value} value={page.value}>
                            {page.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase mb-1.5 block">Data Format</Label>
                    <Select
                      value={formData.content_type}
                      onValueChange={(val) => setFormData({ ...formData, content_type: val })}
                    >
                      <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold uppercase mb-1.5 block">Module Key (Unique Name)</Label>
                  <Input
                    value={formData.block_key}
                    onChange={(e) => setFormData({ ...formData, block_key: e.target.value })}
                    placeholder="e.g. hero_heading_main"
                    disabled={!isCreating}
                    className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono text-sm"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1 italic">
                    Keys are immutable once created. Recommended: snake_case (lowercase_with_underscores).
                  </p>
                </div>

                <Tabs defaultValue="en">
                  <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-800 h-10 p-1">
                    <TabsTrigger value="en" className="text-xs font-black uppercase tracking-widest">English</TabsTrigger>
                    <TabsTrigger value="sv" className="text-xs font-black uppercase tracking-widest">Swedish</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="space-y-4 mt-4">
                    <div className="relative group">
                      <Label className="text-[10px] font-black uppercase text-primary mb-1 block">English Payload</Label>
                      <Textarea
                        value={formData.content_en}
                        onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                        placeholder="Define English content..."
                        rows={formData.content_type === "html" ? 18 : 10}
                        className="font-mono text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 ring-primary/20"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="sv" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-[10px] font-black uppercase text-zinc-500 mb-1 block">Swedish Payload</Label>
                      <Textarea
                        value={formData.content_sv}
                        onChange={(e) => setFormData({ ...formData, content_sv: e.target.value })}
                        placeholder="Definiera svenskt innehåll..."
                        rows={formData.content_type === "html" ? 18 : 10}
                        className="font-mono text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <Button onClick={handleSave} disabled={saving} className="font-black bg-primary text-white h-11 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        SAVING...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        COMMIT MODULE
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={handleCancel} className="font-bold h-11 px-6 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                    DISCARD
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
