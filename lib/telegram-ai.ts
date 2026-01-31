import { getNovitaApiKey } from './api-keys';

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

        const response = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: prompt }],
                model: 'deepseek/deepseek-v3.1',
                temperature: 0.9,
                max_tokens: 150, // Reduced from 250 for speed
            }),
        });

        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";
        return content.trim() || `💕 I've been waiting for you, ${userName}...`;
    } catch (e) {
        return `💕 Hey ${userName}! I was missing you... so glad you picked me.`;
    }
}
