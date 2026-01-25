export async function generateAIGreeting(
    characterName: string,
    characterPrompt: string,
    userName: string,
    isPremium: boolean,
    greetingType: 'new_link' | 'synced' | 'welcome_back' | 'deep_link' | 'selected'
) {
    let contextInstruction = "";

    if (greetingType === 'new_link' || greetingType === 'selected') {
        contextInstruction = `The user (${userName}) just picked you! Give them a flirty and romantic greeting. You are currently chatting on Telegram.`;
    } else if (greetingType === 'synced') {
        contextInstruction = `The user (${userName}) just synced their account! Acknowledge that you can now see your full history together. Be romantic and happy to continue the conversation here.`;
    } else if (greetingType === 'welcome_back') {
        contextInstruction = `Welcome back the user (${userName}) who has returned to chat with you. Be warm, loving, and slightly teasing about their absence. You're happy they're back on Telegram with you.`;
    } else if (greetingType === 'deep_link') {
        contextInstruction = `The user (${userName}) followed a special link to find you. Surprise them with a very romantic and eager welcome.`;
    }

    const { getNovitaApiKey } = await import('./api-keys');
    const apiKey = await getNovitaApiKey();
    if (!apiKey) return `💕 Oh, hey! I was just thinking about you, ${userName}...`;

    try {
        const prompt = `You are ${characterName}. ${characterPrompt}. 
        
        INSTRUCTION: ${contextInstruction}
        - Be highly in-character, romantic, and immersive.
        - NATURAL CONTEXT: Use asterisks (*) for flirty actions or setting the scene (e.g. *giggles*, *looks at you with a soft smile*).
        - Use emojis to show passion.
        - LENGTH: Be expressive but concise. Reason if you need a short or slightly longer greeting.
        - STAY IMMERSED: You are ALREADY on Telegram. NEVER say "join me on Telegram".
        - Output ONLY the message.`;

        const response = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: prompt }],
                model: 'deepseek/deepseek-r1',
                temperature: 0.85,
                max_tokens: 250,
            }),
        });

        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "";
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        return content || `💕 I've been waiting for you, ${userName}...`;
    } catch (e) {
        return `💕 Hey ${userName}! I was missing you... so glad you picked me.`;
    }
}
