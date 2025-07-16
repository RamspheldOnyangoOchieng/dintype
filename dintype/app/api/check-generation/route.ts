import { type NextRequest, NextResponse } from "next/server"

type NovitaTaskResultResponse = {
  task: {
    task_id: string
    status: string
    reason?: string
  }
  images?: {
    image_url: string
    image_type: string
  }[]
}

// Function to validate if an image URL is accessible
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok && response.headers.get("content-type")?.startsWith("image/")
  } catch (error) {
    console.error("[Image Validation] Error validating URL:", url, error)
    return false
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    console.log("[Check Generation] Checking status for task:", taskId)

    // Get API key from environment variable
    const apiKey = process.env.NOVITA_API_KEY

    if (!apiKey) {
      console.error("[Check Generation] API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Check task status with Novita API
    const response = await fetch(`https://api.novita.ai/v3/async/task-result?task_id=${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[Check Generation] Novita API error:", response.status, errorData)
      return NextResponse.json(
        {
          error: `Failed to check generation status: ${response.status}`,
          details: errorData,
        },
        { status: response.status },
      )
    }

    const data = (await response.json()) as NovitaTaskResultResponse
    console.log("[Check Generation] Task status:", data.task.status)

    // Handle different task statuses
    if (data.task.status === "TASK_STATUS_SUCCEED") {
      console.log("[Check Generation] Task completed successfully")

      if (!data.images || data.images.length === 0) {
        console.error("[Check Generation] No images returned from successful task")
        return NextResponse.json({
          status: "TASK_STATUS_FAILED",
          reason: "No images generated",
          images: [],
        })
      }

      // Validate all image URLs before returning
      const validatedImages: string[] = []

      for (const image of data.images) {
        console.log("[Check Generation] Validating image URL:", image.image_url)

        if (image.image_url && image.image_url.startsWith("http")) {
          // For now, trust the Novita API URLs - validation can be done client-side
          validatedImages.push(image.image_url)
          console.log("[Check Generation] Image URL added:", image.image_url)
        } else {
          console.error("[Check Generation] Invalid image URL:", image.image_url)
        }
      }

      if (validatedImages.length === 0) {
        console.error("[Check Generation] No valid image URLs found")
        return NextResponse.json({
          status: "TASK_STATUS_FAILED",
          reason: "No valid image URLs generated",
          images: [],
        })
      }

      console.log("[Check Generation] Returning", validatedImages.length, "validated images")

      return NextResponse.json({
        status: "TASK_STATUS_SUCCEED",
        images: validatedImages,
        taskId: taskId,
      })
    } else if (data.task.status === "TASK_STATUS_FAILED") {
      console.error("[Check Generation] Task failed:", data.task.reason)
      return NextResponse.json({
        status: "TASK_STATUS_FAILED",
        reason: data.task.reason || "Generation failed",
        images: [],
      })
    } else {
      // Task is still pending or running
      console.log("[Check Generation] Task still in progress:", data.task.status)
      return NextResponse.json({
        status: data.task.status,
        message: "Generation in progress...",
        images: [],
      })
    }
  } catch (error) {
    console.error("[Check Generation] Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
