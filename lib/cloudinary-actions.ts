"use server"

// No more Cloudinary SDK import - we'll use direct fetch calls instead

export type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
  error?: string
}

/**
 * Uploads an image to Cloudinary using the server-side SDK
 * @param base64Data The file to upload as base64 string
 * @param folder Optional folder path
 * @returns The upload result with secure URL
 */
export async function uploadImageToCloudinary(
  base64Data: string,
  folder = "ai-characters",
): Promise<CloudinaryUploadResult> {
  try {
    const { v2: cloudinary } = await import("cloudinary")

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Upload to Cloudinary using the server-side SDK
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: "auto",
    })

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    return {
      secure_url: "",
      public_id: "",
      error: error instanceof Error ? error.message : "Unknown error during upload",
    }
  }
}

/**
 * Extracts the public ID from a Cloudinary URL
 * @param url The Cloudinary URL
 * @returns The public ID
 */
export async function getPublicIdFromUrl(url: string): Promise<string> {
  if (!url || !url.includes("cloudinary.com")) {
    return ""
  }

  try {
    // Extract the public ID from the URL
    // Format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public-id.jpg
    const urlParts = url.split("/")
    const publicIdParts = urlParts.slice(urlParts.indexOf("upload") + 1)

    // Remove file extension
    const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "")
    return publicId
  } catch (error) {
    console.error("Error extracting public ID:", error)
    return ""
  }
}

/**
 * Deletes an image from Cloudinary using direct fetch
 * @param publicId The public ID of the image to delete
 * @returns Success status
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const { v2: cloudinary } = await import("cloudinary")

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    return false
  }
}
