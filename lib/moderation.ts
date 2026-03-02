import { createAdminClient } from "./supabase-admin";

export type ViolationType = 'PROHIBITED' | 'NSFW_UPGRADE' | 'MESSAGE_LIMIT';

/**
 * Logs a moderation violation for potential manual review.
 */
export async function logModerationViolation(
    userId: string,
    content: string,
    type: ViolationType,
    metadata: Record<string, any> = {}
) {
    try {
        const supabase = await createAdminClient();
        if (!supabase) return;

        // We can use the 'cost_logs' or 'generation_tasks' or a generic meta logging system
        // For now, let's try to see if we can log it to a dedicated 'moderation_logs' table
        // If it doesn't exist, we might get an error but we'll try/catch it.

        const { error } = await supabase
            .from('moderation_logs')
            .insert({
                user_id: userId,
                content: content,
                violation_type: type,
                metadata: metadata,
                created_at: new Date().toISOString()
            });

        if (error && error.code === '42P01') {
            // Table doesn't exist, we fallback to a generic notification or skip
            console.warn("⚠️ [Moderation] 'moderation_logs' table not found. Skipping persistent log.");
        } else if (error) {
            console.error("❌ [Moderation] Error logging violation:", error);
        } else {
            console.log(`✅ [Moderation] Logged ${type} violation for user ${userId}`);
        }
    } catch (error) {
        console.error("❌ Fatal [Moderation] log error:", error);
    }
}
