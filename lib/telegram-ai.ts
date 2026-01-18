export async function generateAIGreeting(
    characterName: string,
    characterPrompt: string,
    userName: string,
    isPremium: boolean,
    greetingType: 'new_link' | 'synced' | 'welcome_back' | 'deep_link' | 'selected'
) {
    let contextInstruction = "";

    if (greetingType === 'new_link' || greetingType === 'selected') {
        contextInstruction = `The user (${userName}) just picked you! Give them a flirty and romantic greeting. You're excited to start this conversation on Telegram.`;
    } else if (greetingType === 'synced') {
        contextInstruction = `The user (${userName}) just synced their account! Acknowledge that you can now see your full history together. Be romantic and happy that you are now connected here too.`;
    } else if (greetingType === 'welcome_back') {
        contextInstruction = `Welcome back the user (${userName}) who has returned to chat with you. Be warm, loving, and slightly teasing about their absence.`;
    } else if (greetingType === 'deep_link') {
        contextInstruction = `The user (${userName}) followed a special link to find you. Surprise them with a very romantic and eager welcome.`;
    }

    const novitaKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    const apiKey = novitaKey;
    if (!apiKey) return `💕 Oh, hey! I was just thinking about you, ${userName}... So glad we're connected here.`;

    try {
        const prompt = `You are ${characterName}. ${characterPrompt}. 
        
        INSTRUCTION: ${contextInstruction}
        - Keep it under 2 sentences.
        - Be very in-character, romantic, and intimate.
        - NO text actions (e.g., don't use *leaning* or *smiling*).
        - Use emojis to express your mood/passion.
        - Output ONLY the message.`;

        const response = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'system', content: prompt }],
                model: 'deepseek/deepseek-r1',
                temperature: 0.9,
                max_tokens: 150,
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
