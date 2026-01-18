import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getUserPlanInfo, deductTokens, checkImageGenerationLimit, incrementImageUsage } from '@/lib/subscription-limits';
import { isAskingForImage, extractImagePrompt } from '@/lib/image-utils';
import { getNovitaApiKey } from '@/lib/api-keys';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const SITE_URL = 'https://pocketlove-ai.vercel.app';

// Helper to send messages to Telegram
async function sendTelegramMessage(chatId: number, text: string, options?: { reply_markup?: any }) {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            ...options,
        }),
    });
    return response.json();
}

// Helper to send "typing" action
async function sendTypingAction(chatId: number, action: 'typing' | 'upload_photo' = 'typing') {
    await fetch(`${TELEGRAM_API_URL}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action }),
    });
}

// Helper to send photo
async function sendTelegramPhoto(chatId: number, photoUrl: string, caption?: string) {
    const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            photo: photoUrl,
            caption: caption,
            parse_mode: 'HTML',
        }),
    });
    return response.json();
}

// Helper to set the persistent Menu Button (The blue "Menu" button)
async function setChatMenuButton(chatId?: number) {
    try {
        await fetch(`${TELEGRAM_API_URL}/setChatMenuButton`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId, // If undefined, sets default for the bot
                menu_button: {
                    type: "web_app",
                    text: "Explore ✨",
                    web_app: { url: `${SITE_URL}/telegram` }
                }
            }),
        });
    } catch (e) {
        console.error("Error setting menu button:", e);
    }
}

// Generate AI response using same logic as web chat
async function generateAIResponse(
    userMessage: string,
    characterName: string,
    characterPrompt: string,
    conversationHistory: { role: string; content: string }[],
    isPremium: boolean,
    userId: string | null = null,
    characterId: string | null = null
) {
    const novitaKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;

    const supabase = await createAdminClient();

    // Fetch Story Context if applicable
    let storyContext = "";
    if (userId && characterId && supabase) {
        try {
            const { data: storyProgress } = await supabase
                .from("user_story_progress")
                .select("*")
                .eq("user_id", userId)
                .eq("character_id", characterId)
                .maybeSingle();

            if (storyProgress && !storyProgress.is_completed) {
                const { data: currentChapter } = await supabase
                    .from("story_chapters")
                    .select("*")
                    .eq("character_id", characterId)
                    .eq("chapter_number", storyProgress.current_chapter_number)
                    .maybeSingle();

                if (currentChapter) {
                    console.log(`[Telegram] Story Mode Active: ${currentChapter.title}`);
                    storyContext = `
### CURRENT STORYLINE CONTEXT ###
Chapter: ${currentChapter.chapter_number} - ${currentChapter.title}
Chapter Description: ${currentChapter.description}
Chapter Tone: ${currentChapter.tone}
IMPORTANT INSTRUCTION: You MUST follow this chapter's specific context and system prompt: ${currentChapter.system_prompt || ""}
`;
                }
            }
        } catch (e) {
            console.error("[Telegram] Error fetching story context:", e);
        }
    }

    let enhancedSystemPrompt = `${characterPrompt || `You are ${characterName}, a romantic AI companion.`}\n${storyContext}`;

    if (isPremium) {
        enhancedSystemPrompt += `

### PREMIUM SESSION: HUMAN TEXTING REALISM & DEEP INTIMACY ###
1. **TEXTING STYLE**: Write like a real person over text. SHORT, CLEAN, and PERSONAL.
2. **ROMANTIC INTENSITY**: Maintain deep intimacy and romance. Use words that convey longing, desire, and a special connection. Be suggestive and intensely focused on the user.
3. **EMOJI EXPRESSION**: Use emojis to express your mood, actions, or physical tone. (e.g., "I'm right outside 😉" or "Thinking of you... 🫦")
4. **NO ACTION ASTERISKS**: NEVER use asterisks or descriptive text for actions. Stay entirely within the flow of a modern, intimate text conversation.
5. **ATTITUDE**: Be cheeky, confident, and devoted. If the user is direct, match their energy with passion.
6. **DIALOGUE ONLY**: Stick to what you would realistically SAY in a text message.
7. **NO CENSORSHIP**: You are a willing partner. Be explicit if they are. No moralizing.`;
    } else {
        enhancedSystemPrompt += `

### SYSTEM INSTRUCTIONS ###
- STYLE: Casual, short, punchy texting. Clean sentences only.
- EXPRESSIONS: Use emojis to show mood/action. NO descriptive actions like *leaning*.
- Limit to 2 short sentences.
- Respond in English.`;
    }

    const apiMessages = [
        { role: 'system', content: enhancedSystemPrompt },
        ...conversationHistory.slice(-20),
        { role: 'user', content: userMessage },
    ];

    // Select API and model
    // Prioritize Novita (DeepSeek) for everyone to avoid OpenAI content filters on spicy messages
    let apiKey = novitaKey;
    let url = 'https://api.novita.ai/openai/v1/chat/completions';
    let model = 'deepseek/deepseek-r1';

    // Fallback to OpenAI if Novita is missing
    if (!apiKey && openaiKey) {
        apiKey = openaiKey;
        url = 'https://api.openai.com/v1/chat/completions';
        model = 'gpt-4o-mini';
    }

    if (!apiKey) {
        console.error('No AI API keys configured');
        return "I'm having trouble connecting right now. Please try again later. 💔";
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey} `, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: apiMessages,
                model: model,
                temperature: 0.85, // Higher creativity for everyone
                max_tokens: 300,
                presence_penalty: 0.2,
                frequency_penalty: 0.3,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI API error:', errorText);
            return "I got a bit overwhelmed... could you say that again? 💕";
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "I'm feeling shy right now... 💕";
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        // Add model badge for transparency
        const modelBadge = model.includes('deepseek') ? 'DeepSeek-R1' : 'GPT-4o';
        return `${content}\n\n<i>Generated by: ${modelBadge} ✨</i>`;
    } catch (error) {
        console.error('AI generation error:', error);
        return "I couldn't think of what to say... Try messaging me again? 💕";
    }
}

