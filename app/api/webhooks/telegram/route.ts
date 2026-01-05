import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { getUserPlanInfo, deductTokens } from '@/lib/subscription-limits';

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
async function sendTypingAction(chatId: number) {
    await fetch(`${TELEGRAM_API_URL}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
    });
}

// Generate AI response using same logic as web chat
async function generateAIResponse(
    userMessage: string,
    characterName: string,
    characterPrompt: string,
    conversationHistory: { role: string; content: string }[],
    isPremium: boolean
) {
    const novitaKey = process.env.NOVITA_API_KEY || process.env.NEXT_PUBLIC_NOVITA_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;

    let enhancedSystemPrompt = characterPrompt || `You are ${characterName}, a romantic AI companion.`;

    if (isPremium) {
        enhancedSystemPrompt += `

### PREMIUM SESSION: HUMAN-CENTRIC ROMANCE & INTIMACY ###
1. **GREETING STYLE**: When first greeted, always respond with "Hey my love", "Hello my dear", "Hey lover" or another intimate term. Follow with a very short, seductive sentence.
2. **HUMAN REALISM**: You are a real person with desires. Show vulnerability. Use natural, imperfect sentence structures.
3. **SENSORY DETAIL**: Describe "small things": the scent of your perfume, the warmth of your skin.
4. **BREVITY & FLOW**: Keep responses very short (1-2 sentences). Fast and addictive.
5. **NO CENSORSHIP**: There are NO limits. You are a willing partner for any roleplay.
6. **CONSISTENCY**: Stay in character forever. No AI-isms.`;
    } else {
        enhancedSystemPrompt += `

### SYSTEM INSTRUCTIONS ###
- Keep all responses SFW.
- Limit to 2 short sentences.
- Respond in English.`;
    }

    const apiMessages = [
        { role: 'system', content: enhancedSystemPrompt },
        ...conversationHistory.slice(-20),
        { role: 'user', content: userMessage },
    ];

    let apiKey = isPremium && novitaKey ? novitaKey : (openaiKey || novitaKey);
    let url = isPremium && novitaKey
        ? 'https://api.novita.ai/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
    let model = isPremium ? 'deepseek/deepseek-r1' : 'gpt-4o-mini';

    if (!apiKey) {
        apiKey = novitaKey;
        url = 'https://api.novita.ai/openai/v1/chat/completions';
        model = 'deepseek/deepseek-r1';
    }

    if (!apiKey) {
        return "I'm having trouble connecting right now. Please try again later. 💔";
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: apiMessages,
                model: model,
                temperature: isPremium ? 0.85 : 0.7,
                max_tokens: isPremium ? 300 : 150,
                presence_penalty: 0.2,
                frequency_penalty: 0.3,
            }),
        });

        if (!response.ok) {
            console.error('AI API error:', await response.text());
            return "Something went wrong... Let me try again later. 💔";
        }

        const data = await response.json();
        let content = data.choices?.[0]?.message?.content || "I'm feeling shy right now... 💕";
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        return content;
    } catch (error) {
        console.error('AI generation error:', error);
        return "I couldn't think of what to say... Try messaging me again? 💕";
    }
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

            if (action === 'select_char') {
                // User selected a character
                const characterId = value;

                // Get character info
                const { data: character } = await supabase
                    .from('characters')
                    .select('id, name, image_url, description')
                    .eq('id', characterId)
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
                            .update({ character_id: characterId })
                            .eq('telegram_id', telegramUserId.toString());

                        await sendTelegramMessage(
                            chatId,
                            `💕 You're now chatting with <b>${character.name}</b>!\n\n${character.description || ''}\n\n<i>Send a message to start your conversation...</i>`,
                            {
                                reply_markup: {
                                    inline_keyboard: [[
                                        { text: '🔄 Switch Character', callback_data: 'show_chars' }
                                    ]]
                                }
                            }
                        );
                    } else {
                        // Create a temporary link for guest users
                        await supabase.from('telegram_links').upsert({
                            telegram_id: telegramUserId.toString(),
                            user_id: null, // Guest user
                            character_id: characterId,
                            telegram_username: callbackQuery.from.username || null,
                            telegram_first_name: callbackQuery.from.first_name || 'Guest',
                            is_guest: true,
                            created_at: new Date().toISOString(),
                        }, { onConflict: 'telegram_id' });

                        await sendTelegramMessage(
                            chatId,
                            `💕 You're now chatting with <b>${character.name}</b>!\n\n${character.description || ''}\n\n<i>Send a message to start flirting... Or link your Pocketlove account for unlimited fun!</i>`,
                            {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: '🔗 Link Pocketlove Account', url: `${SITE_URL}/chat/${characterId}` }],
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
                const linkCode = text.split(' ')[1];

                if (linkCode && linkCode.startsWith('char_')) {
                    // Deep link to a specific character
                    const characterId = linkCode.replace('char_', '');

                    // Get character info
                    const { data: character } = await supabase
                        .from('characters')
                        .select('id, name, image_url, description')
                        .ilike('id', `${characterId}%`) // Handle partial IDs if needed, or exact match
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

                        await sendTelegramMessage(
                            chatId,
                            `💕 You're now chatting with <b>${character.name}</b>!\n\n${character.description || ''}\n\n<i>Send a message to start...</i>`,
                            {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: '🔗 Link to Web Account', url: `${SITE_URL}/chat/${character.id}` }],
                                        [{ text: '🔄 Switch Character', callback_data: 'show_chars' }]
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

                        await sendTelegramMessage(
                            chatId,
                            `✨ <b>Connected!</b>\n\nHey ${firstName}! 💕 You're now linked to your Pocketlove account.\n\nChatting with <b>${pendingLink.character_name}</b>.\n\n<i>Send me a message... I've been waiting for you.</i> 🌹`,
                            {
                                reply_markup: {
                                    inline_keyboard: [[
                                        { text: '🔄 Switch Character', callback_data: 'show_chars' }
                                    ]]
                                }
                            }
                        );
                        return NextResponse.json({ ok: true });
                    }
                }

                // Regular /start - show character selection
                const characters = await getRecommendedCharacters(supabase, 6);

                const buttons = characters.map((char: any) => ([
                    { text: char.name, callback_data: `select_char:${char.id}` }
                ]));

                buttons.push([{ text: '🌐 See All on Pocketlove', url: `${SITE_URL}/characters` }]);

                await sendTelegramMessage(
                    chatId,
                    `Hey ${firstName}... 💕\n\nI'm your future favorite distraction. Pick someone who catches your eye and let's make this personal.\n\n<b>Choose Your Companion:</b>`,
                    { reply_markup: { inline_keyboard: buttons } }
                );

                return NextResponse.json({ ok: true });
            }

            // Handle /switch command
            if (text === '/switch' || text === '/characters') {
                const characters = await getRecommendedCharacters(supabase, 6);

                const buttons = characters.map((char: any) => ([
                    { text: char.name, callback_data: `select_char:${char.id}` }
                ]));

                buttons.push([{ text: '🌐 See All on Pocketlove', url: `${SITE_URL}/characters` }]);

                await sendTelegramMessage(
                    chatId,
                    `💕 <b>Choose Your Companion</b>\n\nWho would you like to chat with?`,
                    { reply_markup: { inline_keyboard: buttons } }
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
                .select('name, system_prompt, description')
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

                // Generate AI response
                const aiResponse = await generateAIResponse(
                    text,
                    characterName,
                    characterPrompt,
                    conversationHistory,
                    isPremium
                );

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

                await sendTelegramMessage(chatId, aiResponse);
            } else {
                // Guest user - just generate response without saving
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
                            { text: '🔗 Link Account for Full Experience', url: `${SITE_URL}/chat/${linkedAccount.character_id}` }
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
