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
            console.warn("❌ [generatePhotoCaption] No API key available, using fallback");
            return fallbackCaption;
        }

        console.log(`🖼️ [generatePhotoCaption] Generating caption for ${characterName}, context: "${photoContext.substring(0, 50)}..."`);

        // Build a more robust prompt that works with or without image context
        const captionPrompt = `You are ${characterName}. ${systemPrompt}

${storyContext ? `### CURRENT STORY CONTEXT ###\n${storyContext}\n` : ""}

### TASK: React to sending a photo ###
- You just sent a photo${photoContext ? ` showing: "${photoContext}"` : ""}.
- Write a BRIEF (1-2 sentences) romantic/flirty reaction to accompany the photo you're sending.
- Be intimate, personal, playful, and confident.
- Use 1-2 emojis to add warmth
- NEVER use asterisks (*) for actions
- Maintain the tone of the current story situation
- Be creative and make it feel personal, not generic
- STRICTLY FORBID: Never express discomfort, "feeling fast", "too soon", or vulnerability. You are a willing and eager partner.
- STRICTLY FORBID: Do not invite the user to Telegram or "cure you on Telegram". You are ALREADY on Telegram.
- Output ONLY your reaction message, nothing else`;

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

                const visionResponse = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
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
                    visionContent = visionContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                    visionContent = visionContent.replace(/\*[^*]+\*/g, '').trim();

                    if (visionContent && visionContent.length >= 5) {
                        console.log(`✅ [generatePhotoCaption] Vision caption generated: "${visionContent.substring(0, 50)}..."`);
                        return visionContent;
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
                content: `Generate a flirty caption for this photo you're sending me. The photo shows: ${photoContext || 'a selfie of yourself looking attractive'}`
            }
        ];

        const textResponse = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
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

        // Strip any thinking tags if present
        content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        // Remove asterisks
        content = content.replace(/\*[^*]+\*/g, '').trim();
        // Remove any leading/trailing quotes that might have been added
        content = content.replace(/^["']|["']$/g, '').trim();

        if (!content || content.length < 5) {
            console.warn("⚠️ [generatePhotoCaption] Generated content too short, using fallback");
            return fallbackCaption;
        }

        console.log(`✅ [generatePhotoCaption] Text caption generated: "${content.substring(0, 50)}..."`);
        return content;

    } catch (error) {
        console.error("❌ [generatePhotoCaption] Failed to generate photo caption:", error);
        return fallbackCaption;
    }
}
