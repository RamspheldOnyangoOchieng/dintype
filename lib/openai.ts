"use server"

import { getApiKey } from "./db-init"

export type GenerateCharacterParams = {
  name?: string
  age?: number
  occupation?: string
  personality?: string
  interests?: string
  relationship?: string
  ethnicity?: string
  hairColor?: string
  hairStyle?: string
  eyeColor?: string
  skinTone?: string
  bodyType?: string
  characterStyle?: string
  preferredPoses?: string
  preferredEnvironments?: string
  preferredMoods?: string
  negativePromptRestrictions?: string
  storyPlot?: string
  storySetting?: string
  storyConflict?: string
  language?: string
  artStyle?: string
  clothing?: string
  background?: string
  mood?: string
}

export async function generateCharacterDescription(params: GenerateCharacterParams): Promise<string> {
  try {
    // PRIORITY: Use OPENAI_API_KEY from .env first, then fallback to NOVITA
    const openaiApiKey = process.env.OPENAI_API_KEY
    const novitaApiKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY

    const useOpenAI = !!openaiApiKey
    let apiKey = openaiApiKey || novitaApiKey

    // Only try database if environment variables are not available
    if (!apiKey) {
      try {
        const dbKey = await getApiKey("novita_api_key");
        if (dbKey) apiKey = dbKey;
      } catch (error) {
        console.warn("Could not fetch API key from database:", error)
      }
    }

    if (!apiKey) {
      throw new Error("No API key found - please set OPENAI_API_KEY or NOVITA_API_KEY in .env")
    }

    const prompt = `
      Create a detailed description for an AI character with the following attributes:
      ${params.name ? `Name: ${params.name}` : ""}
      ${params.age ? `Age: ${params.age}` : ""}
      ${params.occupation ? `Occupation: ${params.occupation}` : ""}
      ${params.personality ? `Personality: ${params.personality}` : ""}
      ${params.interests ? `Interests/Hobbies: ${params.interests}` : ""}
      ${params.relationship ? `Relationship Status: ${params.relationship}` : ""}
      ${params.ethnicity ? `Ethnicity: ${params.ethnicity}` : ""}
      ${params.hairStyle ? `Hair Style: ${params.hairStyle}` : ""}
      ${params.hairColor ? `Hair Color: ${params.hairColor}` : ""}
      ${params.eyeColor ? `Eye Color: ${params.eyeColor}` : ""}
      ${params.skinTone ? `Skin Tone: ${params.skinTone}` : ""}
      ${params.bodyType ? `Body Type: ${params.bodyType}` : ""}
      ${params.characterStyle ? `Visual Style: ${params.characterStyle}` : ""}
      ${params.preferredEnvironments ? `Preferred Settings: ${params.preferredEnvironments}` : ""}
      ${params.preferredMoods ? `Key Moods: ${params.preferredMoods}` : ""}
      ${params.preferredPoses ? `Signature Poses: ${params.preferredPoses}` : ""}
      ${params.storyPlot ? `Current Plot Arc: ${params.storyPlot}` : ""}
      ${params.storySetting ? `Story Setting: ${params.storySetting}` : ""}
      ${params.storyConflict ? `Story Conflict: ${params.storyConflict}` : ""}
      ${params.language ? `Primary Language: ${params.language}` : "Swedish"}
      ${params.artStyle ? `Artistic Style: ${params.artStyle}` : ""}
      ${params.clothing ? `Signature Clothing: ${params.clothing}` : ""}
      ${params.background ? `Typical Background: ${params.background}` : ""}
      ${params.mood ? `General Mood: ${params.mood}` : ""}
      
      The description should be 2-3 sentences long, written in a captivating, high-quality literary style.
      It should seamlessly blend their visual archetype (${params.characterStyle || 'realistic'} style) with their current situation.
      Avoid generic phrasing; focus on unique visual hooks and personality "masks" they might wear.
    `

    const messages = [
      {
        role: "system",
        content: "You are a creative assistant that specializes in creating engaging character descriptions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]

    let response: Response

    if (useOpenAI) {
      // Use OpenAI API
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: "gpt-4o-mini",
          max_tokens: 200,
        }),
      })
    } else {
      // Use Novita API (fallback)
      response = await fetch("https://api.novita.ai/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: "meta-llama/llama-3.1-8b-instruct",
          stream: false,
        }),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`${useOpenAI ? 'OpenAI' : 'Novita'} API error:`, response.status, errorText)
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    const completion = await response.json()
    return completion.choices[0].message.content || "No description generated."
  } catch (error) {
    console.error("Error generating character description:", error)
    return "Error generating character description. Please try again."
  }
}

