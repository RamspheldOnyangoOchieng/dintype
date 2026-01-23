"use server"

import { revalidatePath } from "next/cache"
import { getAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"
import type { CharacterProfile } from "@/lib/storage-service"
import { isUserAdmin } from "@/lib/admin-auth"
import { uploadImageToCloudinary } from "@/lib/cloudinary-upload"

// Helper to convert File to base64 for Cloudinary upload
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return `data:${file.type};base64,${buffer.toString("base64")}`
}

export async function getCharacters() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      console.error("Failed to create admin client")
      return []
    }

    let query = supabaseAdmin.from("characters").select("*")

    if (user) {
      // Logged in: show user's own characters OR public characters
      // We use the standard column names: user_id and is_public
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
    } else {
      // Not logged in: show ONLY public characters
      query = query.eq('is_public', true)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching characters:", error)
      return []
    }

    // Normalize image fields
    const normalizedData = (data || []).map(char => {
      const imageUrl = char.image || char.image_url || ''

      return {
        ...char,
        image: imageUrl,
        image_url: imageUrl
      }
    })

    return normalizedData
  } catch (error) {
    console.error("Error in getCharacters:", error)
    return []
  }
}

export async function getCharacterById(id: string) {
  try {
    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      console.error("Failed to create admin client")
      return null
    }

    const { data, error } = await supabaseAdmin.from("characters").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching character:", error)
      return null
    }

    // Normalize image and prompt fields
    const imageUrl = data.image || data.image_url || ''
    return {
      ...data,
      image: imageUrl,
      image_url: imageUrl,
      prompt_template: data.prompt_template || data.system_prompt || '',
      user_id: data.user_id || data.userId || ''
    }
  } catch (error) {
    console.error("Error in getCharacterById:", error)
    return null
  }
}

