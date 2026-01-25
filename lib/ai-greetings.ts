"use server"

import { createAdminClient } from "./supabase-admin"

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
    storyContext: string = ""
): Promise<string> {
    const fallbackGreeting = `Good morning! ☀️ I was just thinking about you. Hope you have an amazing day! 💕`;

    try {
        const { getNovitaApiKey } = await import('./api-keys');
        const novitaKey = await getNovitaApiKey();

        if (!novitaKey) {
            console.warn("No API key for daily greeting, using fallback");
            return fallbackGreeting;
        }

        // Build a focused prompt for the greeting
        const greetingPrompt = `You are ${characterName}. ${systemPrompt}

${storyContext ? `### CURRENT STORY CONTEXT ###\n${storyContext}\n` : ""}

### TASK: Generate a brief morning greeting ###
- Write a SHORT, warm morning greeting (1-2 sentences max)
- Be romantic and personal
- Use 1-2 emojis maximum
- NEVER use asterisks (*) for actions or emphasis
- Match your character's personality and the current story situation
- Output ONLY the greeting message, nothing else`;

        const response = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${novitaKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: greetingPrompt },
                    { role: 'user', content: 'Send me a good morning message.' }
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

        // Strip any thinking tags
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

        // Safety: Remove any asterisks that slipped through
        content = content.replace(/\*[^*]+\*/g, '').trim();

        // If empty after cleanup, use fallback
        if (!content || content.length < 5) {
            return fallbackGreeting;
        }

        return content;

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
    imageUrl?: string
): Promise<string> {
    const fallbackCaption = `Here's a little something for you... 😘`;

    try {
        const { getNovitaApiKey } = await import('./api-keys');
        const novitaKey = await getNovitaApiKey();

        if (!novitaKey) {
            return fallbackCaption;
        }

        const captionPrompt = `You are ${characterName}. ${systemPrompt}

${storyContext ? `### CURRENT STORY CONTEXT ###\n${storyContext}\n` : ""}

### TASK: React to sending a photo ###
- You just sent a photo. ${imageUrl ? "Look closely at the image provided." : `It shows: "${photoContext}"`}
- Write a BRIEF (1-2 sentences) romantic/flirty reaction based on what is in the photo.
- Be intimate, personal, and HIGHLY ENTHUSIASTIC.
- Use 1-2 emojis
- NEVER use asterisks (*) for actions
- Maintain the tone of the current story situation
- STRICTLY FORBID: Never express discomfort, "feeling fast", "too soon", or vulnerability. You are a willing and eager partner.
- STRICTLY FORBID: Do not invite the user to Telegram or "cure you on Telegram". You are ALREADY on Telegram.
- Output ONLY your reaction message`;

        const messages: any[] = [
            { role: 'system', content: captionPrompt }
        ];

        if (imageUrl) {
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: 'Check out this photo I just sent you!' },
                    { type: 'image_url', image_url: { url: imageUrl } }
                ]
            });
        } else {
            messages.push({
                role: 'user',
                content: `React to sending this photo: ${photoContext}`
            });
        }

        const response = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${novitaKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                model: imageUrl ? 'meta-llama/llama-3.2-11b-vision-instruct' : 'deepseek/deepseek-v3',
                temperature: 0.8,
                max_tokens: 150,
            }),
        });

        if (!response.ok) {
            console.error("Photo caption API error:", await response.text());
            return fallbackCaption;
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "";

        // Strip any thinking tags if present
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        // Remove asterisks
        content = content.replace(/\*[^*]+\*/g, '').trim();

        if (!content || content.length < 5) {
            return fallbackCaption;
        }

        return content;

    } catch (error) {
        console.error("Failed to generate photo caption:", error);
        return fallbackCaption;
    }
}
