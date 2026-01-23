import { type NextRequest, NextResponse } from "next/server"
import { getNovitaApiKey } from "@/lib/api-keys"
import { createAdminClient } from "@/lib/supabase-admin"
import { refundTokens } from "@/lib/token-utils"

type NovitaTaskResultResponse = {
  extra: {
    seed: string
    debug_info: {
      request_info: string
      submit_time_ms: string
      execute_time_ms: string
      complete_time_ms: string
    }
  }
  task: {
    task_id: string
    task_type: string
    status: string
    reason: string
    eta: number
    progress_percent: number
  }
  images: {
    image_url: string
    image_url_ttl: string
    image_type: string
  }[]
  videos: any[]
  audios: any[]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    // Get API key with automatic fallback to .env
    const apiKey = await getNovitaApiKey()

    if (!apiKey) {
      return NextResponse.json({
        error: "No Novita API key configured. Please add it in Admin Dashboard or .env file"
      }, { status: 500 })
    }

    const taskIds = taskId.split(',')
    const supabaseAdmin = await createAdminClient()

    const results = await Promise.all(taskIds.map(async (id) => {
      try {
        // Handle Seedream results that are already stored in the DB
        if (id.startsWith('seedream_')) {
          if (supabaseAdmin) {
            // 1. Check if the task itself is marked as completed and has Novita URLs
            const { data: taskRecord } = await supabaseAdmin
              .from('generation_tasks')
              .select('status, error_message, novita_image_urls')
              .eq('task_id', taskId)
              .maybeSingle()

            if (taskRecord && taskRecord.status === 'completed' && taskRecord.novita_image_urls) {
              const urls = Array.isArray(taskRecord.novita_image_urls)
                ? taskRecord.novita_image_urls
                : [taskRecord.novita_image_urls];

              return {
                id,
                task: { status: "TASK_STATUS_SUCCEED", progress_percent: 100 },
                images: urls.map(url => ({ image_url: url }))
              }
            }

            // 2. Fallback: Check if images are already saved in the permanent collection
            const { data: dbImages } = await supabaseAdmin
              .from('generated_images')
              .select('image_url')
              .eq('task_id', id)

            if (dbImages && dbImages.length > 0) {
              return {
                id,
                task: { status: "TASK_STATUS_SUCCEED", progress_percent: 100 },
                images: dbImages.map(img => ({ image_url: img.image_url }))
              }
            }

            if (taskRecord && taskRecord.status === 'failed') {
              return {
                id,
                task: {
                  status: "TASK_STATUS_FAILED",
                  reason: taskRecord.error_message || "Synchronous generation failed or task not found."
                }
              }
            }
          }
          // If not found yet, assume it's still being processed/saved
          return { id, task: { status: "TASK_STATUS_QUEUED", progress_percent: 0 } }
        }

        const response = await fetch(`https://api.novita.ai/v3/async/task-result?task_id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) return { id, status: 'FAILED', error: response.statusText } as any
        const data = await response.json() as NovitaTaskResultResponse
        return { id, ...data }
      } catch (err) {
        return { id, status: 'FAILED', error: String(err) } as any
      }
    }))

    const allSucceeded = results.every(r => r.task?.status === "TASK_STATUS_SUCCEED")
    const anyFailed = results.some(r => r.task?.status === "TASK_STATUS_FAILED" || (r as any).status === 'FAILED')
    const anyProcessing = results.some(r => r.task?.status === "TASK_STATUS_QUEUED" || r.task?.status === "TASK_STATUS_EXECUTING" || r.task?.status === "TASK_STATUS_PROCESSING" || r.task?.status === "TASK_STATUS_WAITING")

    // Aggregate images
    const allImages = results.flatMap(r => r.images || []).map(img => img.image_url)

    // Calculate average progress
    const totalProgress = results.reduce((acc, r) => acc + (r.task?.progress_percent || 0), 0)
    const avgProgress = Math.round(totalProgress / taskIds.length)

    if (allSucceeded) {
      // Update task status
      if (supabaseAdmin) {
        await supabaseAdmin
          .from("generation_tasks")
          .update({ status: "completed" })
          .eq("task_id", taskId)
      }

      // Auto-save logic: Check if this generation should be auto-saved
      const userId = searchParams.get("userId")
      const autoSave = searchParams.get("autoSave") === "true"
      const characterId = searchParams.get("characterId")
      const prompt = searchParams.get("prompt")
      let permanentUrls: string[] = []

      if (autoSave && userId && supabaseAdmin && allImages.length > 0) {
        console.log("💾 Auto-saving generated images for user:", userId)

        try {
          // Import Cloudinary upload function
          const { uploadImageToCloudinary } = await import("@/lib/cloudinary-upload");

          // Upload each image to Cloudinary first for permanent storage
          permanentUrls = await Promise.all(
            allImages.map(async (imageUrl) => {
              try {
                console.log("💾 [Auto-save] Uploading to Cloudinary...");
                const permanentUrl = await uploadImageToCloudinary(imageUrl, 'chat-images');
                console.log("✅ [Auto-save] Cloudinary upload success:", permanentUrl);
                return permanentUrl;
              } catch (err) {
                console.error("⚠️ [Auto-save] Cloudinary upload failed, using original URL:", err);
                return imageUrl; // Fallback to original URL
              }
            })
          );

          // Save each generated image to the database with permanent URLs
          const imagesToSave = permanentUrls.map(imageUrl => ({
            user_id: userId,
            character_id: characterId || null,
            image_url: imageUrl,
            prompt: prompt || "Chat image",
            model_used: "seedream-4.5",
            metadata: {
              source: "chat",
              auto_saved: true
            },
            created_at: new Date().toISOString()
          }))

          const { error: saveError } = await supabaseAdmin
            .from("generated_images")
            .insert(imagesToSave)

          if (saveError) {
            console.error("❌ Auto-save failed:", saveError)
          } else {
            console.log("✅ Auto-saved", imagesToSave.length, "image(s) to collection")
          }
        } catch (saveErr) {
          console.error("❌ Auto-save exception:", saveErr)
        }
      }

      return NextResponse.json({
        status: "TASK_STATUS_SUCCEED",
        images: permanentUrls.length > 0 ? permanentUrls : allImages,
      })
    } else if (anyFailed && !anyProcessing) {
      // If some failed and none are processing anymore, it's a failure (or partial success)
      // For simplicity, we return the images that DID succeed if any, but mark as failed if NONE succeeded
      if (allImages.length > 0) {
        return NextResponse.json({
          status: "TASK_STATUS_SUCCEED",
          images: allImages,
          partial: true
        })
      }

      // Handle refund for total failure
      if (supabaseAdmin) {
        const { data: taskRecord } = await supabaseAdmin
          .from("generation_tasks")
          .select("id, user_id, tokens_deducted, status")
          .eq("task_id", taskId)
          .single()

        if (taskRecord && (taskRecord.status === "processing" || taskRecord.status === "pending")) {
          await supabaseAdmin
            .from("generation_tasks")
            .update({ status: "failed", error_message: "One or more batch tasks failed" })
            .eq("id", taskRecord.id)

          if (taskRecord.tokens_deducted > 0) {
            await refundTokens(
              taskRecord.user_id,
              taskRecord.tokens_deducted,
              `Refund for failed batch image generation (Tasks: ${taskId})`
            )
          }
        }
      }

      return NextResponse.json({
        status: "TASK_STATUS_FAILED",
        reason: "One or more images in the batch failed to generate.",
        refunded: true
      })
    } else {
      // Still in progress
      if (supabaseAdmin && avgProgress > 0) {
        await supabaseAdmin
          .from("generation_tasks")
          .update({ progress: avgProgress, status: "processing" })
          .eq("task_id", taskId)
      }

      return NextResponse.json({
        status: "TASK_STATUS_PROCESSING",
        progress: avgProgress,
        completed_count: results.filter(r => r.task?.status === "TASK_STATUS_SUCCEED").length,
        total_count: taskIds.length
      })
    }
  } catch (error) {
    console.error("Error checking generation status:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
