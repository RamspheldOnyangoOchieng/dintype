"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Edit, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Character } from "@/lib/types"

interface EditCharacterDialogProps {
    character: Character
    onUpdate: (updatedCharacter: Character) => void
}

export function EditCharacterDialog({ character, onUpdate }: EditCharacterDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: character.name,
        description: character.description || "",
        isPublic: character.isPublic || false,
        story_setting: character.story_setting || "",
        story_conflict: character.story_conflict || "",
        story_plot: character.story_plot || "",
        occupation: character.occupation || "",
        hobbies: character.hobbies || "",
        relationship: character.relationship || "",
    })

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/characters/${character.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to update character")

            const updated = await res.json()
            onUpdate(updated)
            toast.success("Character updated successfully")
            setIsOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Error updating character")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-[#1a1a1a] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Edit Character Profile</DialogTitle>
                    <DialogDescription>
                        Update {character.name}'s details and storyline.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship</Label>
                            <Input
                                id="relationship"
                                value={formData.relationship}
                                onChange={(e) => handleChange("relationship", e.target.value)}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="bg-white/5 border-white/10 min-h-[80px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input
                                id="occupation"
                                value={formData.occupation}
                                onChange={(e) => handleChange("occupation", e.target.value)}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hobbies">Hobbies</Label>
                            <Input
                                id="hobbies"
                                value={formData.hobbies}
                                onChange={(e) => handleChange("hobbies", e.target.value)}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <h3 className="text-lg font-semibold text-primary">Storyline Settings</h3>

                        <div className="space-y-2">
                            <Label htmlFor="setting">Setting (Where does it take place?)</Label>
                            <Textarea
                                id="setting"
                                value={formData.story_setting}
                                onChange={(e) => handleChange("story_setting", e.target.value)}
                                className="bg-white/5 border-white/10"
                                placeholder="e.g. A cyberpunk city, a cozy cafe, a fantasy kingdom..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="conflict">Conflict (What is the main tension?)</Label>
                            <Textarea
                                id="conflict"
                                value={formData.story_conflict}
                                onChange={(e) => handleChange("story_conflict", e.target.value)}
                                className="bg-white/5 border-white/10"
                                placeholder="e.g. She is hiding a secret, We are rivals..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plot">Plot (What is happening right now?)</Label>
                            <Textarea
                                id="plot"
                                value={formData.story_plot}
                                onChange={(e) => handleChange("story_plot", e.target.value)}
                                className="bg-white/5 border-white/10"
                                placeholder="e.g. We just met at a party, We are stuck in an elevator..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="public-mode"
                                checked={formData.isPublic}
                                onCheckedChange={(c) => handleChange("isPublic", c)}
                            />
                            <Label htmlFor="public-mode">Make Public</Label>
                        </div>
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
