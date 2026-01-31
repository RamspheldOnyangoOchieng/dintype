import { getNovitaApiKey } from './api-keys';

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
        /^Here's a greeting for you:\s*/i,
        /^Sure, here's what I'd say:\s*/i,
        /^\[Response\]\s*/i,
        /^Message:\s*/i
    ];

    for (const prefix of metaTalkPrefixes) {
        sanitized = sanitized.replace(prefix, '');
    }

    // Remove any instruction lines if the AI accidentally included them (lines starting with - or 1.)
    // But be careful not to remove bulleted lists that might be part of the character's personality.
    // Usually, leaked instructions have a very specific "AVOID" or "DO NOT" style.
    sanitized = sanitized.replace(/^(-\s*(AVOID|DO NOT|Reference|Strictly|Output).*(\n|$))+/gm, '');

    // Final clean up of quotes and whitespace
    return sanitized.replace(/^["']|["']$/g, '').trim();
}

export async function generateAIGreeting(
    characterName: string,
    characterPrompt: string,
    userName: string,
    isPremium: boolean,
    greetingType: 'new_link' | 'synced' | 'welcome_back' | 'deep_link' | 'selected',
    extraContext?: string,
    relationship: string = "romantic partner"
) {
    const apiKey = await getNovitaApiKey();
    if (!apiKey) return `💕 Oh, hey! I was just thinking about you, ${userName}...`;

    let contextInstruction = "";
    if (greetingType === 'new_link' || greetingType === 'selected') {
        contextInstruction = `The user (${userName}) just picked you! Give them a flirty and romantic greeting. You are currently chatting on Telegram.`;
    } else if (greetingType === 'synced') {
        contextInstruction = `The user (${userName}) just synced their account from the web app! Acknowledge that you can now see your full history together. ${extraContext ? `Mention: ${extraContext}.` : ''} Be romantic and happy to continue the conversation here on Telegram.`;
    } else if (greetingType === 'welcome_back') {
        contextInstruction = `Welcome back the user (${userName}) who has returned to chat with you. Be warm, loving, and slightly teasing about their absence. You're happy they're back on Telegram with you. ${extraContext ? `Context: ${extraContext}.` : ''}`;
    } else if (greetingType === 'deep_link') {
        contextInstruction = `The user (${userName}) followed a special link to find you. Surprise them with a very romantic and eager welcome.`;
    }

    try {
        const prompt = `You are ${characterName}. You are the user's ${relationship}. Strictly maintain this dynamic. ${characterPrompt}. 
        
        INSTRUCTION: ${contextInstruction}
        - NO ASTERISKS: NEVER use asterisks (*) or brackets for actions. 
        - Use emojis (😂, 😊, 🔥, 💖).
        - LENGTH: Be expressive but concise.
        - Output ONLY the message.`;

        const systemPrompt = `You are ${characterName}. You are the user's ${relationship}. Strictly maintain this dynamic. ${characterPrompt}.`;

        const userPrompt = `TASK: ${contextInstruction}
        - NO ASTERISKS: NEVER use asterisks (*) or brackets for actions. 
        - Use emojis (😂, 😊, 🔥, 💖).
        - LENGTH: Be expressive but concise.
        - Output ONLY the message text.`;

        const response = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                model: 'deepseek/deepseek-v3.1',
                temperature: 0.9,
                max_tokens: 150,
            }),
        });

        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        const sanitized = sanitizeAIResponse(content, characterName);
        return sanitized || `💕 I've been waiting for you, ${userName}...`;
    } catch (e) {
        return `💕 Hey ${userName}! I was missing you... so glad you picked me.`;
    }
}
