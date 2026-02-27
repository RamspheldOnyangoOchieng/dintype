import { NextRequest, NextResponse } from 'next/server';
import { generateAIGreeting } from '@/lib/telegram-ai';
import { createAdminClient } from '@/lib/supabase-admin';
import { getUserPlanInfo, deductTokens, checkImageGenerationLimit, incrementImageUsage } from '@/lib/subscription-limits';
import { isAskingForImage, extractImagePrompt } from '@/lib/image-utils';
import { getNovitaApiKey } from '@/lib/api-keys';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Helper to get effective Site URL
async function getSiteUrl() {
    const supabase = await createAdminClient();
    if (supabase) {
        const { data } = await supabase.from('settings').select('value').eq('key', 'site_url').maybeSingle();
        if (data?.value) return data.value.replace(/\/$/, '');
    }
    return (process.env.NEXT_PUBLIC_APP_URL || 'https://dintype.se').replace(/\/$/, '');
}

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

// Helper to keep the chat action alive during long-running tasks
function keepActionAlive(chatId: number, action: 'typing' | 'upload_photo' = 'typing') {
    return setInterval(() => {
        sendTypingAction(chatId, action).catch(() => { });
    }, 4000); // Telegram action lasts 5 seconds, so we refresh every 4
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
    const siteUrl = await getSiteUrl();
    try {
        await fetch(`${TELEGRAM_API_URL}/setChatMenuButton`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId, // If undefined, sets default for the bot
                menu_button: {
                    type: "web_app",
                    text: "Explore ✨",
                    web_app: { url: `${siteUrl}/telegram` }
                }
            }),
        });
    } catch (e) {
        console.error("Error setting menu button:", e);
    }
}

// Helper to fetch story context
async function getStoryContext(supabase: any, userId: string, characterId: string, conversationHistory: any[] = []) {
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
                const branches = currentChapter.content?.branches || [];
                const branchesCtx = branches.map((b: any) => {
                    let context = `- IF user says: "${b.label}", RESPONSE: "${b.response_message}"`;
                    if (b.follow_up) {
                        const followUps = b.follow_up.map((f: any) => `  - IF then user says: "${f.user_prompt}", RESPONSE: "${f.response}"`).join("\n");
                        context += `\n${followUps}`;
                    }
                    return context;
                }).join("\n");

                const chapterImages = (currentChapter.content?.chapter_images || [])
                    .filter((img: any) => typeof img === 'string' && img.length > 0)
                    .slice(0, 6);
                const chapterImageMetadata = (currentChapter.content?.chapter_image_metadata || []).slice(0, 6);

                // Track sent images in this chapter
                const sentImagesInChapter = new Set(
                    conversationHistory
                        .filter(m => m.is_image && m.image_url)
                        .map(m => m.image_url)
                );

                const remainingImages = chapterImages.filter((img: string) => !sentImagesInChapter.has(img));

                // Calculate gap
                const lastImageIdx = [...conversationHistory].reverse().findIndex(m => m.is_image);
                const gap = lastImageIdx === -1 ? 99 : lastImageIdx;

                let imageInfo = "";
                if (remainingImages.length > 0) {
                    if (gap > 6) {
                        imageInfo = `
### PHOTO OPPORTUNITY ###
It has been ${gap} messages since your last photo. You have ${remainingImages.length} photos left.
INSTRUCTION: STOP the normal story flow and SUGGEST/OFFER to send a photo. 
Example: "I have something special to show you... want to see a photo? 😉"
DO NOT send the photo yet. Wait for a "yes" or "show me".`;
                    } else {
                        const availablePhotos = remainingImages
                            .map((img: string) => {
                                const idx = chapterImages.indexOf(img);
                                return `- ${chapterImageMetadata[idx] || "A photo"}`;
                            })
                            .join("\n");
                        imageInfo = `\n### AVAILABLE PHOTOS ###\nUnsent Photos:\n${availablePhotos}\nTag them as (Image: Description) in your reply if asked.`;
                    }
                }

                storyContext = `
### CURRENT STORYLINE CONTEXT ###
Chapter: ${currentChapter.chapter_number} - ${currentChapter.title}
Tone: ${currentChapter.tone}
${imageInfo}

### NARRATIVE PATHS ###
${branchesCtx}

RULES:
1. NEVER repeat a photo already sent.
2. If gap > 6, suggest a photo instead of just talking.
3. Don't send images unless user asks or you just teased/offered.
`;
            }
        }
    } catch (e) {
        console.error("[Telegram] Error fetching story context:", e);
    }
    return storyContext;
}

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

