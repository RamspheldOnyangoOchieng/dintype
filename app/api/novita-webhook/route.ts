import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("🔔 Novita Webhook Received:", JSON.stringify(body, null, 2));

        const { event_type, payload } = body;

        if (event_type === "TASK.STATUS.UPDATE" && payload?.task?.status === "TASK_STATUS_SUCCEED") {
            const { images } = payload;
            const taskExtra = payload.task.extra || {}; // This might contain the metadata passed during generation

            // We assume 'images' is an array of objects like { image_url: "...", image_type: "jpeg" }
            if (images && images.length > 0) {
                const supabase = createAdminClient();

                // Try to extract user/character references if passed in metadata/extra
                // Note: The generate-image route needs to pack this info into the 'extra' field of the Novita request
                // However, Novita might not echo back arbitrary extra fields exactly how we want.
                // A more robust way is to save the TaskID in our DB when we create the task,
                // then look it up here. But for now, let's see what we can do.

                // If we can't link it to a user here immediately without a Task ID lookup table,
                // the client-side polling is still the primary way users see images.
                // This webhook is a fallback for data consistency.

                console.log("✅ Webhook: Images generated successfully", images);

                // FUTURE IMPLEMENTATION:
                // 1. When generating, save generated_image record with status 'pending' and task_id
                // 2. Here, find record by task_id and update status to 'completed' + url
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Webhook Error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
