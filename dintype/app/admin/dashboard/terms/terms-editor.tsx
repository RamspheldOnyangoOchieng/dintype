"use client"

import { updateTerms } from "@/app/actions/terms-actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useTransition } from "react"
import { useToast } from "@/components/ui/use-toast"

interface TermsEditorProps {
  initialTerms: {
    content: string
  }
}

export function TermsEditor({ initialTerms }: TermsEditorProps) {
  const [content, setContent] = useState(initialTerms?.content || "# Användarvillkor\n\nLägg till dina villkor här.")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateTerms(formData)

      if (result.success) {
        toast({
          title: "Klart",
          description: "Villkoren har uppdaterats",
          variant: "default",
        })
      } else {
        toast({
          title: "Fel",
          description: result.message || "Kunde inte uppdatera villkoren",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Redigera användarvillkor</h1>
        <Button asChild variant="outline">
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Visa villkorssidan
          </a>
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Innehåll (Markdown-format)
            </label>
            <Textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Använd Markdown för att formatera villkoren. Rubriker, listor och länkar stöds.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sparar..." : "Spara ändringar"}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Förhandsvisning</h2>
        <div className="bg-card rounded-lg shadow p-6 prose dark:prose-invert max-w-none">
          <iframe
            srcDoc={`
              <html>
                <head>
                  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                  <style>
                    body { padding: 1rem; font-family: system-ui, -apple-system, sans-serif; }
                    h1 { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; }
                    h2 { font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
                    p { margin-bottom: 1rem; }
                    ul, ol { margin-left: 1.5rem; margin-bottom: 1rem; }
                    li { margin-bottom: 0.25rem; }
                    a { color: #3b82f6; text-decoration: underline; }
                    @media (prefers-color-scheme: dark) {
                      body { color: #e5e7eb; background-color: #1f2937; }
                      a { color: #60a5fa; }
                    }
                  </style>
                </head>
                <body>
                  <div id="content"></div>
                  <script>
                    document.getElementById('content').innerHTML = marked.parse(\`${content.replace(/`/g, "\\`")}\`);
                  </script>
                </body>
              </html>
            `}
            className="w-full h-[500px] border-0 rounded"
            title="Förhandsvisning av villkor"
          />
        </div>
      </div>
    </div>
  )
}
