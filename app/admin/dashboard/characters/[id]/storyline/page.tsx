"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { ArrowLeft, BookOpen, Edit2, Plus, Trash2, Save, GripVertical, FileText, MessageSquare, Image as ImageIcon, Terminal, Check, ChevronLeft, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner" // Using sonner as seen in app/layout.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface StoryChapter {
    id: string
    character_id: string
    chapter_number: number
    title: string
    tone: string
    description: string
    content: any // JSON
    system_prompt: string
    created_at: string
}

export default function CharacterStorylinePage() {
    const params = useParams()
    const router = useRouter()
    const characterId = params.id as string
    const supabase = createClient()

    const [chapters, setChapters] = useState<StoryChapter[]>([])
    const [characterName, setCharacterName] = useState("")
    const [loading, setLoading] = useState(true)

    // Selection State
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

    // Edit State
    const [formData, setFormData] = useState({
        chapter_number: 1,
        title: "",
        tone: "",
        description: "",
        content: "{}",
        system_prompt: ""
    })
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        fetchData()
    }, [characterId])

    // If a chapter is selected, update form data
    useEffect(() => {
        if (selectedChapterId) {
            const chapter = chapters.find(c => c.id === selectedChapterId)
            if (chapter) {
                setFormData({
                    chapter_number: chapter.chapter_number,
                    title: chapter.title,
                    tone: chapter.tone || "",
                    description: chapter.description || "",
                    content: JSON.stringify(chapter.content, null, 2),
                    system_prompt: chapter.system_prompt || ""
                })
                setIsDirty(false)
            }
        }
    }, [selectedChapterId, chapters])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch character name
            // Fetch characters
            const { data: char, error: charError } = await supabase
                .from("characters")
                .select("name")
                .eq("id", characterId)
                .single()

            if (charError) throw charError
            // @ts-ignore
            setCharacterName(char?.name || "Unknown")

            // Fetch chapters
            // @ts-ignore
            const { data, error } = await supabase
                .from("story_chapters")
                .select("*")
                .eq("character_id", characterId)
                .order("chapter_number", { ascending: true })

            if (error) throw error
            const typedData = (data || []) as StoryChapter[]
            setChapters(typedData)

            // Select first chapter if available and none selected
            if (typedData.length > 0 && !selectedChapterId) {
                setSelectedChapterId(typedData[0].id)
            }

        } catch (error: any) {
            console.error("Error fetching data:", error)
            toast.error("Failed to load storyline data")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateNew = () => {
        // Create a new blank chapter local state or open a dialog?
        // Let's create a temporary object or reset selection to "new" mode
        // Simplest: Auto-create a draft row in DB? Better: Show "New" form.
        // For this UI, let's just create a new record immediately to simplify selection logic
        const nextNum = chapters.length > 0 ? Math.max(...chapters.map(c => c.chapter_number)) + 1 : 1

        const newChapter = {
            character_id: characterId,
            chapter_number: nextNum,
            title: `Chapter ${nextNum}`,
            content: { opening_message: "Start here..." }
        }

        insertChapter(newChapter)
    }

    const insertChapter = async (payload: any) => {
        // @ts-ignore
        const { data, error } = await supabase.from("story_chapters").insert(payload).select().single()
        if (error) {
            toast.error(error.message)
        } else {
            const newChapter = data as StoryChapter
            setChapters(prev => [...prev, newChapter])
            setSelectedChapterId(newChapter.id)
            toast.success("New chapter created")
        }
    }

    const handleSave = async () => {
        if (!selectedChapterId) return

        try {
            let parsedContent = {}
            try {
                parsedContent = JSON.parse(formData.content)
            } catch (e) {
                toast.error("Invalid JSON content")
                return
            }

            const updates = {
                chapter_number: formData.chapter_number,
                title: formData.title,
                tone: formData.tone,
                description: formData.description,
                content: parsedContent,
                system_prompt: formData.system_prompt,
                updated_at: new Date().toISOString()
            }

            // @ts-ignore
            const { error } = await supabase
                .from("story_chapters")
                .update(updates)
                .eq("id", selectedChapterId)

            if (error) throw error

            toast.success("Chapter saved successfully")
            setChapters(prev => prev.map(c => c.id === selectedChapterId ? { ...c, ...updates } as StoryChapter : c))
            setIsDirty(false)
        } catch (error: any) {
            toast.error("Error saving chapter: " + error.message)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this chapter?")) return

        try {
            // @ts-ignore
            const { error } = await supabase.from("story_chapters").delete().eq("id", id)
            if (error) throw error

            setChapters(prev => prev.filter(c => c.id !== id))
            if (selectedChapterId === id) setSelectedChapterId(null)
            toast.success("Chapter deleted")
        } catch (error: any) {
            toast.error("Error deleting chapter")
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-400">Loading storyline...</div>

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-[#0a0a0a] text-white">
            {/* Header */}
            {/* Header - Always visible now to access buttons on mobile */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 py-4 border-b border-white/10 bg-[#0f0f0f] gap-4 shrink-0">
                <div className="flex items-center gap-3 w-full lg:w-auto overflow-hidden">
                    {/* Mobile Back to List Button - Only shows when editing a chapter */}
                    <div className={`${selectedChapterId ? 'block md:hidden' : 'hidden'}`}>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedChapterId(null)} className="text-gray-400 hover:text-white shrink-0 -ml-2">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => router.back()} className={`${selectedChapterId ? 'hidden md:flex' : 'flex'} text-gray-400 hover:text-white shrink-0`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="min-w-0 flex-1 lg:flex-none">
                        <h1 className="text-lg font-bold flex items-center gap-2 truncate">
                            <BookOpen className="h-5 w-5 text-primary shrink-0" />
                            <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-md">{characterName}</span>
                            <span className="text-gray-500 shrink-0">/</span>
                            <span className="shrink-0">Storyline</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-row gap-3 w-full lg:w-auto">
                    <Button onClick={handleCreateNew} variant="secondary" className="flex-1 lg:flex-none h-10 w-full lg:w-auto px-4">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="whitespace-nowrap">Add Chapter</span>
                    </Button>
                    <Button onClick={handleSave} disabled={!isDirty || !selectedChapterId} className={`flex-1 lg:flex-none h-10 w-full lg:w-auto px-6 ${isDirty ? "animate-pulse" : ""}`}>
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Sidebar List */}
                <div className={`
                    w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 flex-col bg-[#111]
                    ${selectedChapterId ? 'hidden md:flex' : 'flex'}
                    md:min-h-full h-full
                `}>
                    <div className="p-4 font-semibold text-xs text-gray-500 uppercase tracking-wider flex justify-between items-center bg-[#151515] md:bg-transparent">
                        <div className="flex items-center gap-4">
                            <span>Chapters ({chapters.length})</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-1 p-2">
                            {chapters.map((chapter) => (
                                <div
                                    key={chapter.id}
                                    onClick={() => setSelectedChapterId(chapter.id)}
                                    className={`
                                group flex items-start p-4 md:p-3 rounded-lg cursor-pointer transition-all border border-transparent mb-2 md:mb-0
                                ${selectedChapterId === chapter.id
                                            ? "bg-primary/10 border-primary/20 text-primary"
                                            : "bg-[#1a1a1a] md:bg-transparent border-white/5 md:border-transparent hover:bg-white/5 text-gray-400 hover:text-white"
                                        }
                            `}
                                >
                                    <div className={`
                                mt-0.5 mr-3 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                ${selectedChapterId === chapter.id ? "bg-primary text-black" : "bg-white/10 group-hover:bg-white/20"}
                            `}>
                                        {chapter.chapter_number}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate text-base md:text-sm">{chapter.title}</div>
                                        <div className="text-sm md:text-xs opacity-60 truncate">{chapter.description || "No description"}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 md:h-6 md:w-6 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400 hover:bg-red-400/10 -mt-1 -mr-1 shrink-0"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(chapter.id); }}
                                    >
                                        <Trash2 className="h-4 w-4 md:h-3 md:w-3" />
                                    </Button>
                                </div>
                            ))}
                            {chapters.length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-sm italic">
                                    No chapters yet. Click "Add Chapter" to begin.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className={`
                    flex-1 flex-col bg-[#0a0a0a] min-h-[500px]
                    ${selectedChapterId ? 'flex' : 'hidden md:flex'}
                `}>
                    {selectedChapterId ? (
                        <div className="h-full flex flex-col">
                            <Tabs defaultValue="details" className="flex-1 flex flex-col">
                                <div className="px-6 py-2 border-b border-white/10 bg-[#151515]">
                                    <TabsList className="bg-black/40 w-full justify-start overflow-x-auto no-scrollbar whitespace-nowrap h-auto py-1">
                                        <TabsTrigger value="details" className="shrink-0">Details & Tone</TabsTrigger>
                                        <TabsTrigger value="visual" className="shrink-0">Visual Builder</TabsTrigger>
                                        <TabsTrigger value="content" className="shrink-0">Raw JSON (Advanced)</TabsTrigger>
                                        <TabsTrigger value="prompt" className="shrink-0">System Prompt</TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="flex-1 p-6">
                                    <TabsContent value="visual" className="mt-0 max-w-4xl space-y-8">
                                        {/* Visual Editor Logic */}
                                        {(() => {
                                            let parsed = { opening_message: "", branches: [] };
                                            let isValid = true;
                                            try {
                                                parsed = JSON.parse(formData.content);
                                                if (!parsed.branches) parsed.branches = [];
                                            } catch (e) {
                                                isValid = false;
                                            }

                                            if (!isValid) {
                                                return (
                                                    <div className="p-8 text-center border border-red-900/50 bg-red-900/10 rounded-xl">
                                                        <h3 className="text-red-400 font-bold mb-2">Invalid JSON Detected</h3>
                                                        <p className="text-gray-400 text-sm">
                                                            The content in the "Raw JSON" tab contains syntax errors.
                                                            Please fix them before using the Visual Builder.
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            const updateContent = (newObj: any) => {
                                                setFormData({ ...formData, content: JSON.stringify(newObj, null, 2) });
                                                setIsDirty(true);
                                            };

                                            const updateBranch = (index: number, field: string, value: string) => {
                                                const newBranches = [...(parsed.branches || []) as any[]];
                                                newBranches[index] = { ...newBranches[index], [field]: value };
                                                updateContent({ ...parsed, branches: newBranches });
                                            };

                                            const addBranch = () => {
                                                const newBranches = [...(parsed.branches || []) as any[], { label: "New Choice", response_message: "..." }];
                                                updateContent({ ...parsed, branches: newBranches });
                                            };

                                            const removeBranch = (index: number) => {
                                                const newBranches = [...(parsed.branches || []) as any[]];
                                                newBranches.splice(index, 1);
                                                updateContent({ ...parsed, branches: newBranches });
                                            };

                                            return (
                                                <div className="space-y-8 animate-in fade-in duration-300">
                                                    {/* Opening Message Section */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-lg font-semibold text-primary">Opening Message</Label>
                                                            <Badge variant="outline" className="bg-primary/5 border-primary/20">Step 1</Badge>
                                                        </div>
                                                        <Card className="bg-[#111] border-white/10">
                                                            <CardContent className="p-4">
                                                                <Textarea
                                                                    value={parsed.opening_message || ""}
                                                                    onChange={(e) => updateContent({ ...parsed, opening_message: e.target.value })}
                                                                    className="min-h-[120px] bg-black/20 border-white/5 text-base leading-relaxed"
                                                                    placeholder="What does the character say to start this chapter?"
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </div>

                                                    <Separator className="bg-white/5" />

                                                    {/* Branches Section */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <Label className="text-lg font-semibold text-blue-400">Player Choices (Branches)</Label>
                                                                <p className="text-xs text-gray-500 mt-1">Define what options the player has and how the character responds.</p>
                                                            </div>
                                                            <Button onClick={addBranch} size="sm" variant="secondary" className="gap-2">
                                                                <Plus className="h-4 w-4" /> Add Choice
                                                            </Button>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-4">
                                                            {/* @ts-ignore */}
                                                            {parsed.branches?.map((branch: any, idx: number) => (
                                                                <Card key={idx} className="bg-[#111] border-white/10 relative group overflow-hidden">
                                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                                                                    <CardContent className="p-4 pl-6 space-y-4">
                                                                        <div className="flex gap-4">
                                                                            <div className="flex-1 space-y-2">
                                                                                <Label className="text-xs text-gray-400 uppercase tracking-wider">Player Option Label</Label>
                                                                                <Input
                                                                                    value={branch.label || ""}
                                                                                    onChange={(e) => updateBranch(idx, "label", e.target.value)}
                                                                                    className="bg-black/20 border-white/5 font-medium"
                                                                                    placeholder="e.g. 'Tell me more'"
                                                                                />
                                                                            </div>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeBranch(idx)}
                                                                                className="text-gray-500 hover:text-red-400 hover:bg-black/20 self-start mt-6"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <Label className="text-xs text-gray-400 uppercase tracking-wider">Character Response</Label>
                                                                            <Textarea
                                                                                value={branch.response_message || ""}
                                                                                onChange={(e) => updateBranch(idx, "response_message", e.target.value)}
                                                                                className="min-h-[80px] bg-black/20 border-white/5 resize-none"
                                                                                placeholder="How does the character respond to this choice?"
                                                                            />
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            ))}

                                                            {(!parsed.branches || parsed.branches.length === 0) && (
                                                                <div className="p-8 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-gray-500 gap-2">
                                                                    <p>No branches defined yet.</p>
                                                                    <Button variant="outline" onClick={addBranch}>Create First Choice</Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </TabsContent>
                                    <TabsContent value="details" className="mt-0 space-y-6 max-w-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-1">
                                                <Label>Number</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.chapter_number}
                                                    onChange={e => { setFormData({ ...formData, chapter_number: parseInt(e.target.value) }); setIsDirty(true); }}
                                                    className="bg-black/20 border-white/10"
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <Label>Chapter Title</Label>
                                                <Input
                                                    value={formData.title}
                                                    onChange={e => { setFormData({ ...formData, title: e.target.value }); setIsDirty(true); }}
                                                    className="bg-black/20 border-white/10 font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Description (Internal)</Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={e => { setFormData({ ...formData, description: e.target.value }); setIsDirty(true); }}
                                                className="bg-black/20 border-white/10 h-24 resize-none"
                                                placeholder="Brief summary of what happens in this chapter..."
                                            />
                                        </div>

                                        <div>
                                            <Label>Tone / Pacing</Label>
                                            <Input
                                                value={formData.tone}
                                                onChange={e => { setFormData({ ...formData, tone: e.target.value }); setIsDirty(true); }}
                                                className="bg-black/20 border-white/10"
                                                placeholder="e.g. Suspenseful, Romantic, Fast-paced"
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="content" className="mt-0 h-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full pb-20">
                                            <div className="space-y-2 flex flex-col">
                                                <Label className="flex items-center gap-2">
                                                    <Terminal className="h-4 w-4 text-primary" />
                                                    JSON Structure
                                                </Label>
                                                <Card className="bg-[#111] border-white/10 flex-1 flex flex-col">
                                                    <CardContent className="p-0 flex-1">
                                                        <Textarea
                                                            value={formData.content}
                                                            onChange={e => { setFormData({ ...formData, content: e.target.value }); setIsDirty(true); }}
                                                            className="w-full h-full min-h-[500px] font-mono text-sm bg-transparent border-none focus-visible:ring-0 p-4 leading-relaxed text-green-400/90"
                                                            spellCheck="false"
                                                        />
                                                    </CardContent>
                                                </Card>
                                                <div className="text-xs text-gray-500">
                                                    Must include 'opening_message' and 'branches' array.
                                                </div>
                                            </div>

                                            <div className="bg-[#111] rounded-xl border border-white/10 p-4 space-y-4 overflow-y-auto">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <FileText className="h-4 w-4 text-blue-400" />
                                                    <h3 className="font-semibold text-sm uppercase tracking-wider text-blue-400">Preview Structure</h3>
                                                </div>

                                                {/* Simple Visualizer */}
                                                <div className="space-y-4">
                                                    <div className="bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
                                                        <div className="text-xs text-gray-500 mb-1">Opening Message</div>
                                                        <div className="text-sm italic text-gray-300">
                                                            {(() => {
                                                                try { return JSON.parse(formData.content).opening_message || "..." }
                                                                catch { return "Invalid JSON" }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <Separator className="bg-white/10" />

                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-2">Branches</div>
                                                        <div className="space-y-2">
                                                            {(() => {
                                                                try {
                                                                    const branches = JSON.parse(formData.content).branches || []
                                                                    if (!Array.isArray(branches)) return <div className="text-red-500 text-xs">No branches array</div>
                                                                    if (branches.length === 0) return <div className="text-gray-500 text-xs">No branches defined</div>
                                                                    return branches.map((b: any, i: number) => (
                                                                        <div key={i} className="flex gap-2">
                                                                            <div className="w-1 bg-white/20 rounded-full"></div>
                                                                            <div className="flex-1 bg-[#1a1a1a] p-2 rounded border border-white/5">
                                                                                <div className="font-bold text-xs text-primary mb-1">{b.label}</div>
                                                                                <div className="text-xs text-gray-400 line-clamp-2">{b.response_message}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                                catch { return null }
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="prompt" className="mt-0 max-w-3xl">
                                        <Label className="mb-2 block">Chapter-Specific System Prompt Prompt</Label>
                                        <Card className="bg-amber-950/10 border-amber-900/30">
                                            <CardContent className="p-4">
                                                <Textarea
                                                    value={formData.system_prompt}
                                                    onChange={e => { setFormData({ ...formData, system_prompt: e.target.value }); setIsDirty(true); }}
                                                    className="bg-transparent border-none min-h-[300px] resize-none focus-visible:ring-0 text-amber-100/80"
                                                    placeholder="Override the character's base system prompt for this specific chapter context..."
                                                />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                            <p>Select a chapter to edit or create a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