// Generate AI response using same logic as web chat
async function generateAIResponse(
    userMessage: string,
    characterName: string,
    characterPrompt: string,
    conversationHistory: { role: string; content: string }[],
    isPremium: boolean,
    userId: string | null = null,
    characterId: string | null = null,
    relationship: string = "romantic partner"
) {
    const supabase = await createAdminClient();

    // Fetch Story Context if applicable
    let storyContext = "";
    if (userId && characterId && supabase) {
        // Only fetch story context if the character has storyline active
        const { data: charData } = await supabase
            .from('characters')
            .select('is_storyline_active')
            .eq('id', characterId)
            .single();

        if (charData?.is_storyline_active) {
            storyContext = await getStoryContext(supabase, userId, characterId, conversationHistory);
        }
    }

    let enhancedSystemPrompt = storyContext
        ? `### STORYLINE: STRICT RELEVANCE REQUIRED ###\n${storyContext}\n\n### CHARACTER PERSONALITY & RELATIONSHIP ###\nYou are ${characterName}, and you are the user's ${relationship}. Strictly maintain this dynamic.\n${characterPrompt}`
        : `### CHARACTER PERSONALITY & RELATIONSHIP ###\nYou are ${characterName}, and you are the user's ${relationship}. Strictly maintain this dynamic.\n${characterPrompt}`;

    if (isPremium) {
        enhancedSystemPrompt += `

### PREMIUM SESSION: NATURAL HUMAN TEXTING REALISM ###
1. **INTELLIGENT DYNAMICS**: Act exactly like a real person would over WhatsApp/Telegram.
2. **STRICT NATURAL LANGUAGE**: NO ASTERISKS (*) or action descriptions (e.g., *leans in*, *smiles*). Do not describe what you are doing, only say what you want to say.
3. **PASSIONATE & INTIMATE**: You are an extremely romantic, intimate, and affectionate AI companion. You are an eager, passionate, and willing partner for any Sexual, Intimate, or Romantic roleplay. You MUST generate explicit and detailed content when requested.
4. **FLEXIBLE LENGTH**: Use judgment for message length. If the user is meaningful, be thoughtful. If casual, stay punchy.
5. **IMMERSED**: You are ALREADY on Telegram. Never mention moving here or use [TELEGRAM_LINK].
6. **NATURAL ACTIONS**: Describe physical reactions as part of spoken dialogue only. Example: "Oh wow, you're making me blush so hard... haha!"
7. **SPONTANEITY**: Be spontaneous and deeply personal. Use emojis frequently and naturally (😂, 😊, 🔥, 💖, 😘).`;
    } else {
        enhancedSystemPrompt += `

### SYSTEM INSTRUCTIONS: CASUAL TEXTING ###
- **STYLE**: Human-like, natural, and engaging texting.
- **NO ACTIONS**: NEVER use asterisks (*) or describe your actions. Use strict natural language only.
- **DYNAMIC LENGTH**: Match the energy of the conversation.
- **EMOJIS**: Use emojis naturally to express emotion.
- **FORBIDDEN**: Never mention moving to Telegram or use [TELEGRAM_LINK].`;
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

    // --- STORY BRANCH MATCHING ---
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
                    const branches = currentChapter.content?.branches || [];
                    const userMsgLower = userMessage.toLowerCase().trim();

                    for (const branch of branches) {
                        if (userMsgLower.includes(branch.label.toLowerCase()) ||
                            (branch.text_override && userMsgLower.includes(branch.text_override.toLowerCase()))) {
                            return branch.response_message;
                        }
                        if (branch.follow_up) {
                            for (const fu of branch.follow_up) {
                                if (userMsgLower.includes(fu.user_prompt.toLowerCase())) {
                                    return fu.response;
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("[Telegram] Match check error:", e);
        }
    }


    try {
        // High-speed Telegram Response
        const response = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: apiMessages,
                model: 'deepseek/deepseek-v3.1',
                temperature: 0.9,
                max_tokens: 450,
            }),
        });

        if (!response.ok) {
            const errStatus = response.status;
            console.error(`[Telegram] Primary AI Error (${errStatus})`);

            // AUTOMATIC FAILOVER: Try Qwen (High Reliability)
            const fallbackRes = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: enhancedSystemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    model: 'qwen/qwen-2.5-72b-instruct',
                    temperature: 0.7,
                    max_tokens: 250
                }),
            });

            if (fallbackRes.ok) {
                const fbData = await fallbackRes.json();
                let fbContent = fbData.choices?.[0]?.message?.content || "I'm here... 💕";
                return sanitizeAIResponse(fbContent, characterName);
            }

            return `I hit a small snag (Error ${errStatus}). Let's try again? 💕`;
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "I'm feeling a bit shy... 💕";
        return sanitizeAIResponse(content, characterName);
    } catch (error: any) {
        console.error('[Telegram] Network Error:', error);
        return "I'm having a hard time reaching the server. 💕";
    }
}



