import Image from "next/image"

interface SeoPreviewProps {
  title: string
  url: string
  description: string
  titleTemplate: string
  siteName: string
  ogImage?: string
}

export default function SeoPreview({ title, url, description, titleTemplate, siteName, ogImage }: SeoPreviewProps) {
  // Format the title using the template
  const formattedTitle = titleTemplate.replace("%s", title || siteName)

  // Format the URL to look like Google search results
  const formattedUrl = url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase()

  // Truncate description to ~160 characters
  const truncatedDescription = description.length > 160 ? description.substring(0, 157) + "..." : description

  return (
    <div className="font-sans">
      <div className="mb-1">
        <a href="#" className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl no-underline hover:underline">
          {formattedTitle}
        </a>
      </div>
      <div className="text-[#006621] dark:text-[#8ec984] text-sm mb-1">{formattedUrl}</div>
      <div className="text-[#545454] dark:text-[#bdc1c6] text-sm">{truncatedDescription}</div>

      {ogImage && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-1">Preview of og:image:</p>
          <div className="relative h-32 w-64 border rounded overflow-hidden">
            <Image
              src={ogImage.startsWith("http") ? ogImage : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${ogImage}`}
              alt="OG Image Preview"
              fill
              className="object-cover"
              unoptimized={ogImage.startsWith("http")}
            />
          </div>
        </div>
      )}
    </div>
  )
}
