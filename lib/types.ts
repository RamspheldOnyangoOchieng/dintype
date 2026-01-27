export type Character = {
  id: string
  user_id?: string
  name: string
  age: number
  image: string
  images?: string[] // Array of additional profile images
  imageUrl?: string // Alternative field name from backend
  image_url?: string // Alternative field name from backend
  videoUrl?: string // Add this field
  description: string
  personality: string
  occupation: string
  hobbies: string
  body: string
  ethnicity: string
  // Character appearance traits
  characterGender?: string
  characterAge?: string
  bodyType?: string
  characterStyle?: string
  artStyle?: string
  hairColor?: string
  eyeColor?: string
  skinTone?: string
  clothing?: string
  pose?: string
  background?: string
  mood?: string
  // Storyline fields
  storyConflict?: string
  storySetting?: string
  storyPlot?: string
  // Other fields
  language: string
  relationship: string
  isNew: boolean
  createdAt: string
  systemPrompt: string
  characterType?: "Girls" | "Anime" | "Guys" | string
  category?: string
  tags?: string[]
  isPublic?: boolean
  isStorylineActive?: boolean
  metadata?: {
    face_reference_url?: string
    anatomy_reference_url?: string
    preferred_poses?: string
    preferred_environments?: string
    preferred_moods?: string
    negative_prompt_restrictions?: string
    default_prompt?: string
    negative_prompt?: string
    characterDetails?: any
  }
}

export type CharacterInsert = Omit<Character, "id" | "createdAt">
export type CharacterUpdate = Partial<CharacterInsert>