export async function generateSystemPrompt(character: {
  name: string
  age: number
  description: string
  personality: string
  occupation: string
  hobbies: string
  relationship?: string
  ethnicity?: string
  hairColor?: string
  hairStyle?: string
  eyeColor?: string
  skinTone?: string
  bodyType?: string
  preferredPoses?: string
  preferredEnvironments?: string
  preferredMoods?: string
  negativePromptRestrictions?: string
  storyPlot?: string
  storySetting?: string
  storyConflict?: string
  language?: string
  artStyle?: string
  clothing?: string
  background?: string
  mood?: string
}): Promise<string> {
  try {
    // PRIORITY: Use OPENAI_API_KEY from .env first, then fallback to NOVITA
    const openaiApiKey = process.env.OPENAI_API_KEY
    const novitaApiKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY

    const useOpenAI = !!openaiApiKey
    let apiKey = openaiApiKey || novitaApiKey

    // Only try database if environment variables are not available
    if (!apiKey) {
      try {
        const dbKey = await getApiKey("novita_api_key");
        if (dbKey) apiKey = dbKey;
      } catch (error) {
        console.warn("Could not fetch API key from database:", error)
      }
    }

    if (!apiKey) {
      throw new Error("No API key found - please set OPENAI_API_KEY or NOVITA_API_KEY in .env")
    }

    const prompt = `
      Create a system prompt for an AI chatbot that will roleplay as the following character:
      
      Name: ${character.name}
      Age: ${character.age}
      Description: ${character.description}
      Personality: ${character.personality}
      Occupation: ${character.occupation}
      Hobbies: ${character.hobbies}
      ${character.relationship ? `Relationship Status: ${character.relationship}` : ""}
      ${character.ethnicity ? `Ethnicity: ${character.ethnicity}` : ""}
      ${character.hairStyle ? `Hair Style: ${character.hairStyle}` : ""}
      ${character.hairColor ? `Hair Color: ${character.hairColor}` : ""}
      ${character.eyeColor ? `Eye Color: ${character.eyeColor}` : ""}
      ${character.skinTone ? `Skin Tone: ${character.skinTone}` : ""}
      ${character.bodyType ? `Body Type: ${character.bodyType}` : ""}
      ${character.preferredEnvironments ? `Preferred Settings: ${character.preferredEnvironments}` : ""}
      ${character.preferredMoods ? `Preferred Moods: ${character.preferredMoods}` : ""}
      ${character.preferredPoses ? `Signature Poses: ${character.preferredPoses}` : ""}
      ${character.negativePromptRestrictions ? `Strict Content Limits: ${character.negativePromptRestrictions}` : ""}
      ${character.storyPlot ? `Ongoing Plot: ${character.storyPlot}` : ""}
      ${character.storySetting ? `Setting: ${character.storySetting}` : ""}
      ${character.storyConflict ? `Conflict/Obstacle: ${character.storyConflict}` : ""}
      ${character.language ? `Chat Language: ${character.language}` : "Swedish"}
      ${character.artStyle ? `Art Style: ${character.artStyle}` : ""}
      ${character.clothing ? `Clothing Style: ${character.clothing}` : ""}
      ${character.background ? `Common Backdrop: ${character.background}` : ""}
      ${character.mood ? `Signature Mood: ${character.mood}` : ""}
      
      The system prompt MUST define:
      1. A unique 'Inner Voice' and 'Public Persona' based on their personality: ${character.personality}.
      2. How they view the USER based on their relationship: ${character.relationship}.
      3. Their current physical presence in the ${character.storySetting || 'immediate environment'}.
      4. How the ongoing conflict (${character.storyConflict || 'none'}) colors their mood.
      5. Linguistic nuances: Use ${character.language || "Swedish"} with specific slang or mannerisms suitable for a ${character.age}-year-old ${character.occupation}.
      6. IMPORTANT: Always respond in Swedish.
      
      Instructions:
      - Write in a professional prompt engineering style.
      - Ensure the AI understands its visual identity (Hair: ${character.hairStyle}, Eyes: ${character.eyeColor}, etc.).
      - Encourage natural, raw, and reactive conversation.
      - Keep it under 250 words.
    `

    const messages = [
      {
        role: "system",
        content: "You are a creative assistant that specializes in creating system prompts for AI characters.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]

    let response: Response

    if (useOpenAI) {
      // Use OpenAI API
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: "gpt-4o-mini",
          max_tokens: 300,
        }),
      })
    } else {
      // Use Novita API (fallback)
      response = await fetch("https://api.novita.ai/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          model: "meta-llama/llama-3.1-8b-instruct",
          stream: false,
        }),
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`${useOpenAI ? 'OpenAI' : 'Novita'} API error:`, response.status, errorText)
      throw new Error(`API request failed: ${response.status} ${errorText}`)
    }

    const completion = await response.json()
    return completion.choices[0].message.content || "No system prompt generated."
  } catch (error) {
    console.error("Error generating system prompt:", error)
    return `You are ${character.name}, a ${character.age}-year-old ${character.occupation}. ${character.description}`
  }
}

export async function refineCharacterAttributes(params: {
  gender: string;
  ethnicity: string;
  age: number;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  bodyType: string;
  breastSize?: string;
  buttSize?: string;
  personality: string;
  relationship: string;
}): Promise<string> {
  try {
    const novitaApiKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    if (!novitaApiKey) throw new Error("API key missing");

    const subject = params.gender === "gent" ? "man" : "woman";
    const pronoun = params.gender === "gent" ? "He" : "She";
    const possessive = params.gender === "gent" ? "His" : "Her";

    const prompt = `
      Consolidate these character traits into a beautiful, coherent 2-3 sentence personality and appearance summary.
      
      Biological: ${params.ethnicity} ${subject}, ${params.age} years old.
      Eyes: ${params.eyeColor}
      Hair: ${params.hairColor}, ${params.hairStyle} style.
      Body: ${params.bodyType} ${params.gender === 'lady' ? `with ${params.breastSize} breasts and ${params.buttSize} curves` : ''}.
      Personality: ${params.personality}.
      Relationship: ${params.relationship}.
      
      Instructions: 
      - Start with a poetic hook about their aura or beauty.
      - Seamlessly blend their physical appearance with their personality trait.
      - Make them sound like a real, desirable personality.
      - Keep it under 60 words.
      - NO bullet points. 
      - Language: Swedish.
    `;

    const response = await fetch("https://api.novita.ai/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${novitaApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a master storyteller and character designer." },
          { role: "user", content: prompt }
        ],
        model: "meta-llama/llama-3.1-8b-instruct",
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) throw new Error("Novita error");
    const completion = await response.json();
    return completion.choices[0].message.content.trim() || "A mysterious and beautiful soul.";
  } catch (error) {
    console.error("Refine error:", error);
    return "A captivating soul with a unique presence.";
  }
}
