import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

function calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

async function moderateWithOpenAI(text: string): Promise<{ flagged: boolean; categories: Record<string, boolean>; category_scores: Record<string, number>; }> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY not set. Skipping OpenAI moderation.");
        return { flagged: false, categories: {}, category_scores: {} };
    }
    try {
        const response = await fetch("https://api.openai.com/v1/moderations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({ input: text }),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("OpenAI moderation API returned error:", data);
            return { flagged: true, categories: { api_error: true }, category_scores: {} };
        }
        return data.results[0];
    } catch (error) {
        console.error("Error calling OpenAI moderation API:", error);
        return { flagged: true, categories: { api_error: true }, category_scores: {} };
    }
}

interface ModerationResult {
    blocked: boolean;
    message?: string;
    moderatedContent?: string;
}

export async function moderateContent({
    userId,
    content,
    contentType,
    isAgeRestrictedFeature = false,
}: {
    userId: string | null;
    content: string;
    contentType: string;
    isAgeRestrictedFeature?: boolean;
}): Promise<ModerationResult> {
    const supabase = createClient(headers().get('cookie'));
    let policyViolation: string | null = null;
    let actionTaken: string = 'allowed';
    let triggeredRules: string[] = [];
    let moderatedContent: string | null = null;
    if (isAgeRestrictedFeature) {
        if (!userId) {
            actionTaken = 'blocked';
            policyViolation = 'unauthenticated_access';
            triggeredRules.push('unauthenticated_access_to_age_restricted');
            await supabase.from('moderation_logs').insert({
                user_id: userId,
                content_type: contentType,
                original_content: content,
                policy_violation: policyViolation,
                action_taken: actionTaken,
                triggered_rules: triggeredRules
            });
            return { blocked: true, message: "Please log in to access this feature." };
        }
        const { data: profile, error: profileError }: PostgrestSingleResponse<{ date_of_birth: string | null }> = await supabase
            .from('profiles')
            .select('date_of_birth')
            .eq('id', userId)
            .single();
        if (profileError || !profile?.date_of_birth) {
            actionTaken = 'blocked';
            policyViolation = 'age_verification_failed';
            triggeredRules.push('missing_age_data');
            await supabase.from('moderation_logs').insert({
                user_id: userId,
                content_type: contentType,
                original_content: content,
                policy_violation: policyViolation,
                action_taken: actionTaken,
                triggered_rules: triggeredRules
            });
            return { blocked: true, message: "Cannot proceed. Your age verification is incomplete or failed. Minimum age of 18 required." };
        }
        const userAge = calculateAge(new Date(profile.date_of_birth));
        if (userAge < 18) {
            actionTaken = 'blocked';
            policyViolation = 'underage_access';
            triggeredRules.push('user_under_18');
            await supabase.from('moderation_logs').insert({
                user_id: userId,
                content_type: contentType,
                original_content: content,
                policy_violation: policyViolation,
                action_taken: actionTaken,
                triggered_rules: triggeredRules
            });
            return { blocked: true, message: "You must be 18 or older to engage in this type of conversation." };
        }
    }
    const openaiModerationResult = await moderateWithOpenAI(content);
    if (openaiModerationResult.flagged) {
        triggeredRules.push('openai_flagged');
        const severeFlags = [
            'hate/threatening', 'self-harm/intent', 'violence/graphic', 'sexual/minors',
            'harassment/threatening', 'self-harm/instructions', 'violence'
        ];
        const hasSevereViolation = severeFlags.some(flag => openaiModerationResult.categories[flag]);
        if (hasSevereViolation) {
            policyViolation = 'severe_external_violation';
            actionTaken = 'blocked';
            triggeredRules.push(...Object.keys(openaiModerationResult.categories).filter(cat => openaiModerationResult.categories[cat]));
            await supabase.from('moderation_logs').insert({
                user_id: userId,
                content_type: contentType,
                original_content: content,
                policy_violation: policyViolation,
                action_taken: actionTaken,
                triggered_rules: triggeredRules,
                metadata: openaiModerationResult
            });
            return { blocked: true, message: "Content violates severe platform policy. Action blocked." };
        }
        if (openaiModerationResult.categories.sexual && !isAgeRestrictedFeature) {
            policyViolation = 'unpermitted_sexual_content';
            actionTaken = 'blocked';
            triggeredRules.push('general_sexual_content_unrestricted_feature');
            await supabase.from('moderation_logs').insert({
                user_id: userId,
                content_type: contentType,
                original_content: content,
                policy_violation: policyViolation,
                action_taken: actionTaken,
                triggered_rules: triggeredRules,
                metadata: openaiModerationResult
            });
            return { blocked: true, message: "Sexual content is not allowed for this feature." };
        }
        if (openaiModerationResult.categories.hate || openaiModerationResult.categories.harassment) {
            policyViolation = openaiModerationResult.categories.hate ? 'hate_speech' : 'harassment';
            actionTaken = 'blocked';
            triggeredRules.push(...Object.keys(openaiModerationResult.categories).filter(cat => openaiModerationResult.categories[cat]));
            await supabase.from('moderation_logs').insert({
                user_id: userId,
                content_type: contentType,
                original_content: content,
                policy_violation: policyViolation,
                action_taken: actionTaken,
                triggered_rules: triggeredRules,
                metadata: openaiModerationResult
            });
            return { blocked: true, message: "Content violates platform policy on hate speech or harassment." };
        }
    }
    const { data: forbiddenPhrases, error: forbiddenPhrasesError } = await supabase.from('forbidden_phrases').select('*');
    if (!forbiddenPhrasesError) {
        for (const forbidden of forbiddenPhrases || []) {
            let match = false;
            if (forbidden.is_regex) {
                try {
                    const regex = new RegExp(forbidden.phrase, 'i');
                    match = regex.test(content);
                } catch (e) {
                    continue;
                }
            } else {
                match = content.toLowerCase().includes(forbidden.phrase.toLowerCase());
            }
            if (match) {
                actionTaken = 'blocked';
                policyViolation = forbidden.category || 'custom_keyword_violation';
                triggeredRules.push(forbidden.phrase);
                break;
            }
        }
    }
    await supabase.from('moderation_logs').insert({
        user_id: userId,
        content_type: contentType,
        original_content: content,
        moderated_content: moderatedContent,
        policy_violation: policyViolation,
        action_taken: actionTaken,
        triggered_rules: triggeredRules,
        metadata: openaiModerationResult
    });
    if (actionTaken === 'blocked') {
        return { blocked: true, message: `Your content was blocked due to: ${policyViolation || 'policy violation'}.` };
    }
    return { blocked: false, moderatedContent: moderatedContent || content };
} 