export async function createCharacter(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const promptTemplate = formData.get("promptTemplate") as string
    const faceFile = formData.get("faceReference") as File
    const anatomyFile = formData.get("anatomyReference") as File
    const isPublic = formData.get("isPublic") === "true"
    const imageUrl = formData.get("imageUrl") as string
    const preferredPoses = formData.get("preferredPoses") as string
    const preferredEnvironments = formData.get("preferredEnvironments") as string
    const preferredMoods = formData.get("preferredMoods") as string
    const negativeRestrictions = formData.get("negativeRestrictions") as string

    if (!name) {
      return { error: "Character name is required" }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to create a character" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    // Handle reference images
    let faceUrl = ""
    let anatomyUrl = ""

    if (faceFile && faceFile.size > 0) {
      const b64 = await fileToBase64(faceFile)
      faceUrl = await uploadImageToCloudinary(b64, "face-refs")
    }

    if (anatomyFile && anatomyFile.size > 0) {
      const b64 = await fileToBase64(anatomyFile)
      anatomyUrl = await uploadImageToCloudinary(b64, "anatomy-refs")
    }

    const { data, error } = await supabaseAdmin
      .from("characters")
      .insert({
        name,
        description,
        system_prompt: promptTemplate,
        is_public: isPublic,
        user_id: user.id,
        image: imageUrl || undefined,
        image_url: imageUrl || undefined,
        created_at: new Date().toISOString(),
        metadata: {
          face_reference_url: faceUrl,
          anatomy_reference_url: anatomyUrl,
          preferred_poses: preferredPoses,
          preferred_environments: preferredEnvironments,
          preferred_moods: preferredMoods,
          negative_prompt_restrictions: negativeRestrictions
        }
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating character:", error)
      return { error: error.message }
    }

    revalidatePath("/characters")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating character:", error)
    return { error: (error as Error).message }
  }
}

export async function updateCharacter(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const promptTemplate = formData.get("promptTemplate") as string
    const faceFile = formData.get("faceReference") as File
    const anatomyFile = formData.get("anatomyReference") as File
    const isPublic = formData.get("isPublic") === "true"
    const imageUrl = formData.get("imageUrl") as string
    const preferredPoses = formData.get("preferredPoses") as string
    const preferredEnvironments = formData.get("preferredEnvironments") as string
    const preferredMoods = formData.get("preferredMoods") as string
    const negativeRestrictions = formData.get("negativeRestrictions") as string

    if (!name) {
      return { error: "Character name is required" }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to update a character" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    // First check if user owns this character
    const { data: character } = await supabaseAdmin
      .from("characters")
      .select("user_id, userId, metadata")
      .eq("id", id)
      .single()

    // Check for ownership or admin status
    const isAdmin = await isUserAdmin(supabase as any, user.id)

    if (!isAdmin && character?.user_id !== user.id && character?.userId !== user.id) {
      return { error: "You do not have permission to update this character" }
    }

    // Handle reference images
    let faceUrl = character?.metadata?.face_reference_url || ""
    let anatomyUrl = character?.metadata?.anatomy_reference_url || ""

    if (faceFile && faceFile.size > 0) {
      const b64 = await fileToBase64(faceFile)
      faceUrl = await uploadImageToCloudinary(b64, "face-refs")
    }

    if (anatomyFile && anatomyFile.size > 0) {
      const b64 = await fileToBase64(anatomyFile)
      anatomyUrl = await uploadImageToCloudinary(b64, "anatomy-refs")
    }

    const updates: any = {
      name,
      description,
      system_prompt: promptTemplate,
      is_public: isPublic,
      metadata: {
        ...(character?.metadata || {}),
        face_reference_url: faceUrl,
        anatomy_reference_url: anatomyUrl,
        preferred_poses: preferredPoses,
        preferred_environments: preferredEnvironments,
        preferred_moods: preferredMoods,
        negative_prompt_restrictions: negativeRestrictions
      }
    }

    if (imageUrl) {
      updates.image = imageUrl
      updates.image_url = imageUrl
    }

    const { data, error } = await supabaseAdmin
      .from("characters")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating character:", error)
      return { error: error.message }
    }

    revalidatePath("/characters")
    revalidatePath(`/characters/${id}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error updating character:", error)
    return { error: (error as Error).message }
  }
}

export async function deleteCharacter(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to delete a character" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    // First check if user owns this character
    const { data: character } = await supabaseAdmin
      .from("characters")
      .select("user_id, userId")
      .eq("id", id)
      .single()

    const isAdmin = await isUserAdmin(supabase as any, user.id)

    if (!isAdmin && character?.user_id !== user.id && character?.userId !== user.id) {
      return { error: "You do not have permission to delete this character" }
    }

    const { error } = await supabaseAdmin.from("characters").delete().eq("id", id)

    if (error) {
      console.error("Error deleting character:", error)
      return { error: error.message }
    }

    revalidatePath("/characters")
    return { success: true }
  } catch (error) {
    console.error("Error deleting character:", error)
    return { error: (error as Error).message }
  }
}

export async function savePrompt(prompt: string, characterId?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to save a prompt" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    const { data, error } = await supabaseAdmin
      .from("saved_prompts")
      .insert({
        prompt,
        character_id: characterId,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving prompt:", error)
      return { error: error.message }
    }

    revalidatePath("/prompts")
    if (characterId) {
      revalidatePath(`/characters/${characterId}`)
    }
    return { success: true, data }
  } catch (error) {
    console.error("Error saving prompt:", error)
    return { error: (error as Error).message }
  }
}

export async function toggleFavorite(promptId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to favorite a prompt" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    // Get current favorite status
    const { data: prompt } = await supabaseAdmin
      .from("saved_prompts")
      .select("is_favorite")
      .eq("id", promptId)
      .eq("user_id", user.id)
      .single()

    if (!prompt) {
      return { error: "Prompt not found" }
    }

    const { data, error } = await supabaseAdmin
      .from("saved_prompts")
      .update({ is_favorite: !prompt.is_favorite })
      .eq("id", promptId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error toggling favorite:", error)
      return { error: error.message }
    }

    revalidatePath("/prompts")
    revalidatePath("/favorites")
    return { success: true, data }
  } catch (error) {
    console.error("Error toggling favorite:", error)
    return { error: (error as Error).message }
  }
}

export async function deletePrompt(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to delete a prompt" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    const { error } = await supabaseAdmin.from("saved_prompts").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting prompt:", error)
      return { error: error.message }
    }

    revalidatePath("/prompts")
    revalidatePath("/favorites")
    return { success: true }
  } catch (error) {
    console.error("Error deleting prompt:", error)
    return { error: (error as Error).message }
  }
}

export async function createTag(name: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to create a tag" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    const { data, error } = await supabaseAdmin
      .from("tags")
      .insert({
        name,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating tag:", error)
      return { error: error.message }
    }

    revalidatePath("/characters")
    return { success: true, data }
  } catch (error) {
    console.error("Error creating tag:", error)
    return { error: (error as Error).message }
  }
}

export async function deleteTag(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "You must be logged in to delete a tag" }
    }

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      return { error: "Failed to create admin client" }
    }

    const { error } = await supabaseAdmin.from("tags").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting tag:", error)
      return { error: error.message }
    }

    revalidatePath("/characters")
    return { success: true }
  } catch (error) {
    console.error("Error deleting tag:", error)
    return { error: (error as Error).message }
  }
}

export async function getFavorites() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      console.error("Failed to create admin client")
      return []
    }

    const { data, error } = await supabaseAdmin
      .from("saved_prompts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_favorite", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching favorites:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getFavorites:", error)
    return []
  }
}

export async function getPrompts(characterId?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const supabaseAdmin = await getAdminClient()
    if (!supabaseAdmin) {
      console.error("Failed to create admin client")
      return []
    }

    let query = supabaseAdmin.from("saved_prompts").select("*").eq("user_id", user.id)

    if (characterId) {
      query = query.eq("character_id", characterId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching prompts:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getPrompts:", error)
    return []
  }
}