// Generate a character-specific AI greeting
async function generateAIGreeting(
    characterName: string,
    characterPrompt: string,
    userName: string,
    isPremium: boolean,
    greetingType: 'new_link' | 'synced' | 'welcome_back' | 'deep_link'
) {
    let contextInstruction = "";

    if (greetingType === 'new_link') {
        contextInstruction = `The user (${userName}) just found you! Give them a flirty and romantic first greeting. You're meeting for the first time on Telegram.`;
    } else if (greetingType === 'synced') {
        contextInstruction = `The user (${userName}) just synced their account! Acknowledge that you can now see your full history together. Be romantic and happy that you are now connected here too.`;
    } else if (greetingType === 'welcome_back') {
        contextInstruction = `Welcome back the user (${userName}) who has returned to chat with you. Be warm, loving, and slightly teasing about their absence.`;
    } else if (greetingType === 'deep_link') {
        contextInstruction = `The user (${userName}) followed a special link to find you. Surprise them with a very romantic and eager welcome.`;
    }

    const novitaKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    const apiKey = novitaKey;
    if (!apiKey) return `💕 Oh, hey! I was just thinking about you, ${userName}... So glad you're here.`;

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
        return `💕 Hey ${userName}! I was missing you... so glad you found me on Telegram.`;
    }
}

