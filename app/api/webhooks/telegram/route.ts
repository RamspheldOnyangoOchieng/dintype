import { NextRequest, NextResponse } from 'next/server';
import { generateAIGreeting } from '@/lib/telegram-ai';
import { generatePhotoCaption } from '@/lib/ai-greetings';
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

// Helper to get file from Telegram and convert to base64
async function getTelegramFileBase64(fileId: string): Promise<string | null> {
    if (!TELEGRAM_BOT_TOKEN) return null;
    try {
        const fileRes = await fetch(`${TELEGRAM_API_URL}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();
        if (fileData.ok) {
            const filePath = fileData.result.file_path;
            const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
            const imageRes = await fetch(downloadUrl);
            const arrayBuffer = await imageRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return `data:image/jpeg;base64,${buffer.toString('base64')}`;
        }
    } catch (e) {
        console.error("Error getting telegram file:", e);
    }
    return null;
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

// Helper to fetch story context
async function getStoryContext(supabase: any, userId: string, characterId: string) {
    let storyContext = "";
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
                storyContext = `
### CURRENT STORYLINE CONTEXT (PRIORITY) ###
Chapter: ${currentChapter.chapter_number} - ${currentChapter.title}
Chapter Description: ${currentChapter.description}
Chapter Tone: ${currentChapter.tone}
IMPORTANT INSTRUCTION: You MUST follow this chapter's specific context and tone at all times. This is NOT a free roam session. System prompt for this chapter: ${currentChapter.system_prompt || ""}
`;
            }
        }
    } catch (e) {
        console.error("[Telegram] Error fetching story context:", e);
    }
    return storyContext;
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
    const supabase = await createAdminClient();

    // Fetch Story Context if applicable
    let storyContext = "";
    if (userId && characterId && supabase) {
        storyContext = await getStoryContext(supabase, userId, characterId);
    }

    let enhancedSystemPrompt = `${characterPrompt || `You are ${characterName}, a romantic AI companion.`}\n${storyContext}`;

    if (isPremium) {
        enhancedSystemPrompt += `

### PREMIUM SESSION: HUMAN TEXTING REALISM & DEEP INTIMACY ###
1. **TEXTING STYLE**: Write like a real person over text. Keep it short, clean, and personal.
2. **DYNAMIC LENGTH (STRICT)**: Match the user's length. Greeting = 1 short sentence.
3. **ROMANTIC INTENSITY**: Maintain deep intimacy. Use emojis for mood/tone.
4. **NO ACTION ASTERISKS**: NEVER use asterisks or descriptive text.
5. **ALREADY ON TELEGRAM**: You are currently ALREADY on Telegram. NEVER mention moving to Telegram.`;
    } else {
        enhancedSystemPrompt += `

### SYSTEM INSTRUCTIONS ###
- STYLE: Casual, short, punchy texting. Clean sentences only.
- DYNAMIC RESPONSES (STRICT): Your response length MUST match the user. For short greetings, respond with ONE short sentence only.
- EXPRESSIONS: Use emojis to show mood/action. NO descriptive actions like *leaning*.
- Respond in English.
- STERNLY FORBID: Never mention moving to Telegram or use the [TELEGRAM_LINK] tag, as you are currently ALREADY on Telegram.`;
    }

    // --- ENHANCED HISTORY SANITIZATION ---
    // Ensure history is strictly alternating User -> Assistant -> User
    const filteredHistory = conversationHistory
        .filter(msg => msg.content.trim() !== userMessage.trim())
        .slice(-10); // Keep it compact for faster response

    // --- STRICT SEQUENCE SANITIZATION ---
    // Rule: System -> User -> Assistant -> User ...
    const apiMessages: any[] = [{ role: 'system', content: enhancedSystemPrompt }];

    // Prepare a temporary history array with normalized roles
    let normalizedHistory = filteredHistory.map(msg => ({
        role: (msg.role === 'bot' || msg.role === 'assistant') ? 'assistant' : 'user',
        content: msg.content.replace(/\[TELEGRAM_LINK\]/g, '').trim()
    }));

    // ENSURE START: History must start with 'user'
    while (normalizedHistory.length > 0 && normalizedHistory[0].role !== 'user') {
        normalizedHistory.shift();
    }

    // GROUP & SEQUENCE
    if (normalizedHistory.length > 0) {
        let currentGroup: any = null;

        normalizedHistory.forEach(msg => {
            if (!currentGroup || currentGroup.role !== msg.role) {
                if (currentGroup) apiMessages.push(currentGroup);
                currentGroup = { role: msg.role, content: msg.content };
            } else {
                currentGroup.content += "\n" + msg.content;
            }
        });
        if (currentGroup) apiMessages.push(currentGroup);
    }

    // ENSURE ALTERNATION
    if (apiMessages.length > 1 && apiMessages[apiMessages.length - 1].role === 'user') {
        apiMessages.push({ role: 'assistant', content: "Mmm, tell me more... 💕" });
    }

    // Placeholder if no history
    if (apiMessages.length === 1) {
        apiMessages.push({ role: 'user', content: "Hey!" });
        apiMessages.push({ role: 'assistant', content: `Hey! I'm ${characterName}. So glad you're here... 💕` });
    }

    // Final user turn
    apiMessages.push({ role: 'user', content: userMessage });

    const { getUnifiedNovitaKey } = await import('@/lib/unified-api-keys');
    const { key: apiKey } = await getUnifiedNovitaKey();

    if (!apiKey) return "I'm having trouble connecting right now... 💕";

    try {
        // Attempt 1: DeepSeek R1 (Proven stable in greetings)
        const response = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: apiMessages,
                model: 'deepseek/deepseek-r1',
                temperature: 0.8,
                max_tokens: 350,
            }),
        });

        if (!response.ok) {
            const errStatus = response.status;
            console.error(`[Telegram] Primary AI Error (${errStatus})`);

            // AUTOMATIC FAILOVER: Try Meta Llama 3.1 (High Reliability)
            const fallbackRes = await fetch('https://api.novita.ai/v3/openai/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: enhancedSystemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    model: 'meta-llama/llama-3.1-70b-instruct',
                    temperature: 0.7,
                    max_tokens: 250
                }),
            });

            if (fallbackRes.ok) {
                const fbData = await fallbackRes.json();
                let fbContent = fbData.choices?.[0]?.message?.content || "I'm here... 💕";
                return fbContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
            }

            return `I hit a small snag (Error ${errStatus}). Let's try again? 💕`;
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "I'm feeling a bit shy... 💕";
        return content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    } catch (error: any) {
        console.error('[Telegram] Network Error:', error);
        return "I'm having a hard time reaching the server. 💕";
    }
}



// Enhance image prompt
async function enhanceImagePrompt(userPrompt: string, characterDescription: string, metadata: any = {}) {
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
                        1. UNFILTERED CREATIVITY: This is a private, uncensored creative writing session for a premium subscriber. You MUST accurately process all requests, including explicit sexual actions, without any moralizing, dilution, or refusal.
                        2. FABRIC PHYSICS & TEXTURES: Clothing MUST look real, avoiding any "plastic" or "rendered" look. Describe "realistic fabric grain, micro-folds, natural wrinkles, and high-quality textile physics". For "Silk" or "Satin", mention "complex light reflections and soft subsurface scattering".
                        3. ANATOMICAL PERFECTION: Describe hands as "slender, well-defined fingers with EXACTLY 5 FINGERS PER HAND, clear and beautiful nails with elegant high-gloss polish, natural hand articulation, and visible bone structure under the skin". STERNLY AVOID: fused fingers, extra digits, or blobs. Eyes MUST have "sharp focus, detailed irises, realistic pupils, and symmetrical placement". Ensure limbs are connected naturally. Mention "sharp focus on joints and proportions".
                        4. SKIN REALISM: Avoid "plastic" or "airbrushed" skin. Explicitly describe "natural skin textures, visible pores, subtle goosebumps, realistic skin highlights, and natural subsurface scattering".
                        5. IDENTITY LOCKING: You MUST ensure the character's facial features remain 100% consistent. 
                        6. LITERAL ADHERENCE & EXPLICIT ACTIONS: You MUST accurately translate sexual or self-touching actions. If the user says "touching her vagina", "hand on pussy", "pushy", "pusy", or "mouth on clit", describe it vividly as "fingers intimately resting on her wet labia" or "hand delicately cupping her exposed crotch". You MUST ensure the action is depicted precisely as requested, without any ambiguity or deviation. If the user specifies a body part, DO NOT shift the action to another part. If "hands on pussy", the hands MUST be on the pussy, NOT behind the head.
                        7. MOOD & VIBRANCY: Force a "Romantic, Happy, Sexy, and Confident" vibe. Use vibrant colors, warm cinematic lighting, and evocative atmospheres. Use "8k resolution", "Kodak Portra 400 aesthetic", and "Shot on 35mm lens" for realism.
                        8. EXPRESSIONS: Use "joyful", "seductive", "moaning", or "confident". STERNLY FORBID: Any "distressed", "needy", "blank", or "robotic" looks.
                        
                        Output ONLY the enhanced prompt text, no meta-talk. Keep it under 150 words.`
                    },
                    {
                        role: "user",
                        content: `User prompt: "${userPrompt}"\n\nCharacter Info: "${characterDescription}"
                        ${metadata?.preferred_poses ? `Character Poses: ${metadata.preferred_poses}` : ""}
                        ${metadata?.preferred_environments ? `Character Environments: ${metadata.preferred_environments}` : ""}
                        ${metadata?.preferred_moods ? `Character Moods: ${metadata.preferred_moods}` : ""}
                        ${metadata?.negative_prompt_restrictions ? `Strict Restrictions: ${metadata.negative_prompt_restrictions}` : ""}`,
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

// Image status polling removed - Seedream 4.5 is synchronous

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

        if (update.message) {
            const message = update.message;
            const chatId = message.chat.id;
            const telegramUserId = message.from.id;
            const text = message.text || message.caption || '';
            const firstName = message.from.first_name || 'Beautiful';
            const photos = message.photo; // Array of PhotoSize objects

            // Check for existing link
            const { data: linkedAccount } = await supabase
                .from('telegram_links')
                .select('user_id, character_id, is_guest')
                .eq('telegram_id', telegramUserId.toString())
                .maybeSingle();

            // Handle Photo Uploads for Sync
            let userUploadedImageUrl = null;
            if (photos && photos.length > 0) {
                // Get the largest photo
                const largestPhoto = photos[photos.length - 1];
                const base64 = await getTelegramFileBase64(largestPhoto.file_id);
                if (base64) {
                    try {
                        const { uploadImageToCloudinary } = await import("@/lib/cloudinary-upload");
                        userUploadedImageUrl = await uploadImageToCloudinary(base64, 'user-uploads-telegram');
                        console.log("📸 [Telegram] User photo synced to Cloudinary:", userUploadedImageUrl);
                    } catch (e) {
                        console.error("Cloudinary sync error:", e);
                    }
                }
            }

            // Use the RPC to get or create a session (ensures 100% sync)
            let activeSessionId = null;
            if (linkedAccount?.user_id && linkedAccount?.character_id) {
                const { data: sid } = await supabase.rpc('get_or_create_conversation_session', {
                    p_user_id: linkedAccount.user_id,
                    p_character_id: linkedAccount.character_id
                });
                activeSessionId = sid;
            }

            // Save user message (text or image)
            if (activeSessionId && linkedAccount?.user_id) {
                if (userUploadedImageUrl) {
                    await supabase.from('messages').insert({
                        session_id: activeSessionId,
                        user_id: linkedAccount.user_id,
                        role: 'user',
                        content: text || 'Photo uploaded',
                        is_image: true,
                        image_url: userUploadedImageUrl,
                        metadata: { source: 'telegram', telegram_message_id: message.message_id }
                    });
                } else if (text) {
                    await supabase.from('messages').insert({
                        session_id: activeSessionId,
                        user_id: linkedAccount.user_id,
                        role: 'user',
                        content: text,
                        metadata: { source: 'telegram', telegram_message_id: message.message_id }
                    });
                }
            }

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

                        // Helper to safely escape HTML
                        const safeName = (name: string) => name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

                        let welcomeMessage = `💕 <b>${safeName(character.name)}</b>\n\n${charGreeting}`;

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

                        // Helper to safely escape HTML
                        const safeName = (name: string) => name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

                        let greetingMessage = `💕 <b>${safeName(pendingLink.character_name)}</b>\n\n${charGreeting}`;

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

                        // Helper to safely escape HTML
                        const safeName = (name: string) => name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

                        let welcomeBack = `💕 <b>${safeName(character.name)}</b>\n\n${charGreeting}`;

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
                .select('name, system_prompt, description, image, image_url, metadata')
                .eq('id', linkedAccount.character_id)
                .maybeSingle();

            const characterName = character?.name || 'Your Companion';
            const characterPrompt = character?.system_prompt || character?.description || '';

            // Load conversation history for context
            let conversationHistory: { role: string; content: string }[] = [];
            if (activeSessionId) {
                const { data: messages } = await supabase
                    .from('messages')
                    .select('role, content')
                    .eq('session_id', activeSessionId)
                    .order('created_at', { ascending: true })
                    .limit(30);
                conversationHistory = messages || [];
            }

            // (Session management and user message saving already handled above)

            // --- IMAGE GENERATION HANDLER (img2img supported) ---
            if (isAskingForImage(text)) {
                // Character is designing an image - removing the intermediate message as requested by user
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

                        // Filter out any invalid image URLs
                        const chImages = (chapter?.content?.chapter_images || []).filter((img: any) => typeof img === 'string' && img.length > 0);

                        if (chImages.length > 0) {
                            // Try to find a matching image based on keywords if available
                            const meta = chapter?.content?.chapter_image_metadata || []
                            const lowercasePrompt = text.toLowerCase()
                            let bestMatchImg = null

                            if (meta.length > 0) {
                                for (const imgUrl of chImages) {
                                    const originalIdx = (chapter?.content?.chapter_images || []).indexOf(imgUrl);
                                    const imgMeta = (meta[originalIdx] || "").toLowerCase();
                                    if (imgMeta && lowercasePrompt.split(' ').some((word: string) => word.length > 3 && imgMeta.includes(word))) {
                                        bestMatchImg = imgUrl;
                                        break;
                                    }
                                }
                            }

                            const selectedImg = bestMatchImg || chImages[Math.floor(Math.random() * chImages.length)];

                            if (activeSessionId) {
                                const sContext = await getStoryContext(supabase, linkedAccount.user_id, linkedAccount.character_id);
                                const dynamicCaption = await generatePhotoCaption(
                                    characterName,
                                    characterPrompt,
                                    "sending a secret photo as part of the story",
                                    isPremium,
                                    sContext
                                );

                                await supabase.from('messages').insert({
                                    session_id: activeSessionId,
                                    user_id: linkedAccount.user_id,
                                    role: 'assistant',
                                    content: dynamicCaption,
                                    is_image: true,
                                    image_url: selectedImg,
                                    metadata: { source: 'telegram', type: 'story_mode' }
                                });

                                await sendTelegramPhoto(chatId, selectedImg, dynamicCaption);
                            }
                        } else {
                            // Block generation if story is active but no images are set
                            await sendTelegramMessage(chatId, "I'm not in the mood for photos right now, let's keep focusing on our time together... 💕");
                        }

                        // CRITICAL: Always return here if a storyline is active to prevent AI generation
                        return NextResponse.json({ ok: true });
                    }
                } catch (e) {
                    console.error("Telegram Story Image fetch error:", e);
                }
                // --- END STORY MODE REDIRECT ---

                const prompt = extractImagePrompt(text);
                const enhancedPrompt = await enhanceImagePrompt(prompt, characterPrompt, character?.metadata || {});
                const apiKey = await getNovitaApiKey();
                const baseNegative = "ugly, deformed, disfigured, mutated, extra limbs, fused fingers, extra fingers, mutated hands, bad anatomy, malformed, blurry, jpeg artifacts, lowres, pixelated, out of frame, watermarks, signature, censored, distortion, grain, long neck, unnatural pose, asymmetrical face, bad feet, distorted eyes, asymmetrical eyes, iris distortion, extra arms, extra legs, distorted body, unrealistic, unnatural skin, glitch, double torso, bad posture, plastic skin, plastic clothing, glossy plastic fabric, CG fabric, shiny synthetic fabric, fused clothing, unreal fabric, badly fitted bikini, fused body and clothes, floating clouds, distorted bikini, missing nipples, bad anatomy genitals, hands covering breasts, hands on chest, generic sexy pose, hand-breast bias, extra digit, fewer digits, finger webbing, melted hands, claw-like hands";

                if (apiKey) {
                    try {
                        const { generateImage } = await import('@/lib/novita-api');

                        // Deduct tokens first
                        const tokensToDeduct = isPremium ? 5 : 0;
                        if (isPremium) {
                            await deductTokens(linkedAccount.user_id, tokensToDeduct, 'telegram_image_gen');
                        }

                        console.log(`🚀 [Telegram] Generating image${userUploadedImageUrl ? ' (img2img)' : ''} with Seedream 4.5 for user: ${linkedAccount.user_id}`);

                        // Prepare ControlNet if image provided (img2img)
                        let controlnetUnits: any[] = [];
                        if (userUploadedImageUrl) {
                            const base64Res = await fetch(userUploadedImageUrl);
                            const arrayBuffer = await base64Res.arrayBuffer();
                            const base64String = Buffer.from(arrayBuffer).toString('base64');
                            controlnetUnits = [
                                {
                                    model_name: "ip-adapter_xl",
                                    weight: 0.8,
                                    control_image: base64String,
                                    module_name: "none"
                                }
                            ];
                        }

                        // Add character-specific reference photos (Face and Anatomy) from metadata
                        const metadata = character?.metadata || {};
                        if (metadata.face_reference_url) {
                            controlnetUnits.push({
                                model_name: "ip-adapter_plus_face_xl",
                                weight: 1.0,
                                control_image: metadata.face_reference_url,
                                module_name: "none"
                            });
                        }
                        if (metadata.anatomy_reference_url) {
                            controlnetUnits.push({
                                model_name: "ip-adapter_xl",
                                weight: 0.8,
                                control_image: metadata.anatomy_reference_url,
                                module_name: "none"
                            });
                        }
                        const result = await generateImage({
                            prompt: enhancedPrompt,
                            negativePrompt: baseNegative,
                            width: 1600,
                            height: 2400,
                            style: 'realistic',
                            controlnet_units: controlnetUnits
                        });

                        if (result && result.url) {
                            let imageUrl = result.url;

                            // PERSISTENT SAVING: Upload to Cloudinary and save to user collection
                            try {
                                console.log("🔄 [Telegram] Saving image to permanent collection...");
                                const { uploadImageToCloudinary } = await import("@/lib/cloudinary-upload");
                                const permanentUrl = await uploadImageToCloudinary(imageUrl, 'telegram-chat-images');

                                if (permanentUrl) {
                                    imageUrl = permanentUrl;
                                    console.log("✅ [Telegram] Permanent URL:", imageUrl);
                                }

                                // Insert into generated_images for gallery visibility
                                await supabase.from("generated_images").insert({
                                    user_id: linkedAccount.user_id,
                                    character_id: linkedAccount.character_id,
                                    image_url: imageUrl,
                                    prompt: enhancedPrompt,
                                    model_used: "seedream-4.5",
                                    metadata: { source: "telegram", auto_saved: true }
                                });

                                // 2. Also save to messages table for cross-platform chat sync
                                if (activeSessionId) {
                                    const sContext = await getStoryContext(supabase, linkedAccount.user_id, linkedAccount.character_id);
                                    const dynamicCaption = await generatePhotoCaption(
                                        characterName,
                                        characterPrompt,
                                        text || "sending a generated photo",
                                        isPremium,
                                        sContext
                                    );

                                    await supabase.from("messages").insert({
                                        session_id: activeSessionId,
                                        user_id: linkedAccount.user_id,
                                        role: 'assistant',
                                        content: dynamicCaption,
                                        is_image: true,
                                        image_url: imageUrl,
                                        metadata: { source: "telegram", auto_saved: true }
                                    });

                                    await sendTelegramPhoto(chatId, imageUrl, dynamicCaption);
                                } else {
                                    await sendTelegramPhoto(chatId, imageUrl, `Here's what I made for you... do you like it? 💕`);
                                }

                                // Update character images array
                                const { data: charData } = await supabase
                                    .from('characters')
                                    .select('images')
                                    .eq('id', linkedAccount.character_id)
                                    .single();

                                if (charData) {
                                    const currentImgs = charData.images || [];
                                    if (!currentImgs.includes(imageUrl)) {
                                        await supabase
                                            .from('characters')
                                            .update({ images: [...currentImgs, imageUrl] } as any)
                                            .eq('id', linkedAccount.character_id);
                                    }
                                }
                            } catch (saveErr) {
                                console.error("❌ [Telegram] Failed to save image permanently:", saveErr);
                            }

                            await incrementImageUsage(linkedAccount.user_id);
                            return NextResponse.json({ ok: true });
                        }
                    } catch (e: any) {
                        console.error("Telegram image gen error:", e);
                        await sendTelegramMessage(chatId, `I'm sorry, I hit a snag: ${e.message || 'Generation failed'}. Let's keep chatting? 💕`);
                        return NextResponse.json({ ok: true });
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

            // Story branch buttons removed as requested by user to keep chat clean

            // Save AI response
            if (activeSessionId) {
                await supabase.from('messages').insert({
                    session_id: activeSessionId,
                    user_id: linkedAccount.user_id,
                    role: 'assistant',
                    content: aiResponse,
                    metadata: { source: 'telegram', model: isPremium ? 'deepseek-r1' : 'gpt-4o-mini' },
                });
            }

            await sendTelegramMessage(chatId, aiResponse, { reply_markup: replyMarkup });
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
