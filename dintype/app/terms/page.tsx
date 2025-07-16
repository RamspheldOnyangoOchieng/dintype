import { getTerms } from "@/app/actions/terms-actions"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for our platform",
}

export default async function TermsPage() {
  const terms = await getTerms()

  if (!terms) {
    notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-8">
        <article className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: markdownToHtml(terms.content) }} />
        </article>
      </div>
    </div>
  )
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  if (!markdown) return ""

  // Convert headers
  let html = markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")

  // Convert paragraphs
  html = html.replace(/^\s*(\n)?(.+)/gim, (m) =>
    /^<(\/)?(h1|h2|h3|ul|ol|li|blockquote|pre|img)/.test(m) ? m : "<p>" + m + "</p>",
  )

  // Convert bold and italic
  html = html.replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>").replace(/\*(.*)\*/gim, "<em>$1</em>")

  // Convert links
  html = html.replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Convert lists
  html = html
    .replace(/^\s*\n\*/gim, "<ul>\n*")
    .replace(/^(\*.+)\s*\n([^*])/gim, "$1\n</ul>\n\n$2")
    .replace(/^\*(.+)/gim, "<li>$1</li>")

  return html.trim()
}