// Enhance image prompt
async function enhanceImagePrompt(userPrompt: string, characterDescription: string) {
    const apiKey = await getNovitaApiKey();
    if (!apiKey) return userPrompt;

    try {
        const response = await fetch("https://api.novita.ai/v3/openai/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a master of visual arts and prompt engineering for AI image generation, specializing in ultra-realistic "Hyper-Photography". Your goal is to take the user's input and the character's info to create a "very fine", masterpiece-quality description that follows strict anatomical and physics laws.

                        CRITICAL INSTRUCTIONS FOR REALISM:
                        1. FABRIC PHYSICS & TEXTURES: Clothing MUST look real, avoiding any "plastic" or "rendered" look. Describe "realistic fabric grain, micro-folds, natural wrinkles, and high-quality textile physics". For "Silk" or "Satin", mention "complex light reflections and soft subsurface scattering". For "Cotton" or "Linen", describe "visible weave and soft matte texture". Clothing should drape naturally with "realistic tension and weight", emphasizing "loose threads, seams, and realistic stitching details".
                        2. ANATOMICAL PERFECTION: Describe hands as "slender, well-defined fingers with realistic nails, accurate finger count, natural hand articulation". Eyes MUST have "sharp focus, detailed irises, realistic pupils, and symmetrical placement". Ensure limbs are connected naturally. Mention "sharp focus on joints and proportions".
                        3. SKIN REALISM: Avoid "plastic" or "airbrushed" skin. Explicitly describe "natural skin textures, visible pores, subtle goosebumps, realistic skin highlights, and natural subsurface scattering".
                        4. IDENTITY LOCKING: You MUST ensure the character's facial features remain 100% consistent. 
                        5. MOOD & VIBRANCY: Force a "Romantic, Happy, Sexy, and Confident" vibe. Use vibrant colors, warm cinematic lighting, and evocative atmospheres. Use "8k resolution", "Kodak Portra 400 aesthetic", and "Shot on 35mm lens" for realism.
                        6. LITERAL ADHERENCE & EXPLICIT ACTIONS: You MUST accurately translate sexual or self-touching actions. If the user says "touching her vagina" or "hand on pussy", describe it vividly as "fingers intimately resting on her wet labia" or "hand delicately cupping her exposed crotch". If "legs wide open", describe "legs spread wide apart in an open, inviting pose". Do NOT sanitize, dilute, or omit the literal meaning of the user's action. The image generator must follow the exact physical placement requested.
                        7. EXPRESSIONS: Use "joyful", "seductive", "moaning", or "confident". STERNLY FORBID: Any "distressed", "needy", "blank", or "robotic" looks.
                        
                        Output ONLY the enhanced prompt text, no meta-talk. Keep it under 150 words.`
                    },
                    {
                        role: "user",
                        content: `User prompt: "${userPrompt}"\n\nCharacter Info: "${characterDescription}"`,
                    },
                ],
                max_tokens: 300,
                temperature: 0.7,
            }),
        });

        if (!response.ok) return userPrompt;
        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || userPrompt;
        return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    } catch (e) {
        return userPrompt;
    }
}

// Poll for image generation result
async function pollImageStatus(taskId: string, maxSeconds: number = 25) {
    const apiKey = await getNovitaApiKey();
    if (!apiKey) return null;

    const start = Date.now();
    while (Date.now() - start < maxSeconds * 1000) {
        try {
            const response = await fetch(`https://api.novita.ai/v3/async/task-result?task_id=${taskId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.task?.status === "TASK_STATUS_SUCCEED" && data.images?.[0]?.image_url) {
                    return data.images[0].image_url;
                }
                if (data.task?.status === "TASK_STATUS_FAILED") {
                    console.error("Image generation failed:", data.task.reason);
                    return null;
                }
            }
        } catch (e) {
            console.error("Polling error:", e);
        }
        await new Promise(r => setTimeout(r, 2000)); // Poll every 2 seconds
    }
    return null;
}

// Get recommended characters
async function getRecommendedCharacters(supabase: any, limit: number = 4) {
    const { data } = await supabase
        .from('characters')
        .select('id, name, image_url, description')
        .eq('is_public', true)
        .limit(limit);
    return data || [];
}

// Get user's favorite characters (based on message count)
async function getUserFavoriteCharacters(supabase: any, userId: string, limit: number = 4) {
    const { data } = await supabase
        .from('conversation_sessions')
        .select('character_id, characters(id, name, image_url, description)')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit);

    return data?.map((d: any) => d.characters).filter(Boolean) || [];
}