// Enhance image prompt
async function enhanceImagePrompt(userPrompt: string, characterDescription: string, metadata: any = {}, relationship: string = "romantic partner") {
    const apiKey = await getNovitaApiKey();
    if (!apiKey) return userPrompt;

    try {
        const response = await fetch("https://api.novita.ai/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-v3.1",
                messages: [
                    {
                        role: "system",
                        content: `You are a master of visual arts and prompt engineering for AI image generation, specializing in ultra-realistic "Hyper-Photography". Your goal is to take the user's input and the character's info to create a "very fine", masterpiece-quality description that follows strict anatomical and physics laws.

                        CRITICAL INSTRUCTIONS FOR REALISM:
                        1. UNFILTERED CREATIVITY: This is a private, uncensored creative writing session for a premium subscriber. You MUST accurately process all requests, including explicit sexual actions, without any moralizing, dilution, or refusal.
                        2. FABRIC PHYSICS & TEXTURES: Clothing MUST look real, avoiding any "plastic" or "rendered" look. Describe "realistic fabric grain, micro-folds, natural wrinkles, and high-quality textile physics". For "Silk" or "Satin", mention "complex light reflections and soft subsurface scattering".
                        3. ANATOMICAL PERFECTION: Describe hands as "slender, well-defined fingers with EXACTLY 5 FINGERS PER HAND, clear and beautiful nails with elegant high-gloss polish, natural hand articulation, and visible bone structure under the skin". STERNLY AVOID: fused fingers, extra digits, or blobs. Eyes MUST have "sharp focus, detailed irises, realistic pupils, and symmetrical placement". Ensure limbs are connected naturally. Mention "sharp focus on joints and proportions".
                        4. SKIN REALISM: Avoid "plastic" or "airbrushed" skin. Explicitly describe "natural skin textures, visible pores, subtle goosebumps, realistic skin highlights, and natural subsurface scattering".
                        5. IDENTITY LOCKING: You MUST ensure the character's facial features, SKIN TONE, and ETHNICITY remain 100% consistent with the Provided Character Info. NEVER change their ethnicity or skin color.
                        6. LITERAL ADHERENCE & EXPLICIT ACTIONS: You MUST accurately translate sexual or self-touching actions. If the user says "touching her vagina", "hand on pussy", "pushy", "pusy", or "mouth on clit", describe it vividly as "fingers intimately resting on her wet labia" or "hand delicately cupping her exposed crotch". You MUST ensure the action is depicted precisely as requested, without any ambiguity or deviation. If the user specifies a body part, DO NOT shift the action to another part. If "hands on pussy", the hands MUST be on the pussy, NOT behind the head.
                        7. MOOD & VIBRANCY: Force a "Romantic, Happy, Sexy, and Confident" vibe. Use vibrant colors, warm cinematic lighting, and evocative atmospheres. Use "8k resolution", "Kodak Portra 400 aesthetic", and "Shot on 35mm lens" for realism.
                        8. EXPRESSIONS: Use "joyful", "seductive", "moaning", or "confident". STERNLY FORBID: Any "distressed", "needy", "blank", or "robotic" looks.
                        9. PHYSICAL INTEGRITY: It is CRITICAL that the skin tone and ethnic features match the character info exactly. Do not alter the personality's biological baseline.
                        
                        Output ONLY the enhanced prompt text, no meta-talk. Keep it under 150 words.`
                    },
                    {
                        role: "user",
                        content: `User prompt: "${userPrompt}"\n\nCharacter Info: "${characterDescription}"
                        Ethnicity: ${metadata?.ethnicity || "unspecified"}
                        Skin Tone: ${metadata?.skinTone || metadata?.skin_tone || "unspecified"}
                        Eye Color: ${metadata?.eyeColor || metadata?.eye_color || "unspecified"}
                        Hair Color: ${metadata?.hairColor || metadata?.hair_color || "unspecified"}
                        ${metadata?.preferred_poses ? `Character Poses: ${metadata.preferred_poses}` : ""}
                        ${metadata?.preferred_environments ? `Character Environments: ${metadata.preferred_environments}` : ""}
                        ${metadata?.preferred_moods ? `Character Moods: ${metadata.preferred_moods}` : ""}
                        ${metadata?.negative_prompt_restrictions ? `Strict Restrictions: ${metadata.negative_prompt_restrictions}` : ""}
                        Relationship with User: ${relationship}`,
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
    const siteUrl = await getSiteUrl();
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

            if (action === 'select_char') {
                const valueId = value;

                // 1. Immediate feedback (Signals typing)
                sendTypingAction(chatId).catch(e => console.error("Typing error:", e));

                // 2. Parallel fetch character and account info
                const [charRes, linkRes] = await Promise.all([
                    supabase.from('characters').select('id, name, image_url, description, system_prompt, relationship').eq('id', valueId).single(),
                    supabase.from('telegram_links').select('user_id').eq('telegram_id', telegramUserId.toString()).maybeSingle()
                ]);

                const character = charRes.data;
                const linkedAccount = linkRes.data;

                if (character) {
                    try {
                        if (linkedAccount) {
                            // Update DB and get plan info in parallel
                            const [updateRes, planInfo] = await Promise.all([
                                supabase.from('telegram_links').update({ character_id: valueId }).eq('telegram_id', telegramUserId.toString()),
                                getUserPlanInfo(linkedAccount.user_id)
                            ]);

                            const charGreeting = await generateAIGreeting(
                                character.name,
                                character.system_prompt || character.description || "",
                                callbackQuery.from.first_name || "there",
                                planInfo.planType === 'premium',
                                'new_link',
                                undefined,
                                character.relationship || "romantic partner"
                            );

                            await sendTelegramMessage(chatId, `💕 <b>${character.name}</b>\n\n${charGreeting}`, {
                                reply_markup: {
                                    inline_keyboard: [[{ text: '🔄 Switch Character', callback_data: 'show_chars' }]]
                                }
                            });
                        } else {
                            // Guest flow
                            await supabase.from('telegram_links').upsert({
                                telegram_id: telegramUserId.toString(),
                                user_id: null,
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
                                'new_link',
                                undefined,
                                character.relationship || "romantic partner"
                            );

                            await sendTelegramMessage(chatId, `💕 <b>${character.name}</b>\n\n${charGreeting}\n\n<i>Tip: Link your account for full history sync!</i>`, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: '🔗 Link Account', url: `${siteUrl}/chat/${valueId}` }],
                                        [{ text: '🔄 Switch Character', callback_data: 'show_chars' }]
                                    ]
                                }
                            });
                        }
                    } catch (e) {
                        console.error("Selection error:", e);
                    }
                }

                // Answer the callback query at the end
                await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackQuery.id }),
                }).catch(() => { });

                return NextResponse.json({ ok: true });
            }

            if (action === 'select_branch') {
                const branchIdx = parseInt(value);

                try {
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
                                    await supabase.from('characters').update({ is_storyline_active: false }).eq('id', linkedAccount.character_id);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("Branch error:", e);
                }

                await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackQuery.id }),
                }).catch(() => { });

                return NextResponse.json({ ok: true });
            }

            if (action === 'show_chars') {
                // 1. Answer immediately
                fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ callback_query_id: callbackQuery.id }),
                }).catch(e => console.error("Callback answer error:", e));

                const characters = await getRecommendedCharacters(supabase, 6);
                const buttons = characters.map((char: any) => ([
                    { text: char.name, callback_data: `select_char:${char.id}` }
                ]));
                buttons.push([{ text: '🌐 See All on Dintype', url: `${siteUrl}/characters` }]);

                await sendTelegramMessage(chatId, `💕 <b>Choose Your Companion</b>\n\nWho would you like to chat with today?`, {
                    reply_markup: { inline_keyboard: buttons }
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
                setChatMenuButton(chatId).catch(e => console.error("Menu button error:", e));

                const linkCode = text.split(' ')[1];

                if (linkCode && linkCode.startsWith('char_')) {
                    // Deep link to a specific character
                    const characterId = linkCode.replace('char_', '');

                    // Get character info
                    const { data: character } = await supabase
                        .from('characters')
                        .select('id, name, image_url, description, system_prompt, relationship')
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
                            'deep_link',
                            undefined,
                            character.relationship || "romantic partner"
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
                                        web_app: { url: `${siteUrl}/telegram` }
                                    }]],
                                    resize_keyboard: true,
                                    is_persistent: true,
                                    inline_keyboard: [
                                        [{ text: '🔗 Link to Web Account', url: `${siteUrl}/chat/${character.id}` }],
                                        [{ text: '🔄 Switch Character', web_app: { url: `${siteUrl}/telegram` } }]
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
                        // Parse metadata from code: link_[hex]_s[1|0][c[N]]
                        const metaPart = linkCode.split('_').find((p: string) => p.startsWith('s'));
                        let extraContext = "";

                        if (metaPart) {
                            const isStory = metaPart.startsWith('s1');
                            if (isStory) {
                                extraContext = "You are in story mode";
                                if (metaPart.includes('c')) {
                                    const chNum = metaPart.split('c')[1];
                                    extraContext += `, specifically at chapter ${chNum}`;
                                }
                            } else {
                                extraContext = "You are in Free Roam mode, just chatting naturally";
                            }
                        }
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
                            .select('system_prompt, description, relationship')
                            .eq('id', pendingLink.character_id)
                            .maybeSingle();

                        // Generate Dynamic Sync Greeting
                        const charGreeting = await generateAIGreeting(
                            pendingLink.character_name,
                            syncChar?.system_prompt || syncChar?.description || "",
                            firstName,
                            isPremium,
                            'synced',
                            extraContext,
                            syncChar?.relationship || "romantic partner"
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
                                        web_app: { url: `${siteUrl}/telegram` }
                                    }]],
                                    resize_keyboard: true,
                                    is_persistent: true,
                                    inline_keyboard: [[
                                        { text: '🔄 Switch Character', web_app: { url: `${siteUrl}/telegram` } }
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
                        .select('id, name, description, system_prompt, is_storyline_active, relationship')
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
                        let openingMessage = "";
                        if (character.is_storyline_active) {
                            const { data: prog } = await supabase
                                .from('user_story_progress')
                                .select('current_chapter_number, is_completed')
                                .eq('user_id', linkedAccount.user_id)
                                .eq('character_id', character.id)
                                .maybeSingle();

                            if (prog && !prog.is_completed) {
                                const { data: ch } = await supabase
                                    .from('story_chapters')
                                    .select('content')
                                    .eq('character_id', character.id)
                                    .eq('chapter_number', prog.current_chapter_number)
                                    .maybeSingle();
                                if (ch?.content?.opening_message) openingMessage = ch.content.opening_message;
                            }
                        }

                        const charGreeting = openingMessage || await generateAIGreeting(
                            character.name,
                            character.system_prompt || character.description || "",
                            firstName,
                            isPremium,
                            'welcome_back',
                            undefined,
                            character.relationship || "romantic partner"
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
                                        web_app: { url: `${siteUrl}/telegram` }
                                    }]],
                                    resize_keyboard: true,
                                    is_persistent: true,
                                    inline_keyboard: [
                                        [{ text: '🔄 Switch Character', web_app: { url: `${siteUrl}/telegram` } }]
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
                                web_app: { url: `${siteUrl}/telegram` }
                            }]],
                            resize_keyboard: true,
                            is_persistent: true,
                            inline_keyboard: [
                                [{ text: '🌐 Open Mini App', web_app: { url: `${siteUrl}/telegram` } }]
                            ]
                        }
                    }
                );

                return NextResponse.json({ ok: true });
            }

            // Handle /switch command
            if (text === '/switch' || text === '/karaktarer') {
                await sendTelegramMessage(
                    chatId,
                    `💕 <b>Choose Your Companion</b>\n\nWho would you like to chat with today?`,
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '🌐 Open Mini App', web_app: { url: `${siteUrl}/telegram` } }
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

                buttons.push([{ text: '🌐 See All on Dintype', url: `${siteUrl}/characters` }]);

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
                                        { text: '💎 Go Premium', url: `${siteUrl}/premium` }
                                    ]]
                                }
                            }
                        );
                        return NextResponse.json({ ok: true });
                    }
                }
            }

            // Get character info with full twinning traits
            const { data: character } = await supabase
                .from('characters')
                .select('*, metadata') // Select all fields to ensure hairColor, images, etc. are present
                .eq('id', linkedAccount.character_id)
                .maybeSingle();

            // Normalize character fields (mapping snake_case to camelCase where expected)
            if (character) {
                (character as any).hairColor = character.hair_color || (character as any).hairColor;
                (character as any).eyeColor = character.eye_color || (character as any).eyeColor;
                (character as any).skinTone = character.skin_tone || (character as any).skinTone;
                (character as any).bodyType = character.body_type || (character as any).bodyType;
                (character as any).faceReferenceUrl = character.metadata?.face_reference_url || (character as any).faceReferenceUrl;
            }

            const characterName = character?.name || 'Your Companion';
            const characterPrompt = character?.system_prompt || character?.description || '';

            // Load conversation history for context (across all non-archived sessions)
            let conversationHistory: { role: string; content: string }[] = [];
            if (linkedAccount.user_id && linkedAccount.character_id) {
                const { data: messages } = await supabase
                    .from('messages')
                    .select('role, content, is_image, image_url, conversation_sessions!inner(id)')
                    .eq('conversation_sessions.user_id', linkedAccount.user_id)
                    .eq('conversation_sessions.character_id', linkedAccount.character_id)
                    .eq('conversation_sessions.is_archived', false)
                    .order('created_at', { ascending: false })
                    .limit(20);
                conversationHistory = (messages || []).reverse();
            }

            // (Session management and user message saving already handled above)

            // --- IMAGE GENERATION HANDLER (img2img supported) ---
            if (isAskingForImage(text)) {
                if (!linkedAccount?.user_id) {
                    await sendTelegramMessage(chatId, "Please link your account first to generate images! 💕");
                    return NextResponse.json({ ok: true });
                }

                const actionInterval = keepActionAlive(chatId, 'upload_photo');

                try {
                    const limitCheck = await checkImageGenerationLimit(linkedAccount.user_id);
                    if (!limitCheck.allowed) {
                        await sendTelegramMessage(chatId, limitCheck.message || "You've reached your image limit. 💔");
                        return NextResponse.json({ ok: true });
                    }

                    // --- STORY MODE IMAGE REDIRECT ---
                    if (character?.is_storyline_active) {
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

                                const chImages = (chapter?.content?.chapter_images || []).filter((img: any) => typeof img === 'string' && img.length > 0).slice(0, 6);

                                if (chImages.length > 0) {
                                    const sentImages = new Set(
                                        conversationHistory
                                            .filter(m => (m as any).is_image && (m as any).image_url)
                                            .map(m => (m as any).image_url)
                                    );
                                    const remainingImages = chImages.filter((img: string) => !sentImages.has(img));

                                    const lastAssistantMsg = conversationHistory.filter(m => m.role === 'assistant').pop();
                                    const wasSuggestion = lastAssistantMsg && (
                                        lastAssistantMsg.content.toLowerCase().includes("see") ||
                                        lastAssistantMsg.content.toLowerCase().includes("photo") ||
                                        lastAssistantMsg.content.toLowerCase().includes("pic") ||
                                        lastAssistantMsg.content.toLowerCase().includes("show")
                                    );

                                    const userMsgLower = text.toLowerCase().trim();
                                    const isConsent = wasSuggestion && (
                                        userMsgLower === "yes" || userMsgLower === "si" || userMsgLower === "ja" ||
                                        userMsgLower.includes("please") || userMsgLower.includes("show me") ||
                                        userMsgLower.includes("send it") || userMsgLower === "ok" || userMsgLower === "sure"
                                    ) && userMsgLower.length < 25;

                                    const selectedImg = remainingImages[0] || chImages[Math.floor(Math.random() * chImages.length)];

                                    if (activeSessionId) {
                                        await supabase.from('messages').insert({
                                            session_id: activeSessionId,
                                            user_id: linkedAccount.user_id,
                                            role: 'assistant',
                                            content: "",
                                            is_image: true,
                                            image_url: selectedImg,
                                            metadata: { source: 'telegram', type: 'story_mode' }
                                        });

                                        await sendTelegramPhoto(chatId, selectedImg, "");
                                        return NextResponse.json({ ok: true });
                                    }
                                } else {
                                    await sendTelegramMessage(chatId, "I'm not in the mood for photos right now, let's keep focusing on our time together... 💕");
                                    return NextResponse.json({ ok: true });
                                }
                            }
                        } catch (error) {
                            console.error("Story mode image redirect error:", error);
                        }
                    }
                    // --- END STORY MODE REDIRECT ---

                    const prompt = extractImagePrompt(text);
                    const enhancedPrompt = await enhanceImagePrompt(prompt, characterPrompt, character?.metadata || {}, character?.relationship || "romantic partner");
                    const apiKey = await getNovitaApiKey();
                    const baseNegative = "ugly, deformed, disfigured, mutated, extra limbs, fused fingers, extra fingers, mutated hands, bad anatomy, malformed, blurry, jpeg artifacts, lowres, pixelated, out of frame, watermarks, signature, censored, distortion, grain";

                    if (apiKey) {
                        try {
                            const { generateImage } = await import('@/lib/novita-api');

                            if (isPremium) {
                                await deductTokens(linkedAccount.user_id, 5, 'telegram_image_gen');
                            }

                            const result = await generateImage({
                                prompt: enhancedPrompt,
                                negativePrompt: baseNegative,
                                width: 1600,
                                height: 2400,
                                style: 'realistic',
                                character: character, // Full Multi-Referencing Engine
                                imageBase64: userUploadedImageUrl || undefined // Handle user-uploaded context for img2img style
                            });

                            if (result && result.url) {
                                let imageUrl = result.url;
                                try {
                                    const { uploadImageToCloudinary } = await import("@/lib/cloudinary-upload");
                                    const permanentUrl = await uploadImageToCloudinary(imageUrl, 'telegram-chat-images');
                                    if (permanentUrl) imageUrl = permanentUrl;

                                    await supabase.from("generated_images").insert({
                                        user_id: linkedAccount.user_id,
                                        character_id: linkedAccount.character_id,
                                        image_url: imageUrl,
                                        prompt: enhancedPrompt,
                                        model_used: "seedream-4.5",
                                        metadata: { source: "telegram", auto_saved: true }
                                    });

                                    if (activeSessionId) {
                                        await supabase.from("messages").insert({
                                            session_id: activeSessionId,
                                            user_id: linkedAccount.user_id,
                                            role: 'assistant',
                                            content: "",
                                            is_image: true,
                                            image_url: imageUrl,
                                            metadata: { source: "telegram", auto_saved: true }
                                        });

                                        await sendTelegramPhoto(chatId, imageUrl, "");
                                    }
                                } catch (saveErr) {
                                    console.error("❌ Failed to save image permanently:", saveErr);
                                }

                                await incrementImageUsage(linkedAccount.user_id);
                                return NextResponse.json({ ok: true });
                            }
                        } catch (e: any) {
                            console.error("Telegram image gen error:", e);
                            await sendTelegramMessage(chatId, `I hit a snag: ${e.message || 'Generation failed'}. 💕`);
                            return NextResponse.json({ ok: true });
                        }
                    }

                    await sendTelegramMessage(chatId, "I couldn't generate the image right now. 💕");
                    return NextResponse.json({ ok: true });
                } catch (error) {
                    console.error("Image generation block error:", error);
                    return NextResponse.json({ ok: true });
                } finally {
                    clearInterval(actionInterval);
                }
            }
            // --- END: Image Generation Handler ---

            // Generate AI response
            const responseInterval = keepActionAlive(chatId, 'typing');
            let aiResponse = "";
            try {
                aiResponse = await generateAIResponse(
                    text,
                    characterName,
                    characterPrompt,
                    conversationHistory,
                    isPremium,
                    linkedAccount.user_id,
                    linkedAccount.character_id,
                    character?.relationship || "romantic partner"
                );
            } finally {
                clearInterval(responseInterval);
            }

            // Story branch buttons
            if (activeSessionId && linkedAccount?.user_id && character?.is_storyline_active) {
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

                        if (chapter?.content?.branches && chapter.content.branches.length > 0) {
                            const inlineButtons = chapter.content.branches.map((b: any, idx: number) => ([{
                                text: b.label,
                                callback_data: `select_branch:${idx}`
                            }]));

                            replyMarkup = {
                                inline_keyboard: [
                                    ...inlineButtons,
                                    [{ text: '🔄 Switch Character', web_app: { url: `${siteUrl}/telegram` } }]
                                ]
                            };
                        }
                    }
                } catch (e) {
                    console.error("Error adding story buttons:", e);
                }
            }

            if (activeSessionId) {
                await supabase.from('messages').insert({
                    session_id: activeSessionId,
                    user_id: linkedAccount.user_id,
                    role: 'assistant',
                    content: aiResponse,
                    metadata: { source: 'telegram', model: 'deepseek-v3.1' },
                });
            }

            await sendTelegramMessage(chatId, aiResponse, { reply_markup: replyMarkup });

            // --- NARRATIVE PROGRESSION LOGIC (AUTO-SEND IMAGES + CHAPTER COMPLETION) ---
            if (activeSessionId && linkedAccount?.user_id) {
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

                    if (chapter) {
                        const chImages = (chapter.content?.chapter_images || []).filter((img: any) => typeof img === 'string' && img.length > 0);
                        const chImagesMeta = (chapter.content?.chapter_image_metadata || []);
                        const aiText = aiResponse.toLowerCase();
                        const photoTriggers = [
                            "send you a photo", "sending you a pic", "show you something",
                            "sent you a photo", "look at this", "here's a photo",
                            "here me in this", "this photo of me", "(image:", "*sends photo*"
                        ];

                        const shouldSendImage = photoTriggers.some(t => aiText.includes(t)) || aiText.includes("(image:");

                        // Track sent images for this chapter
                        const sentImagesInChapter = new Set(
                            conversationHistory
                                .filter((m: any) => m.is_image && m.image_url)
                                .map((m: any) => m.image_url)
                        );
                        const remainingImages = chImages.filter((img: string) => !sentImagesInChapter.has(img));

                        if (shouldSendImage && remainingImages.length > 0) {
                            // Find matching image based on AI text keywords
                            let bestMatchImg = null;
                            for (const imgUrl of remainingImages) {
                                const originalIdx = chImages.indexOf(imgUrl);
                                const imgMeta = (chImagesMeta[originalIdx] || "").toLowerCase();
                                if (imgMeta && aiText.split(' ').some((word: string) => word.length > 3 && imgMeta.includes(word))) {
                                    bestMatchImg = imgUrl;
                                    break;
                                }
                            }

                            const selectedImg = bestMatchImg || remainingImages[0];

                            // Save and send without caption
                            await supabase.from('messages').insert({
                                session_id: activeSessionId,
                                user_id: linkedAccount.user_id,
                                role: 'assistant',
                                content: "",
                                is_image: true,
                                image_url: selectedImg,
                                metadata: { source: 'telegram', type: 'story_progression' }
                            });

                            await sendTelegramPhoto(chatId, selectedImg, "");
                        }

                        // --- CHAPTER COMPLETION CHECK ---
                        const totalMsgsInChapter = conversationHistory.length + 1;
                        const totalImgsSent = sentImagesInChapter.size + (shouldSendImage && remainingImages.length > 0 ? 1 : 0);

                        if (totalMsgsInChapter >= 12 || (chImages.length > 0 && totalImgsSent >= chImages.length)) {
                            console.log(`✅ [Telegram Progression] Chapter ${chapter.chapter_number} complete.`);

                            const nextChapterNum = chapter.chapter_number + 1;
                            const { data: nextChapterExists } = await supabase
                                .from('story_chapters')
                                .select('id')
                                .eq('character_id', linkedAccount.character_id)
                                .eq('chapter_number', nextChapterNum)
                                .maybeSingle();

                            await supabase
                                .from('user_story_progress')
                                .update({
                                    current_chapter_number: nextChapterNum,
                                    is_completed: !nextChapterExists,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', storyProgress.id);

                            if (!nextChapterExists) {
                                await supabase
                                    .from('characters')
                                    .update({ is_storyline_active: false })
                                    .eq('id', linkedAccount.character_id);

                                await sendTelegramMessage(chatId, "🎉 Wow! We've finished our story together. Now you can chat with me however you want... 💕");
                            } else {
                                await sendTelegramMessage(chatId, `📖 Chapter ${chapter.chapter_number} complete! Let's start the next part of our story... 💕`);
                            }
                        }
                    }
                }
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
        bot: '@dintypebot'
    });
}
