
import { createClient } from "@/utils/supabase/client"

export interface StoryChapter {
    id: string
    character_id: string
    chapter_number: number
    title: string
    tone: string
    description: string
    content: {
        opening_message: string
        branches: StoryBranch[]
    }
    system_prompt: string
}

export interface StoryBranch {
    id: string
    label: string
    text_override?: string
    response_message: string
    media?: {
        type: 'image' | 'video'
        url: string
        nsfw_level?: string
    }[]
    next_chapter_increment?: number
}

export interface UserStoryProgress {
    id: string
    user_id: string
    character_id: string
    current_chapter_number: number
    is_completed: boolean
    unlocked_chapters: number[]
}

export async function getStoryProgress(userId: string, characterId: string) {
    const supabase = createClient()

    // @ts-ignore
    const { data, error } = await supabase
        .from("user_story_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("character_id", characterId)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching story progress:", error)
        return null
    }

    return data as UserStoryProgress | null
}

export async function initializeStoryProgress(userId: string, characterId: string) {
    const supabase = createClient()
    // @ts-ignore
    const { data, error } = await supabase
        .from("user_story_progress")
        .insert({
            user_id: userId,
            character_id: characterId,
            current_chapter_number: 1,
            is_completed: false,
            unlocked_chapters: [1]
        })
        .select()
        .single()

    if (error) console.error("Error creating progress:", error)
    return data as UserStoryProgress
}

export async function getChapter(characterId: string, chapterNumber: number) {
    const supabase = createClient()
    // @ts-ignore
    const { data, error } = await supabase
        .from("story_chapters")
        .select("*")
        .eq("character_id", characterId)
        .eq("chapter_number", chapterNumber)
        .single()

    if (error) {
        return null
    }
    return data as StoryChapter
}

export async function completeChapter(userId: string, characterId: string, nextChapter: number) {
    const supabase = createClient()
    // Check if next chapter exists
    // @ts-ignore
    const { data: nextCharChapter } = await supabase
        .from("story_chapters")
        .select("id")
        .eq("character_id", characterId)
        .eq("chapter_number", nextChapter)
        .single()

    const isComplete = !nextCharChapter

    // @ts-ignore
    const { data, error } = await supabase
        .from("user_story_progress")
        .update({
            current_chapter_number: nextChapter,
            is_completed: isComplete,
        })
        .eq("user_id", userId)
        .eq("character_id", characterId)
        .select()
        .single()

    return { progress: data, isComplete }
}