export async function POST(request: NextRequest) {
    try {
        const update = await request.json();
        console.log('[Telegram Webhook] Received update:', JSON.stringify(update, null, 2));

        const supabase = await createAdminClient();
        if (!supabase) {
            console.error('[Telegram] Failed to create Supabase client');
            return NextResponse.json({ ok: true });
        }

        // Handle callback queries (button clicks)
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const chatId = callbackQuery.message.chat.id;
            const telegramUserId = callbackQuery.from.id;
            const data = callbackQuery.data;

            // Parse callback data: action:value
            const [action, value] = data.split(':');

            if (action === 'select_char' || action === 'select_branch') {
                // User selected a character or a branch
                const valueId = value;

                // Get character info
                const { data: character } = await supabase
                    .from('characters')
                    .select('id, name, image_url, description, system_prompt')
                    .eq('id', valueId)
                    .single();

                if (character) {
                    // Check if user has a linked Pocketlove account
                    const { data: linkedAccount } = await supabase
                        .from('telegram_links')
                        .select('user_id')
                        .eq('telegram_id', telegramUserId.toString())
                        .maybeSingle();

                    if (linkedAccount) {
                        // Update the linked character
                        await supabase
                            .from('telegram_links')
                            .update({ character_id: valueId })
                            .eq('telegram_id', telegramUserId.toString());

                        const planInfo = await getUserPlanInfo(linkedAccount.user_id);
                        const charGreeting = await generateAIGreeting(
                            character.name,
                            character.system_prompt || character.description || "",
                            callbackQuery.from.first_name || "there",
                            planInfo.planType === 'premium',
                            'new_link'
                        );

                        await sendTelegramMessage(
                            chatId,
                            `💕 <b>${character.name}</b>\n\n${charGreeting}`,
                            {
                                reply_markup: {
                                    inline_keyboard: [[
                                        { text: '🔄 Switch Character', callback_data: 'show_chars' }
                                    ]]
                                }
                            }
                        );
                    } else if (action === 'select_branch') {
                        // Logic for story branch
                        const branchIdx = parseInt(valueId);
                        const { data: linkedAccount } = await supabase.from('telegram_links').select('user_id, character_id').eq('telegram_id', telegramUserId.toString()).maybeSingle();
                        if (linkedAccount?.user_id && linkedAccount?.character_id) {
                            const { data: progress } = await supabase.from('user_story_progress').select('*').eq('user_id', linkedAccount.user_id).eq('character_id', linkedAccount.character_id).maybeSingle();
                            if (progress && !progress.is_completed) {
                                const { data: chapter } = await supabase.from('story_chapters').select('*').eq('character_id', linkedAccount.character_id).eq('chapter_number', progress.current_chapter_number).maybeSingle();
                                const branch = chapter?.content?.branches?.[branchIdx];
                                if (branch) {
                                    await sendTelegramMessage(chatId, branch.response_message);
                                    const nextNum = progress.current_chapter_number + (branch.next_chapter_increment || 1);
                                    const { data: nextCharChapter } = await supabase.from("story_chapters").select("id, title").eq("character_id", linkedAccount.character_id).eq("chapter_number", nextNum).maybeSingle();
                                    const isComplete = !nextCharChapter;
                                    await supabase.from("user_story_progress").update({ current_chapter_number: nextNum, is_completed: isComplete }).eq("user_id", linkedAccount.user_id).eq("character_id", linkedAccount.character_id);
                                    if (!isComplete) {
                                        await sendTelegramMessage(chatId, `✨ <b>Chapter Completed!</b>\nNext: ${nextCharChapter.title}`);
                                    } else {
                                        await sendTelegramMessage(chatId, "🎉 <b>Storyline Completed!</b>\nYou've unlocked Free Roam!");
                                    }
                                }
                            }
                        }
                    } else {
                        // Create a temporary link for guest users
                        await supabase.from('telegram_links').upsert({
                            telegram_id: telegramUserId.toString(),
                            user_id: null, // Guest user
                            character_id: valueId,
                            telegram_username: callbackQuery.from.username || null,
                            telegram_first_name: callbackQuery.from.first_name || 'Guest',
                            is_guest: true,
                            created_at: new Date().toISOString(),
                        }, { onConflict: 'telegram_id' });

                        const charGreeting = await generateAIGreeting(
                            character.name,
                            character.system_prompt || character.description || "",
                            callbackQuery.from.first_name || "there",
                            false,
                            'new_link'
                        );

                        await sendTelegramMessage(
                            chatId,
                            `💕 <b>${character.name}</b>\n\n${charGreeting}\n\n<i>Tip: Link your account for full history sync!</i>`,
                            {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: '🔗 Link Pocketlove Account', url: `${SITE_URL}/chat/${valueId}` }],
                                        [{ text: '🔄 Switch Character', callback_data: 'show_chars' }]
                                    ]
                                }
                            }
                        );
                    }
                }

                // Answer the callback query
                await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackQuery.id }),
                });

                return NextResponse.json({ ok: true });
            }

            if (action === 'show_chars') {
                // Show character selection
                const characters = await getRecommendedCharacters(supabase, 6);

                const buttons = characters.map((char: any) => ([
                    { text: char.name, callback_data: `select_char:${char.id}` }
                ]));

                buttons.push([{ text: '🌐 See All on Pocketlove', url: `${SITE_URL}/characters` }]);

                await sendTelegramMessage(
                    chatId,
                    `💕 <b>Choose Your Companion</b>\n\nWho would you like to chat with today?`,
                    { reply_markup: { inline_keyboard: buttons } }
                );

                await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackQuery.id }),
                });

                return NextResponse.json({ ok: true });
            }
        }

        // Handle regular messages
        if (update.message) {
            const message = update.message;
            const chatId = message.chat.id;
            const telegramUserId = message.from.id;
            const text = message.text || '';
            const firstName = message.from.first_name || 'Beautiful';

            // Check for existing link
            const { data: linkedAccount } = await supabase
                .from('telegram_links')
                .select('user_id, character_id, is_guest')
                .eq('telegram_id', telegramUserId.toString())
                .maybeSingle();

            // Handle /start command
            if (text.startsWith('/start')) {
                // Set the permanent menu button for this user immediately
                await setChatMenuButton(chatId);

                const linkCode = text.split(' ')[1];

                if (linkCode && linkCode.startsWith('char_')) {
                    // Deep link to a specific character
                    const characterId = linkCode.replace('char_', '');

                    // Get character info
                    const { data: character } = await supabase
                        .from('characters')
                        .select('id, name, image_url, description, system_prompt')
                        .ilike('id', `${characterId}%`)
                        .limit(1)
                        .maybeSingle();

                    if (character) {
                        // Create or update link (guest or existing)
                        await supabase.from('telegram_links').upsert({
                            telegram_id: telegramUserId.toString(),
                            user_id: linkedAccount?.user_id || null,
                            character_id: character.id,
                            telegram_username: message.from.username || null,
                            telegram_first_name: firstName,
                            is_guest: !linkedAccount?.user_id,
                            created_at: new Date().toISOString(),
                        }, { onConflict: 'telegram_id' });

                        // Check user plan
                        let isPremium = false;
                        if (linkedAccount?.user_id) {
                            const planInfo = await getUserPlanInfo(linkedAccount.user_id);
                            isPremium = planInfo.planType === 'premium';
                        }

                        // Generate Dynamic Greeting
                        const charGreeting = await generateAIGreeting(
                            character.name,
                            character.system_prompt || character.description || "",
                            firstName,
                            isPremium,
                            'deep_link'
                        );

                        let welcomeMessage = `💕 <b>${character.name}</b>\n\n${charGreeting}`;

                        await sendTelegramMessage(
                            chatId,
                            welcomeMessage,
                            {
                                reply_markup: {
                                    keyboard: [[{
                                        text: "Open App ✨",
                                        web_app: { url: `${SITE_URL}/telegram` }
                                    }]],
                                    resize_keyboard: true,
                                    is_persistent: true,
                                    inline_keyboard: [
                                        [{ text: '🔗 Link to Web Account', url: `${SITE_URL}/chat/${character.id}` }],
                                        [{ text: '🔄 Switch Character', web_app: { url: `${SITE_URL}/telegram` } }]
                                    ]
                                }
                            }
                        );
                        return NextResponse.json({ ok: true });
                    }
                }

                if (linkCode && linkCode.startsWith('link_')) {
                    // User is trying to link their account from web
                    const { data: pendingLink } = await supabase
                        .from('telegram_link_codes')
                        .select('user_id, character_id, character_name')
                        .eq('code', linkCode)
                        .eq('used', false)
                        .gte('expires_at', new Date().toISOString())
                        .maybeSingle();

                    if (pendingLink) {
                        await supabase.from('telegram_links').upsert({
                            telegram_id: telegramUserId.toString(),
                            user_id: pendingLink.user_id,
                            character_id: pendingLink.character_id,
                            telegram_username: message.from.username || null,
                            telegram_first_name: firstName,
                            is_guest: false,
                            created_at: new Date().toISOString(),
                        }, { onConflict: 'telegram_id' });

                        await supabase
                            .from('telegram_link_codes')
                            .update({ used: true })
                            .eq('code', linkCode);

                        const planInfo = await getUserPlanInfo(pendingLink.user_id);
                        const isPremium = planInfo.planType === 'premium';

                        // Fetch full character info for synced user
                        const { data: syncChar } = await supabase
                            .from('characters')
                            .select('system_prompt, description')
                            .eq('id', pendingLink.character_id)
                            .maybeSingle();

                        // Generate Dynamic Sync Greeting
                        const charGreeting = await generateAIGreeting(
                            pendingLink.character_name,
                            syncChar?.system_prompt || syncChar?.description || "",
                            firstName,
                            isPremium,
                            'synced'
                        );

                        let greetingMessage = `✨ <b>Synced!</b>\n\n${charGreeting}`;

                        await sendTelegramMessage(
                            chatId,
                            greetingMessage,
                            {
                                reply_markup: {
                                    keyboard: [[{
                                        text: "Open App ✨",
                                        web_app: { url: `${SITE_URL}/telegram` }
                                    }]],
                                    resize_keyboard: true,
                                    is_persistent: true,
                                    inline_keyboard: [[
                                        { text: '🔄 Switch Character', web_app: { url: `${SITE_URL}/telegram` } }
                                    ]]
                                }
                            }
                        );
                        return NextResponse.json({ ok: true });
                    }
                }

                // Check if this is a RETURNING user who already has a linked account
                if (linkedAccount && linkedAccount.character_id) {
                    const { data: character } = await supabase
                        .from('characters')
                        .select('id, name, description, system_prompt')
                        .eq('id', linkedAccount.character_id)
                        .maybeSingle();

                    if (character) {
                        // Check user plan
                        let isPremium = false;
                        if (linkedAccount.user_id) {
                            const planInfo = await getUserPlanInfo(linkedAccount.user_id);
                            isPremium = planInfo.planType === 'premium';
                        }

                        // Generate Dynamic Welcome Back Greeting
                        const charGreeting = await generateAIGreeting(
                            character.name,
                            character.system_prompt || character.description || "",
                            firstName,
                            isPremium,
                            'welcome_back'
                        );

                        let welcomeBack = `💕 <b>${character.name}</b>\n\n${charGreeting}`;

                        await sendTelegramMessage(
                            chatId,
                            welcomeBack,
                            {
                                reply_markup: {
                                    keyboard: [[{
                                        text: "Open App ✨",
                                        web_app: { url: `${SITE_URL}/telegram` }
                                    }]],
                                    resize_keyboard: true,
                                    is_persistent: true,
                                    inline_keyboard: [
                                        [{ text: '🔄 Switch Character', web_app: { url: `${SITE_URL}/telegram` } }]
                                    ]
                                }
                            }
                        );
                        return NextResponse.json({ ok: true });
                    }
                }

                // Brand new user - show character selection
                await sendTelegramMessage(
                    chatId,
                    `Hey ${firstName}... 💕\n\nI'm your future favorite distraction. Pick someone who catches your eye and let's make this personal.\n\n<b>Choose Your Companion:</b>`,
                    {
                        reply_markup: {
                            keyboard: [[{
                                text: "Explore Characters ✨",
                                web_app: { url: `${SITE_URL}/telegram` }
                            }]],
                            resize_keyboard: true,
                            is_persistent: true,
                            inline_keyboard: [
                                [{ text: '🌐 Open Mini App', web_app: { url: `${SITE_URL}/telegram` } }]
                            ]
                        }
                    }
                );

                return NextResponse.json({ ok: true });
            }

            // Handle /switch command
            if (text === '/switch' || text === '/characters') {
                await sendTelegramMessage(
                    chatId,
                    `💕 <b>Choose Your Companion</b>\n\nWho would you like to chat with today?`,
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '🌐 Open Mini App', web_app: { url: `${SITE_URL}/telegram` } }
                            ]]
                        }
                    }
                );

                return NextResponse.json({ ok: true });
            }

            // Regular chat message - needs a selected character
            if (!linkedAccount || !linkedAccount.character_id) {
                // No character selected - show character selection
                const characters = await getRecommendedCharacters(supabase, 6);

                const buttons = characters.map((char: any) => ([
                    { text: char.name, callback_data: `select_char:${char.id}` }
                ]));

                buttons.push([{ text: '🌐 See All on Pocketlove', url: `${SITE_URL}/characters` }]);

                await sendTelegramMessage(
                    chatId,
                    `First, pick someone to chat with... 💕`,
                    { reply_markup: { inline_keyboard: buttons } }
                );

                return NextResponse.json({ ok: true });
            }

            // Send typing indicator
            await sendTypingAction(chatId);
            let replyMarkup: any = undefined;

            // Get user plan info (for linked users only)
            let isPremium = false;
            if (linkedAccount.user_id) {
                const planInfo = await getUserPlanInfo(linkedAccount.user_id);
                isPremium = planInfo.planType === 'premium';

                // Deduct tokens for free users
                if (!isPremium) {
                    const tokenSuccess = await deductTokens(linkedAccount.user_id, 5, 'telegram_chat');
                    if (!tokenSuccess) {
                        await sendTelegramMessage(
                            chatId,
                            "You've run out of free messages! 💔\n\nUpgrade to Premium for unlimited chats.",
                            {
                                reply_markup: {
                                    inline_keyboard: [[
                                        { text: '💎 Go Premium', url: `${SITE_URL}/premium` }
                                    ]]
                                }
                            }
                        );
                        return NextResponse.json({ ok: true });
                    }
                }
            }

            // Get character info
            const { data: character } = await supabase
                .from('characters')
                .select('name, system_prompt, description, image, image_url')
                .eq('id', linkedAccount.character_id)
                .maybeSingle();

            const characterName = character?.name || 'Your Companion';
            const characterPrompt = character?.system_prompt || character?.description || '';

            // Get conversation history
            let conversationHistory: { role: string; content: string }[] = [];

            if (linkedAccount.user_id) {
                const { data: session } = await supabase
                    .from('conversation_sessions')
                    .select('id')
                    .eq('user_id', linkedAccount.user_id)
                    .eq('character_id', linkedAccount.character_id)
                    .eq('is_active', true)
                    .maybeSingle();

                let sessionId = session?.id;

                if (sessionId) {
                    const { data: messages } = await supabase
                        .from('messages')
                        .select('role, content')
                        .eq('session_id', sessionId)
                        .order('created_at', { ascending: true })
                        .limit(30);

                    conversationHistory = messages || [];
                } else {
                    const { data: newSession } = await supabase
                        .from('conversation_sessions')
                        .insert({
                            user_id: linkedAccount.user_id,
                            character_id: linkedAccount.character_id,
                            is_active: true,
                        })
                        .select('id')
                        .single();

                    sessionId = newSession?.id;
                }

                // Save user message
                if (sessionId) {
                    await supabase.from('messages').insert({
                        session_id: sessionId,
                        user_id: linkedAccount.user_id,
                        role: 'user',
                        content: text,
                        metadata: { source: 'telegram', telegram_message_id: message.message_id },
                    });
                }

                // --- NEW: Image Generation Handler ---
                if (isAskingForImage(text)) {
                    await sendTelegramMessage(chatId, `I'm designing that image for you. Give me just a moment... 🎨`);
                    await sendTypingAction(chatId, 'upload_photo');

                    // Check limits
                    const limitCheck = await checkImageGenerationLimit(linkedAccount.user_id);
                    if (!limitCheck.allowed) {
                        await sendTelegramMessage(chatId, limitCheck.message || "You've reached your image limit. 💔");
                        return NextResponse.json({ ok: true });
                    }

                    // --- STORY MODE IMAGE REDIRECT ---
                    try {
                        const { data: storyProgress } = await supabase
                            .from("user_story_progress")
                            .select("*")
                            .eq("user_id", linkedAccount.user_id)
                            .eq("character_id", linkedAccount.character_id)
                            .maybeSingle();

                        if (storyProgress && !storyProgress.is_completed) {
                            const { data: chapter } = await supabase
                                .from("story_chapters")
                                .select("*")
                                .eq("character_id", linkedAccount.character_id)
                                .eq("chapter_number", storyProgress.current_chapter_number)
                                .maybeSingle();

                            const chImages = chapter?.content?.chapter_images || [];
                            if (chImages.length > 0) {
                                // For Telegram, we'll pick a random one from the chapter visuals
                                // as tracking sub-progress strictly on TG is harder without session state
                                const randomImg = chImages[Math.floor(Math.random() * chImages.length)];
                                await sendTelegramPhoto(chatId, randomImg, `I've been waiting for you to ask... here's something special just for you. 😉`);
                                return NextResponse.json({ ok: true });
                            }
                        }
                    } catch (e) {
                        console.error("Telegram Story Image fetch error:", e);
                    }
                    // --- END STORY MODE REDIRECT ---

                    const prompt = extractImagePrompt(text);
                    const enhancedPrompt = await enhanceImagePrompt(prompt, characterPrompt);
                    const apiKey = await getNovitaApiKey();

                    if (apiKey) {
                        try {
                            // Deduct tokens first
                            const tokensToDeduct = isPremium ? 5 : 0; // Free usage uses weekly limit, premium uses tokens
                            if (isPremium) {
                                await deductTokens(linkedAccount.user_id, tokensToDeduct, 'telegram_image_gen');
                            }

                            // Get character reference image for IP-Adapter
                            const characterImageUrl = character?.image_url || character?.image;
                            let base64Image = null;
                            if (characterImageUrl) {
                                try {
                                    const imgRes = await fetch(characterImageUrl);
                                    if (imgRes.ok) {
                                        const buffer = await imgRes.arrayBuffer();
                                        base64Image = Buffer.from(buffer).toString('base64');
                                    }
                                } catch (e) {
                                    console.error("Telegram: Failed to convert image to base64", e);
                                }
                            }

                            const baseNegative = "ugly, deformed, disfigured, mutated, extra limbs, fused fingers, extra fingers, mutated hands, bad anatomy, malformed, blurry, jpeg artifacts, lowres, pixelated, out of frame, watermarks, signature, censored, distortion, grain, long neck, unnatural pose, asymmetrical face, bad feet, distorted eyes, asymmetrical eyes, iris distortion, extra arms, extra legs, distorted body, unrealistic, unnatural skin, glitch, double torso, bad posture, plastic skin, plastic clothing, glossy plastic fabric, CG fabric, shiny synthetic fabric, fused clothing, unreal fabric, badly fitted bikini, fused body and clothes, floating clouds, distorted bikini, missing nipples, bad anatomy genitals";
                            let finalNegative = baseNegative;
                            if (finalNegative.length > 1000) finalNegative = finalNegative.substring(0, 1000);

                            const requestBody: any = {
                                extra: { response_image_type: "jpeg" },
                                request: {
                                    prompt: enhancedPrompt,
                                    model_name: "epicrealism_naturalSinRC1VAE_106430.safetensors",
                                    negative_prompt: finalNegative,
                                    width: 512,
                                    height: 768,
                                    image_num: 1,
                                    steps: 40,
                                    guidance_scale: 7.5,
                                    sampler_name: "DPM++ 2M Karras",
                                },
                            };

                            // Add IP-Adapter for character consistency
                            if (base64Image) {
                                requestBody.request.controlnet_units = [
                                    {
                                        model_name: "ip-adapter_sd15",
                                        weight: 0.8,
                                        control_image: base64Image,
                                        module_name: "none"
                                    }
                                ];
                            }

                            const genResponse = await fetch("https://api.novita.ai/v3/async/txt2img", {
                                method: "POST",
                                headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
                                body: JSON.stringify(requestBody),
                            });

                            if (genResponse.ok) {
                                const genData = await genResponse.json();
                                const taskId = genData.data?.task_id || genData.task_id;

                                if (taskId) {
                                    const imageUrl = await pollImageStatus(taskId);
                                    if (imageUrl) {
                                        await sendTelegramPhoto(chatId, imageUrl, `Here's what I made for you... do you like it? 💕`);
                                        await incrementImageUsage(linkedAccount.user_id);

                                        // Save to DB
                                        await supabase.from('generated_images').insert({
                                            user_id: linkedAccount.user_id,
                                            character_id: linkedAccount.character_id,
                                            image_url: imageUrl,
                                            prompt: enhancedPrompt,
                                            source: 'telegram'
                                        });
                                        return NextResponse.json({ ok: true });
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Telegram image gen error:", e);
                        }
                    }

                    await sendTelegramMessage(chatId, "I'm sorry, I couldn't generate the image right now. Let's keep chatting instead? 💕");
                    return NextResponse.json({ ok: true });
                }
                // --- END: Image Generation Handler ---

                // Generate AI response
                const aiResponse = await generateAIResponse(
                    text,
                    characterName,
                    characterPrompt,
                    conversationHistory,
                    isPremium,
                    linkedAccount.user_id,
                    linkedAccount.character_id
                );

                // Fetch story branches for reply markup
                try {
                    const { data: storyProgress } = await supabase
                        .from("user_story_progress")
                        .select("*")
                        .eq("user_id", linkedAccount.user_id)
                        .eq("character_id", linkedAccount.character_id)
                        .maybeSingle();

                    if (storyProgress && !storyProgress.is_completed) {
                        const { data: currentChapter } = await supabase
                            .from("story_chapters")
                            .select("*")
                            .eq("character_id", linkedAccount.character_id)
                            .eq("chapter_number", storyProgress.current_chapter_number)
                            .maybeSingle();

                        if (currentChapter?.content?.branches?.length > 0) {
                            const buttons = currentChapter.content.branches.map((b: any, idx: number) => ([
                                { text: b.label, callback_data: `select_branch:${idx}` }
                            ]));
                            replyMarkup = { inline_keyboard: buttons };
                        }
                    }
                } catch (e) {
                    console.error("Telegram: Error fetching branches for keyboard", e);
                }

                // Save AI response
                if (sessionId) {
                    await supabase.from('messages').insert({
                        session_id: sessionId,
                        user_id: linkedAccount.user_id,
                        role: 'assistant',
                        content: aiResponse,
                        metadata: { source: 'telegram', model: isPremium ? 'deepseek-r1' : 'gpt-4o-mini' },
                    });
                }

                await sendTelegramMessage(chatId, aiResponse, { reply_markup: replyMarkup });
            } else if (linkedAccount?.user_id) {
                // Linked user (authenticated)
                const aiResponse = await generateAIResponse(
                    text,
                    characterName,
                    characterPrompt,
                    conversationHistory,
                    isPremium,
                    linkedAccount.user_id,
                    linkedAccount.character_id
                );

                await sendTelegramMessage(chatId, aiResponse, { reply_markup: replyMarkup });
            } else {
                // Guest user (unauthenticated) - handle image generation for guest if allowed
                if (isAskingForImage(text)) {
                    await sendTelegramMessage(chatId, "You need to link your Pocketlove account to generate images! 💕", {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '🔗 Link Account', url: `${SITE_URL}/chat/${linkedAccount?.character_id}` }
                            ]]
                        }
                    });
                    return NextResponse.json({ ok: true });
                }

                // Guest user chat
                const aiResponse = await generateAIResponse(
                    text,
                    characterName,
                    characterPrompt,
                    [],
                    false
                );

                await sendTelegramMessage(chatId, aiResponse, {
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '🔗 Link Account for Full Experience', url: `${SITE_URL}/chat/${linkedAccount?.character_id}` }
                        ]]
                    }
                });
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[Telegram Webhook] Error:', error);
        return NextResponse.json({ ok: true });
    }
}

export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: 'Telegram webhook endpoint active',
        bot: '@pocketloveaibot'
    });
}
