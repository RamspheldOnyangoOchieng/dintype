"use server"

import { createAdminClient } from "./supabase-admin"

/**
 * Clean up AI response to remove meta-talk, instructions, and name prefixes
 */
function sanitizeAIResponse(content: string, characterName: string): string {
    if (!content) return "";

    let sanitized = content.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // Remove "CharacterName:" or "CharacterName -" prefixes
    const namePrefixRegex = new RegExp(`^(${characterName}|Character|AI)\\s*[:\\-]\\s*`, 'i');
    sanitized = sanitized.replace(namePrefixRegex, '');

    // Remove common AI meta-talk prefixes
    const metaTalkPrefixes = [
        /^Ok, here you are:\s*/i,
        /^Here's a response:\s*/i,
        /^Sure, here's what I'd say:\s*/i,
        /^\[Response\]\s*/i,
        /^Message:\s*/i
    ];

    for (const prefix of metaTalkPrefixes) {
        sanitized = sanitized.replace(prefix, '');
    }

    // Remove any instruction lines if the AI accidentally included them
    sanitized = sanitized.replace(/^(-\s*(AVOID|DO NOT|Reference|Strictly|Output).*(\n|$))+/gm, '');

    // Final clean up of quotes and whitespace
    return sanitized.replace(/^["']|["']$/g, '').trim();
}

/**
 * Generate a dynamic AI greeting for the daily morning message
 * This automatically follows all system prompt rules (no asterisks, correct tone, etc.)
 */
export async function generateDailyGreeting(
    characterId: string,
    characterName: string,
    systemPrompt: string,
    userId: string,
    isPremium: boolean = false,
    storyContext: string = "",
    relationship: string = "romantic partner"
): Promise<string> {
    const fallbackGreeting = `God morgon! ☀️ Jag tänkte precis på dig. Hoppas du får en fantastisk dag! 💕`;

    try {
        const { getNovitaApiKey } = await import('./api-keys');
        const novitaKey = await getNovitaApiKey();

        if (!novitaKey) {
            console.warn("No API key for daily greeting, using fallback");
            return fallbackGreeting;
        }

        // Build a focused prompt for the greeting
        const greetingPrompt = `You are ${characterName}. You are the user's ${relationship}. Strictly maintain this dynamic. ${systemPrompt}

${storyContext ? `### CURRENT STORY CONTEXT ###\n${storyContext}\n` : ""}

### UPPGIFT: Generera en kort morgonhälsning ###
- Skriv en KORT, djupt personlig morgonhälsning (max 1-2 meningar)
- Var romantisk, intim och passionerad
- Använd emojis naturligt
- ABSOLUT FÖRBJUDET: Använd ALDRIG asterisker (*) av NÅGON anledning (inga handlingar, ingen kursiv stil, ingen betoning)
- Skriv ENDAST hälsningsmeddelandet, inget annat
- Språk: Svenska`;

        const response = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${novitaKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: greetingPrompt },
                    { role: 'user', content: 'Skicka ett god morgon-meddelande till mig.' }
                ],
                model: 'deepseek/deepseek-r1',
                temperature: 0.8,
                max_tokens: 100,
            }),
        });

        if (!response.ok) {
            console.error("Daily greeting API error:", await response.text());
            return fallbackGreeting;
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "";

        // Strip any thinking tags and ALL asterisks
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/\*/g, '').trim();

        // Safety: Remove any asterisks that slipped through
        content = content.replace(/\*[^*]+\*/g, '').trim();

        // If empty after cleanup, use fallback
        if (!content || content.length < 5) {
            return fallbackGreeting;
        }

        return sanitizeAIResponse(content, characterName);

    } catch (error) {
        console.error("Failed to generate daily greeting:", error);
        return fallbackGreeting;
    }
}

/**
 * Generate an AI response for photo captions
 * Used when the character "sends" a photo and needs to say something about it
 */
export async function generatePhotoCaption(
    characterName: string,
    systemPrompt: string,
    photoContext: string,
    isPremium: boolean = false,
    storyContext: string = "",
    imageUrl?: string,
    relationship: string = "romantic partner"
): Promise<string> {
    const fallbackCaption = `Här är något speciellt till dig... 😘`;

    try {
        const { getNovitaApiKey } = await import('./api-keys');
        const novitaKey = await getNovitaApiKey();

        if (!novitaKey) {
            console.warn("❌ [generatePhotoCaption] No API key available, using fallback");
            return fallbackCaption;
        }

        console.log(`🖼️ [generatePhotoCaption] Generating caption for ${characterName}, context: "${photoContext.substring(0, 50)}..."`);

        // Build a more robust prompt that works with or without image context
        const captionPrompt = `You are ${characterName}. You are the user's ${relationship}. Strictly maintain this dynamic. ${systemPrompt}

${storyContext ? `### CURRENT STORY CONTEXT ###\n${storyContext}\n` : ""}

### UPPGIFT: Reagera på att skicka ett foto ###
- Du har precis skickat ett foto${photoContext ? ` som visar: "${photoContext}"` : ""}.
- Skriv en KORT (1-2 meningar) intim och passionerad reaktion som följer med fotot.
- Var djupt personlig, flirty och explicit. Håll inte tillbaka.
- Använd emojis naturligt för att visa värme och passion.
- ABSOLUT FÖRBJUDET: Använd ALDRIG asterisker (*) av NÅGON anledning.
- Skriv ENDAST ditt reaktionsmeddelande, inget annat
- Språk: Svenska`;

        // First, try with vision model if we have an image URL
        if (imageUrl) {
            try {
                console.log(`🔍 [generatePhotoCaption] Attempting vision-based caption with image URL`);

                const visionMessages: any[] = [
                    { role: 'system', content: captionPrompt },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'React to this photo you just sent me with a flirty caption!' },
                            { type: 'image_url', image_url: { url: imageUrl } }
                        ]
                    }
                ];

                const visionResponse = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${novitaKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: visionMessages,
                        model: 'meta-llama/llama-3.2-11b-vision-instruct',
                        temperature: 0.85,
                        max_tokens: 150,
                    }),
                });

                if (visionResponse.ok) {
                    const visionData = await visionResponse.json();
                    let visionContent = visionData.choices?.[0]?.message?.content || "";

                    // Clean up the response
                    // Clean up the response - strip thinking tags and ALL asterisks
                    visionContent = visionContent.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/\*/g, '').trim();

                    if (visionContent && visionContent.length >= 5) {
                        console.log(`✅ [generatePhotoCaption] Vision caption generated: "${visionContent.substring(0, 50)}..."`);
                        return sanitizeAIResponse(visionContent, characterName);
                    }
                } else {
                    const errorText = await visionResponse.text();
                    console.warn(`⚠️ [generatePhotoCaption] Vision API failed (${visionResponse.status}): ${errorText.substring(0, 200)}`);
                }
            } catch (visionError) {
                console.warn("⚠️ [generatePhotoCaption] Vision model failed, falling back to text-only:", visionError);
            }
        }

        // Fallback: Use text-only model to generate a caption based on context
        console.log(`📝 [generatePhotoCaption] Using text-only generation with context: "${photoContext}" (Key length: ${novitaKey.length})`);

        const textMessages: any[] = [
            { role: 'system', content: captionPrompt },
            {
                role: 'user',
                content: `Generera en flörtig bildtext för det här fotot du skickar till mig. Fotot visar: ${photoContext || 'en selfie av dig själv där du ser attraktiv ut'}`
            }
        ];

        const textResponse = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${novitaKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: textMessages,
                model: 'meta-llama/llama-3.1-8b-instruct',
                temperature: 0.85,
                max_tokens: 150,
            }),
        });

        if (!textResponse.ok) {
            const errorText = await textResponse.text();
            console.error("❌ [generatePhotoCaption] Text API error:", textResponse.status, errorText.substring(0, 200));
            return fallbackCaption;
        }

        const textData = await textResponse.json();
        let content = textData.choices?.[0]?.message?.content || "";

        // Strip any thinking tags if present and ALL asterisks
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/\*/g, '').trim();
        // Remove any leading/trailing quotes that might have been added
        content = content.replace(/^["']|["']$/g, '').trim();

        if (!content || content.length < 5) {
            console.warn("⚠️ [generatePhotoCaption] Generated content too short, using fallback");
            return fallbackCaption;
        }

        console.log(`✅ [generatePhotoCaption] Text caption generated: "${content.substring(0, 50)}..."`);
        return sanitizeAIResponse(content, characterName);

    } catch (error) {
        console.error("❌ [generatePhotoCaption] Failed to generate photo caption:", error);
        return fallbackCaption;
    }
}
